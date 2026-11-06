import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../_shared/styles';
import {
  focusFirstElement,
  getDeepActiveElement,
  isTopOverlay,
  lockBodyScroll,
  registerOverlay,
  trapFocus,
  unregisterOverlay,
  unlockBodyScroll,
} from '../_shared/overlay';

type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
let assetViewerInstanceId = 0;

function isAssetSource(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value, document.baseURI);
    return (
      ['http:', 'https:', 'blob:'].includes(url.protocol) ||
      (url.protocol === 'data:' &&
        /^data:(?:image\/|audio\/|video\/|application\/pdf[;,])/i.test(url.href))
    );
  } catch {
    return false;
  }
}

@customElement('se-asset-viewer')
export class SeAssetViewer extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) thumbnail = '';
  @property({ type: String }) title = '';
  @property({ type: Boolean }) downloadable = true;
  @property({ type: String }) type: AssetType = 'unknown';
  @state() private previewVisible = false;
  @state() private previewError = false;
  @state() private pdfUrl = '';

  private readonly titleId = `se-asset-viewer-${++assetViewerInstanceId}-title`;
  private overlayActive = false;
  private previouslyFocused: HTMLElement | null = null;
  private pdfRequest?: AbortController;

  private onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !this.previewVisible || !isTopOverlay(this)) return;
    const panel = this.shadowRoot?.querySelector<HTMLElement>('.overlay-content');
    if (panel) trapFocus(event, panel);
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePreview();
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

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has('src') || changed.has('type')) {
      this.deactivateOverlay();
      this.previewVisible = false;
      this.previewError = false;
    }
  }

  protected updated() {
    if (!this.isConnected) return;
    if (!this.previewVisible) {
      this.deactivateOverlay();
    } else if (!this.overlayActive) {
      this.overlayActive = true;
      this.previouslyFocused = getDeepActiveElement();
      registerOverlay(this);
      lockBodyScroll();
      const panel = this.shadowRoot?.querySelector<HTMLElement>('.overlay-content');
      if (panel) focusFirstElement(panel);
    }
    if (
      this.previewVisible &&
      this.resolveType() === 'pdf' &&
      !this.pdfUrl &&
      !this.pdfRequest &&
      !this.previewError
    ) {
      void this.loadPdf();
    }
  }

  private deactivateOverlay(restoreFocus = true) {
    this.pdfRequest?.abort();
    this.pdfRequest = undefined;
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = '';
    }
    this.shadowRoot?.querySelectorAll<HTMLMediaElement>('video, audio').forEach((media) => {
      if (!media.paused) media.pause();
    });
    if (!this.overlayActive) return;
    const shouldRestoreFocus = restoreFocus && isTopOverlay(this);
    this.overlayActive = false;
    unregisterOverlay(this);
    unlockBodyScroll();
    if (shouldRestoreFocus && this.previouslyFocused?.isConnected) this.previouslyFocused.focus();
    this.previouslyFocused = null;
  }

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-sm);
      }

      .preview {
        position: relative;
        display: grid;
        place-items: center;
        flex: none;
        width: 96px;
        height: 72px;
        overflow: hidden;
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-muted);
        color: var(--su-text-3);
        cursor: pointer;
        border: 0;
        padding: 0;
        font: inherit;
      }

      .preview img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .meta {
        flex: 1;
        min-width: 0;
      }

      .title {
        margin: 0 0 6px;
        color: var(--su-text-1);
        font-size: var(--su-font-size-sm);
        font-weight: 600;
        line-height: 1.4;
      }

      .meta small {
        display: block;
        color: var(--su-text-3);
        line-height: 1.6;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      button,
      a.button-link {
        padding: 6px 10px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        color: var(--su-text-1);
        font-size: var(--su-font-size-xs);
        cursor: pointer;
        text-decoration: none;
        transition:
          border-color 0.2s ease,
          color 0.2s ease;
      }

      button:hover,
      a.button-link:hover {
        border-color: var(--su-color-primary-hover);
        color: var(--su-color-primary-hover);
      }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(15, 23, 42, 0.55);
      }

      .overlay-content {
        display: grid;
        gap: 10px;
        max-width: min(90vw, 960px);
        max-height: 90vh;
        padding: 12px;
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-md);
      }

      .overlay header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .overlay header h3 {
        margin: 0;
        color: var(--su-text-1);
        font-size: var(--su-font-size-md);
      }

      .overlay img,
      .overlay iframe,
      .overlay video,
      .overlay audio {
        max-width: 100%;
        max-height: 72vh;
        border-radius: var(--su-radius-sm);
      }
    `,
  ];

  private resolveType(): AssetType {
    if (this.type !== 'unknown') return this.type;
    if (!this.src) return 'unknown';
    let pathname: string;
    try {
      pathname = new URL(this.src, document.baseURI).pathname;
    } catch {
      pathname = this.src.split(/[?#]/, 1)[0];
    }
    const lower = pathname.toLowerCase();
    if (lower.match(/\.(png|jpe?g|gif|webp|svg)$/)) return 'image';
    if (lower.match(/\.(mp4|webm|mov)$/)) return 'video';
    if (lower.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    if (lower.endsWith('.pdf')) return 'pdf';
    return 'unknown';
  }

  private openPreview() {
    if (!isAssetSource(this.src) || this.previewVisible) return;
    this.previewError = false;
    this.previewVisible = true;
    this.dispatchEvent(
      new CustomEvent('asset-open', {
        detail: { src: this.src, type: this.resolveType() },
        bubbles: true,
        composed: true,
      })
    );
  }

  private closePreview() {
    this.deactivateOverlay();
    this.previewVisible = false;
  }

  private handlePreviewError() {
    this.previewError = true;
  }

  private async loadPdf() {
    const request = new AbortController();
    this.pdfRequest = request;
    const source = this.src;
    try {
      const response = await fetch(source, { signal: request.signal });
      if (!response.ok) throw new Error('PDF request failed');
      const file = await response.blob();
      const header = await file.slice(0, 5).text();
      if (header !== '%PDF-') throw new Error('Resource is not a PDF');
      if (request.signal.aborted || source !== this.src) return;
      // A fixed MIME type prevents an HTML response from being rendered as an active document.
      this.pdfUrl = URL.createObjectURL(file.slice(0, file.size, 'application/pdf'));
    } catch {
      if (!request.signal.aborted && source === this.src) this.handlePreviewError();
    } finally {
      if (this.pdfRequest === request) this.pdfRequest = undefined;
    }
  }

  private renderPreviewThumb() {
    const kind = this.resolveType();
    const url = this.thumbnail || this.src;
    if (kind === 'image' && isAssetSource(url)) {
      return html`<img src=${url} alt=${this.title || 'asset'} loading="lazy" />`;
    }
    const labelMap: Record<AssetType, string> = {
      image: '图片',
      video: '视频',
      audio: '音频',
      pdf: 'PDF',
      unknown: '文件',
    };
    return html`<span>${labelMap[kind]}</span>`;
  }

  private renderOverlay() {
    if (!this.previewVisible) return null;
    const kind = this.resolveType();
    return html`
      <div class="overlay" @click=${this.closePreview}>
        <div
          class="overlay-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this.titleId}
          tabindex="-1"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <header>
            <h3 id=${this.titleId}>${this.title || this.src}</h3>
            <button type="button" @click=${this.closePreview}>关闭</button>
          </header>
          ${this.previewError
            ? html`<div role="alert">
                资源加载失败，请检查地址或重试。
                <button
                  type="button"
                  class="retry"
                  @click=${() => {
                    this.previewError = false;
                  }}
                >
                  重试
                </button>
              </div>`
            : kind === 'image'
              ? html`<img
                  src=${this.src}
                  alt=${this.title || 'asset'}
                  @error=${this.handlePreviewError}
                />`
              : kind === 'pdf'
                ? this.pdfUrl
                  ? html`<iframe
                      src=${this.pdfUrl + new URL(this.src, document.baseURI).hash}
                      title="PDF preview"
                    ></iframe>`
                  : html`<p role="status">正在加载 PDF…</p>`
                : kind === 'video'
                  ? html`<video src=${this.src} controls @error=${this.handlePreviewError}></video>`
                  : kind === 'audio'
                    ? html`<audio
                        src=${this.src}
                        controls
                        @error=${this.handlePreviewError}
                      ></audio>`
                    : html`<p>暂不支持预览该文件类型</p>`}
        </div>
      </div>
    `;
  }

  render() {
    const sourceAvailable = isAssetSource(this.src);
    return html`
      <div class="card">
        <button
          type="button"
          class="preview"
          aria-label=${`预览：${this.title || '资源'}`}
          ?disabled=${!sourceAvailable}
          @click=${this.openPreview}
        >
          ${this.renderPreviewThumb()}
        </button>
        <div class="meta">
          <p class="title">${this.title || this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button type="button" ?disabled=${!sourceAvailable} @click=${this.openPreview}>
            预览
          </button>
          ${this.downloadable && sourceAvailable
            ? html`<a class="button-link" href=${this.src} download target="_blank" rel="noreferrer"
                >下载</a
              >`
            : null}
        </div>
      </div>
      ${this.renderOverlay()}
    `;
  }
}
