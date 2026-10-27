import { afterEach, expect, it, vi } from 'vitest';
import './index';
import '../form';
import '../form-item';
import { getFormController } from '../../_shared/form';
import type { TreeNode } from '../../data/tree';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
const nodes: TreeNode[] = [
  {
    key: 'root',
    label: '公司',
    children: [
      { key: 'a', label: '研发' },
      { key: 'b', label: '运营' },
      {
        key: 'locked',
        label: '停用',
        disabled: true,
        children: [{ key: 'child', label: '子部门' }],
      },
    ],
  },
];
async function mount(multiple = false) {
  const control = document.createElement('su-tree-select');
  control.nodes = nodes;
  control.multiple = multiple;
  control.name = 'department';
  document.body.append(control);
  await control.updateComplete;
  return control;
}
async function open(control: HTMLElementTagNameMap['su-tree-select']) {
  control.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
  await control.updateComplete;
  const tree = control.shadowRoot!.querySelector('su-tree')!;
  await tree.updateComplete;
  tree.expandedKeys = ['root', 'locked'];
  await tree.updateComplete;
  return tree;
}

it('selects a node, emits once and closes the single-select popup', async () => {
  const control = await mount();
  const change = vi.fn();
  control.addEventListener('change', change);
  const tree = await open(control);
  tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="a"]')!.click();
  await control.updateComplete;
  expect(control.value).toBe('a');
  expect(change).toHaveBeenCalledOnce();
  expect(change.mock.calls[0][0].detail).toEqual({ value: 'a' });
  expect(control.shadowRoot!.querySelector('.popup')).toBeNull();
  expect(control.shadowRoot!.querySelector('.trigger')!.textContent).toContain('研发');
});

it('keeps independent checked keys and selection across searches', async () => {
  const control = await mount(true);
  control.searchable = true;
  control.values = ['b'];
  await control.updateComplete;
  const tree = await open(control);
  tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="root"]')!.click();
  await control.updateComplete;
  expect(control.values).toEqual(['b', 'root']);
  const change = vi.fn();
  control.addEventListener('change', change);
  const search = control.shadowRoot!.querySelector<HTMLInputElement>('.search')!;
  search.value = '研发';
  search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await control.updateComplete;
  await tree.updateComplete;
  expect(tree.nodes[0].key).toBe('root');
  expect(tree.nodes[0].children!.map((node) => node.key)).toEqual(['a']);
  expect(control.values).toEqual(['b', 'root']);
  expect(change).not.toHaveBeenCalled();
  tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="a"]')!.click();
  await control.updateComplete;
  expect(control.values).toEqual(['b', 'root', 'a']);
  expect(control.shadowRoot!.querySelector('.popup')).toBeTruthy();
});

it('disables an entire subtree and excludes disabled selected values from submission', async () => {
  const control = await mount(true);
  control.values = ['child', 'a'];
  await control.updateComplete;
  const tree = await open(control);
  expect(tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="child"]')!.disabled).toBe(
    true
  );
  expect((getFormController(control)!.value as FormData).getAll('department')).toEqual(['a']);
});

it('preserves selected labels across replacements, evicts cleared caches and deduplicates keys', async () => {
  const control = await mount(true);
  control.values = ['a', 'a', 'unknown'];
  await control.updateComplete;
  control.nodes = [];
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector('.trigger')!.textContent).toContain('研发、unknown');
  control.values = [];
  await control.updateComplete;
  control.values = ['a'];
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector('.trigger')!.textContent!.trim()).toBe('a');
});

it('ignores invalid nodes, duplicate keys and circular references without changing source data', async () => {
  const control = await mount();
  const cyclic: TreeNode = { key: 'x', label: 'X' };
  cyclic.children = [cyclic];
  control.nodes = [null, cyclic, { key: 'x', label: 'Duplicate' }] as TreeNode[];
  await control.updateComplete;
  const tree = await open(control);
  expect(tree.nodes).toHaveLength(1);
  expect(tree.nodes[0].children).toEqual([]);
  expect(cyclic.children[0]).toBe(cyclic);
});

it('bridges required validity, FormItem descriptions and a visible invalid focus anchor', async () => {
  const setValidity = vi.fn();
  vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
    setValidity,
    setFormValue: vi.fn(),
  } as unknown as ElementInternals);
  const item = document.createElement('su-form-item');
  item.label = '选择部门';
  item.message = '必填';
  const control = document.createElement('su-tree-select');
  control.required = true;
  control.nodes = nodes;
  item.append(control);
  document.body.append(item);
  await item.updateComplete;
  await control.updateComplete;
  expect(getFormController(control)!.checkValidity()).toBe(false);
  const trigger = control.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
  expect(trigger.getAttribute('aria-label')).toBe('选择部门');
  expect(trigger.getAttribute('aria-describedby')).toContain('su-form-description');
  expect(setValidity.mock.calls.at(-1)![2]).toBe(trigger);
  control.focus();
  expect(control.shadowRoot!.activeElement).toBe(trigger);
  control.value = 'a';
  await control.updateComplete;
  expect(getFormController(control)!.checkValidity()).toBe(true);
});

it('supports FormData bridge, reset, state restore and inherited disabled without modifying explicit disabled', async () => {
  const setFormValue = vi.fn();
  vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
    setFormValue,
    setValidity: vi.fn(),
  } as unknown as ElementInternals);
  const control = document.createElement('su-tree-select');
  control.multiple = true;
  control.name = 'departments';
  control.nodes = nodes;
  control.values = ['a'];
  document.body.append(control);
  await control.updateComplete;
  expect((setFormValue.mock.calls.at(-1)![0] as FormData).getAll('departments')).toEqual(['a']);
  control.values = ['b'];
  await control.updateComplete;
  control.formResetCallback();
  await control.updateComplete;
  expect(control.values).toEqual(['a']);
  const state = new FormData();
  state.append('departments', 'b');
  control.formStateRestoreCallback(state);
  await control.updateComplete;
  expect(control.values).toEqual(['b']);
  control.formDisabledCallback(true);
  await control.updateComplete;
  expect(control.disabled).toBe(false);
  expect(getFormController(control)!.value).toBeNull();
  expect(control.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.disabled).toBe(true);
  control.formDisabledCallback(false);
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.disabled).toBe(false);
});

it('closes on Escape/outside clicks and enters the tree with ArrowDown', async () => {
  const control = await mount();
  const trigger = control.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
  trigger.focus();
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  await control.updateComplete;
  const tree = control.shadowRoot!.querySelector('su-tree')!;
  await tree.updateComplete;
  await Promise.resolve();
  expect(tree.shadowRoot!.activeElement?.getAttribute('data-key')).toBe('root');
  tree.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true })
  );
  await control.updateComplete;
  expect(control.shadowRoot!.activeElement).toBe(trigger);
  expect(control.shadowRoot!.querySelector('.popup')).toBeNull();
  await open(control);
  document.body.click();
  await control.updateComplete;
  expect(control.shadowRoot!.querySelector('.popup')).toBeNull();
});

it('ignores stale tree events after data replacement or fieldset disabling', async () => {
  const control = await mount();
  const tree = await open(control);
  const change = vi.fn();
  control.addEventListener('change', change);
  control.nodes = [];
  tree.dispatchEvent(new CustomEvent('select', { detail: { key: 'a' } }));
  expect(change).not.toHaveBeenCalled();
  control.nodes = nodes;
  control.formDisabledCallback(true);
  tree.dispatchEvent(new CustomEvent('select', { detail: { key: 'a' } }));
  expect(control.value).toBe('');
  await control.updateComplete;
});

it('validates through su-form and clears a selection through user action only', async () => {
  const wrapper = document.createElement('su-form');
  wrapper.innerHTML =
    '<form novalidate><su-tree-select name="department" required clearable></su-tree-select></form>';
  document.body.append(wrapper);
  await wrapper.updateComplete;
  const control = wrapper.querySelector('su-tree-select')!;
  control.nodes = nodes;
  await control.updateComplete;
  expect(await wrapper.validate()).toBe(false);
  const change = vi.fn();
  control.addEventListener('change', change);
  control.value = 'a';
  await control.updateComplete;
  expect(change).not.toHaveBeenCalled();
  expect(await wrapper.validate()).toBe(true);
  control.shadowRoot!.querySelector<HTMLButtonElement>('.clear')!.click();
  await control.updateComplete;
  expect(change.mock.calls[0][0].detail.value).toBe('');
  expect(await wrapper.validate()).toBe(false);
});
