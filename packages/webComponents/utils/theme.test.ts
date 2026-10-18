import { afterEach, describe, expect, it } from 'vitest';
import { initTheme, resetThemeColors, setThemeColors, setThemeMode } from './theme';

afterEach(() => {
  resetThemeColors();
  setThemeMode('light');
  localStorage.clear();
});

describe('theme integration', () => {
  it.each(['null', '[]', '42', '"invalid"', '{broken'])(
    'ignores corrupt stored colors: %s',
    (stored) => {
      localStorage.setItem('su-theme-colors', stored);
      expect(() => initTheme()).not.toThrow();
      expect(() => setThemeMode('dark')).not.toThrow();
      expect(() => setThemeColors({ primary: '#123456' })).not.toThrow();
      expect(document.documentElement.style.getPropertyValue('--su-color-primary')).toBe('#123456');
    }
  );

  it('restores only known string-valued colors', () => {
    localStorage.setItem(
      'su-theme-colors',
      JSON.stringify({ primary: 123, success: ' #10b981 ', extra: '#fff' })
    );
    initTheme();
    expect(document.documentElement.style.getPropertyValue('--su-color-primary')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--su-color-success')).toBe('#10b981');
    setThemeColors({ info: '#0ea5e9' });
    expect(JSON.parse(localStorage.getItem('su-theme-colors')!)).toEqual({
      success: '#10b981',
      info: '#0ea5e9',
    });
  });
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
