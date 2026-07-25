import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';
import { getThemeMode, toggleThemeMode, type ThemeMode } from '../../../utils/theme';

/** 一键明暗主题切换按钮，多个实例之间通过 su-theme-change 事件保持同步 */
@customElement('su-theme-toggle')
export class SuThemeToggle extends LitElement {
  @state() private mode: ThemeMode = 'light';

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-flex;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid var(--su-border-color);
        border-radius: 50%;
        background: var(--su-bg-card);
        color: var(--su-text-2);
        font-size: 16px;
        cursor: pointer;
        transition: border-color 0.15s ease, color 0.15s ease;
      }

      button:hover {
        border-color: var(--su-color-primary);
        color: var(--su-color-primary);
      }
    `
  ];

  private onThemeChange = () => {
    this.mode = getThemeMode();
  };

  connectedCallback() {
    super.connectedCallback();
    this.mode = getThemeMode();
    window.addEventListener('su-theme-change', this.onThemeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('su-theme-change', this.onThemeChange);
  }

  private handleClick() {
    this.mode = toggleThemeMode();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { mode: this.mode },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    const isDark = this.mode === 'dark';
    return html`
      <button
        type="button"
        aria-label=${isDark ? '切换到亮色主题' : '切换到暗色主题'}
        title=${isDark ? '切换到亮色主题' : '切换到暗色主题'}
        @click=${this.handleClick}>
        ${isDark ? '🌙' : '☀️'}
      </button>
    `;
  }
}
