import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        700: '#334155',
        900: '#0f172a'
      }
    }
  },
  shortcuts: {
    'su-surface': 'bg-white border border-slate-200 rounded-lg',
    'su-text-muted': 'text-slate-500',
    'su-clickable': 'cursor-pointer transition-colors duration-200'
  },
  presets: [presetUno(), presetIcons()]
});
