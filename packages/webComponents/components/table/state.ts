export interface TableColumnState {
  key: string;
  hidden?: boolean;
  width?: number;
}
export interface TableColumnStateSnapshot {
  version: 1;
  columns: TableColumnState[];
}
export type TableFilterModel =
  | { type: 'enum'; values: string[] }
  | { type: 'number'; min?: number; max?: number };
export type TableFilterModels = Record<string, TableFilterModel>;
type Column = { key: string; fixed?: 'left' | 'right'; minWidth?: number; maxWidth?: number };
export function validColumnKeys(columns: Column[]) {
  return (
    columns.every((c) => typeof c.key === 'string' && c.key.trim()) &&
    new Set(columns.map((c) => c.key)).size === columns.length
  );
}
export function normalizeColumnState(columns: Column[], value: unknown): TableColumnState[] {
  if (!validColumnKeys(columns)) return [];
  const entries = Array.isArray(value) ? value : [];
  const counts = new Map<string, number>();
  for (const item of entries)
    if (item && typeof item.key === 'string') counts.set(item.key, (counts.get(item.key) ?? 0) + 1);
  const map = new Map(columns.map((c) => [c.key, c]));
  const state: TableColumnState[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!entry || !map.has(entry.key) || counts.get(entry.key) !== 1) continue;
    const column = map.get(entry.key)!;
    const next: TableColumnState = { key: entry.key };
    if (typeof entry.hidden === 'boolean') next.hidden = entry.hidden;
    if (typeof entry.width === 'number' && Number.isFinite(entry.width) && entry.width > 0) {
      const min = Number.isFinite(column.minWidth) ? Math.max(40, column.minWidth!) : 64;
      const max = Number.isFinite(column.maxWidth) ? Math.max(min, column.maxWidth!) : Infinity;
      next.width = Math.round(Math.min(max, Math.max(min, entry.width)));
    }
    state.push(next);
    seen.add(entry.key);
  }
  for (const c of columns) if (!seen.has(c.key)) state.push({ key: c.key });
  return ['left', undefined, 'right'].flatMap((group) =>
    state.filter((s) => map.get(s.key)!.fixed === group)
  );
}
export function normalizeFilters(models: unknown): {
  models: TableFilterModels;
  invalid: string[];
} {
  const normalized: TableFilterModels = Object.create(null);
  const invalid: string[] = [];
  if (!models || typeof models !== 'object' || Array.isArray(models))
    return { models: normalized, invalid: ['*'] };
  for (const [key, value] of Object.entries(models)) {
    if (
      value?.type === 'enum' &&
      Array.isArray(value.values) &&
      value.values.every((v: unknown) => typeof v === 'string')
    )
      normalized[key] = { type: 'enum', values: [...new Set<string>(value.values)] };
    else if (
      value?.type === 'number' &&
      (value.min === undefined || (typeof value.min === 'number' && Number.isFinite(value.min))) &&
      (value.max === undefined || (typeof value.max === 'number' && Number.isFinite(value.max))) &&
      !(value.min !== undefined && value.max !== undefined && value.min > value.max)
    )
      normalized[key] = {
        type: 'number',
        ...(value.min !== undefined ? { min: value.min } : {}),
        ...(value.max !== undefined ? { max: value.max } : {}),
      };
    else invalid.push(key);
  }
  return { models: normalized, invalid };
}
export function matchesModel(value: unknown, model: TableFilterModel): boolean {
  if (model.type === 'enum')
    return !model.values.length || model.values.includes(String(value ?? ''));
  if (model.min === undefined && model.max === undefined) return true;
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  return (
    (model.min === undefined || value >= model.min) &&
    (model.max === undefined || value <= model.max)
  );
}
