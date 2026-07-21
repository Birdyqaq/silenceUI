import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-drawer')
export class SuDrawer extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '侧边面板';
  @property({ type: String }) width = '360px';
  @property({ type: Boolean }) maskClosable = true;
  @property({ type: String, reflect: true }) placement: 'left' | 'right' = 'right';

  private onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open && this.maskClosable) {
      this.close('close');
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.onKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.onKeydown);
  }

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: contents;
      }

      .mask {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(15, 23, 42, 0.5);
      }

      .panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: var(--drawer-width, 360px);
        background: var(--su-bg-card);
        box-shadow: -8px 0 24px rgba(15, 23, 42, 0.14);
        display: flex;
        flex-direction: column;
      }

      :host([placement='left']) .panel {
        right: auto;
        left: 0;
        box-shadow: 8px 0 24px rgba(15, 23, 42, 0.14);
      }

      .header {
        padding: 14px 16px;
        border-bottom: 1px solid var(--su-border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--su-font-size-md);
        font-weight: 600;
      }

      .body {
        padding: 16px;
        overflow: auto;
      }

      button {
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--su-text-3);
      }
    `
  ];

  willUpdate() {
    this.style.setProperty('--drawer-width', this.width);
  }

  private close(source: 'mask' | 'close') {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { source },
        bubbles: true,
        composed: true
      })
    );
  }

  private handleMaskClick(event: Event) {
    if (!this.maskClosable) return;
    if (event.target !== event.currentTarget) return;
    this.close('mask');
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="mask" @click=${this.handleMaskClick}>
        <aside class="panel" role="dialog" aria-modal="true">
          <header class="header">
            <span>${this.title}</span>
            <button @click=${() => this.close('close')}>关闭</button>
          </header>
          <div class="body"><slot></slot></div>
        </aside>
      </div>
    `;
  }
}
