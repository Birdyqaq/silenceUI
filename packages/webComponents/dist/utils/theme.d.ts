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
export declare function getThemeMode(): ThemeMode;
export declare function setThemeMode(mode: ThemeMode): void;
export declare function toggleThemeMode(): ThemeMode;
/** 自定义主题色（合并到已有的自定义色上）。primary 会自动派生 hover 色与 rgb 变量 */
export declare function setThemeColors(colors: ThemeColors): void;
/** 清除自定义颜色，恢复 theme.css 默认值 */
export declare function resetThemeColors(): void;
/** 恢复持久化的主题状态。库入口会自动调用，也可手动调用 */
export declare function initTheme(): void;
