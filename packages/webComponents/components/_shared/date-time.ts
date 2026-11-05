import { isValidDateValue } from './date';
import { timeMinutes } from './time';

/** Local calendar value, without converting through Date or applying a timezone. */
export function isValidDateTime(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
    isValidDateValue(value.slice(0, 10)) &&
    timeMinutes(value.slice(11)) !== null
  );
}

export function dateTimeError(value: string, min: string, max: string): string {
  if ((min !== '' && !isValidDateTime(min)) || (max !== '' && !isValidDateTime(max)))
    return '日期时间边界格式无效，请使用 YYYY-MM-DDTHH:mm';
  if (min && max && min > max) return 'min 不能晚于 max';
  if (!value) return '';
  if (!isValidDateTime(value)) return '日期时间格式无效，请使用 YYYY-MM-DDTHH:mm';
  if (min && value < min) return '日期时间不能早于 min';
  if (max && value > max) return '日期时间不能晚于 max';
  return '';
}
