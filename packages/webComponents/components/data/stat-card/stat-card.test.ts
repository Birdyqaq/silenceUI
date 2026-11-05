import { afterEach, expect, it } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('renders a semantic metric card with optional direction and theme parts', async () => {
  const card = document.createElement('su-stat-card');
  card.title = '今日订单';
  card.value = '1,286';
  card.trend = '+12.5%';
  card.trendType = 'up';
  document.body.append(card);
  await card.updateComplete;

  expect(card.shadowRoot!.querySelector('[part="card"]')).not.toBeNull();
  expect(card.shadowRoot!.querySelector('.title')!.textContent).toContain('今日订单');
  expect(card.shadowRoot!.querySelector('.value')!.textContent).toContain('1,286');
  expect(card.shadowRoot!.querySelector('.trend')!.textContent).toContain('+12.5%');
  expect(card.shadowRoot!.querySelector('.trend')!.textContent).toContain('↑');
  expect(card.shadowRoot!.querySelector('.trend span')!.getAttribute('aria-label')).toBe('上升');
});

it('supports title, prefix, suffix, and trend slots and normalizes invalid trend types', async () => {
  const card = document.createElement('su-stat-card');
  card.value = '98.6';
  card.trendType = 'unexpected' as 'flat';
  for (const [slot, text] of [
    ['title', '活跃率'],
    ['prefix', '¥'],
    ['suffix', '人'],
    ['trend', '较昨日持平'],
  ]) {
    const element = document.createElement('span');
    element.slot = slot;
    element.textContent = text;
    card.append(element);
  }
  document.body.append(card);
  await card.updateComplete;

  const assignedText = (name: string) =>
    card.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!.assignedElements()[0]
      .textContent;
  expect(assignedText('title')).toBe('活跃率');
  expect(assignedText('prefix')).toBe('¥');
  expect(assignedText('suffix')).toBe('人');
  expect(card.shadowRoot!.querySelector('.trend')!.classList.contains('flat')).toBe(true);
  expect(assignedText('trend')).toBe('较昨日持平');
});

it('hides empty trends and reacts to slot insertion and removal', async () => {
  const card = document.createElement('su-stat-card');
  document.body.append(card);
  await card.updateComplete;
  const trend = card.shadowRoot!.querySelector<HTMLElement>('.trend')!;
  expect(trend.hidden).toBe(true);
  const content = document.createElement('span');
  content.slot = 'trend';
  content.textContent = '较昨日';
  card.append(content);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await card.updateComplete;
  expect(trend.hidden).toBe(false);
  expect(trend.querySelector('[role="img"]')!.getAttribute('aria-label')).toBe('持平');
  content.remove();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await card.updateComplete;
  expect(trend.hidden).toBe(true);
});
