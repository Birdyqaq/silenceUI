class CustomElement extends HTMLElement {
    static get observedAttributes() {
        return ["type"];
    }

    _slot: HTMLSlotElement;
    constructor() {
        super();
        this._slot = document.createElement("slot"); // 创建slot标签
        this._slot.setAttribute("class", "slot");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const style = document.createElement('style');
        style.textContent = `
        /* 默认样式 */
        :host {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background-color: blue;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `;

        // 将样式标签添加到 Shadow DOM 中
        this.shadowRoot!.appendChild(style);
        shadowRoot.appendChild(this._slot); // 将slot加入shadow DOM

    }

    // 获取元素上的 type 属性
    get type() {
        return this.getAttribute('type')
    }
    // 设置元素上 type 属性
    set type(value) {
        if (value) {
            this.setAttribute('type', value)
            this.setAttribute('class', value)
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'type') {
            // 根据传入的类型设置组件自身的类名
            this.className = newValue;
        }
    }
}
customElements.define("sc-button", CustomElement);
