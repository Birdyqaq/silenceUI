import { afterEach, describe, expect, it } from 'vitest';
import { initTheme, resetThemeColors, setThemeColors, setThemeMode } from './theme';

afterEach(() => {
  resetThemeColors();
  setThemeMode('light');
  localStorage.clear();
});

describe('theme integration', () => {
  it('recalculates hover and RGB when switching brand colors', () => {
    setThemeColors({ primary: '#ff0000', primaryHover: '#aa0000' });
    setThemeColors({ primary: '#00ff00' });
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--su-color-primary')).toBe('#00ff00');
    expect(style.getPropertyValue('--su-color-primary-hover')).toBe('#00d900');
    expect(style.getPropertyValue('--su-color-primary-rgb')).toBe('0, 255, 0');
    expect(style.getPropertyValue('--su-color-primary-contrast')).toBe('#ffffff');
  });

  it('restores persisted mode and colors and resets custom variables', () => {
    localStorage.setItem('su-theme-mode', 'dark');
    localStorage.setItem('su-theme-colors', JSON.stringify({ primary: '#7c3aed' }));
    initTheme();
    expect(document.documentElement.getAttribute('data-su-theme')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--su-color-primary')).toBe('#7c3aed');
    resetThemeColors();
    expect(document.documentElement.style.getPropertyValue('--su-color-primary')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--su-color-primary-hover')).toBe('');
  });
});
