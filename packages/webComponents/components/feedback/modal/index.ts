import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  focusFirstElement,
  getDeepActiveElement,
  isTopOverlay,
  lockBodyScroll,
  registerOverlay,
  trapFocus,
  unregisterOverlay,
  unlockBodyScroll,
} from '../../_shared/overlay';
import { baseControlStyles } from '../../_shared/styles';

@customElement('su-modal')
export class SuModal extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) title = '提示';
  @property({ type: Boolean }) maskClosable = true;
  @property({ type: Boolean }) hideFooter = false;
  @property({ type: String }) confirmText = '确定';
  @property({ type: String }) cancelText = '取消';

  private overlayActive = false;
  private previouslyFocused: HTMLElement | null = null;

  private onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !this.open || !isTopOverlay(this)) return;

    const panel = this.shadowRoot?.querySelector<HTMLElement>('.panel');
    if (panel) trapFocus(event, panel);

    if (event.key === 'Escape' && this.open && this.maskClosable) {
      event.preventDefault();
      this.close('escape');
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.onKeydown);
    if (this.hasUpdated) this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.onKeydown);
    this.deactivateOverlay(false);
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
        max-height: calc(100vh - 40px);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-lg);
        box-shadow: var(--su-shadow-md);
        overflow: hidden;
        display: flex;
        flex-direction: column;
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
        overflow: auto;
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
    `,
  ];

  private closeByMask(event: Event) {
    if (!this.maskClosable) return;
    if (event.target !== event.currentTarget) return;
    this.close('mask');
  }

  private close(source: 'mask' | 'cancel' | 'confirm' | 'escape') {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { source },
        bubbles: true,
        composed: true,
      })
    );
  }

  private confirm() {
    const shouldClose = this.dispatchEvent(
      new CustomEvent('confirm', { bubbles: true, composed: true, cancelable: true })
    );
    if (shouldClose) this.close('confirm');
  }

  private activateOverlay() {
    if (this.overlayActive) return;
    this.overlayActive = true;
    this.previouslyFocused = getDeepActiveElement();
    registerOverlay(this);
    lockBodyScroll();

    // 等同一轮插槽内的 Lit 控件完成首次渲染，再查找其内部可聚焦元素。
    queueMicrotask(() => {
      const panel = this.shadowRoot?.querySelector<HTMLElement>('.panel');
      if (this.isConnected && this.open && isTopOverlay(this) && panel) focusFirstElement(panel);
    });
  }

  private deactivateOverlay(restoreFocus = true) {
    if (!this.overlayActive) return;
    const shouldRestoreFocus = restoreFocus && isTopOverlay(this);
    this.overlayActive = false;
    unregisterOverlay(this);
    unlockBodyScroll();

    if (shouldRestoreFocus && this.previouslyFocused?.isConnected) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;
  }

  protected updated() {
    if (!this.isConnected) return;
    if (this.open) this.activateOverlay();
    else this.deactivateOverlay();
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="mask" @click=${this.closeByMask}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="su-modal-title"
          tabindex="-1"
        >
          <header id="su-modal-title" class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter
            ? nothing
            : html`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${() => this.close('cancel')}>
                      ${this.cancelText}
                    </button>
                    <button class="confirm" type="button" @click=${this.confirm}>
                      ${this.confirmText}
                    </button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `;
  }
}
