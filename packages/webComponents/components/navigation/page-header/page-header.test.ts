import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('renders configured heading semantics and falls back for invalid levels', async () => {
  const el = document.createElement('su-page-header');
  el.heading = '成员';
  el.level = 3;
  document.body.append(el);
  await el.updateComplete;
  expect(el.shadowRoot?.querySelector('[role=heading]')?.getAttribute('aria-level')).toBe('3');
  el.level = 8;
  await el.updateComplete;
  expect(el.shadowRoot?.querySelector('[role=heading]')?.getAttribute('aria-level')).toBe('1');
});

it('only shows back on request and emits a composed host event', async () => {
  const el = document.createElement('su-page-header');
  const listener = vi.fn();
  const parent = document.createElement('div');
  parent.append(el);
  parent.addEventListener('back', listener);
  document.body.append(parent);
  await el.updateComplete;
  expect(el.shadowRoot?.querySelector('button')).toBeNull();
  el.showBack = true;
  el.backLabel = '返回列表';
  await el.updateComplete;
  const button = el.shadowRoot!.querySelector('button')!;
  expect(button.textContent).toBe('返回列表');
  button.click();
  expect(listener).toHaveBeenCalledOnce();
  expect(listener.mock.calls[0][0].composed).toBe(true);
});
