import { afterEach, describe, expect, it, vi } from 'vitest';
import './modal';

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = '';
});

describe('modal focus management', () => {
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
