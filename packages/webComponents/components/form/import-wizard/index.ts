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
const steps = ['file', 'mapping', 'preview', 'result'] as const;
export type ImportStep = (typeof steps)[number];
export type ImportOperation = 'parse' | 'validate' | 'submit';
export interface ImportWizardState {
  readonly step: ImportStep;
  readonly operation: ImportOperation | null;
  readonly fileName: string | null;
  readonly rowCount: number;
  readonly issueCount: number;
  readonly error: string;
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
  @state() private operation: ImportOperation | null = null;
  @state() private fileName: string | null = null;
  @state() private error = '';
  @state() private sheet?: ImportSheet;
  @state() private mapping: Record<string, string> = {};
  @state() private issues: ImportIssue[] = [];
  @state() private errorsOnly = false;
  @state() private result = '';
  private controller?: AbortController;
  private configuration?: { adapter: ImportAdapter; fields: ImportField[] };
  private lastState?: ImportWizardState;

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
      .preview-filter {
        display: flex;
        align-items: center;
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

  getState(): ImportWizardState {
    return {
      step: steps[this.step],
      operation: this.operation,
      fileName: this.fileName,
      rowCount: this.sheet?.rows.length ?? 0,
      issueCount: this.issues.length,
      error: this.error,
    };
  }

  cancel(): boolean {
    const controller = this.controller;
    if (!controller) return false;
    this.controller = undefined;
    this.operation = null;
    controller.abort();
    return true;
  }

  reset() {
    this.configuration = undefined;
    this.fileName = null;
    this.step = 0;
    this.sheet = undefined;
    this.mapping = {};
    this.issues = [];
    this.errorsOnly = false;
    this.result = this.error = '';
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
    if (input) input.value = '';
    this.cancel();
  }

  disconnectedCallback() {
    this.reset();
    super.disconnectedCallback();
  }

  protected willUpdate() {
    if (this.configurationChanged) this.reset();
  }

  protected updated() {
    if (!this.isConnected) return;
    const current = this.getState();
    const previous = this.lastState;
    if (
      previous &&
      previous.step === current.step &&
      previous.operation === current.operation &&
      previous.fileName === current.fileName &&
      previous.rowCount === current.rowCount &&
      previous.issueCount === current.issueCount &&
      previous.error === current.error
    )
      return;
    this.lastState = current;
    this.dispatchEvent(
      new CustomEvent<ImportWizardState>('import-state-change', {
        detail: { ...current },
        bubbles: true,
        composed: true,
      })
    );
  }

  private get pending() {
    return this.operation !== null;
  }

  private get configurationChanged() {
    const config = this.configuration;
    return config && (config.adapter !== this.adapter || config.fields !== this.fields);
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
    phase: ImportOperation,
    operation: (adapter: ImportAdapter, signal: AbortSignal) => Promise<() => void>
  ): Promise<boolean> {
    if (
      this.pending ||
      !this.adapter ||
      !this.validFields ||
      !this.isConnected ||
      this.configurationChanged
    )
      return false;
    const adapter = this.adapter;
    this.configuration = { adapter, fields: this.fields };
    const controller = new AbortController();
    const isCurrent = () => this.controller === controller && !this.configurationChanged;
    this.controller = controller;
    this.operation = phase;
    this.error = '';
    let apply: (() => void) | undefined;
    let onAbort!: () => void;
    const cancelled = new Promise<undefined>((resolve) => {
      onAbort = () => resolve(undefined);
      controller.signal.addEventListener('abort', onAbort, { once: true });
    });
    try {
      const commit = await Promise.race([operation(adapter, controller.signal), cancelled]);
      if (isCurrent()) apply = commit;
    } catch (error) {
      if (isCurrent()) this.error = error instanceof Error ? error.message : '操作失败，请重试';
    } finally {
      controller.signal.removeEventListener('abort', onAbort);
      if (this.controller === controller) {
        this.operation = null;
        this.controller = undefined;
      }
    }
    if (!apply) return false;
    apply();
    return true;
  }

  private choose(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) void this.loadFile(file);
  }

  async loadFile(file: File): Promise<boolean> {
    if (
      this.step !== 0 ||
      this.pending ||
      !this.isConnected ||
      !this.adapter ||
      !this.validFields ||
      this.configurationChanged
    )
      return false;
    this.fileName = file.name;
    if (!Number.isFinite(this.maxSize) || this.maxSize <= 0 || file.size > this.maxSize) {
      this.error = '文件超过大小限制或大小配置无效';
      return false;
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
      return false;
    }
    return this.run('parse', async (adapter, signal) => {
      const sheet = await adapter.parse(file, signal);
      signal.throwIfAborted();
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

  private get mappingError() {
    if (!this.validFields) return '请配置目标字段';
    const missing = this.fields.filter((field) => field.required && !this.mapping[field.key]);
    if (missing.length) return `请选择必填字段：${missing.map((field) => field.label).join('、')}`;
    const values = Object.values(this.mapping).filter(Boolean);
    if (!values.length) return '请至少选择一个字段';
    if (new Set(values).size !== values.length) return '同一个来源列不能映射到多个字段';
    return '';
  }

  private validate() {
    if (this.step !== 1 || this.mappingError || !this.sheet) return;
    const sheet = this.sheet;
    void this.run('validate', async (adapter, signal) => {
      const issues = await adapter.validate(structuredClone(sheet), { ...this.mapping }, signal);
      signal.throwIfAborted();
      if (
        !Array.isArray(issues) ||
        issues.some(
          (i) =>
            !i ||
            !Number.isInteger(i.row) ||
            i.row < 1 ||
            i.row > sheet.rows.length ||
            typeof i.message !== 'string' ||
            !i.message.trim()
        )
      )
        throw new Error('校验结果格式无效');
      const copy = structuredClone(issues);
      return () => {
        this.issues = copy;
        this.errorsOnly = false;
        this.step = 2;
      };
    });
  }

  private submit() {
    if (this.step !== 2 || this.issues.length || !this.sheet) return;
    const sheet = this.sheet;
    void this.run('submit', async (adapter, signal) => {
      const result = await adapter.submit(structuredClone(sheet), { ...this.mapping }, signal);
      signal.throwIfAborted();
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

  private renderPreview(sheet: ImportSheet) {
    const columns = this.fields.flatMap((field) => {
      const index = sheet.columns.indexOf(this.mapping[field.key]);
      return index === -1 ? [] : [{ label: field.label, index }];
    });
    const errorRows = new Set(this.issues.map((issue) => issue.row));
    const rowNumbers: number[] = [];
    for (let row = 1; row <= sheet.rows.length && rowNumbers.length < 10; row++) {
      if (!this.errorsOnly || errorRows.has(row)) rowNumbers.push(row);
    }
    return html`
      <p>共 ${sheet.rows.length} 行，${errorRows.size} 行有错误（${this.issues.length} 项）。</p>
      ${errorRows.size
        ? html`<label class="preview-filter">
            <input
              type="checkbox"
              .checked=${this.errorsOnly}
              @change=${(event: Event) => {
                this.errorsOnly = (event.target as HTMLInputElement).checked;
              }}
            />
            只看错误行
          </label>`
        : nothing}
      <div class="scroll" part="preview" role="region" aria-label="映射预览" tabindex="0">
        <table>
          <caption>
            按目标字段预览前 ${rowNumbers.length} 行
          </caption>
          <thead>
            <tr>
              <th scope="col">源数据行号</th>
              ${columns.map((column) => html`<th scope="col">${column.label}</th>`)}
              ${errorRows.size ? html`<th scope="col">校验状态</th>` : nothing}
            </tr>
          </thead>
          <tbody>
            ${rowNumbers.map(
              (row) =>
                html`<tr>
                  <th scope="row">${row}</th>
                  ${columns.map(({ index }) => html`<td>${sheet.rows[row - 1][index]}</td>`)}
                  ${errorRows.size
                    ? html`<td>${errorRows.has(row) ? '有错误' : '通过'}</td>`
                    : nothing}
                </tr>`
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  render() {
    const renderedSheet = this.sheet;
    const mappingError = this.step === 1 ? this.mappingError : '';
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
                      // Detached controls must not change a later import session.
                      if (
                        this.isConnected &&
                        this.renderRoot.contains(event.currentTarget as Node) &&
                        this.sheet === renderedSheet &&
                        !this.configurationChanged &&
                        !this.pending &&
                        this.step === 1
                      )
                        this.mapping = {
                          ...this.mapping,
                          [field.key]: (event.target as HTMLSelectElement).value,
                        };
                    }}
                  >
                    <option value="" ?selected=${!this.mapping[field.key]}>不导入</option>
                    ${this.sheet!.columns.map(
                      (column) =>
                        html`<option
                          value=${column}
                          ?selected=${column === this.mapping[field.key]}
                        >
                          ${column}
                        </option>`
                    )}
                  </select></label
                >`
            )}
            ${mappingError ? html`<p role="status">${mappingError}</p>` : nothing}
            <button
              type="button"
              ?disabled=${this.pending || Boolean(mappingError)}
              @click=${this.validate}
            >
              校验数据
            </button>`
        : nothing}
      ${this.step === 2
        ? html`${this.renderPreview(this.sheet!)}
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
