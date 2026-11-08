/**
 * 主题管理器：支持明暗一键切换与自定义主题色，状态持久化到 localStorage。
 *
 * setThemeMode('dark')                    // 切换到暗色
 * toggleThemeMode()                       // 明暗互切
 * setThemeColors({ primary: '#7c3aed' })  // 自定义品牌色
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary?: string;
  primaryHover?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

const MODE_STORAGE_KEY = 'su-theme-mode';
const COLORS_STORAGE_KEY = 'su-theme-colors';
const DARK_CLASS = 'su-theme-dark';
const THEME_ATTR = 'data-su-theme';
let currentColors: ThemeColors | undefined;

const COLOR_VAR_MAP: Record<keyof ThemeColors, string> = {
  primary: '--su-color-primary',
  primaryHover: '--su-color-primary-hover',
  success: '--su-color-success',
  warning: '--su-color-warning',
  error: '--su-color-error',
  info: '--su-color-info',
};

function hexToRgb(hex: string): [number, number, number] | null {
  let value = hex.trim().replace(/^#/, '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  const num = parseInt(value, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** 按比例压暗颜色，用于自动生成 hover 色 */
function darken(hex: string, ratio: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const [r, g, b] = rgb.map((channel) => Math.max(0, Math.round(channel * (1 - ratio))));
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/** 根据背景的相对亮度选择对比度更高的黑色或白色。 */
function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const [r, g, b] = rgb.map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const againstBlack = (luminance + 0.05) / 0.05;
  const againstWhite = 1.05 / (luminance + 0.05);
  return againstBlack >= againstWhite ? '#000000' : '#ffffff';
}

function emitChange() {
  window.dispatchEvent(
    new CustomEvent('su-theme-change', {
      detail: { mode: getThemeMode(), colors: { ...getCurrentColors() } },
    })
  );
}

function getStoredColors(): ThemeColors {
  try {
    return normalizeColors(JSON.parse(localStorage.getItem(COLORS_STORAGE_KEY) ?? '{}'));
  } catch {
    return currentColors ?? {};
  }
}

function getCurrentColors(): ThemeColors {
  return (currentColors ??= getStoredColors());
}

/** Resolve browser-supported opaque sRGB colors before deriving contrast and RGB tokens. */
function normalizeColor(value: string): string | undefined {
  const color = value.trim();
  if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color)) return color;
  const probe = document.createElement('span');
  probe.style.color = color;
  if (!probe.style.color) return;
  probe.hidden = true;
  document.documentElement.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const match = resolved.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match || (match[4] !== undefined && Number(match[4]) !== 1)) return;
  return '#' + match.slice(1, 4).map((channel) => Number(channel).toString(16).padStart(2, '0')).join('');
}

/** 只接受已知字段中可解析的不透明颜色。 */
function normalizeColors(value: unknown): ThemeColors {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const colors: ThemeColors = {};
  for (const key of Object.keys(COLOR_VAR_MAP) as (keyof ThemeColors)[]) {
    const color = (value as Record<string, unknown>)[key];
    if (typeof color !== 'string') continue;
    const normalized = normalizeColor(color);
    if (normalized) colors[key] = normalized;
  }
  return colors;
}

export function getThemeMode(): ThemeMode {
  return document.documentElement.getAttribute(THEME_ATTR) === 'dark' ? 'dark' : 'light';
}

export function setThemeMode(mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, mode);
  root.classList.toggle(DARK_CLASS, mode === 'dark');
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* 隐私模式下 localStorage 可能不可用 */
  }
  emitChange();
}

export function toggleThemeMode(): ThemeMode {
  const next: ThemeMode = getThemeMode() === 'dark' ? 'light' : 'dark';
  setThemeMode(next);
  return next;
}

function applyColors(colors: ThemeColors) {
  const root = document.documentElement;
  (Object.keys(COLOR_VAR_MAP) as (keyof ThemeColors)[]).forEach((key) => {
    const value = colors[key];
    if (!value || key === 'primaryHover') return;
    root.style.setProperty(COLOR_VAR_MAP[key], value);

    const rgb = hexToRgb(value);
    if (rgb) {
      root.style.setProperty(`${COLOR_VAR_MAP[key]}-rgb`, rgb.join(', '));
    }
    root.style.setProperty(`${COLOR_VAR_MAP[key]}-contrast`, contrastColor(value));
  });

  const primaryHover = colors.primaryHover ?? (colors.primary && darken(colors.primary, 0.15));
  if (primaryHover) {
    root.style.setProperty('--su-color-primary-hover', primaryHover);
    root.style.setProperty('--su-color-primary-hover-contrast', contrastColor(primaryHover));
  }
}

/** 自定义主题色（合并到已有的自定义色上）。primary 会自动派生 hover 色与 rgb 变量 */
export function setThemeColors(colors: ThemeColors) {
  colors = normalizeColors(colors);
  const merged = { ...getCurrentColors(), ...colors };
  // 换主色时重新派生 hover，除非本次同时明确提供 hover 色。
  if (colors.primary && !colors.primaryHover) delete merged.primaryHover;
  applyColors(merged);
  currentColors = merged;
  try {
    localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  emitChange();
}

/** 清除自定义颜色，恢复 theme.css 默认值 */
export function resetThemeColors() {
  currentColors = {};
  const root = document.documentElement;
  Object.values(COLOR_VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
    root.style.removeProperty(`${cssVar}-rgb`);
    root.style.removeProperty(`${cssVar}-contrast`);
  });
  try {
    localStorage.removeItem(COLORS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  emitChange();
}

/** 恢复持久化的主题状态。库入口会自动调用，也可手动调用 */
export function initTheme() {
  if (typeof window === 'undefined') return;
  let mode: ThemeMode | null = null;
  try {
    mode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
  } catch {
    /* ignore */
  }
  if (mode === 'dark' || mode === 'light') {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTR, mode);
    root.classList.toggle(DARK_CLASS, mode === 'dark');
  }
  const colors = getStoredColors();
  currentColors = colors;
  if (Object.keys(colors).length > 0) applyColors(colors);
}
