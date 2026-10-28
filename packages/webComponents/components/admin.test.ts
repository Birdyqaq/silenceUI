import { afterEach, describe, expect, it, vi } from 'vitest';
import { SuIcon, iconNames } from './icon';
import './button';
import { SuForm } from './form/form';
import './form/form-item';
import './input';
import './form/textarea';
import './form/select';
import './form/date-range';
import './navigation/menu';
import './data/tree';
import './table';
import { getFormController } from './_shared/form';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
const mount = async <T extends HTMLElement & { updateComplete: Promise<unknown> }>(element: T) => {
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe('admin building blocks', () => {
  it('renders bundled icons locally, follows accessible naming, and rejects unknown names', async () => {
    expect(SuIcon).toBeDefined();
    const icon = await mount(document.createElement('su-icon'));
    for (const name of iconNames) {
      icon.name = name;
      await icon.updateComplete;
      expect(icon.shadowRoot!.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    }
    icon.label = '设置';
    icon.size = '20';
    await icon.updateComplete;
    expect(icon.shadowRoot!.querySelector('svg')?.getAttribute('aria-label')).toBe('设置');
    expect(icon.shadowRoot!.querySelector('svg')?.style.width).toBe('20px');
    icon.name = '__proto__';
    await icon.updateComplete;
    expect(icon.shadowRoot!.querySelector('svg')).toBeNull();
  });

  it('uses the icon component in buttons while retaining the legacy iconClass API', async () => {
    const button = await mount(document.createElement('su-button'));
    button.icon = 'plus';
    await button.updateComplete;
    expect(button.shadowRoot!.querySelector('su-icon')?.name).toBe('plus');
    button.icon = '';
    button.iconClass = 'legacy';
    await button.updateComplete;
    expect(button.shadowRoot!.querySelector('i.legacy')).not.toBeNull();
  });

  it('bridges required native constraints into ElementInternals', async () => {
    const setValidity = vi.fn();
    vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
      setValidity,
      setFormValue: vi.fn(),
    } as unknown as ElementInternals);
    const input = document.createElement('su-input');
    input.required = true;
    await mount(input);
    expect(setValidity).toHaveBeenLastCalledWith(
      { valueMissing: true },
      expect.any(String),
      expect.any(HTMLInputElement)
    );
    input.value = 'ok';
    await input.updateComplete;
    expect(setValidity).toHaveBeenLastCalledWith({}, '', expect.any(HTMLInputElement));
    input.value = '';
    input.disabled = true;
    await input.updateComplete;
    expect(getFormController(input)?.checkValidity()).toBe(true);
  });

  it('validates rules, associates errors inside the shadow root, and clears them on edit', async () => {
    expect(SuForm).toBeDefined();
    const form = document.createElement('su-form');
    form.innerHTML =
      '<form novalidate><su-form-item label="用户名"><su-input name="username"></su-input></su-form-item></form>';
    form.rules = { username: [{ required: true, message: '请输入用户名' }] };
    await mount(form);
    const input = form.querySelector('su-input')!;
    await input.updateComplete;
    expect(await form.validate()).toBe(false);
    const native = input.shadowRoot!.querySelector('input')!;
    expect(native.getAttribute('aria-label')).toBe('用户名');
    expect(native.getAttribute('aria-describedby')).toContain('su-form-description');
    expect(input.shadowRoot!.querySelector('#su-form-description')?.textContent).toBe(
      '请输入用户名'
    );
    input.value = 'Alice';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(await form.validate()).toBe(true);
    expect(native.getAttribute('aria-invalid')).toBe('false');
  });

  it('discards asynchronous validation after an edit', async () => {
    const form = document.createElement('su-form');
    form.innerHTML = '<su-input name="user"></su-input>';
    let resolve!: (message: string) => void;
    const validator = vi.fn(
      () =>
        new Promise<string>((done) => {
          resolve = done;
        })
    );
    form.rules = { user: [{ validator }] };
    await mount(form);
    const validating = form.validate();
    await vi.waitFor(() => expect(validator).toHaveBeenCalled());
    form.querySelector('su-input')!.dispatchEvent(new Event('input', { bubbles: true }));
    resolve('过期错误');
    expect(await validating).toBe(false);
    expect(form.errors).toEqual({});
  });

  it('emits valid-submit only after validation and resets errors', async () => {
    const form = document.createElement('su-form');
    form.innerHTML = '<form novalidate><su-input name="user" value="Alice"></su-input></form>';
    await mount(form);
    const submitted = vi.fn();
    form.addEventListener('valid-submit', submitted);
    form
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(submitted).toHaveBeenCalledOnce());
    expect(submitted.mock.calls[0][0].detail.values.user).toBe('Alice');
    form.reset();
    expect(form.errors).toEqual({});
  });

  it('validates and submits multi-select arrays rather than the single-value compatibility field', async () => {
    const form = document.createElement('su-form');
    form.innerHTML = '<form novalidate><su-select name="roles" multiple></su-select></form>';
    await mount(form);
    const select = form.querySelector('su-select')!;
    select.options = [{ value: 'a', label: 'Admin' }];
    select.values = ['a'];
    form.rules = {
      roles: [
        {
          validator: (value) => (Array.isArray(value) && value[0] === 'a' ? '' : 'Expected array'),
        },
      ],
    };
    expect(await form.validate()).toBe(true);
    const submit = vi.fn();
    form.addEventListener('valid-submit', submit);
    form
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0][0].detail.values.roles).toEqual(['a']);
  });

  it('supports searchable multiple select and repeated form values', async () => {
    const setFormValue = vi.fn();
    vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
      setFormValue,
    } as unknown as ElementInternals);
    const select = document.createElement('su-select');
    Object.assign(select, {
      name: 'roles',
      multiple: true,
      searchable: true,
      clearable: true,
      values: ['a'],
      options: [
        { value: 'a', label: 'Admin' },
        { value: 'b', label: 'Editor' },
      ],
    });
    await mount(select);
    const search = select.shadowRoot!.querySelector('input')!;
    search.value = 'Editor';
    search.dispatchEvent(new Event('input'));
    await select.updateComplete;
    const native = select.shadowRoot!.querySelector('select')!;
    expect(native.options.length).toBe(2); // Selected options survive filtering.
    native.options[1].selected = true;
    native.dispatchEvent(new Event('change'));
    await select.updateComplete;
    expect(select.values).toEqual(['a', 'b']);
    expect((setFormValue.mock.calls.at(-1)![0] as FormData).getAll('roles')).toEqual(['a', 'b']);
    select.shadowRoot!.querySelector('button')!.click();
    await select.updateComplete;
    expect(select.values).toEqual([]);
    select.formResetCallback();
    await select.updateComplete;
    expect(select.values).toEqual(['a']);
  });

  it('emits remote search queries and disables selection while loading', async () => {
    const select = document.createElement('su-select');
    Object.assign(select, {
      remote: true,
      searchable: true,
      loading: true,
      options: [{ label: 'A', value: 'a' }],
    });
    await mount(select);
    const listener = vi.fn();
    select.addEventListener('search', listener);
    const search = select.shadowRoot!.querySelector('input')!;
    search.value = 'missing';
    search.dispatchEvent(new Event('input'));
    await select.updateComplete;
    expect(listener.mock.calls[0][0].detail.query).toBe('missing');
    expect(select.shadowRoot!.querySelector('select')!.options.length).toBe(2);
    expect(select.shadowRoot!.querySelector('select')!.disabled).toBe(true);
  });

  it('validates reversed date ranges, supports min/max and reset', async () => {
    const range = document.createElement('su-date-range');
    range.value = ['2026-01-01', '2026-01-02'];
    await mount(range);
    range.value = ['2026-02-01', '2026-01-01'];
    await range.updateComplete;
    expect(getFormController(range)?.validationMessage).toBe('结束日期不能早于开始日期');
    range.formResetCallback();
    await range.updateComplete;
    expect(getFormController(range)?.checkValidity()).toBe(true);
    range.min = '2026-03-01';
    await range.updateComplete;
    expect(getFormController(range)?.checkValidity()).toBe(false);
    range.formDisabledCallback(true);
    await range.updateComplete;
    expect(getFormController(range)?.checkValidity()).toBe(true);
  });

  it('expands nested menus, skips disabled entries and selects leaves', async () => {
    const menu = document.createElement('su-menu');
    menu.items = [
      {
        key: 'admin',
        label: '管理',
        children: [
          { key: 'off', label: '禁用', disabled: true },
          { key: 'users', label: '用户', iconName: 'user' },
        ],
      },
    ];
    await mount(menu);
    const listener = vi.fn();
    menu.addEventListener('select', listener);
    menu.shadowRoot!.querySelector<HTMLButtonElement>('.item')!.click();
    await menu.updateComplete;
    expect(menu.expandedKeys).toEqual(['admin']);
    expect(listener).not.toHaveBeenCalled();
    const root = menu.shadowRoot!.querySelector<HTMLButtonElement>('.item')!;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect((menu.shadowRoot!.activeElement as HTMLElement).dataset.key).toBe('users');
    menu.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="users"]')!.click();
    expect(menu.activeKey).toBe('users');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('cascades permission checks, reports half state, and isolates disabled nodes', async () => {
    const tree = document.createElement('su-tree');
    tree.checkable = true;
    tree.expandedKeys = ['root'];
    tree.nodes = [
      {
        key: 'root',
        label: '权限',
        children: [
          { key: 'read', label: '读取' },
          { key: 'write', label: '写入' },
          { key: 'off', label: '禁用', disabled: true },
        ],
      },
    ];
    await mount(tree);
    const listener = vi.fn();
    tree.addEventListener('check', listener);
    tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="read"]')!.click();
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelector('[data-key="root"]')!.getAttribute('aria-checked')).toBe(
      'mixed'
    );
    expect(listener.mock.calls[0][0].detail.halfCheckedKeys).toEqual(['root']);
    tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="root"]')!.click();
    await tree.updateComplete;
    expect(tree.checkedKeys.sort()).toEqual(['read', 'root', 'write']);
    tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="root"]')!.click();
    await tree.updateComplete;
    expect(tree.checkedKeys).toEqual([]);
  });

  it('supports strict independent tree checks and Space key activation', async () => {
    const tree = document.createElement('su-tree');
    Object.assign(tree, {
      checkable: true,
      checkStrictly: true,
      nodes: [{ key: 'root', label: '根', children: [{ key: 'child', label: '子' }] }],
    });
    await mount(tree);
    tree
      .shadowRoot!.querySelector('.label')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(tree.checkedKeys).toEqual(['root']);
  });

  it('filters table rows before pagination and retains sort order', async () => {
    const table = document.createElement('se-table');
    table.columns = [{ key: 'name', label: '姓名', filterable: true, sortable: true }];
    table.data = [{ name: 'Amy' }, { name: 'Bob' }, { name: 'Alice' }];
    table.pageSize = 1;
    await mount(table);
    table.shadowRoot!.querySelector<HTMLButtonElement>('.sort-button')!.click();
    await table.updateComplete;
    table.currentPage = 2;
    await table.updateComplete;
    const search = table.shadowRoot!.querySelector<HTMLInputElement>('.column-filter')!;
    search.value = 'a';
    search.dispatchEvent(new Event('input'));
    await table.updateComplete;
    expect(table.currentPage).toBe(1);
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Alice');
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).not.toContain('Bob');
  });

  it('emits remote filters without modifying server-provided rows', async () => {
    const table = document.createElement('se-table');
    Object.assign(table, {
      remote: true,
      data: [{ name: 'Bob' }],
      columns: [{ key: 'name', label: '姓名', filterable: true }],
    });
    await mount(table);
    const listener = vi.fn();
    table.addEventListener('filter-change', listener);
    const search = table.shadowRoot!.querySelector<HTMLInputElement>('.column-filter')!;
    search.value = 'other';
    search.dispatchEvent(new Event('input'));
    await table.updateComplete;
    expect(listener.mock.calls[0][0].detail.filters).toEqual({ name: 'other' });
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Bob');
  });
});
