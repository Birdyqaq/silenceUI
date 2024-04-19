import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('button-component')

export class ButtonComponent extends LitElement {

  @property({ type: String }) _color = 'blue';
  @property({ type: String }) _size = 'medium';
  @property({ type: String }) colorClass = '';
  static styles = css`
     @unocss-placeholder
  `
  constructor() {
    super();
    this._color = 'blue';
    this._size = 'medium';
    this.colorClass = ""
  }

  @property({ type: String })
  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
  }

  @property({ type: String })
  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
  }
  render() {
    const sizeClasses = {
      small: 'px-2 py-1 text-sm',
      medium: 'px-3 py-2 text-base',
      large: 'px-4 py-3 text-lg'
    }[this.size] || '';
    return html`
      <span class="${sizeClasses} border-none cursor-pointer inline-block rounded bg-${this._color}">
        <slot></slot>
      </span>
    `;
  }
}
