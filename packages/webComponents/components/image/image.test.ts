import { afterEach, describe, expect, it } from 'vitest';
import './index';

afterEach(() => {
  document.body.replaceChildren();
});

describe('image', () => {
  it('loads the real image while displaying a placeholder', async () => {
    const image = document.createElement('se-image');
    image.src = '/photo.png';
    image.placeholder = '/placeholder.png';
    image.lazy = true;
    document.body.append(image);
    await image.updateComplete;

    const images = image.shadowRoot?.querySelectorAll('img');
    expect(images?.[0].getAttribute('src')).toBe('/placeholder.png');
    expect(images?.[1].getAttribute('src')).toBe('/photo.png');
    expect(images?.[1].getAttribute('loading')).toBe('lazy');

    images?.[1].dispatchEvent(new Event('load'));
    await image.updateComplete;
    expect(image.shadowRoot?.querySelector('.image')?.classList.contains('loaded')).toBe(true);
  });

  it('uses the error placeholder after a load failure', async () => {
    const image = document.createElement('se-image');
    image.src = '/missing.png';
    image.errorPlaceholder = '/fallback.png';
    document.body.append(image);
    await image.updateComplete;

    image.shadowRoot?.querySelector('.image')?.dispatchEvent(new Event('error'));
    await image.updateComplete;

    expect(image.shadowRoot?.querySelector('.image')?.getAttribute('src')).toBe('/fallback.png');
  });
});
