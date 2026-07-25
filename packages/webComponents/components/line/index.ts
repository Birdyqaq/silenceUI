import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('line-component')
export class LineComponent extends LitElement {
  @property({ type: String }) direction: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: String }) color: string = '#000';

  static styles = css`
    :host {
      display: block;
    }

    :host([direction='vertical']) {
      display: inline-block;
      height: 100%;
    }

    .line.horizontal {
      width: 100%;
      height: 4px;
    }

    .line.vertical {
      height: 100%;
      width: 4px;
    }
  `;

  render() {
    return html`
      <div
        class="line ${this.direction === 'horizontal' ? 'horizontal' : 'vertical'}"
        style="background-color: ${this.color};"
      ></div>
    `;
  }
}
