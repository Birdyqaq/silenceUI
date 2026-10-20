import { afterEach, describe, expect, it, vi } from 'vitest';
import '../input';
import './textarea';

afterEach(() => document.body.replaceChildren());

describe('text control accessibility', () => {
  it.each(['su-input', 'su-textarea'] as const)(
    'associates %s labels and dynamic descriptions within its shadow root',
    async (tag) => {
      const control = document.createElement(tag);
      control.label = '备注';
      control.helperText = '请填写说明';
      document.body.append(control);
      await control.updateComplete;
      const field = control.shadowRoot!.querySelector('input, textarea')!;
      const label = control.shadowRoot!.querySelector('label')!;
      expect(label.getAttribute('for')).toBe(field.id);
      const description = field.getAttribute('aria-describedby')!;
      expect(control.shadowRoot!.getElementById(description)?.textContent).toBe('请填写说明');
      control.error = true;
      control.helperText = '说明不能为空';
      await control.updateComplete;
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(control.shadowRoot!.getElementById(description)?.textContent).toBe('说明不能为空');
      control.helperText = '';
      control.error = false;
      await control.updateComplete;
      expect(field.hasAttribute('aria-describedby')).toBe(false);
      expect(control.shadowRoot!.getElementById(description)).toBeNull();
      expect(field.getAttribute('aria-invalid')).toBe('false');
    }
  );

  it.each(['disabled', 'readonly', 'fieldset'] as const)(
    'makes clear unavailable while %s and restores it after enabling',
    async (state) => {
      const control = document.createElement('su-input');
      control.clearable = true;
      control.value = 'Keep';
      document.body.append(control);
      await control.updateComplete;
      const change = vi.fn();
      control.addEventListener('input-change', change);
      if (state === 'fieldset') control.formDisabledCallback(true);
      else control[state] = true;
      await control.updateComplete;
      const clear = control.shadowRoot!.querySelector<HTMLButtonElement>('.clear-btn')!;
      expect(clear.disabled).toBe(true);
      clear.click();
      expect(control.value).toBe('Keep');
      expect(change).not.toHaveBeenCalled();
      if (state === 'fieldset') control.formDisabledCallback(false);
      else control[state] = false;
      await control.updateComplete;
      expect(clear.disabled).toBe(false);
      clear.click();
      await control.updateComplete;
      expect(control.value).toBe('');
      expect(change).toHaveBeenCalledOnce();
      expect(control.shadowRoot!.activeElement).toBe(control.shadowRoot!.querySelector('input'));
    }
  );
});
