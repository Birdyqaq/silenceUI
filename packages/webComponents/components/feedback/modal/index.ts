import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-modal')
export class SuModal extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '提示';
  @property({ type: Boolean }) maskClosable = true;
  @property({ type: Boolean }) hideFooter = false;
  @property({ type: String }) confirmText = '确定';
  @property({ type: String }) cancelText = '取消';

  private onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open && this.maskClosable) {
      this.close('mask');
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
        z-index: 999;
        background: rgba(15, 23, 42, 0.55);
        display: grid;
        place-items: center;
        padding: 20px;
      }

      .panel {
        width: min(560px, 100%);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-lg);
        box-shadow: var(--su-shadow-md);
        overflow: hidden;
      }

      .header,
      .footer {
        padding: 14px 16px;
      }

      .header {
        border-bottom: 1px solid var(--su-border-color);
        font-size: var(--su-font-size-lg);
        font-weight: 600;
      }

      .body {
        padding: 16px;
        color: var(--su-text-2);
      }

      .footer {
        border-top: 1px solid var(--su-border-color);
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      button {
        border: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-sm);
        color: var(--su-text-2);
        font-size: var(--su-font-size-md);
        padding: 6px 12px;
        cursor: pointer;
      }

      .confirm {
        border-color: var(--su-color-primary);
        background: var(--su-color-primary);
        color: var(--su-color-primary-contrast, #fff);
      }
    `
  ];

  private closeByMask(event: Event) {
    if (!this.maskClosable) return;
    if (event.target !== event.currentTarget) return;
    this.close('mask');
  }

  private close(source: 'mask' | 'cancel' | 'confirm') {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { source },
        bubbles: true,
        composed: true
      })
    );
  }

  private confirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
    this.close('confirm');
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="mask" @click=${this.closeByMask}>
        <section class="panel" role="dialog" aria-modal="true" aria-label=${this.title}>
          <header class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter
            ? nothing
            : html`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${() => this.close('cancel')}>${this.cancelText}</button>
                    <button class="confirm" type="button" @click=${this.confirm}>${this.confirmText}</button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `;
  }
}
