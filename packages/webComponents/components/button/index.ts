import "./index.scss";

class CustomElement extends HTMLElement {
    static get observedAttributes() {
        return ["type", "size"];
    }

    _slot: HTMLSlotElement;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        this._slot = document.createElement("slot");
        const style = document.createElement('style');

        shadowRoot.appendChild(style);

        shadowRoot.appendChild(this._slot);
    }

    connectedCallback() {
        // this.updateStyle();
        this.classList.add('sc-button')
        this.classList.add("sc-button--primary")
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            console.log(name, newValue, oldValue, '哈哈哈')
        }

    }


}

customElements.define("sc-button", CustomElement);
