// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SuButton } from './index';
import { fireEvent } from '@testing-library/dom';

let button: SuButton | undefined;

describe('SuButton', () => {
  beforeEach(() => {
    button = document.createElement('su-button') as SuButton;
    document.body.appendChild(button);
  });

  afterEach(() => {
    button?.remove();
    button = undefined;
  });

  it('should be defined', () => {
    expect(SuButton).toBeDefined();
  });

  it('should render slot content', async () => {
    if (!button) return;
    button.textContent = 'Click Me';
    await button.updateComplete;
    const slot = button.shadowRoot?.querySelector('slot');
    const assigned = slot?.assignedNodes().map((n) => n.textContent).join('') ?? '';
    expect(assigned).toContain('Click Me');
  });

  it('should reflect disabled attribute on native button', async () => {
    if (!button) return;
    button.disabled = true;
    await button.updateComplete;
    const btn = button.shadowRoot?.querySelector('button');
    expect(btn?.hasAttribute('disabled')).toBe(true);
  });

  it('should disable native button while loading', async () => {
    if (!button) return;
    button.loading = true;
    await button.updateComplete;
    const btn = button.shadowRoot?.querySelector('button');
    expect(btn?.hasAttribute('disabled')).toBe(true);
    expect(btn?.getAttribute('aria-busy')).toBe('true');
    expect(button.shadowRoot?.querySelector('.spinner')).toBeTruthy();
    expect(button.shadowRoot?.querySelector('slot')).toBeTruthy();
  });

  it('should emit click event when active', async () => {
    if (!button) return;
    await button.updateComplete;
    const btn = button.shadowRoot?.querySelector('button');
    let clicked = false;
    button.addEventListener('click', () => {
      clicked = true;
    });
    await fireEvent.click(btn!);
    expect(clicked).toBe(true);
  });

  it('should not emit click event when disabled', async () => {
    if (!button) return;
    button.disabled = true;
    await button.updateComplete;
    const btn = button.shadowRoot?.querySelector('button');
    let clicked = false;
    button.addEventListener('click', () => {
      clicked = true;
    });
    await fireEvent.click(btn!);
    expect(clicked).toBe(false);
  });
});
