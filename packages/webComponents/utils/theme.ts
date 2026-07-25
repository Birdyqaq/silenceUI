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

const COLOR_VAR_MAP: Record<keyof ThemeColors, string> = {
  primary: '--su-color-primary',
  primaryHover: '--su-color-primary-hover',
  success: '--su-color-success',
  warning: '--su-color-warning',
  error: '--su-color-error',
  info: '--su-color-info'
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

/** 按感知亮度（YIQ）决定叠加文字用深色还是白色，保证可读性 */
function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const [r, g, b] = rgb;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#111827' : '#ffffff';
}

function emitChange() {
  window.dispatchEvent(
    new CustomEvent('su-theme-change', {
      detail: { mode: getThemeMode(), colors: getStoredColors() }
    })
  );
}

function getStoredColors(): ThemeColors {
  try {
    return JSON.parse(localStorage.getItem(COLORS_STORAGE_KEY) ?? '{}') as ThemeColors;
  } catch {
    return {};
  }
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
    if (!value) return;
    root.style.setProperty(COLOR_VAR_MAP[key], value);

    // primaryHover 是派生色本身，不再计算衍生变量
    if (key === 'primaryHover') return;
    const rgb = hexToRgb(value);
    if (rgb) {
      root.style.setProperty(`${COLOR_VAR_MAP[key]}-rgb`, rgb.join(', '));
    }
    root.style.setProperty(`${COLOR_VAR_MAP[key]}-contrast`, contrastColor(value));
  });

  if (colors.primary && !colors.primaryHover) {
    root.style.setProperty('--su-color-primary-hover', darken(colors.primary, 0.15));
  }
}

/** 自定义主题色（合并到已有的自定义色上）。primary 会自动派生 hover 色与 rgb 变量 */
export function setThemeColors(colors: ThemeColors) {
  const merged = { ...getStoredColors(), ...colors };
  applyColors(merged);
  try {
    localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  emitChange();
}

/** 清除自定义颜色，恢复 theme.css 默认值 */
export function resetThemeColors() {
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
  if (Object.keys(colors).length > 0) applyColors(colors);
}
