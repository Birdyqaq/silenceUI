import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SuTypewriter } from './index';
import './index';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function mount(properties: Partial<SuTypewriter> = {}) {
  const element = Object.assign(
    document.createElement('su-typewriter'),
    { speed: 10, deleteSpeed: 5, holdDelay: 20 },
    properties
  );
  document.body.append(element);
  await element.updateComplete;
  await element.updateComplete;
  return element;
}
const visible = (element: SuTypewriter) =>
  element.shadowRoot!.querySelector('[part="text"]')!.textContent;

describe('su-typewriter', () => {
  it('types complete graphemes and emits bubbling completion events once', async () => {
    const element = await mount({ text: '你👨‍👩‍👧‍👦e\u0301' });
    const complete = vi.fn();
    const sentence = vi.fn();
    element.addEventListener('complete', complete);
    element.addEventListener('text-complete', sentence);
    await vi.advanceTimersByTimeAsync(10);
    expect(visible(element)).toBe('你');
    await vi.advanceTimersByTimeAsync(10);
    expect(visible(element)).toBe('你👨‍👩‍👧‍👦');
    await vi.advanceTimersByTimeAsync(100);
    expect(visible(element)).toBe('你👨‍👩‍👧‍👦e\u0301');
    expect(complete).toHaveBeenCalledOnce();
    expect(sentence).toHaveBeenCalledOnce();
    expect(complete.mock.calls[0][0]).toMatchObject({
      detail: { text: element.text, index: 0 },
      bubbles: true,
      composed: true,
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('holds, deletes and advances, preserving the last sentence without a loop', async () => {
    const element = await mount({ texts: ['AB', 'C'] });
    await vi.advanceTimersByTimeAsync(20);
    expect(visible(element)).toBe('AB');
    await vi.advanceTimersByTimeAsync(20);
    expect(visible(element)).toBe('AB');
    await vi.advanceTimersByTimeAsync(5);
    expect(visible(element)).toBe('A');
    await vi.advanceTimersByTimeAsync(5);
    expect(visible(element)).toBe('');
    await vi.advanceTimersByTimeAsync(10);
    expect(visible(element)).toBe('C');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('loops without an overall complete event and can pause, resume and restart', async () => {
    const element = await mount({ text: 'AB', loop: true });
    const complete = vi.fn();
    const sentence = vi.fn();
    element.addEventListener('complete', complete);
    element.addEventListener('text-complete', sentence);
    await vi.advanceTimersByTimeAsync(10);
    element.pause();
    await vi.advanceTimersByTimeAsync(100);
    expect(visible(element)).toBe('A');
    element.resume();
    await vi.advanceTimersByTimeAsync(60);
    expect(sentence).toHaveBeenCalledTimes(2);
    expect(complete).not.toHaveBeenCalled();
    element.pause();
    element.restart();
    await element.updateComplete;
    expect(visible(element)).toBe('');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('replaces content and applies updated speed without retaining old timers', async () => {
    const element = await mount({ text: 'old' });
    await vi.advanceTimersByTimeAsync(10);
    element.text = 'NEW';
    element.speed = 20;
    await element.updateComplete;
    await vi.advanceTimersByTimeAsync(19);
    expect(visible(element)).toBe('');
    await vi.advanceTimersByTimeAsync(1);
    expect(visible(element)).toBe('N');
    element.speed = 5;
    await element.updateComplete;
    await vi.advanceTimersByTimeAsync(10);
    expect(visible(element)).toBe('NEW');
  });

  it('honors initial delay, cancels on detach and restarts on reconnect', async () => {
    const element = await mount({ text: 'AB', startDelay: 30 });
    await vi.advanceTimersByTimeAsync(39);
    expect(visible(element)).toBe('');
    await vi.advanceTimersByTimeAsync(1);
    expect(visible(element)).toBe('A');
    element.remove();
    expect(vi.getTimerCount()).toBe(0);
    document.body.append(element);
    await vi.advanceTimersByTimeAsync(40);
    expect(visible(element)).toBe('A');
  });

  it('does not schedule when removed before the first update or with empty content', async () => {
    const element = document.createElement('su-typewriter');
    element.text = 'detached';
    document.body.append(element);
    element.remove();
    await element.updateComplete;
    expect(vi.getTimerCount()).toBe(0);
    const empty = await mount({ texts: ['', ''], loop: true });
    expect(visible(empty)).toBe('');
    expect(empty.shadowRoot!.querySelector('[part="cursor"]')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('renders literal markup safely and exposes full text without live announcements', async () => {
    const element = await mount({
      text: '<b>Hi</b>',
      paused: true,
      effect: 'slide',
      cursor: 'underscore',
    });
    expect(element.shadowRoot!.querySelector('.accessible')!.textContent).toBe('<b>Hi</b>');
    expect(element.shadowRoot!.querySelector('[aria-live]')).toBeNull();
    expect(element.shadowRoot!.querySelector('[part="text"]')!.getAttribute('aria-hidden')).toBe(
      'true'
    );
    expect(element.shadowRoot!.querySelector('[part="cursor"]')!.textContent).toBe('_');
    element.resume();
    await vi.advanceTimersByTimeAsync(100);
    expect(visible(element)).toBe('<b>Hi</b>');
    expect(element.shadowRoot!.querySelector('b')).toBeNull();
  });

  it('shows all content without timers for reduced motion and removes its listener', async () => {
    let listener: ((event: { matches: boolean }) => void) | undefined;
    const removeEventListener = vi.fn();
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: (_: string, callback: typeof listener) => {
        listener = callback;
      },
      removeEventListener,
    }));
    const element = await mount({ texts: ['你好', 'World'], loop: true });
    expect(visible(element)).toBe('你好；World');
    expect(vi.getTimerCount()).toBe(0);
    expect(element.shadowRoot!.querySelector('[part="cursor"]')).toBeNull();
    listener?.({ matches: false });
    await vi.advanceTimersByTimeAsync(10);
    expect(visible(element)).toBe('你');
    element.remove();
    expect(removeEventListener).toHaveBeenCalledWith('change', listener);
    expect(vi.getTimerCount()).toBe(0);
  });
});
