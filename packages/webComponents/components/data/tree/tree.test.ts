import { afterEach, describe, expect, it } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

describe('tree data validation', () => {
  it.each(['json', 'property'])(
    'ignores malformed nodes from %s and retains valid descendants',
    async (source) => {
      const tree = document.createElement('su-tree');
      const nodes = [
        null,
        true,
        5,
        'bad',
        {},
        { key: 'missing-label' },
        {
          key: 'parent',
          label: 'Parent',
          children: [null, { label: 'Missing key' }, { key: 'child', label: 'Child' }],
        },
        { key: 'leaf', label: 'Leaf', children: 'invalid' },
      ];
      if (source === 'json') tree.nodesJson = JSON.stringify(nodes);
      else tree.nodes = nodes as never;
      tree.expandedKeys = ['parent', 'leaf'];
      document.body.append(tree);
      await tree.updateComplete;
      expect(
        Array.from(tree.shadowRoot!.querySelectorAll('.label'), (node) => node.textContent?.trim())
      ).toEqual(['Parent', 'Child', 'Leaf']);
      expect(
        tree.shadowRoot!.querySelector('[data-key="leaf"]')?.hasAttribute('aria-expanded')
      ).toBe(false);
      tree
        .shadowRoot!.querySelector<HTMLButtonElement>('[data-key="parent"]')!
        .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await tree.updateComplete;
      expect(tree.shadowRoot!.activeElement?.getAttribute('data-key')).toBe('child');
    }
  );

  it('recovers when malformed JSON is replaced with valid data', async () => {
    const tree = document.createElement('su-tree');
    tree.nodesJson = '[null]';
    document.body.append(tree);
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelectorAll('.label')).toHaveLength(0);
    tree.nodesJson = '[{"key":"valid","label":"Valid"}]';
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelector('.label')?.getAttribute('tabindex')).toBe('0');
  });

  it('does not recurse through circular property data', async () => {
    const tree = document.createElement('su-tree');
    const parent = { key: 'parent', label: 'Parent', children: [] as unknown[] };
    parent.children.push(parent);
    tree.nodes = [parent] as never;
    tree.expandedKeys = ['parent'];
    document.body.append(tree);
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelectorAll('.label')).toHaveLength(1);
  });
});
