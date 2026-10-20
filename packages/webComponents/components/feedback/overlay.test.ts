import { afterEach, describe, expect, it, vi } from 'vitest';
import { LitElement, html } from 'lit';
import './modal';
import './drawer';
import '../image/preview';
import '../input';

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = '';
});

describe('modal focus management', () => {
  it.each(['su-modal', 'su-drawer'] as const)(
    'restores %s behavior after reattachment',
    async (tag) => {
      const overlay = document.createElement(tag);
      overlay.open = true;
      document.body.append(overlay);
      await overlay.updateComplete;
      overlay.remove();
      expect(document.body.style.overflow).toBe('');
      document.body.append(overlay);
      await overlay.updateComplete;
      expect(document.body.style.overflow).toBe('hidden');
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await overlay.updateComplete;
      expect(overlay.open).toBe(false);
      expect(document.body.style.overflow).toBe('');
    }
  );

  it('does not activate a modal removed before its first update', async () => {
    const modal = document.createElement('su-modal');
    modal.open = true;
    document.body.append(modal);
    modal.remove();
    await modal.updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  it('focuses slotted custom controls and traps focus in composed order', async () => {
    const modal = document.createElement('su-modal');
    const first = document.createElement('su-input');
    const hidden = document.createElement('button');
    hidden.hidden = true;
    const disabled = document.createElement('fieldset');
    disabled.disabled = true;
    disabled.innerHTML = '<button>Disabled descendant</button>';
    const last = document.createElement('button');
    last.textContent = 'Last';
    modal.append(first, hidden, disabled, last);
    modal.open = true;
    document.body.append(modal);
    await modal.updateComplete;
    await first.updateComplete;
    const inner = first.shadowRoot!.querySelector('input')!;
    const confirm = modal.shadowRoot!.querySelector<HTMLButtonElement>('.confirm')!;
    expect(first.shadowRoot!.activeElement).toBe(inner);

    const back = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    window.dispatchEvent(back);
    expect(back.defaultPrevented).toBe(true);
    expect(modal.shadowRoot!.activeElement).toBe(confirm);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
    expect(first.shadowRoot!.activeElement).toBe(inner);
  });

  it('does not let an inner canceled Escape close the surrounding modal', async () => {
    const modal = document.createElement('su-modal');
    modal.open = true;
    document.body.append(modal);
    await modal.updateComplete;
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    event.preventDefault();
    window.dispatchEvent(event);
    await modal.updateComplete;
    expect(modal.open).toBe(true);
  });

  it('traverses nested shadow roots and ignores hidden, inert and negative-tabindex controls', async () => {
    const modal = document.createElement('su-modal');
    modal.hideFooter = true;
    const wrapper = document.createElement('div');
    const shadow = wrapper.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<button hidden>Hidden</button><div inert><button>Inert</button></div><button tabindex="-1">Skip</button><fieldset disabled><input></fieldset>';
    const nested = document.createElement('div');
    nested.attachShadow({ mode: 'open' }).innerHTML = '<input autofocus>';
    shadow.append(nested);
    modal.append(wrapper);
    modal.open = true;
    document.body.append(modal);
    await modal.updateComplete;
    expect(nested.shadowRoot!.activeElement).toBe(nested.shadowRoot!.querySelector('input'));
    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    window.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(nested.shadowRoot!.activeElement?.tagName).toBe('INPUT');
  });

  it('waits for nested Lit wrappers to render their form controls', async () => {
    class NestedFields extends LitElement {
      render() {
        return html`<su-input label="Nested input"></su-input>`;
      }
    }
    customElements.define('test-overlay-nested-fields', NestedFields);
    const modal = document.createElement('su-modal');
    const fields = document.createElement('test-overlay-nested-fields') as NestedFields;
    modal.append(fields);
    modal.open = true;
    document.body.append(modal);
    await modal.updateComplete;
    await fields.updateComplete;
    const input = fields.shadowRoot!.querySelector('su-input')!;
    await input.updateComplete;
    await Promise.resolve();
    expect(input.shadowRoot!.activeElement).toBe(input.shadowRoot!.querySelector('input'));
  });

  it('only closes the top overlay on Escape and preserves the original body overflow', async () => {
    document.body.style.overflow = 'clip';
    const modal = document.createElement('su-modal');
    const drawer = document.createElement('su-drawer');
    modal.open = true;
    drawer.open = true;
    document.body.append(modal);
    await modal.updateComplete;
    document.body.append(drawer);
    await drawer.updateComplete;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    await drawer.updateComplete;
    expect(drawer.open).toBe(false);
    expect(modal.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    await modal.updateComplete;
    expect(document.body.style.overflow).toBe('clip');
  });

  it('does not steal focus or unlock scrolling when a lower overlay closes', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const lower = document.createElement('su-modal');
    lower.open = true;
    document.body.append(lower);
    await lower.updateComplete;
    const upper = document.createElement('su-drawer');
    upper.open = true;
    document.body.append(upper);
    await upper.updateComplete;
    expect(document.activeElement).toBe(upper);
    lower.open = false;
    await lower.updateComplete;
    expect(document.activeElement).toBe(upper);
    expect(document.body.style.overflow).toBe('hidden');
    upper.open = false;
    await upper.updateComplete;
    expect(document.body.style.overflow).toBe('');
  });

  it('refocuses an image preview after reattachment', async () => {
    const preview = document.createElement('se-image-preview');
    document.body.append(preview);
    await preview.updateComplete;
    preview.remove();
    const other = document.createElement('button');
    document.body.append(other);
    other.focus();
    document.body.append(preview);
    await preview.updateComplete;
    await Promise.resolve();
    expect(document.activeElement).toBe(preview);
    expect(preview.shadowRoot!.activeElement?.tagName).toBe('BUTTON');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks scrolling and removes keyboard behavior on detach', async () => {
    const modal = document.createElement('su-modal');
    modal.open = true;
    const close = vi.fn();
    modal.addEventListener('close', close);
    document.body.append(modal);
    await modal.updateComplete;
    modal.remove();
    expect(document.body.style.overflow).toBe('');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(close).not.toHaveBeenCalled();
  });
  it('locks scrolling and restores focus after Escape', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'Open';
    document.body.append(opener);
    opener.focus();

    const modal = document.createElement('su-modal');
    const onClose = vi.fn();
    modal.addEventListener('close', onClose);
    modal.open = true;
    document.body.append(modal);
    await modal.updateComplete;

    expect(document.body.style.overflow).toBe('hidden');
    expect(modal.shadowRoot?.activeElement?.tagName).toBe('BUTTON');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await modal.updateComplete;

    expect(modal.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'escape' });
  });

  it('keeps the modal open when confirm is prevented', async () => {
    const modal = document.createElement('su-modal');
    modal.open = true;
    modal.addEventListener('confirm', (event) => event.preventDefault());
    document.body.append(modal);
    await modal.updateComplete;

    modal.shadowRoot?.querySelector<HTMLButtonElement>('.confirm')?.click();
    await modal.updateComplete;

    expect(modal.open).toBe(true);
  });
});
