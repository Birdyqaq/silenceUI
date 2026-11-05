/** Validate calendar dates without timezone conversion or JavaScript Date overflow normalization. */
export function isValidDateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function localToday() {
  const date = new Date();
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
}

export function shiftCalendarDate(date: string, days: number, months = 0) {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCMonth(result.getUTCMonth() + months);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().split('T')[0];
}
