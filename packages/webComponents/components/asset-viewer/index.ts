import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown';

@customElement('se-asset-viewer')
export class SeAssetViewer extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) thumbnail = '';
  @property({ type: String }) title = '';
  @property({ type: Boolean }) downloadable = true;
  @property({ type: String }) type: AssetType = 'unknown';
  @state() private previewVisible = false;

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .card {
      border: 1px solid var(--asset-border, #e5e7eb);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--asset-bg, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .preview {
      width: 96px;
      height: 72px;
      border-radius: 8px;
      overflow: hidden;
      background: #f8fafc;
      display: grid;
      place-items: center;
      cursor: pointer;
      position: relative;
    }

    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .meta {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: #111827;
      line-height: 1.4;
    }

    .meta small {
      display: block;
      color: #6b7280;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    button,
    a.button-link {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: #fff;
      color: #111827;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    button:hover,
    a.button-link:hover {
      border-color: var(--su-color-primary-hover, #2563eb);
      color: var(--su-color-primary-hover, #2563eb);
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: grid;
      place-items: center;
      z-index: 9999;
      padding: 24px;
    }

    .overlay-content {
      background: #fff;
      padding: 12px;
      border-radius: 10px;
      max-width: min(90vw, 960px);
      max-height: 90vh;
      display: grid;
      gap: 10px;
    }

    .overlay header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .overlay header h3 {
      margin: 0;
      font-size: 15px;
    }

    .overlay img,
    .overlay iframe,
    .overlay video,
    .overlay audio {
      max-width: 100%;
      max-height: 72vh;
      border-radius: 8px;
    }
  `;

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
    this.dispatchEvent(new CustomEvent('asset-open', { detail: { src: this.src, type: this.resolveType() } }));
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
      unknown: '文件'
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
        <div class="preview" @click=${this.openPreview}>
          ${this.renderPreviewThumb()}
        </div>
        <div class="meta">
          <p class="title">${this.title || this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button @click=${this.openPreview}>预览</button>
          ${this.downloadable && this.src
        ? html`<a class="button-link" href=${this.src} download target="_blank" rel="noreferrer">下载</a>`
        : null}
        </div>
      </div>
      ${this.renderOverlay()}
    `;
  }
}
