import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

type NotificationType = 'info' | 'success' | 'warning' | 'error';
type NotificationCloseSource = 'manual' | 'timeout';

const ICONS: Record<NotificationType, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

@customElement('su-notification')
export class SuNotification extends LitElement {
  @property({ type: String }) type: NotificationType = 'info';
  @property({ type: String }) title = '';
  @property({ type: Number }) duration = 4500;
  @property({ type: Boolean }) closable = true;

  private timer: ReturnType<typeof setTimeout> | undefined;
  private dismissed = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        width: min(360px, calc(100vw - 32px));
        pointer-events: auto;
      }

      .notification {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 10px;
        align-items: start;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        box-shadow: var(--su-shadow-md);
        padding: 14px;
        color: var(--su-text-1);
        animation: notification-in 0.2s ease;
      }

      @keyframes notification-in {
        from {
          opacity: 0;
          transform: translateX(12px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .icon {
        line-height: 1.5;
      }

      .icon.info {
        color: var(--su-color-info);
      }

      .icon.success {
        color: var(--su-color-success);
      }

      .icon.warning {
        color: var(--su-color-warning);
      }

      .icon.error {
        color: var(--su-color-error);
      }

      .main {
        min-width: 0;
      }

      .title {
        font-weight: 600;
        font-size: var(--su-font-size-md);
        line-height: 1.5;
      }

      .description {
        margin-top: 4px;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      .close {
        border: none;
        background: transparent;
        color: var(--su-text-3);
        cursor: pointer;
        padding: 0;
        line-height: 1.5;
      }

      .close:hover {
        color: var(--su-text-1);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.dismissed = false;
    if (this.hasUpdated) this.startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearTimer();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('duration')) this.startTimer();
  }

  private clearTimer() {
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  private startTimer() {
    this.clearTimer();
    if (
      this.isConnected &&
      !this.dismissed &&
      Number.isFinite(this.duration) &&
      this.duration > 0
    ) {
      this.timer = setTimeout(() => this.dismiss('timeout'), this.duration);
    }
  }

  dismiss(source: NotificationCloseSource = 'manual') {
    if (this.dismissed) return;
    this.dismissed = true;
    this.clearTimer();
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: { source },
        bubbles: true,
        composed: true,
      })
    );
    this.remove();
  }

  render() {
    const role = this.type === 'error' || this.type === 'warning' ? 'alert' : 'status';
    return html`
      <section class="notification" role=${role} aria-atomic="true">
        <span class="icon ${this.type}" aria-hidden="true">${ICONS[this.type]}</span>
        <div class="main">
          <div class="title">${this.title}</div>
          <div class="description"><slot></slot></div>
        </div>
        ${this.closable
          ? html`<button
              class="close"
              type="button"
              aria-label="关闭通知"
              @click=${() => this.dismiss('manual')}
            >
              ✕
            </button>`
          : nothing}
      </section>
    `;
  }
}

interface NotificationOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  closable?: boolean;
}

let container: HTMLElement | null = null;

function ensureContainer(): HTMLElement {
  if (container?.isConnected) return container;
  container = document.createElement('div');
  container.setAttribute('aria-label', '通知');
  Object.assign(container.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2000',
    display: 'grid',
    gap: '10px',
    pointerEvents: 'none',
  });
  document.body.append(container);
  return container;
}

function createNotification(options: NotificationOptions): SuNotification {
  const element = document.createElement('su-notification') as SuNotification;
  element.title = options.title;
  element.textContent = options.description ?? '';
  element.type = options.type ?? 'info';
  element.duration = options.duration ?? 4500;
  element.closable = options.closable ?? true;
  ensureContainer().append(element);
  return element;
}

export const notification = Object.assign(createNotification, {
  info: (title: string, description = '', duration?: number) =>
    createNotification({ title, description, type: 'info', duration }),
  success: (title: string, description = '', duration?: number) =>
    createNotification({ title, description, type: 'success', duration }),
  warning: (title: string, description = '', duration?: number) =>
    createNotification({ title, description, type: 'warning', duration }),
  error: (title: string, description = '', duration?: number) =>
    createNotification({ title, description, type: 'error', duration }),
});

export type { NotificationCloseSource, NotificationOptions, NotificationType };
