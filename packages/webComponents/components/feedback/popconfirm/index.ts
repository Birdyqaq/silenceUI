import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getDeepActiveElement } from '../../_shared/overlay';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';
type PopconfirmCloseSource = 'confirm' | 'cancel' | 'escape' | 'outside';

let popconfirmInstanceId = 0;

@customElement('su-popconfirm')
export class SuPopconfirm extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) title = '确定执行此操作吗？';
  @property({ type: String }) confirmText = '确定';
  @property({ type: String }) cancelText = '取消';
  @property({ type: String, reflect: true }) placement: PopconfirmPlacement = 'top';

  @state() private triggerNeedsTabStop = true;

  private readonly panelId = `su-popconfirm-${++popconfirmInstanceId}`;
  private triggerElement: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private shouldRestoreFocus = true;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
      }

      .trigger {
        display: inline-block;
        cursor: pointer;
      }

      :host([disabled]) .trigger {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .panel {
        position: absolute;
        z-index: 1150;
        width: max-content;
        max-width: min(280px, calc(100vw - 32px));
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-md);
        padding: 12px;
        color: var(--su-text-1);
      }

      :host([placement='top']) .panel {
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='bottom']) .panel {
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='left']) .panel {
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }

      :host([placement='right']) .panel {
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }

      .title {
        font-size: var(--su-font-size-sm);
        line-height: 1.5;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }

      button {
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        color: var(--su-text-2);
        cursor: pointer;
        padding: 5px 10px;
        font-size: var(--su-font-size-sm);
      }

      .confirm {
        border-color: var(--su-color-primary);
        background: var(--su-color-primary);
        color: var(--su-color-primary-contrast);
      }
    `,
  ];

  private onDocumentClick = (event: MouseEvent) => {
    if (!this.open || event.composedPath().includes(this)) return;
    this.close('outside');
  };

  private onWindowKeydown = (event: KeyboardEvent) => {
    if (!this.open || event.key !== 'Escape') return;
    event.preventDefault();
    this.close('escape');
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.onDocumentClick);
    window.addEventListener('keydown', this.onWindowKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.onDocumentClick);
    window.removeEventListener('keydown', this.onWindowKeydown);
  }

  private getTriggerTarget() {
    return (
      this.triggerElement?.shadowRoot?.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]'
      ) ?? this.triggerElement
    );
  }

  private updateTriggerAria() {
    const target = this.getTriggerTarget();
    target?.setAttribute('aria-haspopup', 'dialog');
    target?.setAttribute('aria-expanded', String(this.open));
    target?.setAttribute('aria-controls', this.panelId);
    target?.setAttribute('aria-disabled', String(this.disabled));
  }

  private onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true })[0];
    this.triggerElement = assigned instanceof HTMLElement ? assigned : null;
    const target = this.getTriggerTarget();
    this.triggerNeedsTabStop = !target?.matches(
      'button, a[href], input, select, textarea, [tabindex]'
    );
    this.updateTriggerAria();
  }

  private openPanel() {
    if (this.disabled || this.open) return;
    this.previouslyFocused = getDeepActiveElement();
    this.shouldRestoreFocus = true;
    this.open = true;
  }

  private toggle() {
    if (this.open) this.close('cancel');
    else this.openPanel();
  }

  private onTriggerKeydown(event: KeyboardEvent) {
    if (event.currentTarget !== event.target) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggle();
  }

  private close(source: PopconfirmCloseSource) {
    if (!this.open) return;
    this.shouldRestoreFocus = source !== 'outside';
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

  private cancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
    this.close('cancel');
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('disabled') || changedProperties.has('open')) {
      this.updateTriggerAria();
    }
    if (!changedProperties.has('open')) return;

    if (this.open) {
      this.previouslyFocused ??= getDeepActiveElement();
      this.shadowRoot?.querySelector<HTMLButtonElement>('.confirm')?.focus();
    } else if (changedProperties.get('open') === true) {
      const target = this.previouslyFocused?.isConnected
        ? this.previouslyFocused
        : this.getTriggerTarget();
      if (this.shouldRestoreFocus) target?.focus();
      this.previouslyFocused = null;
      this.shouldRestoreFocus = true;
    }
  }

  render() {
    return html`
      <span
        class="trigger"
        role=${this.triggerNeedsTabStop ? 'button' : nothing}
        tabindex=${this.triggerNeedsTabStop && !this.disabled ? 0 : -1}
        aria-haspopup=${this.triggerNeedsTabStop ? 'dialog' : nothing}
        aria-expanded=${this.triggerNeedsTabStop ? String(this.open) : nothing}
        aria-controls=${this.triggerNeedsTabStop ? this.panelId : nothing}
        aria-disabled=${this.triggerNeedsTabStop ? String(this.disabled) : nothing}
        @click=${this.toggle}
        @keydown=${this.onTriggerKeydown}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </span>
      ${this.open
        ? html`
            <section
              id=${this.panelId}
              class="panel"
              role="dialog"
              aria-modal="false"
              aria-labelledby=${`${this.panelId}-title`}
            >
              <div id=${`${this.panelId}-title`} class="title">${this.title}</div>
              <div class="actions">
                <button type="button" @click=${this.cancel}>${this.cancelText}</button>
                <button class="confirm" type="button" @click=${this.confirm}>
                  ${this.confirmText}
                </button>
              </div>
            </section>
          `
        : nothing}
    `;
  }
}

export type { PopconfirmCloseSource, PopconfirmPlacement };
