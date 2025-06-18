import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('line-component')
export class LineComponent extends LitElement {

    @property({ type: String }) direction: 'horizontal' | 'vertical' = 'horizontal';
    @property({ type: String }) color: string = '#000';

    static styles = css`
    import 'uno.css';
    @unocss-placeholder;

    .line {
      @apply bg-current;
    }

    .horizontal {
      @apply w-full h-1;
    }

    .vertical {
      @apply h-full w-1;
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