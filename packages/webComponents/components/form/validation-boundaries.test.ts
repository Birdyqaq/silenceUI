import { afterEach, describe, expect, it, vi } from 'vitest';
import './form';
import './form-item';
import './select';
import '../input';
import '../navigation/menu';
import { getFormController } from '../_shared/form';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mountForm(markup: string) {
  const form = document.createElement('su-form');
  form.innerHTML = markup;
  document.body.append(form);
  await form.updateComplete;
  await Promise.all(
    Array.from(
      form.querySelectorAll('su-input, su-select'),
      (element) => (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete
    )
  );
  return form;
}

describe('form validation boundaries', () => {
  it('focuses an enabled field when a disabled sibling shares its name', async () => {
    const form = await mountForm('<input name="user" disabled><input name="user">');
    form.rules = { user: [{ required: true }] };
    expect(await form.validate()).toBe(false);
    expect(document.activeElement).toBe(form.querySelectorAll('input')[1]);
  });

  it('does not submit after a validate listener replaces rules', async () => {
    const form = await mountForm('<form novalidate><input name="user" value="Alice"></form>');
    const submit = vi.fn();
    form.addEventListener('valid-submit', submit);
    const validate = vi.fn(() => {
      form.rules = { user: [{ validator: () => 'Blocked' }] };
    });
    form.addEventListener('validate', validate);
    form
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(validate).toHaveBeenCalledOnce());
    expect(submit).not.toHaveBeenCalled();
  });
  it('preserves business-owned native custom validity and FormItem helper text', async () => {
    const form = await mountForm(
      '<su-form-item label="User" message="Choose a public name"><input name="user" value="Alice"></su-form-item>'
    );
    const input = form.querySelector('input')!;
    const item = form.querySelector('su-form-item')!;
    input.setCustomValidity('Reserved by business validation');
    expect(await form.validate()).toBe(false);
    expect(form.errors.user).toBe('Reserved by business validation');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.validationMessage).toBe('Reserved by business validation');
    expect(item.message).toBe('Choose a public name');
    input.setCustomValidity('');
    expect(await form.validate()).toBe(true);
    expect(item.message).toBe('Choose a public name');
  });
  it.each(['value', 'disabled', 'remove', 'add', 'rule'] as const)(
    'discards pending validation after a programmatic %s change',
    async (change) => {
      const form = await mountForm('<su-input name="username" value="Alice"></su-input>');
      let finish!: (value: string) => void;
      const validator = vi.fn(
        () =>
          new Promise<string>((resolve) => {
            finish = resolve;
          })
      );
      form.rules = { username: [{ validator }] };
      const result = form.validate();
      await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce());
      const input = form.querySelector('su-input')!;
      if (change === 'value') input.value = 'Bob';
      if (change === 'disabled') input.disabled = true;
      if (change === 'remove') input.remove();
      if (change === 'add') {
        const extra = document.createElement('input');
        extra.name = 'extra';
        form.append(extra);
      }
      if (change === 'rule') form.rules.username[0].required = true;
      finish('This result is stale');
      expect(await result).toBe(false);
      expect(form.errors).toEqual({});
    }
  );

  it('keeps unrelated field errors while editing one field', async () => {
    const form = await mountForm(
      '<su-input name="user"></su-input><su-input name="email"></su-input>'
    );
    form.rules = { user: [{ required: true }], email: [{ required: true }] };
    expect(await form.validate()).toBe(false);
    const user = form.querySelector('su-input')!;
    user.value = 'Alice';
    user.dispatchEvent(new Event('input-change', { bubbles: true, composed: true }));
    expect(form.errors.user).toBeUndefined();
    expect(form.errors.email).toBe('此项必填');
  });

  it('does not clear errors or cancel validation when searching select options', async () => {
    const form = await mountForm(
      '<su-select name="role" searchable></su-select><su-input name="user"></su-input>'
    );
    const select = form.querySelector('su-select')!;
    form.rules = { role: [{ required: true }], user: [{ required: true }] };
    expect(await form.validate()).toBe(false);
    const search = select.shadowRoot!.querySelector('input')!;
    search.value = 'Admin';
    search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(form.errors).toEqual({ role: '此项必填', user: '此项必填' });
    let finish!: () => void;
    const validator = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    form.rules = { role: [{ validator }] };
    const result = form.validate();
    await vi.waitFor(() => expect(validator).toHaveBeenCalledOnce());
    search.value = 'Editor';
    search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    finish();
    expect(await result).toBe(true);
  });

  it('validates each same-name group once with successful, flattened values', async () => {
    const form = await mountForm(
      '<form novalidate><input type="checkbox" name="role" value="admin" checked><input type="checkbox" name="role" value="guest"><select name="role" multiple><option value="editor" selected>Editor</option></select><input name="role" value="disabled" disabled><input name="role" type="submit" value="save"></form>'
    );
    const validator = vi.fn(() => '');
    form.rules = { role: [{ validator }] };
    expect(await form.validate()).toBe(true);
    expect(validator).toHaveBeenCalledOnce();
    expect(validator.mock.calls[0][0]).toEqual(['admin', 'editor']);
  });

  it('does not submit unchecked checkboxes as empty string entries', async () => {
    const form = await mountForm(
      '<form novalidate><input type="checkbox" name="accept" value="yes"><input name="user" value="Alice"></form>'
    );
    const submit = vi.fn();
    form.addEventListener('valid-submit', submit);
    form
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0][0].detail.values).toEqual({ user: 'Alice' });
  });

  it('blocks submission if a validate listener changes a previously valid value', async () => {
    const form = await mountForm(
      '<form novalidate><su-input name="user" value="Alice"></su-input></form>'
    );
    const submit = vi.fn();
    form.addEventListener('valid-submit', submit);
    const validate = vi.fn(() => {
      form.querySelector('su-input')!.value = 'unvalidated';
    });
    form.addEventListener('validate', validate);
    form
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(validate).toHaveBeenCalledOnce());
    await form.querySelector('su-input')!.updateComplete;
    expect(submit).not.toHaveBeenCalled();
  });
});

describe('select and navigation boundaries', () => {
  it('retains remote selection labels and values across result replacements', async () => {
    const form = await mountForm('<su-select name="roles" multiple remote searchable></su-select>');
    const select = form.querySelector('su-select')!;
    select.options = [{ value: 'a', label: 'Administrator' }];
    select.values = ['a'];
    await select.updateComplete;
    select.options = [{ value: 'b', label: 'Editor' }];
    await select.updateComplete;
    const native = select.shadowRoot!.querySelector('select')!;
    expect(Array.from(native.selectedOptions, (option) => option.textContent?.trim())).toEqual([
      'Administrator',
    ]);
    native.querySelector<HTMLOptionElement>('[value="b"]')!.selected = true;
    native.dispatchEvent(new Event('change'));
    await select.updateComplete;
    expect([...select.values].sort()).toEqual(['a', 'b']);
    expect((getFormController(select)!.value as FormData).getAll('roles').sort()).toEqual([
      'a',
      'b',
    ]);
    select.values = [];
    await select.updateComplete;
    expect(native.querySelector('[value="a"]')).toBeNull();
  });

  it('ignores malformed options and duplicate serialized values', async () => {
    const form = await mountForm('<su-select name="role" searchable></su-select>');
    const select = form.querySelector('su-select')!;
    select.optionsJson = JSON.stringify([
      null,
      5,
      {},
      { label: 'Admin', value: 1 },
      { label: 'Duplicate', value: '1' },
    ]);
    await select.updateComplete;
    expect(select.shadowRoot!.querySelectorAll('option')).toHaveLength(2);
    const search = select.shadowRoot!.querySelector('input')!;
    select.formDisabledCallback(true);
    await select.updateComplete;
    const listener = vi.fn();
    select.addEventListener('search', listener);
    search.value = 'Admin';
    search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(listener).not.toHaveBeenCalled();
  });

  it('omits disabled options from submitted selected values', async () => {
    const form = await mountForm('<su-select name="roles" multiple></su-select>');
    const select = form.querySelector('su-select')!;
    select.options = [
      { value: 'a', label: 'Admin', disabled: true },
      { value: 'b', label: 'Editor' },
    ];
    select.values = ['a', 'b'];
    await select.updateComplete;
    expect((getFormController(select)!.value as FormData).getAll('roles')).toEqual(['b']);
  });

  it('keeps Right on a leaf and enters only an enabled immediate child from a parent', async () => {
    const menu = document.createElement('su-menu');
    menu.items = [
      {
        key: 'parent',
        label: 'Parent',
        children: [
          {
            key: 'nested',
            label: 'Nested',
            disabled: true,
            children: [{ key: 'hidden', label: 'Hidden' }],
          },
        ],
      },
      { key: 'leaf', label: 'Leaf' },
      { key: 'other', label: 'Other' },
    ];
    menu.expandedKeys = ['parent', 'nested'];
    document.body.append(menu);
    await menu.updateComplete;
    const parent = menu.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="parent"]')!;
    parent.focus();
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(menu.shadowRoot!.activeElement).toBe(parent);
    const leaf = menu.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="leaf"]')!;
    leaf.focus();
    leaf.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(menu.shadowRoot!.activeElement).toBe(leaf);
  });
});
