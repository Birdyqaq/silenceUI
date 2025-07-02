/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = {
  toAttribute(t2, s2) {
    switch (s2) {
      case Boolean:
        t2 = t2 ? l$1 : null;
        break;
      case Object:
      case Array:
        t2 = null == t2 ? t2 : JSON.stringify(t2);
    }
    return t2;
  }, fromAttribute(t2, s2) {
    let i2 = t2;
    switch (s2) {
      case Boolean:
        i2 = null !== t2;
        break;
      case Number:
        i2 = null === t2 ? null : Number(t2);
        break;
      case Object:
      case Array:
        try {
          i2 = JSON.parse(t2);
        } catch (t3) {
          i2 = null;
        }
    }
    return i2;
  }
}, f$1 = (t2, s2) => !i$2(t2, s2), b = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? {
      get() {
        return this[s2];
      }, set(t3) {
        this[s2] = t3;
      }
    };
    return {
      get: e2, set(s3) {
        const h2 = e2 == null ? void 0 : e2.call(this);
        r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
      }, configurable: true, enumerable: true
    };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    var _a2;
    if (void 0 !== t2) {
      const e2 = this.constructor, h2 = this[t2];
      if (i2 ?? (i2 = e2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = t$1.trustedTypes, s$1 = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$2 = "?" + h, n$1 = `<${o$2}>`, r$2 = document, l = () => r$2.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y2(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$2.createTreeWalker(r$2, 129);
function P(t2, i2) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
}
const V = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s3.length && (c2.lastIndex = y3, u2 = c2.exec(s3), null !== u2);) y3 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = C.nextNode()) && d2.length < u2;) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i$1 ? i$1.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$2) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1));) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$2.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === T) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class M {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$2).importNode(i2, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2;) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$2, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$2.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new M(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB;) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = S(this, e3[s2 + n3], i2, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$1.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.0");
const B = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return T;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return {
      set(r3) {
        const n4 = e2.get.call(this);
        e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
      }, init(e3) {
        return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
      }
    };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function (r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const rippleEffect = (event, options = {}) => {
  const button = event.currentTarget;
  const circle = document.createElement("div");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();
  const x2 = event.clientX - rect.left - radius;
  const y3 = event.clientY - rect.top - radius;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${x2}px`;
  circle.style.top = `${y3}px`;
  circle.style.position = "absolute";
  circle.classList.add("ripple");
  if (options.color) {
    circle.style.setProperty("--ripple-color", options.color);
  }
  const existingRipples = button.querySelectorAll(".ripple");
  existingRipples.forEach((ripple) => ripple.remove());
  button.appendChild(circle);
  circle.addEventListener("animationend", () => {
    circle.remove();
  });
};
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
let SeButton = class extends i {
  constructor() {
    super(...arguments);
    this.size = "medium";
    this.type = "primary";
    this.disabled = false;
    this.loading = false;
    this.iconClass = "";
    this.iconPosition = "left";
    this.rippleColor = "";
  }
  handleClick(e2) {
    if (this.disabled || this.loading) return;
    const color = this.rippleColor || getComputedStyle(this).getPropertyValue("--ripple-color");
    rippleEffect(e2, { color });
  }
  render() {
    return x`
      <button
        class=${this.getButtonClasses()}
        @click=${this.handleClick}
        ?disabled=${this.disabled}
      >
        ${this.renderIcon("left")}
        ${this.loading ? this.renderSpinner() : x`<slot></slot>`}
        ${this.renderIcon("right")}
      </button>
    `;
  }
  getButtonClasses() {
    return [
      "inline-block w-auto h-auto border-none rounded",
      this.getSizeClasses(),
      this.getTypeClasses(),
      this.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      "relative overflow-hidden"
      // 为水波纹效果添加
    ].join(" ");
  }
  getSizeClasses() {
    return {
      small: "px-2 py-1 text-sm",
      medium: "px-3 py-2 text-base",
      large: "px-4 py-3 text-lg"
    }[this.size];
  }
  getTypeClasses() {
    return {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      danger: "bg-red-500 text-white hover:bg-red-600",
      info: "bg-blue-400 text-white hover:bg-blue-500",
      light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      dark: "bg-gray-900 text-white hover:bg-gray-800",
      link: "text-blue-600 hover:text-blue-700 bg-transparent"
    }[this.type];
  }
  renderSpinner() {
    return x`<span class="spinner"></span>`;
  }
  renderIcon(position) {
    if (!this.iconClass || this.iconPosition !== position) return;
    return x`<i class="icon ${position === "right" ? "ml-2" : "mr-2"} ${this.iconClass}"></i>`;
  }
};
SeButton.styles = i$3`
   /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: default */
.absolute{position:absolute;}
.relative{position:relative;}
.static{position:static;}
.ml-2{margin-left:0.5rem;}
.mr-2{margin-right:0.5rem;}
.inline-block{display:inline-block;}
.hidden{display:none;}
.h-auto{height:auto;}
.w-auto{width:auto;}
.inline-flex{display:inline-flex;}
.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
.cursor-pointer{cursor:pointer;}
.cursor-not-allowed{cursor:not-allowed;}
.overflow-hidden{overflow:hidden;}
.border{border-width:1px;}
.rounded{border-radius:0.25rem;}
.border-none{border-style:none;}
.bg-blue-400{--un-bg-opacity:1;background-color:rgb(96 165 250 / var(--un-bg-opacity)) /* #60a5fa */;}
.bg-blue-500{--un-bg-opacity:1;background-color:rgb(59 130 246 / var(--un-bg-opacity)) /* #3b82f6 */;}
.bg-gray-100{--un-bg-opacity:1;background-color:rgb(243 244 246 / var(--un-bg-opacity)) /* #f3f4f6 */;}
.bg-gray-600{--un-bg-opacity:1;background-color:rgb(75 85 99 / var(--un-bg-opacity)) /* #4b5563 */;}
.bg-gray-900{--un-bg-opacity:1;background-color:rgb(17 24 39 / var(--un-bg-opacity)) /* #111827 */;}
.bg-green-600{--un-bg-opacity:1;background-color:rgb(22 163 74 / var(--un-bg-opacity)) /* #16a34a */;}
.bg-red-500{--un-bg-opacity:1;background-color:rgb(239 68 68 / var(--un-bg-opacity)) /* #ef4444 */;}
.bg-transparent{background-color:transparent /* transparent */;}
.bg-yellow-600{--un-bg-opacity:1;background-color:rgb(202 138 4 / var(--un-bg-opacity)) /* #ca8a04 */;}
.hover\\:bg-blue-500:hover{--un-bg-opacity:1;background-color:rgb(59 130 246 / var(--un-bg-opacity)) /* #3b82f6 */;}
.hover\\:bg-blue-600:hover{--un-bg-opacity:1;background-color:rgb(37 99 235 / var(--un-bg-opacity)) /* #2563eb */;}
.hover\\:bg-gray-200:hover{--un-bg-opacity:1;background-color:rgb(229 231 235 / var(--un-bg-opacity)) /* #e5e7eb */;}
.hover\\:bg-gray-700:hover{--un-bg-opacity:1;background-color:rgb(55 65 81 / var(--un-bg-opacity)) /* #374151 */;}
.hover\\:bg-gray-800:hover{--un-bg-opacity:1;background-color:rgb(31 41 55 / var(--un-bg-opacity)) /* #1f2937 */;}
.hover\\:bg-green-700:hover{--un-bg-opacity:1;background-color:rgb(21 128 61 / var(--un-bg-opacity)) /* #15803d */;}
.hover\\:bg-red-600:hover{--un-bg-opacity:1;background-color:rgb(220 38 38 / var(--un-bg-opacity)) /* #dc2626 */;}
.hover\\:bg-yellow-700:hover{--un-bg-opacity:1;background-color:rgb(161 98 7 / var(--un-bg-opacity)) /* #a16207 */;}
.px-2{padding-left:0.5rem;padding-right:0.5rem;}
.px-3{padding-left:0.75rem;padding-right:0.75rem;}
.px-4{padding-left:1rem;padding-right:1rem;}
.py-1{padding-top:0.25rem;padding-bottom:0.25rem;}
.py-2{padding-top:0.5rem;padding-bottom:0.5rem;}
.py-3{padding-top:0.75rem;padding-bottom:0.75rem;}
.text-base{font-size:1rem;line-height:1.5rem;}
.text-lg{font-size:1.125rem;line-height:1.75rem;}
.text-sm{font-size:0.875rem;line-height:1.25rem;}
.text-blue-600{--un-text-opacity:1;color:rgb(37 99 235 / var(--un-text-opacity)) /* #2563eb */;}
.text-gray-800{--un-text-opacity:1;color:rgb(31 41 55 / var(--un-text-opacity)) /* #1f2937 */;}
.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity)) /* #fff */;}
.hover\\:text-blue-700:hover{--un-text-opacity:1;color:rgb(29 78 216 / var(--un-text-opacity)) /* #1d4ed8 */;}
.opacity-50{opacity:0.5;}; // 确保占位符被解析
  import 'uno.css';

  :host {
    display: inline-block;
    --ripple-color: rgba(0, 0, 0, 0.1); /* 默认水波纹颜色 */
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  button {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: inherit; /* 确保背景颜色继承 */
    color: inherit; /* 确保文本颜色继承 */
    cursor: pointer;
    border-radius: inherit;
    overflow: hidden; /* 为水波纹效果裁剪 */
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: var(--ripple-color);
    opacity: 0.3;
  }
`;
__decorateClass$4([
  n2({ type: String })
], SeButton.prototype, "size", 2);
__decorateClass$4([
  n2({ type: String })
], SeButton.prototype, "type", 2);
__decorateClass$4([
  n2({ type: Boolean })
], SeButton.prototype, "disabled", 2);
__decorateClass$4([
  n2({ type: Boolean })
], SeButton.prototype, "loading", 2);
__decorateClass$4([
  n2({ type: String })
], SeButton.prototype, "iconClass", 2);
__decorateClass$4([
  n2({ type: String })
], SeButton.prototype, "iconPosition", 2);
__decorateClass$4([
  n2({ type: String })
], SeButton.prototype, "rippleColor", 2);
SeButton = __decorateClass$4([
  t("se-button")
], SeButton);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
let SeInput = class extends i {
  constructor() {
    super(...arguments);
    this.value = "";
    this.placeholder = "Enter text";
    this.disabled = false;
    this.type = "text";
    this.readonly = false;
    this.error = false;
    this.label = "";
    this.helperText = "";
  }
  handleInput(event) {
    const input = event.target;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent("input-change", { detail: { value: this.value } }));
  }
  render() {
    return x`
      <div class="input-container">
        ${this.label ? x`<label class="label" for="input">${this.label}</label>` : ""}
        <div class="input-wrapper">
          <input
            id="input"
            class="${this.error ? "error" : ""}"
            .value="${this.value}"
            .placeholder="${this.placeholder}"
            .type="${this.type}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            @input="${this.handleInput}"
            aria-invalid="${this.error ? "true" : "false"}"
            aria-readonly="${this.readonly ? "true" : "false"}"
          />
        </div>
        ${this.helperText ? x`<span class="helper-text ${this.error ? "error" : ""}">
              ${this.helperText}
            </span>` : ""}
      </div>
    `;
  }
};
SeInput.styles = i$3`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color, #333);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--border-color, #ccc);
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      background-color: var(--background-color, #fff);
      color: var(--text-color, #333);
    }

    input:focus {
      border-color: var(--primary-color, #007bff);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    }

    input:disabled {
      background-color: var(--disabled-bg-color, #f5f5f5);
      border-color: var(--disabled-border-color, #ddd);
      color: var(--disabled-text-color, #aaa);
      cursor: not-allowed;
    }

    input.error {
      border-color: var(--error-color, #dc3545);
      background-color: var(--error-bg-color, #fff5f5);
    }

    .helper-text {
      font-size: 12px;
      color: var(--helper-text-color, #666);
    }

    .helper-text.error {
      color: var(--error-color, #dc3545);
    }
  `;
__decorateClass$3([
  n2({ type: String })
], SeInput.prototype, "value", 2);
__decorateClass$3([
  n2({ type: String })
], SeInput.prototype, "placeholder", 2);
__decorateClass$3([
  n2({ type: Boolean })
], SeInput.prototype, "disabled", 2);
__decorateClass$3([
  n2({ type: String })
], SeInput.prototype, "type", 2);
__decorateClass$3([
  n2({ type: Boolean })
], SeInput.prototype, "readonly", 2);
__decorateClass$3([
  n2({ type: Boolean })
], SeInput.prototype, "error", 2);
__decorateClass$3([
  n2({ type: String })
], SeInput.prototype, "label", 2);
__decorateClass$3([
  n2({ type: String })
], SeInput.prototype, "helperText", 2);
SeInput = __decorateClass$3([
  t("se-input")
], SeInput);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let seTable = class extends i {
  constructor() {
    super();
    this.data = [];
    this.columns = [];
    this.noDataText = "No data available";
    this.borderStyle = "1px solid none";
    this.rowLines = true;
    this.columnLines = true;
    this.theadBgColor = "bg-gray-200";
    this.theadTextColor = "text-gray-800";
    this.pageSize = 10;
    this.currentPage = 1;
    this.sortedColumns = [];
    this.sortedData = [];
    this.sortedColumns = [...this.columns];
    this.sortedData = [...this.data];
    this.sortColumn = (index) => {
      const col = this.sortedColumns[index];
      if (col.sortable) {
        this.sortedData.sort((a2, b2) => {
          if (a2[col.key] < b2[col.key]) return -1;
          if (a2[col.key] > b2[col.key]) return 1;
          return 0;
        });
        this.sortedColumns = [...this.sortedColumns];
        this.sortedData = [...this.sortedData];
      }
    };
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("borderStyle")) {
      this.style.setProperty("--border-style", this.borderStyle);
    }
    if (changedProperties.has("rowLines")) {
      const rowLineStyle = this.rowLines ? "1px solid #ddd" : "none";
      this.style.setProperty("--row-line", rowLineStyle);
    }
    if (changedProperties.has("columnLines")) {
      const columnLineStyle = this.columnLines ? "1px solid #ddd" : "none";
      this.style.setProperty("--column-line", columnLineStyle);
    }
    if (changedProperties.has("theadBgColor")) {
      this.style.setProperty("--thead-bg-color", this.theadBgColor);
    }
    if (changedProperties.has("theadTextColor")) {
      this.style.setProperty("--thead-text-color", this.theadTextColor);
    }
    if (changedProperties.has("columns") || changedProperties.has("data")) {
      this.sortedColumns = [...this.columns];
      this.sortedData = [...this.data];
    }
  }
  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }
  handlePageChange(event) {
    const target = event.target;
    this.currentPage = Number(target.value);
  }
  render() {
    return x`
      <div>
        <table class="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              ${this.sortedColumns.map(
      (col, index) => x`
                  <th
                    class="${this.theadBgColor} ${this.theadTextColor} font-bold p-2 border-b-2 border-gray-300 ${col.sortable ? "cursor-pointer" : ""}"
                    style="width: ${col.width || "auto"}"
                    @click="${() => this.sortColumn(index)}">
                    ${col.label}
                  </th>
                `
    )}
            </tr>
          </thead>
          <tbody>
            ${this.paginatedData.length === 0 ? x`
                  <tr>
                    <td
                      colspan="${this.columns.length}"
                      class="text-center p-2 border border-gray-300">
                      ${this.noDataText}
                    </td>
                  </tr>
                ` : this.paginatedData.map(
      (row) => x`
                    <tr>
                      ${this.sortedColumns.map(
        (col) => x`
                          <td class="p-2 border text-center border-gray-300">${row[col.key]}</td>
                        `
      )}
                    </tr>
                  `
    )}
          </tbody>
        </table>
        <div class="pagination">
          <label for="page">Page:</label>
          <input
            type="number"
            id="page"
            name="page"
            min="1"
            .value="${this.currentPage}"
            @input="${this.handlePageChange}" />
          of ${Math.ceil(this.sortedData.length / this.pageSize)}
        </div>
      </div>
    `;
  }
};
seTable.styles = i$3`
    import 'uno.css';
    /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: default */
.static{position:static;}
.w-full{width:100%;}
.table{display:table;}
.border-collapse{border-collapse:collapse;}
.border-spacing-0{--un-border-spacing-x:0;--un-border-spacing-y:0;border-spacing:var(--un-border-spacing-x) var(--un-border-spacing-y);}
.cursor-pointer{cursor:pointer;}
.border{border-width:1px;}
.border-b-2{border-bottom-width:2px;}
.border-gray-300{--un-border-opacity:1;border-color:rgb(209 213 219 / var(--un-border-opacity));}
.bg-gray-200{--un-bg-opacity:1;background-color:rgb(229 231 235 / var(--un-bg-opacity)) /* #e5e7eb */;}
.p-2{padding:0.5rem;}
.text-center{text-align:center;}
.text-gray-800{--un-text-opacity:1;color:rgb(31 41 55 / var(--un-text-opacity)) /* #1f2937 */;}
.font-bold{font-weight:700;};
  `;
__decorateClass$2([
  n2({ type: Array })
], seTable.prototype, "data", 2);
__decorateClass$2([
  n2({ type: Array })
], seTable.prototype, "columns", 2);
__decorateClass$2([
  n2({ type: String })
], seTable.prototype, "noDataText", 2);
__decorateClass$2([
  n2({ type: String })
], seTable.prototype, "borderStyle", 2);
__decorateClass$2([
  n2({ type: Boolean })
], seTable.prototype, "rowLines", 2);
__decorateClass$2([
  n2({ type: Boolean })
], seTable.prototype, "columnLines", 2);
__decorateClass$2([
  n2({ type: String })
], seTable.prototype, "theadBgColor", 2);
__decorateClass$2([
  n2({ type: String })
], seTable.prototype, "theadTextColor", 2);
__decorateClass$2([
  n2({ type: Number })
], seTable.prototype, "pageSize", 2);
__decorateClass$2([
  r()
], seTable.prototype, "currentPage", 2);
__decorateClass$2([
  r()
], seTable.prototype, "sortedColumns", 2);
__decorateClass$2([
  r()
], seTable.prototype, "sortedData", 2);
seTable = __decorateClass$2([
  t("se-table")
], seTable);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let seImagePreview = class extends i {
  constructor() {
    super(...arguments);
    this.src = "";
    this.rotation = 0;
  }
  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
  handleRotate() {
    this.rotation = (this.rotation + 90) % 360;
  }
  render() {
    return x`
      <div class="preview">
        <img src="${this.src}" style="--rotation: ${this.rotation}deg;" />
        <button class="close-btn" @click="${this.handleClose}">关闭</button>
        <button class="rotate-btn" @click="${this.handleRotate}">旋转</button>
      </div>
    `;
  }
};
seImagePreview.styles = i$3`
    import 'uno.css';
    /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: default */
.absolute{position:absolute;}
.fixed{position:fixed;}
.static{position:static;}
.left-0{left:0;}
.right-12\\.5{right:3.125rem;}
.right-2\\.5{right:0.625rem;}
.top-0{top:0;}
.top-2\\.5{top:0.625rem;}
.z-1000{z-index:1000;}
.h-full{height:100%;}
.max-h-90{max-height:22.5rem;}
.max-w-90{max-width:22.5rem;}
.w-full{width:100%;}
.flex{display:flex;}
.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
.cursor-pointer{cursor:pointer;}
.items-center{align-items:center;}
.justify-center{justify-content:center;}
.border-none{border-style:none;}
.bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0 / var(--un-bg-opacity)) /* #000 */;}
.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity)) /* #fff */;}
.bg-opacity-80{--un-bg-opacity:0.8;}
.p-2\\.5{padding:0.625rem;}
.text-base{font-size:1rem;line-height:1.5rem;};

    .preview {
      @apply fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-1000;
    }

    .preview img {
      @apply max-w-90 max-h-90;
      transform: rotate(var(--rotation, 0deg));
    }

    .close-btn, .rotate-btn {
      @apply absolute top-2.5 right-2.5 bg-white border-none cursor-pointer p-2.5 text-base;
    }

    .rotate-btn {
      @apply right-12.5;
    }
  `;
__decorateClass$1([
  n2({ type: String })
], seImagePreview.prototype, "src", 2);
__decorateClass$1([
  r()
], seImagePreview.prototype, "rotation", 2);
seImagePreview = __decorateClass$1([
  t("se-image-preview")
], seImagePreview);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let seImage = class extends i {
  constructor() {
    super(...arguments);
    this.src = "";
    this.alt = "";
    this.lazy = false;
    this.placeholder = "";
    this.errorPlaceholder = "";
    this.width = 100;
    this.height = 100;
    this.isError = false;
    this.isPreviewVisible = false;
    this.rotation = 0;
    this.observer = null;
  }
  firstUpdated() {
    var _a2;
    if (this.lazy) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          var _a3;
          if (entry.isIntersecting) {
            this.loadImage();
            (_a3 = this.observer) == null ? void 0 : _a3.disconnect();
          }
        });
      });
      this.observer.observe((_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("img"));
    }
  }
  loadImage() {
    var _a2;
    const img = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("img");
    if (img && this.src) {
      img.src = this.src;
    }
  }
  handleError() {
    this.isError = true;
  }
  handleImageClick() {
    this.isPreviewVisible = true;
  }
  handleClosePreview() {
    this.isPreviewVisible = false;
  }
  handleRotate() {
    this.rotation = (this.rotation + 90) % 360;
  }
  render() {
    return x`
      <div class="image-container" style="width: ${this.width + "px"}; height: ${this.height + "px"};">
        <img
          class="w-full h-auto block cursor-pointer"
          src="${this.isError ? this.errorPlaceholder : this.lazy ? this.placeholder : this.src}"
          alt="${this.alt}"
          @error="${this.handleError}"
          @click="${this.handleImageClick}"
        />
        <button class="preview-icon" @click="${this.handleImageClick}">预览</button>
        ${this.isPreviewVisible ? x`
          <se-image-preview
            .src="${this.src}"
            @close="${this.handleClosePreview}"
          ></se-image-preview>
        ` : ""}
      </div>
    `;
  }
};
seImage.styles = i$3`
    import 'uno.css';
    /* layer: preflights */
*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}
/* layer: default */
.absolute{position:absolute;}
.fixed{position:fixed;}
.relative{position:relative;}
.static{position:static;}
.left-0{left:0;}
.right-12\\.5{right:3.125rem;}
.right-2\\.5{right:0.625rem;}
.top-0{top:0;}
.top-2\\.5{top:0.625rem;}
.z-1000{z-index:1000;}
.block{display:block;}
.h-auto{height:auto;}
.h-full{height:100%;}
.max-h-90{max-height:22.5rem;}
.max-w-90{max-width:22.5rem;}
.w-full{width:100%;}
.flex{display:flex;}
.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}
.cursor-pointer{cursor:pointer;}
.items-center{align-items:center;}
.justify-center{justify-content:center;}
.border-none{border-style:none;}
.bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0 / var(--un-bg-opacity)) /* #000 */;}
.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity)) /* #fff */;}
.bg-opacity-80{--un-bg-opacity:0.8;}
.p-2\\.5{padding:0.625rem;}
.px{padding-left:1rem;padding-right:1rem;}
.text-base{font-size:1rem;line-height:1.5rem;};

    .image-container {
      @apply flex items-center justify-center w-full h-full relative;
    }

    img {
      @apply w-full h-auto block cursor-pointer;
    }

    .preview {
      @apply fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-1000;
    }

    .preview img {
      @apply max-w-90 max-h-90;
      transform: rotate(var(--rotation, 0deg));
    }

    .close-btn, .rotate-btn {
      @apply absolute top-2.5 right-2.5 bg-white border-none cursor-pointer p-2.5 text-base;
    }

    .rotate-btn {
      @apply right-12.5;
    }

    .preview-icon {
      @apply absolute top-2.5 right-2.5 bg-white border-none cursor-pointer p-2.5 text-base;
      display: none;
    }

    .image-container:hover .preview-icon {
      display: block;
    }
  `;
__decorateClass([
  n2({ type: String })
], seImage.prototype, "src", 2);
__decorateClass([
  n2({ type: String })
], seImage.prototype, "alt", 2);
__decorateClass([
  n2({ type: Boolean })
], seImage.prototype, "lazy", 2);
__decorateClass([
  n2({ type: String })
], seImage.prototype, "placeholder", 2);
__decorateClass([
  n2({ type: String })
], seImage.prototype, "errorPlaceholder", 2);
__decorateClass([
  n2({ type: Number })
], seImage.prototype, "width", 2);
__decorateClass([
  n2({ type: Number })
], seImage.prototype, "height", 2);
__decorateClass([
  r()
], seImage.prototype, "isError", 2);
__decorateClass([
  r()
], seImage.prototype, "isPreviewVisible", 2);
__decorateClass([
  r()
], seImage.prototype, "rotation", 2);
seImage = __decorateClass([
  t("se-image")
], seImage);
console.log(11);
export {
  SeButton,
  SeInput,
  seImage,
  seTable
};
//# sourceMappingURL=index.js.map
