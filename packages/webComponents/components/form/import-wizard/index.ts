import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../../_shared/styles';

export interface ImportField {
  key: string;
  label: string;
  required?: boolean;
}
export interface ImportSheet {
  columns: string[];
  rows: string[][];
}
export interface ImportIssue {
  row: number;
  message: string;
}
export interface ImportResult {
  message: string;
}
export interface ImportAdapter {
  parse(file: File, signal: AbortSignal): Promise<ImportSheet>;
  validate(
    sheet: ImportSheet,
    mapping: Record<string, string>,
    signal: AbortSignal
  ): Promise<ImportIssue[]>;
  submit(
    sheet: ImportSheet,
    mapping: Record<string, string>,
    signal: AbortSignal
  ): Promise<ImportResult>;
}

@customElement('su-import-wizard')
export class SuImportWizard extends LitElement {
  @property({ attribute: false }) adapter?: ImportAdapter;
  @property({ attribute: false }) fields: ImportField[] = [];
  @property() accept = '.csv,.xlsx';
  @property({ type: Number, attribute: 'max-size' }) maxSize = 10 * 1024 * 1024;
  @state() private step = 0;
  @state() private pending = false;
  @state() private error = '';
  @state() private sheet?: ImportSheet;
  @state() private mapping: Record<string, string> = {};
  @state() private issues: ImportIssue[] = [];
  @state() private result = '';
  private controller?: AbortController;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      section {
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        padding: 16px;
        overflow-wrap: anywhere;
      }
      ol,
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 0;
        list-style: none;
      }
      [aria-current] {
        color: var(--su-color-primary);
        font-weight: 600;
      }
      label {
        display: grid;
        gap: 6px;
        margin-block: 12px;
      }
      button,
      select,
      input {
        font: inherit;
        max-width: 100%;
        box-sizing: border-box;
      }
      button,
      select {
        color: inherit;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 8px;
      }
      button:disabled {
        opacity: 0.5;
      }
      .scroll {
        overflow: auto;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border-bottom: 1px solid var(--su-border-color);
        padding: 8px;
        text-align: start;
      }
      [role='alert'] {
        color: var(--su-color-error);
      }
    `,
  ];

  reset() {
    this.controller?.abort();
    this.controller = undefined;
    this.pending = false;
    this.step = 0;
    this.sheet = undefined;
    this.mapping = {};
    this.issues = [];
    this.result = this.error = '';
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.value = '';
  }

  disconnectedCallback() {
    this.reset();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if ((changed.has('adapter') || changed.has('fields')) && this.controller) this.reset();
    else if ((changed.has('adapter') || changed.has('fields')) && this.step > 0) this.reset();
  }

  private get validFields() {
    return (
      Array.isArray(this.fields) &&
      this.fields.length > 0 &&
      this.fields.every(
        (f) => f && typeof f.key === 'string' && f.key.length > 0 && typeof f.label === 'string'
      ) &&
      new Set(this.fields.map((f) => f.key)).size === this.fields.length
    );
  }

  private async run(
    operation: (adapter: ImportAdapter, signal: AbortSignal) => Promise<() => void>
  ) {
    if (this.pending || !this.adapter || !this.validFields || !this.isConnected) return;
    const adapter = this.adapter;
    const fields = this.fields;
    const controller = new AbortController();
    this.controller = controller;
    this.pending = true;
    this.error = '';
    try {
      const apply = await operation(adapter, controller.signal);
      if (
        this.controller === controller &&
        !controller.signal.aborted &&
        this.adapter === adapter &&
        this.fields === fields
      )
        apply();
    } catch (error) {
      if (this.controller === controller && !controller.signal.aborted)
        this.error = error instanceof Error ? error.message : '操作失败，请重试';
    } finally {
      if (this.controller === controller) {
        this.pending = false;
        this.controller = undefined;
      }
    }
  }

  private choose(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    (event.target as HTMLInputElement).value = '';
    if (!file || this.pending) return;
    if (!Number.isFinite(this.maxSize) || this.maxSize <= 0 || file.size > this.maxSize) {
      this.error = '文件超过大小限制或大小配置无效';
      return;
    }
    const rules = this.accept
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (
      rules.length &&
      !rules.some((rule) =>
        rule.startsWith('.')
          ? file.name.toLowerCase().endsWith(rule)
          : rule.endsWith('/*')
            ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
            : file.type.toLowerCase() === rule
      )
    ) {
      this.error = '文件类型不符合要求';
      return;
    }
    void this.run(async (adapter, signal) => {
      const sheet = await adapter.parse(file, signal);
      if (
        !sheet ||
        !Array.isArray(sheet.columns) ||
        !sheet.columns.length ||
        sheet.columns.some((c) => typeof c !== 'string' || !c) ||
        new Set(sheet.columns).size !== sheet.columns.length ||
        !Array.isArray(sheet.rows) ||
        !sheet.rows.length ||
        sheet.rows.some(
          (row) =>
            !Array.isArray(row) ||
            row.length !== sheet.columns.length ||
            row.some((v) => typeof v !== 'string')
        )
      )
        throw new Error('解析结果必须包含唯一列名与非空、等宽的字符串数据行');
      const copy = structuredClone(sheet);
      return () => {
        this.sheet = copy;
        this.mapping = Object.fromEntries(
          this.fields.map((f) => [f.key, copy.columns.includes(f.key) ? f.key : ''])
        );
        this.step = 1;
      };
    });
  }

  private get mapped() {
    const values = Object.values(this.mapping).filter(Boolean);
    return (
      this.validFields &&
      this.fields.every((f) => !f.required || this.mapping[f.key]) &&
      new Set(values).size === values.length &&
      values.length > 0
    );
  }

  private validate() {
    if (this.step !== 1 || !this.mapped || !this.sheet) return;
    void this.run(async (adapter, signal) => {
      const issues = await adapter.validate(
        structuredClone(this.sheet!),
        { ...this.mapping },
        signal
      );
      if (
        !Array.isArray(issues) ||
        issues.some(
          (i) =>
            !i ||
            !Number.isInteger(i.row) ||
            i.row < 1 ||
            i.row > this.sheet!.rows.length ||
            typeof i.message !== 'string' ||
            !i.message.trim()
        )
      )
        throw new Error('校验结果格式无效');
      const copy = structuredClone(issues);
      return () => {
        this.issues = copy;
        this.step = 2;
      };
    });
  }

  private submit() {
    if (this.step !== 2 || this.issues.length || !this.sheet) return;
    void this.run(async (adapter, signal) => {
      const result = await adapter.submit(
        structuredClone(this.sheet!),
        { ...this.mapping },
        signal
      );
      if (!result || typeof result.message !== 'string') throw new Error('导入结果格式无效');
      return () => {
        this.result = result.message;
        this.step = 3;
        this.dispatchEvent(
          new CustomEvent('import-complete', {
            detail: { message: result.message },
            bubbles: true,
            composed: true,
          })
        );
      };
    });
  }

  render() {
    return html`<section part="panel" aria-label="导入向导" aria-busy=${this.pending}>
      <ol aria-label="导入步骤">
        ${['选择文件', '字段映射', '校验预览', '导入结果'].map(
          (label, i) =>
            html`<li aria-current=${i === this.step ? 'step' : nothing}>${i + 1}. ${label}</li>`
        )}
      </ol>
      ${!this.adapter || !this.validFields
        ? html`<p role="alert">请配置导入适配器及具有唯一 key 的目标字段。</p>`
        : nothing}
      ${this.step === 0
        ? html`<label
              >选择导入文件<input
                type="file"
                accept=${this.accept}
                ?disabled=${this.pending || !this.adapter || !this.validFields}
                @change=${this.choose}
            /></label>
            <p>最大 ${this.maxSize} 字节</p>`
        : nothing}
      ${this.step === 1
        ? html`${this.fields.map(
              (field) =>
                html`<label
                  >${field.label}${field.required ? '（必填）' : ''}<select
                    ?disabled=${this.pending}
                    .value=${this.mapping[field.key] || ''}
                    @change=${(event: Event) => {
                      if (!this.pending && this.step === 1)
                        this.mapping = {
                          ...this.mapping,
                          [field.key]: (event.target as HTMLSelectElement).value,
                        };
                    }}
                  >
                    <option value="">不导入</option>
                    ${this.sheet!.columns.map(
                      (column) => html`<option value=${column}>${column}</option>`
                    )}
                  </select></label
                >`
            )}
            <p>每个来源列只能映射一次，至少选择一个字段。</p>
            <button type="button" ?disabled=${this.pending || !this.mapped} @click=${this.validate}>
              校验数据
            </button>`
        : nothing}
      ${this.step === 2
        ? html`<p>共 ${this.sheet!.rows.length} 行；${this.issues.length} 项错误。预览前 10 行。</p>
            <div class="scroll" part="preview">
              <table>
                <caption>
                  来源数据预览
                </caption>
                <thead>
                  <tr>
                    ${this.sheet!.columns.map((c) => html`<th scope="col">${c}</th>`)}
                  </tr>
                </thead>
                <tbody>
                  ${this.sheet!.rows.slice(0, 10).map(
                    (row) =>
                      html`<tr>
                        ${row.map((value) => html`<td>${value}</td>`)}
                      </tr>`
                  )}
                </tbody>
              </table>
            </div>
            ${this.issues.length
              ? html`<ul role="alert">
                    ${this.issues
                      .slice(0, 100)
                      .map((issue) => html`<li>第 ${issue.row} 行：${issue.message}</li>`)}
                  </ul>
                  <p>最多显示前 100 项错误，请修改源文件后重新选择。</p>`
              : nothing}
            <div class="actions">
              <button
                type="button"
                ?disabled=${this.pending}
                @click=${() => {
                  if (!this.pending && this.step === 2) {
                    this.step = 1;
                    this.issues = [];
                    this.error = '';
                  }
                }}
              >
                返回映射</button
              ><button
                type="button"
                ?disabled=${this.pending || this.issues.length > 0}
                @click=${this.submit}
              >
                确认导入
              </button>
            </div>`
        : nothing}
      ${this.step === 3 ? html`<p role="status">${this.result || '导入完成'}</p>` : nothing}
      ${this.pending ? html`<p role="status">正在处理，请稍候</p>` : nothing}
      ${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      <div class="actions">
        <button type="button" @click=${this.reset}>
          ${this.pending ? '取消并重新开始' : '重新开始'}
        </button>
      </div>
    </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'su-import-wizard': SuImportWizard;
  }
}
