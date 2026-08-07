import { afterEach, describe, expect, it } from 'vitest';
import './badge';
import './avatar';
import './card';
import './descriptions';
import './empty';
import './skeleton';
import './stat-card';
import './tag';

afterEach(() => {
  document.body.replaceChildren();
});

describe('data display components', () => {
  it('keeps card content in the documented slots', async () => {
    const card = document.createElement('su-card');
    const header = document.createElement('span');
    header.slot = 'header';
    header.textContent = '筛选条件';
    card.append(header, '内容');
    document.body.append(card);
    await (card as typeof card & { updateComplete: Promise<unknown> }).updateComplete;

    expect(card.shadowRoot?.querySelector('slot[name="header"]')).toBeTruthy();
    expect(card.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
    expect(card.shadowRoot?.querySelector('slot[name="footer"]')).toBeTruthy();
  });

  it('reflects tag variants in the rendered class', async () => {
    const tag = document.createElement('su-tag') as HTMLElement & {
      type: string;
      updateComplete: Promise<unknown>;
    };
    tag.type = 'success';
    tag.textContent = '已完成';
    document.body.append(tag);
    await tag.updateComplete;

    expect(tag.shadowRoot?.querySelector('.tag')?.classList.contains('success')).toBe(true);
  });

  it('hides zero badges unless showZero is enabled and caps large counts', async () => {
    const badge = document.createElement('su-badge') as HTMLElement & {
      count: number;
      max: number;
      showZero: boolean;
      updateComplete: Promise<unknown>;
    };
    badge.count = 0;
    document.body.append(badge);
    await badge.updateComplete;
    expect(badge.shadowRoot?.querySelector('.badge')).toBeNull();

    badge.showZero = true;
    await badge.updateComplete;
    expect(badge.shadowRoot?.querySelector('.badge')?.textContent).toBe('0');

    badge.count = 120;
    badge.max = 99;
    await badge.updateComplete;
    expect(badge.shadowRoot?.querySelector('.badge')?.textContent).toBe('99+');
  });

  it('renders empty-state description and action slot', async () => {
    const empty = document.createElement('su-empty') as HTMLElement & {
      description: string;
      updateComplete: Promise<unknown>;
    };
    empty.description = '暂无结果';
    const action = document.createElement('button');
    action.slot = '';
    action.textContent = '刷新';
    empty.append(action);
    document.body.append(empty);
    await empty.updateComplete;

    expect(empty.shadowRoot?.querySelector('.description')?.textContent).toBe('暂无结果');
    expect(empty.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
  });

  it('uses trend type to style stat-card output', async () => {
    const card = document.createElement('su-stat-card') as HTMLElement & {
      title: string;
      value: string;
      trend: string;
      trendType: string;
      updateComplete: Promise<unknown>;
    };
    card.title = '订单数';
    card.value = '128';
    card.trend = '+12%';
    card.trendType = 'up';
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector('.title')?.textContent).toBe('订单数');
    expect(card.shadowRoot?.querySelector('.value')?.textContent).toBe('128');
    expect(card.shadowRoot?.querySelector('.trend')?.classList.contains('up')).toBe(true);
  });

  it('falls back to the first character when avatar image fails', async () => {
    const avatar = document.createElement('su-avatar') as HTMLElement & {
      src: string;
      name: string;
      updateComplete: Promise<unknown>;
    };
    avatar.src = '/missing-avatar.png';
    avatar.name = 'Alice';
    document.body.append(avatar);
    await avatar.updateComplete;

    avatar.shadowRoot?.querySelector<HTMLImageElement>('img')?.dispatchEvent(new Event('error'));
    await avatar.updateComplete;

    expect(avatar.shadowRoot?.querySelector('.avatar')?.textContent?.trim()).toBe('A');
  });

  it('renders descriptions from JSON and applies the configured column count', async () => {
    const descriptions = document.createElement('su-descriptions') as HTMLElement & {
      itemsJson: string;
      header: string;
      column: number;
      bordered: boolean;
      updateComplete: Promise<unknown>;
    };
    descriptions.itemsJson = JSON.stringify([
      { label: '状态', value: '正常' },
      { label: '区域', value: '华东' },
    ]);
    descriptions.header = '基本信息';
    descriptions.column = 3;
    descriptions.bordered = true;
    document.body.append(descriptions);
    await descriptions.updateComplete;

    expect(descriptions.shadowRoot?.querySelector('.title')?.textContent).toBe('基本信息');
    expect(descriptions.shadowRoot?.querySelectorAll('.item')).toHaveLength(2);
    expect(descriptions.shadowRoot?.querySelector('.grid.bordered')).toBeTruthy();
    expect(descriptions.style.getPropertyValue('--desc-column')).toBe('3');
  });

  it('renders skeleton rows and switches to real content when loading ends', async () => {
    const skeleton = document.createElement('su-skeleton') as HTMLElement & {
      rows: number;
      avatar: boolean;
      loading: boolean;
      updateComplete: Promise<unknown>;
    };
    skeleton.rows = 4;
    skeleton.avatar = true;
    skeleton.textContent = '真实内容';
    document.body.append(skeleton);
    await skeleton.updateComplete;

    expect(skeleton.shadowRoot?.querySelectorAll('.row')).toHaveLength(4);
    expect(skeleton.shadowRoot?.querySelector('.avatar')).toBeTruthy();

    skeleton.loading = false;
    await skeleton.updateComplete;
    expect(skeleton.shadowRoot?.querySelector('.skeleton')).toBeNull();
    expect(skeleton.shadowRoot?.querySelector('slot')).toBeTruthy();
  });
});
