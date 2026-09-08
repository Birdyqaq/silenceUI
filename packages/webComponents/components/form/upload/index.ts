import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormValueController, type FormValue } from '../../_shared/form';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

type UploadRejectReason = 'type' | 'size' | 'count';

interface UploadRejection {
  file: File;
  reason: UploadRejectReason;
}

@customElement('su-upload')
export class SuUpload extends LitElement {
  static formAssociated = true;

  @property({ type: Array, attribute: false }) files: File[] = [];
  @property({ type: String }) name = '';
  @property({ type: String }) accept = '';
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Number, attribute: 'max-size' }) maxSize = 0;
  @property({ type: Number, attribute: 'max-count' }) maxCount = 0;
  @property({ type: String }) label = '选择文件';
  @property({ type: String }) hint = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private dragging = false;

  private defaultFiles: File[] = [];
  private readonly formValue = new FormValueController(this, () => this.getFormValue());

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
      }

      .upload {
        display: grid;
        gap: 10px;
      }

      .picker {
        position: relative;
        display: grid;
        place-items: center;
        min-height: 104px;
        border: 1px dashed var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        color: var(--su-text-2);
        padding: 16px;
        text-align: center;
        transition:
          border-color 0.15s ease,
          background 0.15s ease;
      }

      .picker:hover,
      .picker.dragging {
        border-color: var(--su-color-primary);
        background: rgba(var(--su-color-primary-rgb), 0.06);
      }

      :host([disabled]) .picker {
        background: var(--su-bg-muted);
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.7;
      }

      input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }

      input:disabled {
        cursor: not-allowed;
      }

      .label {
        color: var(--su-color-primary);
        font-size: var(--su-font-size-md);
        font-weight: 600;
      }

      .hint {
        margin-top: 4px;
        color: var(--su-text-3);
        font-size: var(--su-font-size-xs);
      }

      .files {
        display: grid;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .file {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        align-items: center;
        gap: 8px;
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-muted);
        padding: 7px 10px;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .size {
        color: var(--su-text-3);
        font-size: var(--su-font-size-xs);
      }

      .remove {
        border: none;
        background: transparent;
        color: var(--su-text-3);
        cursor: pointer;
        padding: 0 2px;
      }

      .remove:hover {
        color: var(--su-color-error);
      }
    `,
  ];

  private getFormValue(): FormValue {
    if (this.disabled || this.files.length === 0) return null;
    if (this.files.length === 1) return this.files[0];
    if (!this.name) return null;

    const data = new FormData();
    this.files.forEach((file) => data.append(this.name, file));
    return data;
  }

  private accepts(file: File) {
    const rules = this.accept
      .split(',')
      .map((rule) => rule.trim().toLowerCase())
      .filter(Boolean);
    if (rules.length === 0) return true;

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return rules.some((rule) => {
      if (rule.startsWith('.')) return fileName.endsWith(rule);
      if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1));
      return fileType === rule;
    });
  }

  private selectFiles(candidates: File[]) {
    if (this.disabled) return;

    const accepted: File[] = [];
    const rejected: UploadRejection[] = [];
    const limit = this.multiple
      ? this.maxCount > 0
        ? Math.max(1, Math.floor(this.maxCount))
        : Number.POSITIVE_INFINITY
      : 1;

    candidates.forEach((file) => {
      if (!this.accepts(file)) rejected.push({ file, reason: 'type' });
      else if (this.maxSize > 0 && file.size > this.maxSize) {
        rejected.push({ file, reason: 'size' });
      } else if (accepted.length >= limit) rejected.push({ file, reason: 'count' });
      else accepted.push(file);
    });

    this.files = accepted;
    this.emitChange();
    if (rejected.length > 0) {
      this.dispatchEvent(
        new CustomEvent('reject', {
          detail: { rejected },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  private handleDragOver(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragging = true;
  }

  private handleDragLeave() {
    this.dragging = false;
  }

  private handleDrop(event: DragEvent) {
    if (this.disabled) return;
    event.preventDefault();
    this.dragging = false;
    this.selectFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { files: [...this.files] },
        bubbles: true,
        composed: true,
      })
    );
  }

  private removeFile(index: number) {
    if (this.disabled) return;
    this.files = this.files.filter((_, fileIndex) => fileIndex !== index);
    this.emitChange();
  }

  clear() {
    if (this.disabled || this.files.length === 0) return;
    this.files = [];
    this.emitChange();
  }

  protected firstUpdated() {
    this.defaultFiles = [...this.files];
  }

  formResetCallback() {
    this.files = [...this.defaultFiles];
  }

  formStateRestoreCallback(state: string | File | FormData | null) {
    if (state instanceof File) this.files = [state];
    else if (state instanceof FormData) {
      this.files = Array.from(state.values()).filter(
        (value): value is File => value instanceof File
      );
    }
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('input')?.focus(options);
  }

  private formatSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  render() {
    return html`
      <div class="upload">
        <div
          class="picker ${this.dragging ? 'dragging' : ''}"
          @dragover=${this.handleDragOver}
          @dragleave=${this.handleDragLeave}
          @drop=${this.handleDrop}
        >
          <input
            type="file"
            accept=${this.accept}
            ?multiple=${this.multiple}
            ?disabled=${this.disabled}
            aria-label=${this.label}
            @change=${this.handleInputChange}
          />
          <div>
            <div class="label">${this.label}</div>
            ${this.hint ? html`<div class="hint">${this.hint}</div>` : nothing}
          </div>
        </div>
        ${this.files.length > 0
          ? html`
              <ul class="files" aria-live="polite" aria-label="已选择文件">
                ${this.files.map(
                  (file, index) => html`
                    <li class="file">
                      <span class="name" title=${file.name}>${file.name}</span>
                      <span class="size">${this.formatSize(file.size)}</span>
                      <button
                        class="remove"
                        type="button"
                        aria-label=${`移除 ${file.name}`}
                        ?disabled=${this.disabled}
                        @click=${() => this.removeFile(index)}
                      >
                        ✕
                      </button>
                    </li>
                  `
                )}
              </ul>
            `
          : nothing}
      </div>
    `;
  }
}

export type { UploadRejection, UploadRejectReason };
