import { afterEach, expect, it, vi } from 'vitest';
import './index';
import '../form';
import '../form-item';
import { getFormController } from '../../_shared/form';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
const items = [
  { key: 'a', label: '研发' },
  { key: 'b', label: '运营' },
  { key: 'x', label: '禁用', disabled: true },
];
async function mount() {
  const control = document.createElement('su-transfer');
  control.items = items;
  control.searchable = true;
  control.name = 'members';
  document.body.append(control);
  await control.updateComplete;
  return control;
}
async function check(control: HTMLElementTagNameMap['su-transfer'], side: string, key: string) {
  const input = control.shadowRoot!.querySelector<HTMLInputElement>(
    `.${side} .row [data-key="${key}"]`
  )!;
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  await control.updateComplete;
}
async function search(control: HTMLElementTagNameMap['su-transfer'], side: string, query: string) {
  const input = control.shadowRoot!.querySelector<HTMLInputElement>(`.${side} .search`)!;
  input.value = query;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await control.updateComplete;
}
async function move(control: HTMLElementTagNameMap['su-transfer'], direction: string) {
  control.shadowRoot!.querySelector<HTMLButtonElement>(`.to-${direction}`)!.click();
  await control.updateComplete;
}

it('moves items in both directions and emits isolated change details', async () => {
  const control = await mount();
  const change = vi.fn();
  control.addEventListener('change', change);
  await check(control, 'left', 'a');
  await move(control, 'right');
  expect(control.targetKeys).toEqual(['a']);
  expect(change.mock.calls[0][0].detail).toEqual({
    targetKeys: ['a'],
    direction: 'right',
    movedKeys: ['a'],
  });
  change.mock.calls[0][0].detail.targetKeys.push('external');
  expect(control.targetKeys).toEqual(['a']);
  await check(control, 'right', 'a');
  await move(control, 'left');
  expect(control.targetKeys).toEqual([]);
});

it('moves only checked items in the visible search result and preserves hidden checks', async () => {
  const control = await mount();
  await check(control, 'left', 'a');
  await check(control, 'left', 'b');
  await search(control, 'left', '研发');
  await move(control, 'right');
  expect(control.targetKeys).toEqual(['a']);
  await search(control, 'left', '');
  expect(control.shadowRoot!.querySelector<HTMLInputElement>('.left [data-key="b"]')!.checked).toBe(
    true
  );
  await move(control, 'right');
  expect(control.targetKeys).toEqual(['a', 'b']);
  await search(control, 'right', '运营');
  await check(control, 'right', 'b');
  await move(control, 'left');
  expect(control.targetKeys).toEqual(['a']);
});

it('selects only visible enabled rows and exposes mixed select-all state', async () => {
  const control = await mount();
  await check(control, 'left', 'a');
  const all = control.shadowRoot!.querySelector<HTMLInputElement>('.left .all input')!;
  expect(all.indeterminate).toBe(true);
  await search(control, 'left', '研发');
  all.checked = true;
  all.dispatchEvent(new Event('change'));
  await control.updateComplete;
  await move(control, 'right');
  expect(control.targetKeys).toEqual(['a']);
  await search(control, 'left', '');
  all.checked = true;
  all.dispatchEvent(new Event('change'));
  await control.updateComplete;
  await move(control, 'right');
  expect(control.targetKeys).toEqual(['a', 'b']);
  expect(
    control.shadowRoot!.querySelector<HTMLInputElement>('.left [data-key="x"]')!.disabled
  ).toBe(true);
});

it('retains selected labels on replacement and evicts deselected cache entries', async () => {
  const control = await mount();
  control.targetKeys = ['a', 'unknown'];
  await control.updateComplete;
  control.items = [];
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector('.right')!.textContent).toContain('研发');
  expect((getFormController(control)!.value as FormData).getAll('members')).toEqual([
    'a',
    'unknown',
  ]);
  control.targetKeys = [];
  await control.updateComplete;
  control.targetKeys = ['a'];
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector('.right .row')!.textContent!.trim()).toBe('a');
});

it('keeps disabled targets visible but excludes them from successful form values', async () => {
  const control = await mount();
  control.targetKeys = ['x'];
  control.required = true;
  await control.updateComplete;
  expect(
    control.shadowRoot!.querySelector<HTMLInputElement>('.right [data-key="x"]')!.disabled
  ).toBe(true);
  expect((getFormController(control)!.value as FormData).getAll('members')).toEqual([]);
  expect(getFormController(control)!.checkValidity()).toBe(false);
  control.items = [];
  await control.updateComplete;
  expect(getFormController(control)!.checkValidity()).toBe(false);
});

it('filters invalid/duplicate items and keys without mutating caller data', async () => {
  const control = await mount();
  const input = [null, ...items, { key: 'a', label: 'Duplicate' }, { key: '', label: 'Empty' }];
  control.items = input as typeof control.items;
  control.targetKeys = ['a', 'a', null] as string[];
  await control.updateComplete;
  expect(control.shadowRoot!.querySelectorAll('.right .row')).toHaveLength(1);
  expect(control.shadowRoot!.querySelectorAll('.left .row')).toHaveLength(2);
  expect(input).toHaveLength(6);
  expect(control.targetKeys).toHaveLength(3);
  control.items = null as unknown as typeof control.items;
  await control.updateComplete;
  expect(control.shadowRoot!.querySelectorAll('.left .row')).toHaveLength(0);
});

it('ignores stale checkbox and move actions after disabling or data replacement', async () => {
  const control = await mount();
  await check(control, 'left', 'a');
  const moveButton = control.shadowRoot!.querySelector<HTMLButtonElement>('.to-right')!;
  const input = control.shadowRoot!.querySelector<HTMLInputElement>('.left [data-key="a"]')!;
  control.items = [];
  input.checked = true;
  input.dispatchEvent(new Event('change'));
  moveButton.click();
  expect(control.targetKeys).toEqual([]);
  await control.updateComplete;
  control.items = items;
  await control.updateComplete;
  await check(control, 'left', 'b');
  control.formDisabledCallback(true);
  moveButton.click();
  expect(control.targetKeys).toEqual([]);
  await control.updateComplete;
  expect(control.disabled).toBe(false);
  expect(getFormController(control)!.value).toBeNull();
  control.formDisabledCallback(false);
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector<HTMLButtonElement>('[data-form-anchor]')!.disabled).toBe(
    false
  );
});

it('supports reset, state restoration, reflected name and repeated FormData values', async () => {
  const control = document.createElement('su-transfer');
  control.name = 'members';
  control.items = items;
  control.targetKeys = ['a'];
  document.body.append(control);
  await control.updateComplete;
  control.targetKeys = ['b'];
  await control.updateComplete;
  control.formResetCallback();
  await control.updateComplete;
  expect(control.targetKeys).toEqual(['a']);
  const data = new FormData();
  data.append('members', 'a');
  data.append('members', 'b');
  control.formStateRestoreCallback(data);
  await control.updateComplete;
  expect((getFormController(control)!.value as FormData).getAll('members')).toEqual(['a', 'b']);
  control.removeAttribute('name');
  await control.updateComplete;
  expect(control.name).toBe('');
  expect([...(getFormController(control)!.value as FormData).keys()]).toEqual([]);
});

it('bridges visible error focus, required rules and helper associations', async () => {
  const setValidity = vi.fn();
  vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
    setValidity,
    setFormValue: vi.fn(),
  } as unknown as ElementInternals);
  const item = document.createElement('su-form-item');
  item.label = '授权人员';
  item.message = '至少选择一人';
  const control = document.createElement('su-transfer');
  control.required = true;
  item.append(control);
  document.body.append(item);
  await item.updateComplete;
  await control.updateComplete;
  const anchor = control.shadowRoot!.querySelector<HTMLButtonElement>('[data-form-anchor]')!;
  expect(setValidity.mock.calls.at(-1)![2]).toBe(anchor);
  expect(anchor.getAttribute('aria-describedby')).toContain('su-form-description');
  expect(anchor.getAttribute('aria-label')).toBe('授权人员');
  control.focus();
  expect(control.shadowRoot!.activeElement).toBe(anchor);
});

it('does not treat searches or temporary checkboxes as successful value changes', async () => {
  const control = await mount();
  const change = vi.fn();
  const input = vi.fn();
  control.addEventListener('change', change);
  control.addEventListener('input', input);
  await search(control, 'left', '研发');
  await check(control, 'left', 'a');
  expect(change).not.toHaveBeenCalled();
  expect(input).not.toHaveBeenCalled();
  control.targetKeys = ['b'];
  await control.updateComplete;
  expect(change).not.toHaveBeenCalled();
});

it('participates in su-form validation and clears moved checks', async () => {
  const form = document.createElement('su-form');
  form.innerHTML = '<form novalidate><su-transfer name="members" required></su-transfer></form>';
  document.body.append(form);
  await form.updateComplete;
  const control = form.querySelector('su-transfer')!;
  control.items = items;
  await control.updateComplete;
  expect(await form.validate()).toBe(false);
  await check(control, 'left', 'a');
  await move(control, 'right');
  expect(await form.validate()).toBe(true);
  await check(control, 'right', 'a');
  await move(control, 'left');
  expect(control.shadowRoot!.querySelector<HTMLInputElement>('.left [data-key="a"]')!.checked).toBe(
    false
  );
});

it('removes both stale filters when searching is disabled', async () => {
  const control = await mount();
  control.targetKeys = ['b'];
  await control.updateComplete;
  await search(control, 'left', 'missing');
  await search(control, 'right', 'missing');
  expect(control.shadowRoot!.querySelectorAll('.row')).toHaveLength(0);
  control.searchable = false;
  await control.updateComplete;
  expect(control.shadowRoot!.querySelectorAll('.left .row')).toHaveLength(2);
  expect(control.shadowRoot!.querySelectorAll('.right .row')).toHaveLength(1);
  expect(control.targetKeys).toEqual(['b']);
});
