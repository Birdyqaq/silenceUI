import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { styleMap } from 'lit/directives/style-map.js';
import search from '@iconify-icons/lucide/search';
import plus from '@iconify-icons/lucide/plus';
import check from '@iconify-icons/lucide/check';
import x from '@iconify-icons/lucide/x';
import settings from '@iconify-icons/lucide/settings';
import user from '@iconify-icons/lucide/user';
import trash from '@iconify-icons/lucide/trash';
import pencil from '@iconify-icons/lucide/pencil';
import chevronDown from '@iconify-icons/lucide/chevron-down';
import chevronRight from '@iconify-icons/lucide/chevron-right';
import loader from '@iconify-icons/lucide/loader';

// Only bundled, trusted SVG data is rendered; names never become raw SVG or remote URLs.
export type IconName =
  | 'search'
  | 'plus'
  | 'check'
  | 'x'
  | 'settings'
  | 'user'
  | 'trash'
  | 'pencil'
  | 'chevron-down'
  | 'chevron-right'
  | 'loader';
const icons: Record<IconName, { body: string; width?: number; height?: number }> = {
  search,
  plus,
  check,
  x,
  settings,
  user,
  trash,
  pencil,
  'chevron-down': chevronDown,
  'chevron-right': chevronRight,
  loader,
};
export const iconNames = Object.freeze(Object.keys(icons) as IconName[]);

@customElement('su-icon')
export class SuIcon extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) size = '1em';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) spin = false;

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: -0.125em;
      color: inherit;
    }
    svg {
      display: block;
      fill: none;
    }
    .spin {
      animation: rotate 1s linear infinite;
    }
    @keyframes rotate {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spin {
        animation: none;
      }
    }
  `;

  render() {
    const icon = Object.prototype.hasOwnProperty.call(icons, this.name)
      ? icons[this.name as IconName]
      : undefined;
    if (!icon) return nothing;
    const size = /^\d+(\.\d+)?$/.test(String(this.size)) ? `${this.size}px` : this.size;
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${icon.width ?? 24} ${icon.height ?? 24}"
      style=${styleMap({ width: size, height: size })}
      class=${this.spin ? 'spin' : ''}
      role=${this.label ? 'img' : nothing}
      aria-label=${this.label || nothing}
      aria-hidden=${this.label ? nothing : 'true'}
      focusable="false"
    >
      ${unsafeSVG(icon.body)}
    </svg>`;
  }
}
