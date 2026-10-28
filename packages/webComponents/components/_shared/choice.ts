import { css, html } from 'lit';

export interface ChoiceEntry {
  key: string;
  label: string;
  disabled?: boolean;
}

/** 仅接受非空字符串，返回独立去重副本。 */
export function choiceKeys(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((key): key is string => typeof key === 'string' && key.length > 0))]
    : [];
}

/** 更新时只保留已选项缓存；新数据优先，缺失项回退原标签或 key。 */
export function selectedChoices(
  keys: string[],
  available: Map<string, ChoiceEntry>,
  previous: Map<string, ChoiceEntry>
) {
  return new Map(
    keys.map((key) => [key, available.get(key) ?? previous.get(key) ?? { key, label: key }])
  );
}

/** 原生 select 只承担约束桥接，提交值统一由 FormValueController 提供。 */
export function choiceValidity(keys: string[], required: boolean, disabled: boolean) {
  return html`<select
    class="validity-proxy"
    multiple
    tabindex="-1"
    aria-hidden="true"
    aria-label="选中值校验"
    ?required=${required}
    ?disabled=${disabled}
  >
    ${keys.map((key) => html`<option value=${key} .selected=${true}>${key}</option>`)}
  </select>`;
}

export const choiceStyles = css`
  :host {
    display: block;
    position: relative;
    min-width: 0;
  }
  button,
  input {
    font: inherit;
    color: var(--su-text-1);
  }
  button {
    cursor: pointer;
  }
  button:disabled,
  input:disabled {
    cursor: not-allowed;
    color: var(--su-text-3);
  }
  .field-label {
    display: block;
    margin-bottom: 6px;
    font-size: var(--su-font-size-sm);
  }
  .search {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--su-border-color);
    background: var(--su-bg-card);
    padding: 8px;
    border-radius: var(--su-radius-sm);
  }
  .validity-proxy {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
    clip-path: inset(50%);
    pointer-events: none;
  }
  .empty {
    padding: 12px;
    color: var(--su-text-3);
    font-size: var(--su-font-size-sm);
  }
`;
