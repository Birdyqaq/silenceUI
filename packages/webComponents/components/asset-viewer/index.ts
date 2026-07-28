import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles } from '../_shared/styles';

type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown';

@customElement('se-asset-viewer')
export class SeAssetViewer extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) thumbnail = '';
  @property({ type: String }) title = '';
  @property({ type: Boolean }) downloadable = true;
  @property({ type: String }) type: AssetType = 'unknown';
  @state() private previewVisible = false;

  static styles = [
    baseControlStyles,
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
        transition: border-color 0.2s ease, color 0.2s ease;
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
    const lower = this.src.toLowerCase();
    if (lower.match(/\.(png|jpe?g|gif|webp|svg)$/)) return 'image';
    if (lower.match(/\.(mp4|webm|mov)$/)) return 'video';
    if (lower.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    if (lower.endsWith('.pdf')) return 'pdf';
    return 'unknown';
  }

  private openPreview() {
    if (!this.src) return;
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
    this.previewVisible = false;
  }

  private renderPreviewThumb() {
    const kind = this.resolveType();
    if (kind === 'image') {
      const url = this.thumbnail || this.src;
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
        <div class="overlay-content" @click=${(e: Event) => e.stopPropagation()}>
          <header>
            <h3>${this.title || this.src}</h3>
            <button @click=${this.closePreview}>关闭</button>
          </header>
          ${kind === 'image'
            ? html`<img src=${this.src} alt=${this.title || 'asset'} />`
            : kind === 'pdf'
            ? html`<iframe src=${this.src} title="PDF preview"></iframe>`
            : kind === 'video'
            ? html`<video src=${this.src} controls></video>`
            : kind === 'audio'
            ? html`<audio src=${this.src} controls></audio>`
            : html`<p>暂不支持预览该文件类型</p>`}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="card">
        <div class="preview" @click=${this.openPreview}>${this.renderPreviewThumb()}</div>
        <div class="meta">
          <p class="title">${this.title || this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button @click=${this.openPreview}>预览</button>
          ${this.downloadable && this.src
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
