import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import { LitElement, html } from 'lit';

@customElement("my-component")
class MyComponent extends LitElement {
    render() {
        return html`
          <div @click="${this.handleClick}">111188881</>
        `;
    }

    handleClick() {
        alert('按钮被点击了！');
    }
}
