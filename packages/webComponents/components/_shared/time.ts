import { css } from 'lit';

/** Minute precision only: local wall time, with no Date/UTC conversion. */
export function timeMinutes(value: unknown): number | null {
  if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  return Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
}

/** step uses native seconds; minute-only controls accept positive multiples of 60. */
export function timeError(value: unknown, min: unknown, max: unknown, step: unknown): string {
  const lower = min === '' ? null : timeMinutes(min);
  const upper = max === '' ? null : timeMinutes(max);
  if ((min !== '' && lower === null) || (max !== '' && upper === null))
    return '时间边界格式无效，请使用 HH:mm';
  if (lower !== null && upper !== null && lower > upper) return '不支持跨日时间边界';
  if (typeof step !== 'number' || !Number.isSafeInteger(step) || step < 60 || step % 60 !== 0)
    return 'step 必须是 60 的正整数倍（秒）';
  if (value === '') return '';
  const minutes = timeMinutes(value);
  if (minutes === null) return '时间格式无效，请使用 HH:mm';
  if (lower !== null && minutes < lower) return '时间不能早于 min';
  if (upper !== null && minutes > upper) return '时间不能晚于 max';
  if (((minutes - (lower ?? 0)) * 60) % step !== 0) return '时间不符合 step 步长';
  return '';
}

export const timeStyles = css`
  :host {
    display: block;
    min-width: 0;
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
    gap: 8px;
  }
  label {
    display: grid;
    gap: 6px;
    min-width: 0;
    color: var(--su-text-2);
  }
  input {
    color-scheme: var(--su-native-color-scheme, light);
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 40px;
    padding: 8px 10px;
    font: inherit;
    color: var(--su-text-1);
    background: var(--su-bg-card);
    border: 1px solid var(--su-border-color);
    border-radius: var(--su-radius-sm);
  }
  input:focus {
    outline: none;
    border-color: var(--su-color-primary);
    box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
  }
  input[aria-invalid='true'] {
    border-color: var(--su-color-error);
  }
  input:disabled,
  input:read-only {
    background: var(--su-bg-muted);
    color: var(--su-text-3);
  }
`;
