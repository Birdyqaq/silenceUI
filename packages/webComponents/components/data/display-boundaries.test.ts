import { afterEach, expect, it } from 'vitest';
import './descriptions';
import './skeleton';
import '../navigation/steps';

afterEach(() => document.body.replaceChildren());

it('refreshes description titles and numeric layout after corrections', async () => {
  const detail = document.createElement('su-descriptions');
  detail.header = '订单详情';
  detail.column = NaN;
  document.body.append(detail);
  await detail.updateComplete;
  const list = detail.shadowRoot!.querySelector('dl')!;
  expect(
    detail.shadowRoot!.getElementById(list.getAttribute('aria-labelledby')!)!.textContent
  ).toBe('订单详情');
  detail.header = '';
  detail.column = 3;
  detail.items = [{ label: '状态', value: '完成' }];
  await detail.updateComplete;
  expect(list.hasAttribute('aria-labelledby')).toBe(false);
  expect(detail.style.getPropertyValue('--desc-column')).toBe('3');
  expect(list.querySelector('dd')!.textContent).toBe('完成');
});

it('recalculates step completion when the list shrinks and recovers on edits', async () => {
  const steps = document.createElement('su-steps');
  steps.items = [{ title: '填写' }, { title: '提交' }, { title: '完成' }];
  steps.current = 2;
  document.body.append(steps);
  await steps.updateComplete;
  steps.items = steps.items.slice(0, 1);
  await steps.updateComplete;
  expect(steps.shadowRoot!.querySelectorAll('.finished')).toHaveLength(1);
  expect(steps.shadowRoot!.querySelector('[aria-current="step"]')).toBeNull();
  steps.current = -1;
  await steps.updateComplete;
  expect(
    steps.shadowRoot!.querySelector('[aria-current="step"]')!.getAttribute('aria-label')
  ).toContain('填写，当前步骤');
});

it('renders semantic description pairs and filters invalid entries without mutation', async () => {
  const detail = document.createElement('su-descriptions');
  const items = [
    null,
    { label: '姓名', value: '张三' },
    { label: '缺少值' },
    { label: 'HTML', value: '<script>x</script>' },
  ];
  detail.items = items as typeof detail.items;
  document.body.append(detail);
  await detail.updateComplete;
  expect(detail.shadowRoot!.querySelectorAll('dl > div > dt')).toHaveLength(2);
  expect(detail.shadowRoot!.querySelectorAll('dd')).toHaveLength(2);
  expect(detail.shadowRoot!.querySelector('script')).toBeNull();
  expect(items).toHaveLength(4);
  detail.items = null as unknown as typeof detail.items;
  detail.itemsJson = '[null,{"label":"状态","value":"有效"}]';
  await detail.updateComplete;
  expect(detail.shadowRoot!.querySelectorAll('dt')).toHaveLength(1);
});

it.each([
  [NaN, 2],
  [Infinity, 2],
  [-2, 1],
  [2.8, 2],
  [200, 12],
])('normalizes description column %s to %s', async (column, expected) => {
  const detail = document.createElement('su-descriptions');
  detail.column = column;
  document.body.append(detail);
  await detail.updateComplete;
  expect(detail.style.getPropertyValue('--desc-column')).toBe(String(expected));
  expect(Object.is(detail.column, column)).toBe(true);
});

it.each([
  [NaN, 3],
  [Infinity, 3],
  [-1, 1],
  [2.9, 2],
  [1e6, 100],
])('bounds skeleton rows %s to %s', async (rows, expected) => {
  const skeleton = document.createElement('su-skeleton');
  skeleton.rows = rows;
  document.body.append(skeleton);
  await skeleton.updateComplete;
  expect(skeleton.shadowRoot!.querySelectorAll('.row')).toHaveLength(expected);
  skeleton.loading = false;
  await skeleton.updateComplete;
  expect(skeleton.shadowRoot!.querySelector('[aria-busy]')).toBeNull();
  expect(skeleton.shadowRoot!.querySelector('slot')).toBeTruthy();
});

it('filters malformed steps and recovers after JSON/property replacement', async () => {
  const steps = document.createElement('su-steps');
  steps.items = [
    null,
    { title: '填写' },
    { title: 2 },
    { title: '提交', description: {} },
  ] as typeof steps.items;
  document.body.append(steps);
  await steps.updateComplete;
  expect(steps.shadowRoot!.querySelectorAll('.step')).toHaveLength(2);
  expect(steps.shadowRoot!.querySelector('.description')).toBeNull();
  steps.items = null as unknown as typeof steps.items;
  steps.itemsJson = '[null,{"title":"完成"}]';
  await steps.updateComplete;
  expect(steps.shadowRoot!.querySelectorAll('.step')).toHaveLength(1);
});

it.each([
  [NaN, 0, 0],
  [Infinity, 0, 0],
  [-3, 0, 0],
  [1.9, 1, 1],
  [3, -1, 3],
  [20, -1, 3],
])('normalizes step index %s consistently', async (current, active, finished) => {
  const steps = document.createElement('su-steps');
  steps.items = [{ title: '填写' }, { title: '提交' }, { title: '完成' }];
  steps.current = current;
  document.body.append(steps);
  await steps.updateComplete;
  expect(steps.shadowRoot!.querySelectorAll('.finished')).toHaveLength(finished);
  const items = [...steps.shadowRoot!.querySelectorAll('.step')];
  expect(items.findIndex((item) => item.getAttribute('aria-current') === 'step')).toBe(active);
  expect(Object.is(steps.current, current)).toBe(true);
});
