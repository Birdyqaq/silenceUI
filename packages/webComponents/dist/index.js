var _a;
const theme = "";
const MODE_STORAGE_KEY = "su-theme-mode";
const COLORS_STORAGE_KEY = "su-theme-colors";
const DARK_CLASS = "su-theme-dark";
const THEME_ATTR = "data-su-theme";
const COLOR_VAR_MAP = {
  primary: "--su-color-primary",
  primaryHover: "--su-color-primary-hover",
  success: "--su-color-success",
  warning: "--su-color-warning",
  error: "--su-color-error",
  info: "--su-color-info"
};
function hexToRgb(hex) {
  let value = hex.trim().replace(/^#/, "");
  if (value.length === 3) {
    value = value.split("").map((char) => char + char).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value))
    return null;
  const num = parseInt(value, 16);
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}
function darken(hex, ratio) {
  const rgb = hexToRgb(hex);
  if (!rgb)
    return hex;
  const [r2, g2, b2] = rgb.map((channel) => Math.max(0, Math.round(channel * (1 - ratio))));
  return `#${[r2, g2, b2].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}
function contrastColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb)
    return "#ffffff";
  const [r2, g2, b2] = rgb;
  const yiq = (r2 * 299 + g2 * 587 + b2 * 114) / 1e3;
  return yiq >= 150 ? "#111827" : "#ffffff";
}
function emitChange() {
  window.dispatchEvent(
    new CustomEvent("su-theme-change", {
      detail: { mode: getThemeMode(), colors: getStoredColors() }
    })
  );
}
function getStoredColors() {
  try {
    return JSON.parse(localStorage.getItem(COLORS_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function getThemeMode() {
  return document.documentElement.getAttribute(THEME_ATTR) === "dark" ? "dark" : "light";
}
function setThemeMode(mode) {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, mode);
  root.classList.toggle(DARK_CLASS, mode === "dark");
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
  }
  emitChange();
}
function toggleThemeMode() {
  const next = getThemeMode() === "dark" ? "light" : "dark";
  setThemeMode(next);
  return next;
}
function applyColors(colors) {
  const root = document.documentElement;
  Object.keys(COLOR_VAR_MAP).forEach((key) => {
    const value = colors[key];
    if (!value)
      return;
    root.style.setProperty(COLOR_VAR_MAP[key], value);
    if (key === "primaryHover")
      return;
    const rgb = hexToRgb(value);
    if (rgb) {
      root.style.setProperty(`${COLOR_VAR_MAP[key]}-rgb`, rgb.join(", "));
    }
    root.style.setProperty(`${COLOR_VAR_MAP[key]}-contrast`, contrastColor(value));
  });
  if (colors.primary && !colors.primaryHover) {
    root.style.setProperty("--su-color-primary-hover", darken(colors.primary, 0.15));
  }
}
function setThemeColors(colors) {
  const merged = { ...getStoredColors(), ...colors };
  applyColors(merged);
  try {
    localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(merged));
  } catch {
  }
  emitChange();
}
function resetThemeColors() {
  const root = document.documentElement;
  Object.values(COLOR_VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
    root.style.removeProperty(`${cssVar}-rgb`);
    root.style.removeProperty(`${cssVar}-contrast`);
  });
  try {
    localStorage.removeItem(COLORS_STORAGE_KEY);
  } catch {
  }
  emitChange();
}
function initTheme() {
  if (typeof window === "undefined")
    return;
  let mode = null;
  try {
    mode = localStorage.getItem(MODE_STORAGE_KEY);
  } catch {
  }
  if (mode === "dark" || mode === "light") {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTR, mode);
    root.classList.toggle(DARK_CLASS, mode === "dark");
  }
  const colors = getStoredColors();
  if (Object.keys(colors).length > 0)
    applyColors(colors);
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$4 = globalThis, e$3 = t$4.ShadowRoot && (void 0 === t$4.ShadyCSS || t$4.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$3 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$3)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$3 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$5 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$3), i$4 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$)
      return t3.cssText;
    if ("number" == typeof t3)
      return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$3);
}, S$1 = (s2, o2) => {
  if (e$3)
    s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else
    for (const e2 of o2) {
      const o3 = document.createElement("style"), n3 = t$4.litNonce;
      void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
    }
}, c$3 = e$3 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules)
    e2 += s2.cssText;
  return r$5(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$3, defineProperty: e$2, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$4, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$2 = a$1.trustedTypes, l$1 = c$2 ? c$2.emptyScript : "", p$2 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$3 = { toAttribute(t2, s2) {
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
  let i3 = t2;
  switch (s2) {
    case Boolean:
      i3 = null !== t2;
      break;
    case Number:
      i3 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i3 = JSON.parse(t2);
      } catch (t3) {
        i3 = null;
      }
  }
  return i3;
} }, f$1 = (t2, s2) => !i$3(t2, s2), b = { attribute: true, type: String, converter: u$3, reflect: false, useDefault: false, hasChanged: f$1 };
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
      const i3 = Symbol(), h2 = this.getPropertyDescriptor(t2, i3, s2);
      void 0 !== h2 && e$2(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i3) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i3);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties")))
      return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$4(t3), ...o$3(t3)];
      for (const i3 of s2)
        this.createProperty(i3, t3[i3]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2)
        for (const [t3, i3] of s2)
          this.elementProperties.set(t3, i3);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i3 = this._$Eu(t3, s2);
      void 0 !== i3 && this._$Eh.set(i3, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i3 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2)
        i3.unshift(c$3(s3));
    } else
      void 0 !== s2 && i3.push(c$3(s2));
    return i3;
  }
  static _$Eu(t2, s2) {
    const i3 = s2.attribute;
    return false === i3 ? void 0 : "string" == typeof i3 ? i3 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
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
    for (const i3 of s2.keys())
      this.hasOwnProperty(i3) && (t2.set(i3, this[i3]), delete this[i3]);
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
  attributeChangedCallback(t2, s2, i3) {
    this._$AK(t2, i3);
  }
  _$ET(t2, s2) {
    var _a2;
    const i3 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i3);
    if (void 0 !== e2 && true === i3.reflect) {
      const h2 = (void 0 !== ((_a2 = i3.converter) == null ? void 0 : _a2.toAttribute) ? i3.converter : u$3).toAttribute(s2, i3.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i3 = this.constructor, e2 = i3._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i3.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$3;
      this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i3) {
    var _a2;
    if (void 0 !== t2) {
      const e2 = this.constructor, h2 = this[t2];
      if (i3 ?? (i3 = e2.getPropertyOptions(t2)), !((i3.hasChanged ?? f$1)(h2, s2) || i3.useDefault && i3.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i3))))
        return;
      this.C(t2, s2, i3);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i3, reflect: e2, wrapped: h2 }, r2) {
    i3 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i3 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
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
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep)
          this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0)
        for (const [s3, i3] of t3) {
          const { wrapped: t4 } = i3, e2 = this[s3];
          true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i3, e2);
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
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$2 == null ? void 0 : p$2({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3 = globalThis, i$2 = t$3.trustedTypes, s$2 = i$2 ? i$2.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$1 = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$2 = "?" + h, n$1 = `<${o$2}>`, r$3 = document, l = () => r$3.createComment(""), c$1 = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u$2 = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v$1 = /-->/g, _ = />/g, m$1 = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p$1 = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i3, ...s2) => ({ _$litType$: t2, strings: i3, values: s2 }), x = y2(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$3.createTreeWalker(r$3, 129);
function P(t2, i3) {
  if (!a(t2) || !t2.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s$2 ? s$2.createHTML(i3) : i3;
}
const V = (t2, i3) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i3 ? "<svg>" : 3 === i3 ? "<math>" : "", c2 = f;
  for (let i4 = 0; i4 < s2; i4++) {
    const s3 = t2[i4];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s3.length && (c2.lastIndex = y3, u2 = c2.exec(s3), null !== u2); )
      y3 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v$1 : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m$1) : void 0 !== u2[3] && (c2 = m$1) : c2 === m$1 ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m$1 : '"' === u2[3] ? g : p$1) : c2 === g || c2 === p$1 ? c2 = m$1 : c2 === v$1 || c2 === _ ? c2 = f : (c2 = m$1, r2 = void 0);
    const x2 = c2 === m$1 && t2[i4 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e$1 + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i4 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i3 ? "</svg>" : 3 === i3 ? "</math>" : "")), o2];
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
    for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes())
          for (const t3 of r2.getAttributeNames())
            if (t3.endsWith(e$1)) {
              const i3 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i3);
              d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
            } else
              t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i$2 ? i$2.emptyScript : "";
            for (let i3 = 0; i3 < s3; i3++)
              r2.append(t3[i3], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType)
        if (r2.data === o$2)
          d2.push({ type: 2, index: c2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); )
            d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
        }
      c2++;
    }
  }
  static createElement(t2, i3) {
    const s2 = r$3.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i3, s2 = t2, e2) {
  var _a2, _b;
  if (i3 === T)
    return i3;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c$1(i3) ? void 0 : i3._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i3 = S(t2, h2._$AS(t2, i3.values), h2, e2)), i3;
}
let M$1 = class M {
  constructor(t2, i3) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i3;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i3 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$3).importNode(i3, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i4;
        2 === l2.type ? i4 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i4 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i4 = new z(h2, this, t2)), this._$AV.push(i4), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$3, e2;
  }
  p(t2) {
    let i3 = 0;
    for (const s2 of this._$AV)
      void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i3), i3 += s2.strings.length - 2) : s2._$AI(t2[i3])), i3++;
  }
};
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i3, s2, e2) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i3, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i3 = this._$AM;
    return void 0 !== i3 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i3.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i3 = this) {
    t2 = S(this, t2, i3), c$1(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u$2(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c$1(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$3.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i3, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2)
      this._$AH.p(i3);
    else {
      const t3 = new M$1(e2, this), s3 = t3.u(this.options);
      t3.p(i3), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i3 = A.get(t2.strings);
    return void 0 === i3 && A.set(t2.strings, i3 = new N(t2)), i3;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i3 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2)
      e2 === i3.length ? i3.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i3[e2], s2._$AI(h2), e2++;
    e2 < i3.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i3.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i3) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i3); t2 && t2 !== this._$AB; ) {
      const i4 = t2.nextSibling;
      t2.remove(), t2 = i4;
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
  constructor(t2, i3, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i3, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i3 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2)
      t2 = S(this, t2, i3, 0), o2 = !c$1(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++)
        r2 = S(this, e3[s2 + n3], i3, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c$1(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
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
  constructor(t2, i3, s2, e2, h2) {
    super(t2, i3, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i3 = this) {
    if ((t2 = S(this, t2, i3, 0) ?? E) === T)
      return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i3, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i3, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const Z = { M: e$1, P: h, A: o$2, C: 1, L: V, R: M$1, D: u$2, V: S, I: R, H: k, N: I, U: L, B: H, F: z }, j = t$3.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$3.litHtmlVersions ?? (t$3.litHtmlVersions = [])).push("3.3.0");
const B = (t2, i3, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i3;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new R(i3.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s$1 = globalThis;
let i$1 = class i extends y$1 {
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
};
i$1._$litElement$ = true, i$1["finalized"] = true, (_a = s$1.litElementHydrateSupport) == null ? void 0 : _a.call(s$1, { LitElement: i$1 });
const o$1 = s$1.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i$1 });
(s$1.litElementVersions ?? (s$1.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$3, reflect: false, hasChanged: f$1 }, r$2 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i3 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i3);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i3, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$2(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r$1(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const rippleEffect = (event, options = {}, targetElement) => {
  const button = targetElement || event.currentTarget;
  const computedStyle = getComputedStyle(button);
  if (computedStyle.position === "static") {
    button.style.position = "relative";
  }
  if (computedStyle.overflow !== "hidden") {
    button.style.overflow = "hidden";
  }
  const ripple = document.createElement("div");
  const rect = button.getBoundingClientRect();
  const centerX = event.clientX - rect.left;
  const centerY = event.clientY - rect.top;
  const distances = [
    Math.sqrt(centerX ** 2 + centerY ** 2),
    // 到左上角
    Math.sqrt((rect.width - centerX) ** 2 + centerY ** 2),
    // 到右上角
    Math.sqrt(centerX ** 2 + (rect.height - centerY) ** 2),
    // 到左下角
    Math.sqrt((rect.width - centerX) ** 2 + (rect.height - centerY) ** 2)
    // 到右下角
  ];
  const maxDistance = Math.max(...distances);
  const diameter = maxDistance * 2;
  const x2 = centerX - diameter / 2;
  const y3 = centerY - diameter / 2;
  ripple.className = "ripple-effect";
  ripple.style.cssText = `
        position: absolute;
        left: ${x2}px;
        top: ${y3}px;
        width: ${diameter}px;
        height: ${diameter}px;
        border-radius: 50%;
        background-color: ${options.color || "rgba(255, 255, 255, 0.5)"};
        pointer-events: none;
        z-index: 999;
        transform: scale(0);
        opacity: 1;
        animation: rippleExpand ${options.duration || 600}ms ease-out forwards;
    `;
  if (!document.getElementById("ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
            @keyframes rippleExpand {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
  const existingRipples = button.querySelectorAll(".ripple-effect");
  existingRipples.forEach((el) => el.remove());
  button.appendChild(ripple);
  const duration = options.duration || 600;
  setTimeout(() => {
    if (ripple && ripple.parentNode) {
      ripple.remove();
    }
  }, duration);
};
const styleMap = i$4`
  :host {
    display: inline-block;
    --su-button-min-width: 72px;
    --su-button-min-height: 36px;
    min-width: var(--su-button-min-width);
    min-height: var(--su-button-min-height);
    border-radius: var(--su-radius-sm);
    box-sizing: border-box;
  }

  button {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 6px;
    border-radius: inherit;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: var(--su-font-size-md);
    font-weight: 500;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentcolor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: su-spin 0.8s linear infinite;
  }

  @keyframes su-spin {
    to {
      transform: rotate(360deg);
    }
  }

  :host([type='primary']) button {
    background: var(--su-color-primary);
    color: var(--su-color-primary-contrast, #fff);
  }

  :host([type='primary']) button:hover {
    background: var(--su-color-primary-hover);
  }

  :host([type='secondary']) button {
    background: #334155;
    color: #fff;
  }

  :host([type='secondary']) button:hover {
    background: #1e293b;
  }

  :host([type='success']) button {
    background: var(--su-color-success);
    color: var(--su-color-success-contrast, #fff);
  }

  :host([type='warning']) button {
    background: var(--su-color-warning);
    color: var(--su-color-warning-contrast, #fff);
  }

  :host([type='danger']) button {
    background: var(--su-color-error);
    color: var(--su-color-error-contrast, #fff);
  }

  :host([size='small']) {
    --su-button-min-width: 56px;
    --su-button-min-height: 30px;
  }

  :host([size='large']) {
    --su-button-min-width: 92px;
    --su-button-min-height: 42px;
  }

  :host([block]) {
    display: block;
    width: 100%;
  }

  :host([round]) {
    border-radius: 999px;
  }

  :host([disabled]) {
    opacity: 0.7;
    pointer-events: none;
  }

  :host([loading]) button {
    cursor: wait;
  }
`;
var __defProp$B = Object.defineProperty;
var __getOwnPropDesc$B = Object.getOwnPropertyDescriptor;
var __decorateClass$B = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$B(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$B(target, key, result);
  return result;
};
let SuButton = class extends i$1 {
  constructor() {
    super(...arguments);
    this.size = "medium";
    this.type = "primary";
    this.disabled = false;
    this.loading = false;
    this.iconClass = "";
    this.iconPosition = "left";
    this.rippleColor = "";
    this.ripple = true;
    this.block = false;
    this.round = false;
  }
  // 胶囊形
  handleClick(e2) {
    if (this.disabled || this.loading) {
      e2.stopImmediatePropagation();
      e2.preventDefault();
      return;
    }
    if (this.ripple) {
      let color = this.rippleColor;
      if (!color) {
        switch (this.type) {
          case "primary":
          case "secondary":
          case "success":
          case "warning":
          case "danger":
            color = "rgba(255, 255, 255, 0.3)";
            break;
          default:
            color = "rgba(0, 0, 0, 0.1)";
        }
      }
      try {
        const target = e2.currentTarget;
        rippleEffect(e2, { color }, target ?? this);
      } catch (error) {
        console.error("Error creating ripple effect:", error);
      }
    }
  }
  render() {
    return x`
      <button
        class=${this.getButtonClasses()}
        @click=${this.handleClick}
        ?disabled=${this.disabled}
        type="button"
      >
        ${this.renderIcon("left")}
        ${this.loading ? this.renderSpinner() : x`<slot></slot>`}
        ${this.renderIcon("right")}
      </button>
    `;
  }
  getButtonClasses() {
    return [
      this.disabled ? "disabled" : "",
      this.loading ? "loading" : ""
    ].filter(Boolean).join(" ");
  }
  renderSpinner() {
    return x`<span class="spinner"></span>`;
  }
  renderIcon(position) {
    if (!this.iconClass || this.iconPosition !== position)
      return;
    return x`<i class="icon ${position} ${this.iconClass}"></i>`;
  }
};
SuButton.styles = styleMap;
__decorateClass$B([
  n2({ type: String, reflect: true })
], SuButton.prototype, "size", 2);
__decorateClass$B([
  n2({ type: String, reflect: true })
], SuButton.prototype, "type", 2);
__decorateClass$B([
  n2({ type: Boolean, reflect: true })
], SuButton.prototype, "disabled", 2);
__decorateClass$B([
  n2({ type: Boolean, reflect: true })
], SuButton.prototype, "loading", 2);
__decorateClass$B([
  n2({ type: String })
], SuButton.prototype, "iconClass", 2);
__decorateClass$B([
  n2({ type: String })
], SuButton.prototype, "iconPosition", 2);
__decorateClass$B([
  n2({ type: String })
], SuButton.prototype, "rippleColor", 2);
__decorateClass$B([
  n2({ type: Boolean })
], SuButton.prototype, "ripple", 2);
__decorateClass$B([
  n2({ type: Boolean, reflect: true })
], SuButton.prototype, "block", 2);
__decorateClass$B([
  n2({ type: Boolean, reflect: true })
], SuButton.prototype, "round", 2);
SuButton = __decorateClass$B([
  t$2("su-button")
], SuButton);
var __defProp$A = Object.defineProperty;
var __getOwnPropDesc$A = Object.getOwnPropertyDescriptor;
var __decorateClass$A = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$A(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$A(target, key, result);
  return result;
};
let SeInput = class extends i$1 {
  constructor() {
    super(...arguments);
    this.value = "";
    this.placeholder = "请输入";
    this.disabled = false;
    this.type = "text";
    this.readonly = false;
    this.error = false;
    this.label = "";
    this.helperText = "";
    this.clearable = false;
  }
  handleInput(event) {
    const input = event.target;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent("input-change", { detail: { value: this.value } }));
  }
  handleClear() {
    var _a2;
    if (this.disabled || this.readonly)
      return;
    this.value = "";
    this.dispatchEvent(new CustomEvent("input-change", { detail: { value: this.value } }));
    const input = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("input");
    input == null ? void 0 : input.focus();
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
          ${this.clearable && this.value ? x`<button class="clear-btn" type="button" @click="${this.handleClear}">✕</button>` : ""}
        </div>
        ${this.helperText ? x`<span class="helper-text ${this.error ? "error" : ""}">${this.helperText}</span>` : ""}
      </div>
    `;
  }
};
SeInput.styles = i$4`
    :host {
      display: block;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .label {
      font-size: var(--su-font-size-sm);
      font-weight: 500;
      color: var(--su-text-2);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      padding: 9px 12px;
      font-size: var(--su-font-size-md);
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--su-bg-card);
      color: var(--su-text-1);
    }

    input:hover {
      border-color: var(--su-border-color-hover);
    }

    input:focus {
      border-color: var(--su-color-primary);
      box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
    }

    input:disabled {
      background-color: var(--su-bg-muted);
      border-color: var(--su-border-color);
      color: var(--su-text-3);
      cursor: not-allowed;
    }

    input.error {
      border-color: var(--su-color-error);
      background-color: #fef2f2;
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--su-text-3);
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .clear-btn:hover {
      color: var(--su-text-1);
    }

    .helper-text {
      font-size: var(--su-font-size-xs);
      color: var(--su-text-3);
    }

    .helper-text.error {
      color: var(--su-color-error);
    }
  `;
__decorateClass$A([
  n2({ type: String })
], SeInput.prototype, "value", 2);
__decorateClass$A([
  n2({ type: String })
], SeInput.prototype, "placeholder", 2);
__decorateClass$A([
  n2({ type: Boolean })
], SeInput.prototype, "disabled", 2);
__decorateClass$A([
  n2({ type: String })
], SeInput.prototype, "type", 2);
__decorateClass$A([
  n2({ type: Boolean })
], SeInput.prototype, "readonly", 2);
__decorateClass$A([
  n2({ type: Boolean })
], SeInput.prototype, "error", 2);
__decorateClass$A([
  n2({ type: String })
], SeInput.prototype, "label", 2);
__decorateClass$A([
  n2({ type: String })
], SeInput.prototype, "helperText", 2);
__decorateClass$A([
  n2({ type: Boolean })
], SeInput.prototype, "clearable", 2);
SeInput = __decorateClass$A([
  t$2("su-input")
], SeInput);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, e = (t2) => (...e2) => ({ _$litDirective$: t2, values: e2 });
class i2 {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e2, i3) {
    this._$Ct = t2, this._$AM = e2, this._$Ci = i3;
  }
  _$AS(t2, e2) {
    return this.update(t2, e2);
  }
  update(t2, e2) {
    return this.render(...e2);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: t } = Z, s = () => document.createComment(""), r = (o2, i3, n3) => {
  var _a2;
  const e2 = o2._$AA.parentNode, l2 = void 0 === i3 ? o2._$AB : i3._$AA;
  if (void 0 === n3) {
    const i4 = e2.insertBefore(s(), l2), c2 = e2.insertBefore(s(), l2);
    n3 = new t(i4, c2, o2, o2.options);
  } else {
    const t2 = n3._$AB.nextSibling, i4 = n3._$AM, c2 = i4 !== o2;
    if (c2) {
      let t3;
      (_a2 = n3._$AQ) == null ? void 0 : _a2.call(n3, o2), n3._$AM = o2, void 0 !== n3._$AP && (t3 = o2._$AU) !== i4._$AU && n3._$AP(t3);
    }
    if (t2 !== l2 || c2) {
      let o3 = n3._$AA;
      for (; o3 !== t2; ) {
        const t3 = o3.nextSibling;
        e2.insertBefore(o3, l2), o3 = t3;
      }
    }
  }
  return n3;
}, v = (o2, t2, i3 = o2) => (o2._$AI(t2, i3), o2), u$1 = {}, m = (o2, t2 = u$1) => o2._$AH = t2, p = (o2) => o2._$AH, M2 = (o2) => {
  var _a2;
  (_a2 = o2._$AP) == null ? void 0 : _a2.call(o2, false, true);
  let t2 = o2._$AA;
  const i3 = o2._$AB.nextSibling;
  for (; t2 !== i3; ) {
    const o3 = t2.nextSibling;
    t2.remove(), t2 = o3;
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (e2, s2, t2) => {
  const r2 = /* @__PURE__ */ new Map();
  for (let l2 = s2; l2 <= t2; l2++)
    r2.set(e2[l2], l2);
  return r2;
}, c = e(class extends i2 {
  constructor(e2) {
    if (super(e2), e2.type !== t$1.CHILD)
      throw Error("repeat() can only be used in text expressions");
  }
  dt(e2, s2, t2) {
    let r2;
    void 0 === t2 ? t2 = s2 : void 0 !== s2 && (r2 = s2);
    const l2 = [], o2 = [];
    let i3 = 0;
    for (const s3 of e2)
      l2[i3] = r2 ? r2(s3, i3) : i3, o2[i3] = t2(s3, i3), i3++;
    return { values: o2, keys: l2 };
  }
  render(e2, s2, t2) {
    return this.dt(e2, s2, t2).values;
  }
  update(s2, [t2, r$12, c2]) {
    const d2 = p(s2), { values: p$12, keys: a2 } = this.dt(t2, r$12, c2);
    if (!Array.isArray(d2))
      return this.ut = a2, p$12;
    const h2 = this.ut ?? (this.ut = []), v$12 = [];
    let m$12, y3, x2 = 0, j2 = d2.length - 1, k2 = 0, w = p$12.length - 1;
    for (; x2 <= j2 && k2 <= w; )
      if (null === d2[x2])
        x2++;
      else if (null === d2[j2])
        j2--;
      else if (h2[x2] === a2[k2])
        v$12[k2] = v(d2[x2], p$12[k2]), x2++, k2++;
      else if (h2[j2] === a2[w])
        v$12[w] = v(d2[j2], p$12[w]), j2--, w--;
      else if (h2[x2] === a2[w])
        v$12[w] = v(d2[x2], p$12[w]), r(s2, v$12[w + 1], d2[x2]), x2++, w--;
      else if (h2[j2] === a2[k2])
        v$12[k2] = v(d2[j2], p$12[k2]), r(s2, d2[x2], d2[j2]), j2--, k2++;
      else if (void 0 === m$12 && (m$12 = u(a2, k2, w), y3 = u(h2, x2, j2)), m$12.has(h2[x2]))
        if (m$12.has(h2[j2])) {
          const e2 = y3.get(a2[k2]), t3 = void 0 !== e2 ? d2[e2] : null;
          if (null === t3) {
            const e3 = r(s2, d2[x2]);
            v(e3, p$12[k2]), v$12[k2] = e3;
          } else
            v$12[k2] = v(t3, p$12[k2]), r(s2, d2[x2], t3), d2[e2] = null;
          k2++;
        } else
          M2(d2[j2]), j2--;
      else
        M2(d2[x2]), x2++;
    for (; k2 <= w; ) {
      const e2 = r(s2, v$12[w + 1]);
      v(e2, p$12[k2]), v$12[k2++] = e2;
    }
    for (; x2 <= j2; ) {
      const e2 = d2[x2++];
      null !== e2 && M2(e2);
    }
    return this.ut = a2, m(s2, v$12), T;
  }
});
const tableStyles = i$4`
  :host {
    display: block;
    color: var(--su-text-1);
    font-size: var(--su-font-size-md);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 8px;
    border: var(--border-style, 1px solid var(--su-border-color));
  }

  th.sortable:hover {
    cursor: pointer;
  }

  thead th {
    background-color: var(--thead-bg-color, var(--su-bg-hover));
    color: var(--thead-text-color, var(--su-text-1));
    font-weight: bold;
  }

  tbody tr {
    border-bottom: var(--row-line);
  }

  td {
    border-right: var(--column-line);
  }

  td:last-child {
    border-right: none;
  }
`;
var __defProp$z = Object.defineProperty;
var __getOwnPropDesc$z = Object.getOwnPropertyDescriptor;
var __decorateClass$z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$z(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$z(target, key, result);
  return result;
};
let SePagination = class extends i$1 {
  constructor() {
    super(...arguments);
    this.currentPage = 1;
    this.total = 0;
    this.pageSize = 10;
  }
  get totalPages() {
    if (this.total <= 0)
      return 1;
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }
  clampPage(page) {
    return Math.min(this.totalPages, Math.max(1, Number.isFinite(page) ? page : 1));
  }
  emitChange(page) {
    const next = this.clampPage(page);
    if (next === this.currentPage)
      return;
    this.currentPage = next;
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { currentPage: next },
        bubbles: true,
        composed: true
      })
    );
  }
  handlePageInput(event) {
    const target = event.target;
    this.emitChange(Number(target.value));
  }
  handlePrevPage() {
    this.emitChange(this.currentPage - 1);
  }
  handleNextPage() {
    this.emitChange(this.currentPage + 1);
  }
  render() {
    return x`
      <div class="pagination">
        <button type="button" @click="${this.handlePrevPage}" ?disabled="${this.currentPage <= 1}">
          上一页
        </button>
        <label for="page">第</label>
        <input
          type="number"
          id="page"
          name="page"
          min="1"
          max="${this.totalPages}"
          .value="${String(this.currentPage)}"
          @input="${this.handlePageInput}" />
        <span>页 / 共 ${this.totalPages} 页</span>
        <button
          type="button"
          @click="${this.handleNextPage}"
          ?disabled="${this.currentPage >= this.totalPages}">
          下一页
        </button>
      </div>
    `;
  }
};
SePagination.styles = i$4`
    :host {
      display: block;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    .pagination {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--su-font-size-sm);
      flex-wrap: wrap;
      color: var(--su-text-2);
    }

    input[type='number'] {
      width: 64px;
      padding: 6px 8px;
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      font-size: var(--su-font-size-sm);
      color: var(--su-text-1);
    }

    button {
      border: 1px solid var(--su-border-color);
      border-radius: var(--su-radius-sm);
      padding: 4px 10px;
      background: var(--su-bg-card);
      cursor: pointer;
      color: var(--su-text-1);
    }

    button:hover {
      border-color: var(--su-color-primary);
      color: var(--su-color-primary);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `;
__decorateClass$z([
  n2({ type: Number })
], SePagination.prototype, "currentPage", 2);
__decorateClass$z([
  n2({ type: Number })
], SePagination.prototype, "total", 2);
__decorateClass$z([
  n2({ type: Number })
], SePagination.prototype, "pageSize", 2);
SePagination = __decorateClass$z([
  t$2("se-pagination")
], SePagination);
var __defProp$y = Object.defineProperty;
var __getOwnPropDesc$y = Object.getOwnPropertyDescriptor;
var __decorateClass$y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$y(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$y(target, key, result);
  return result;
};
let seTable = class extends i$1 {
  constructor() {
    super();
    this.data = [];
    this.columns = [];
    this.noDataText = "暂无数据";
    this.borderStyle = "1px solid var(--su-border-color)";
    this.rowLines = true;
    this.columnLines = true;
    this.theadBgColor = "";
    this.theadTextColor = "";
    this.pageSize = 10;
    this.pagination = true;
    this.striped = false;
    this.hoverable = false;
    this.stickyHeader = false;
    this.height = "";
    this.rowKey = "id";
    this.selectable = false;
    this.selectedKeys = [];
    this.loading = false;
    this.infiniteScroll = false;
    this.hasMore = false;
    this.loadingMore = false;
    this.loadMoreOffset = 80;
    this.loadMoreText = "下拉到底部加载更多";
    this.loadingText = "加载中...";
    this.noMoreText = "没有更多数据了";
    this.virtualScroll = false;
    this.virtualThreshold = 1e3;
    this.virtualRowHeight = 44;
    this.virtualBuffer = 8;
    this.currentPage = 1;
    this.sortedColumns = [];
    this.sortedData = [];
    this.scrollTop = 0;
    this.viewportHeight = 0;
    this.loadMorePending = false;
    this.sortedColumns = [...this.columns];
    this.sortedData = [...this.data];
    this.sortColumn = (index) => {
      const col = this.sortedColumns[index];
      if (!col.sortable)
        return;
      const nextDirection = col.sortDirection === "asc" ? "desc" : col.sortDirection === "desc" ? "" : "asc";
      this.sortedColumns = this.sortedColumns.map((c2, i3) => ({
        ...c2,
        sortDirection: i3 === index ? nextDirection : ""
      }));
      if (nextDirection === "") {
        this.sortedData = [...this.data];
      } else {
        this.sortedData = [...this.data].sort((a2, b2) => {
          const result = this.compareValues(a2[col.key], b2[col.key]);
          return nextDirection === "asc" ? result : result * -1;
        });
      }
      this.currentPage = 1;
      this.scrollTop = 0;
      this.resetViewportScroll();
      this.dispatchEvent(
        new CustomEvent("sort-change", {
          detail: { column: col.key, direction: nextDirection }
        })
      );
    };
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("borderStyle")) {
      this.style.setProperty("--border-style", this.borderStyle);
    }
    if (changedProperties.has("rowLines")) {
      const rowLineStyle = this.rowLines ? "1px solid var(--su-border-color)" : "none";
      this.style.setProperty("--row-line", rowLineStyle);
    }
    if (changedProperties.has("columnLines")) {
      const columnLineStyle = this.columnLines ? "1px solid var(--su-border-color)" : "none";
      this.style.setProperty("--column-line", columnLineStyle);
    }
    if (changedProperties.has("theadBgColor")) {
      if (this.theadBgColor) {
        this.style.setProperty("--thead-bg-color", this.theadBgColor);
      } else {
        this.style.removeProperty("--thead-bg-color");
      }
    }
    if (changedProperties.has("theadTextColor")) {
      if (this.theadTextColor) {
        this.style.setProperty("--thead-text-color", this.theadTextColor);
      } else {
        this.style.removeProperty("--thead-text-color");
      }
    }
    if (changedProperties.has("columns") || changedProperties.has("data")) {
      this.sortedColumns = this.columns.map((c2) => ({ ...c2, sortDirection: "" }));
      this.sortedData = [...this.data];
      this.currentPage = 1;
    }
    if (changedProperties.has("pageSize") || changedProperties.has("pagination") || changedProperties.has("infiniteScroll")) {
      this.currentPage = 1;
      this.scrollTop = 0;
      this.resetViewportScroll();
    }
    if (changedProperties.has("loadingMore") && !this.loadingMore) {
      this.loadMorePending = false;
    }
  }
  firstUpdated() {
    this.measureViewportHeight();
  }
  updated() {
    this.measureViewportHeight();
  }
  compareValues(a2, b2) {
    if (a2 == null && b2 == null)
      return 0;
    if (a2 == null)
      return -1;
    if (b2 == null)
      return 1;
    if (typeof a2 === "number" && typeof b2 === "number")
      return a2 - b2;
    const av = String(a2);
    const bv = String(b2);
    return av.localeCompare(bv, "en", { numeric: true, sensitivity: "base" });
  }
  get totalPages() {
    return Math.max(1, Math.ceil(this.sortedData.length / this.pageSize));
  }
  get shouldUsePagination() {
    return this.pagination && !this.infiniteScroll;
  }
  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }
  get sourceData() {
    return this.shouldUsePagination ? this.paginatedData : this.sortedData;
  }
  get shouldUseVirtualScroll() {
    if (this.spanMethod)
      return false;
    return this.virtualScroll || this.sourceData.length >= this.virtualThreshold;
  }
  get effectiveHeight() {
    return this.height || "420px";
  }
  get totalColumnCount() {
    return Math.max(1, this.sortedColumns.length + (this.selectable ? 1 : 0));
  }
  isRowSelected(row, rowIndex) {
    return this.selectedKeys.includes(this.getRowKey(row, rowIndex));
  }
  emitSelectionChange(keys) {
    this.selectedKeys = keys;
    const keySet = new Set(keys);
    const rows = this.sortedData.filter((row, index) => keySet.has(this.getRowKey(row, index)));
    this.dispatchEvent(
      new CustomEvent("selection-change", {
        detail: { keys, rows },
        bubbles: true,
        composed: true
      })
    );
  }
  toggleRowSelection(row, rowIndex) {
    const key = this.getRowKey(row, rowIndex);
    const keys = this.selectedKeys.includes(key) ? this.selectedKeys.filter((k2) => k2 !== key) : [...this.selectedKeys, key];
    this.emitSelectionChange(keys);
  }
  /** 全选/取消全选当前可见数据（当前页或已加载数据） */
  toggleAllSelection() {
    const visibleKeys = this.sourceData.map((row, index) => this.getRowKey(row, index));
    const allSelected = visibleKeys.length > 0 && visibleKeys.every((key) => this.selectedKeys.includes(key));
    const keys = allSelected ? this.selectedKeys.filter((key) => !visibleKeys.includes(key)) : [.../* @__PURE__ */ new Set([...this.selectedKeys, ...visibleKeys])];
    this.emitSelectionChange(keys);
  }
  get virtualState() {
    const rows = this.sourceData;
    if (!this.shouldUseVirtualScroll) {
      return {
        start: 0,
        rows,
        topPadding: 0,
        bottomPadding: 0
      };
    }
    const viewportHeight = this.viewportHeight || 420;
    const visible = Math.ceil(viewportHeight / this.virtualRowHeight) + this.virtualBuffer * 2;
    const start = Math.max(0, Math.floor(this.scrollTop / this.virtualRowHeight) - this.virtualBuffer);
    const end = Math.min(rows.length, start + visible);
    return {
      start,
      rows: rows.slice(start, end),
      topPadding: start * this.virtualRowHeight,
      bottomPadding: (rows.length - end) * this.virtualRowHeight
    };
  }
  measureViewportHeight() {
    const el = this.getViewportElement();
    if (!el)
      return;
    if (this.viewportHeight !== el.clientHeight && el.clientHeight > 0) {
      this.viewportHeight = el.clientHeight;
    }
  }
  getViewportElement() {
    var _a2;
    return (_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(".table-viewport");
  }
  resetViewportScroll() {
    const el = this.getViewportElement();
    if (el) {
      el.scrollTop = 0;
    }
  }
  getRowKey(row, rowIndex) {
    const explicitKey = row[this.rowKey];
    if (explicitKey != null && explicitKey !== "")
      return String(explicitKey);
    return `row-${rowIndex}`;
  }
  getCellDisplayValue(row, column, rowIndex) {
    const raw = row[column.key];
    if (column.formatter) {
      return column.formatter(raw, row, rowIndex);
    }
    return raw ?? "";
  }
  normalizeSpan(result) {
    if (!result)
      return { rowspan: 1, colspan: 1 };
    if (Array.isArray(result)) {
      const rowspan2 = Math.max(0, Math.floor(result[0] ?? 1));
      const colspan2 = Math.max(0, Math.floor(result[1] ?? 1));
      return { rowspan: rowspan2, colspan: colspan2 };
    }
    const rowspan = Math.max(0, Math.floor(result.rowspan ?? 1));
    const colspan = Math.max(0, Math.floor(result.colspan ?? 1));
    return { rowspan, colspan };
  }
  getCellSpan(args) {
    if (!this.spanMethod)
      return { rowspan: 1, colspan: 1 };
    return this.normalizeSpan(this.spanMethod(args));
  }
  setCurrentPage(nextPage) {
    const bounded = Math.min(this.totalPages, Math.max(1, Number.isFinite(nextPage) ? nextPage : 1));
    this.currentPage = bounded;
    this.scrollTop = 0;
    this.resetViewportScroll();
    this.dispatchEvent(new CustomEvent("page-change", { detail: { currentPage: bounded } }));
  }
  handlePaginationChange(event) {
    var _a2;
    const customEvent = event;
    this.setCurrentPage(((_a2 = customEvent.detail) == null ? void 0 : _a2.currentPage) ?? 1);
  }
  maybeEmitLoadMore(target) {
    if (!this.infiniteScroll || !this.hasMore || this.loadingMore || this.loadMorePending)
      return;
    const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (distance > this.loadMoreOffset)
      return;
    this.loadMorePending = true;
    this.dispatchEvent(
      new CustomEvent("load-more", {
        detail: {
          loadedCount: this.sortedData.length
        }
      })
    );
  }
  handleBodyScroll(event) {
    const target = event.target;
    this.scrollTop = target.scrollTop;
    if (target.clientHeight !== this.viewportHeight && target.clientHeight > 0) {
      this.viewportHeight = target.clientHeight;
    }
    this.maybeEmitLoadMore(target);
  }
  handleRowClick(row, rowIndex) {
    this.dispatchEvent(
      new CustomEvent("row-click", {
        detail: {
          row,
          rowIndex
        }
      })
    );
  }
  renderRows() {
    const virtual = this.virtualState;
    const hasData = virtual.rows.length > 0;
    if (!hasData) {
      return x`
        <tr>
          <td colspan="${this.totalColumnCount}" class="empty">${this.noDataText}</td>
        </tr>
      `;
    }
    const topSpacer = virtual.topPadding > 0 ? x`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${virtual.topPadding}px;"></td>
            </tr>
          ` : E;
    const bottomSpacer = virtual.bottomPadding > 0 ? x`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${virtual.bottomPadding}px;"></td>
            </tr>
          ` : E;
    const sourceOffset = this.shouldUsePagination ? (this.currentPage - 1) * this.pageSize : 0;
    const coveredCells = /* @__PURE__ */ new Set();
    const rows = c(
      virtual.rows,
      (row, localIndex) => this.getRowKey(row, virtual.start + localIndex),
      (row, localIndex) => {
        const rowIndex = virtual.start + localIndex;
        const globalRowIndex = sourceOffset + rowIndex;
        return x`
          <tr
            class="${this.striped ? "striped" : ""} ${this.hoverable ? "hoverable" : ""}"
            @click="${() => this.handleRowClick(row, rowIndex)}">
            ${this.selectable ? x`
                  <td class="selection-cell" @click="${(e2) => e2.stopPropagation()}">
                    <input
                      type="checkbox"
                      .checked="${this.isRowSelected(row, rowIndex)}"
                      @change="${() => this.toggleRowSelection(row, rowIndex)}" />
                  </td>
                ` : E}
            ${this.sortedColumns.map((col, columnIndex) => {
          const cellKey = `${rowIndex}-${columnIndex}`;
          if (coveredCells.has(cellKey))
            return E;
          const span = this.getCellSpan({
            row,
            rowIndex: globalRowIndex,
            column: col,
            columnIndex,
            data: this.sourceData,
            columns: this.sortedColumns
          });
          if (span.rowspan <= 0 || span.colspan <= 0)
            return E;
          for (let r2 = 0; r2 < span.rowspan; r2 += 1) {
            for (let c2 = 0; c2 < span.colspan; c2 += 1) {
              if (r2 === 0 && c2 === 0)
                continue;
              coveredCells.add(`${rowIndex + r2}-${columnIndex + c2}`);
            }
          }
          const align = col.align ?? "center";
          const value = this.getCellDisplayValue(row, col, rowIndex);
          return x`
                <td
                  class="${col.ellipsis ? "ellipsis" : ""}"
                  rowspan="${span.rowspan}"
                  colspan="${span.colspan}"
                  style="text-align: ${align}; max-width: ${col.width || "auto"};">
                  ${value}
                </td>
              `;
        })}
          </tr>
        `;
      }
    );
    return x`${topSpacer}${rows}${bottomSpacer}`;
  }
  renderPagination() {
    if (!this.shouldUsePagination)
      return E;
    return x`
      <se-pagination
        class="pagination"
        .currentPage="${this.currentPage}"
        .total="${this.sortedData.length}"
        .pageSize="${this.pageSize}"
        @page-change="${this.handlePaginationChange}"></se-pagination>
    `;
  }
  renderLoadMoreStatus() {
    if (!this.infiniteScroll)
      return E;
    if (this.loadingMore)
      return x`<div class="status-line">${this.loadingText}</div>`;
    if (!this.hasMore)
      return x`<div class="status-line">${this.noMoreText}</div>`;
    return x`<div class="status-line">${this.loadMoreText}</div>`;
  }
  renderSelectionHeader() {
    if (!this.selectable)
      return E;
    const visibleKeys = this.sourceData.map((row, index) => this.getRowKey(row, index));
    const selectedVisible = visibleKeys.filter((key) => this.selectedKeys.includes(key));
    const allSelected = visibleKeys.length > 0 && selectedVisible.length === visibleKeys.length;
    const indeterminate = selectedVisible.length > 0 && !allSelected;
    return x`
      <th class="selection-cell">
        <input
          type="checkbox"
          aria-label="全选"
          .checked="${allSelected}"
          .indeterminate="${indeterminate}"
          @change="${() => this.toggleAllSelection()}" />
      </th>
    `;
  }
  render() {
    const scrollable = this.infiniteScroll || this.shouldUseVirtualScroll;
    return x`
      <div class="table-wrapper">
        <div
          class="table-viewport ${scrollable ? "scrollable" : ""}"
          style="${scrollable ? `height: ${this.effectiveHeight};` : ""}"
          @scroll="${this.handleBodyScroll}">
          <table>
            <thead class="${this.stickyHeader && scrollable ? "sticky" : ""}">
              <tr>
                ${this.renderSelectionHeader()}
                ${this.sortedColumns.map(
      (col, index) => x`
                    <th
                      class="${col.sortable ? "sortable" : ""}"
                      style="width: ${col.width || "auto"}; text-align: ${col.align || "center"};"
                      data-sort="${col.sortDirection === "asc" ? "↑" : col.sortDirection === "desc" ? "↓" : "⇅"}"
                      @click="${() => this.sortColumn(index)}">
                      ${col.label}
                    </th>
                  `
    )}
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
        ${this.loading ? x`<div class="loading-overlay"><span class="loading-spinner"></span></div>` : E}
        ${this.renderLoadMoreStatus()}
        ${this.renderPagination()}
      </div>
    `;
  }
};
seTable.styles = [
  tableStyles,
  i$4`
      .pagination {
        margin-top: 0;
      }

      .table-viewport {
        width: 100%;
        overflow-x: auto;
      }

      .table-viewport.scrollable {
        overflow: auto;
      }

      thead.sticky th {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      thead th {
        cursor: default;
        user-select: none;
      }

      thead th.sortable::after {
        content: attr(data-sort);
        margin-left: 6px;
        font-size: 12px;
        color: var(--su-text-3);
      }

      thead th.sortable {
        cursor: pointer;
      }

      tbody tr.striped:nth-child(even) {
        background-color: var(--su-bg-page);
      }

      tbody tr.hoverable:hover {
        background-color: var(--su-bg-hover);
      }

      td.ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      td.empty {
        text-align: center;
        padding: 32px 8px;
        color: var(--su-text-3);
      }

      .selection-cell {
        width: 40px;
        text-align: center;
      }

      .selection-cell input {
        accent-color: var(--su-color-primary);
        cursor: pointer;
      }

      .table-wrapper {
        position: relative;
      }

      .loading-overlay {
        position: absolute;
        inset: 0;
        z-index: 5;
        background: var(--su-overlay);
        display: grid;
        place-items: center;
      }

      .loading-spinner {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 3px solid rgba(var(--su-color-primary-rgb), 0.25);
        border-top-color: var(--su-color-primary);
        animation: table-spin 0.8s linear infinite;
      }

      @keyframes table-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .status-line {
        margin-top: 8px;
        text-align: center;
        color: var(--su-text-3);
        font-size: 13px;
      }

      .virtual-spacer td {
        border: none !important;
        padding: 0 !important;
        height: 0;
      }
    `
];
__decorateClass$y([
  n2({ type: Array })
], seTable.prototype, "data", 2);
__decorateClass$y([
  n2({ type: Array })
], seTable.prototype, "columns", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "noDataText", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "borderStyle", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "rowLines", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "columnLines", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "theadBgColor", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "theadTextColor", 2);
__decorateClass$y([
  n2({ type: Number })
], seTable.prototype, "pageSize", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "pagination", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "striped", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "hoverable", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "stickyHeader", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "height", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "rowKey", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "selectable", 2);
__decorateClass$y([
  n2({ attribute: false })
], seTable.prototype, "selectedKeys", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "loading", 2);
__decorateClass$y([
  n2({ attribute: false })
], seTable.prototype, "spanMethod", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "infiniteScroll", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "hasMore", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "loadingMore", 2);
__decorateClass$y([
  n2({ type: Number })
], seTable.prototype, "loadMoreOffset", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "loadMoreText", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "loadingText", 2);
__decorateClass$y([
  n2({ type: String })
], seTable.prototype, "noMoreText", 2);
__decorateClass$y([
  n2({ type: Boolean })
], seTable.prototype, "virtualScroll", 2);
__decorateClass$y([
  n2({ type: Number })
], seTable.prototype, "virtualThreshold", 2);
__decorateClass$y([
  n2({ type: Number })
], seTable.prototype, "virtualRowHeight", 2);
__decorateClass$y([
  n2({ type: Number })
], seTable.prototype, "virtualBuffer", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "currentPage", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "sortedColumns", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "sortedData", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "scrollTop", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "viewportHeight", 2);
__decorateClass$y([
  r$1()
], seTable.prototype, "loadMorePending", 2);
seTable = __decorateClass$y([
  t$2("se-table")
], seTable);
var __defProp$x = Object.defineProperty;
var __getOwnPropDesc$x = Object.getOwnPropertyDescriptor;
var __decorateClass$x = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$x(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$x(target, key, result);
  return result;
};
let seImagePreview = class extends i$1 {
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
seImagePreview.styles = i$4`
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
__decorateClass$x([
  n2({ type: String })
], seImagePreview.prototype, "src", 2);
__decorateClass$x([
  r$1()
], seImagePreview.prototype, "rotation", 2);
seImagePreview = __decorateClass$x([
  t$2("se-image-preview")
], seImagePreview);
var __defProp$w = Object.defineProperty;
var __getOwnPropDesc$w = Object.getOwnPropertyDescriptor;
var __decorateClass$w = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$w(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$w(target, key, result);
  return result;
};
let seImage = class extends i$1 {
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
    this._isVisible = false;
  }
  firstUpdated() {
    var _a2;
    if (this.lazy) {
      this._observer = new IntersectionObserver((entries) => {
        var _a3;
        if (entries[0].isIntersecting) {
          this._isVisible = true;
          (_a3 = this._observer) == null ? void 0 : _a3.disconnect();
          this.requestUpdate();
        }
      });
      this._observer.observe((_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("img"));
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
          loading="${this.lazy ? "lazy" : "eager"}"
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
seImage.styles = i$4`
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
__decorateClass$w([
  n2({ type: String })
], seImage.prototype, "src", 2);
__decorateClass$w([
  n2({ type: String })
], seImage.prototype, "alt", 2);
__decorateClass$w([
  n2({ type: Boolean })
], seImage.prototype, "lazy", 2);
__decorateClass$w([
  n2({ type: String })
], seImage.prototype, "placeholder", 2);
__decorateClass$w([
  n2({ type: String })
], seImage.prototype, "errorPlaceholder", 2);
__decorateClass$w([
  n2({ type: Number })
], seImage.prototype, "width", 2);
__decorateClass$w([
  n2({ type: Number })
], seImage.prototype, "height", 2);
__decorateClass$w([
  r$1()
], seImage.prototype, "isError", 2);
__decorateClass$w([
  r$1()
], seImage.prototype, "isPreviewVisible", 2);
__decorateClass$w([
  r$1()
], seImage.prototype, "rotation", 2);
seImage = __decorateClass$w([
  t$2("se-image")
], seImage);
var __defProp$v = Object.defineProperty;
var __getOwnPropDesc$v = Object.getOwnPropertyDescriptor;
var __decorateClass$v = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$v(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$v(target, key, result);
  return result;
};
let LineComponent = class extends i$1 {
  constructor() {
    super(...arguments);
    this.direction = "horizontal";
    this.color = "#000";
  }
  render() {
    return x`
      <div
        class="line ${this.direction === "horizontal" ? "horizontal" : "vertical"}"
        style="background-color: ${this.color};"
      ></div>
    `;
  }
};
LineComponent.styles = i$4`
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
__decorateClass$v([
  n2({ type: String })
], LineComponent.prototype, "direction", 2);
__decorateClass$v([
  n2({ type: String })
], LineComponent.prototype, "color", 2);
LineComponent = __decorateClass$v([
  t$2("line-component")
], LineComponent);
var __defProp$u = Object.defineProperty;
var __getOwnPropDesc$u = Object.getOwnPropertyDescriptor;
var __decorateClass$u = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$u(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$u(target, key, result);
  return result;
};
let SeAssetViewer = class extends i$1 {
  constructor() {
    super(...arguments);
    this.src = "";
    this.thumbnail = "";
    this.title = "";
    this.downloadable = true;
    this.type = "unknown";
    this.previewVisible = false;
  }
  resolveType() {
    if (this.type !== "unknown")
      return this.type;
    const lower = this.src.toLowerCase();
    if (lower.match(/\.(png|jpe?g|gif|webp|svg)$/))
      return "image";
    if (lower.match(/\.(mp4|webm|mov)$/))
      return "video";
    if (lower.match(/\.(mp3|wav|ogg)$/))
      return "audio";
    if (lower.endsWith(".pdf"))
      return "pdf";
    return "unknown";
  }
  openPreview() {
    if (!this.src)
      return;
    this.previewVisible = true;
    this.dispatchEvent(new CustomEvent("asset-open", { detail: { src: this.src, type: this.resolveType() } }));
  }
  closePreview() {
    this.previewVisible = false;
  }
  renderPreviewThumb() {
    const kind = this.resolveType();
    if (kind === "image") {
      const url = this.thumbnail || this.src;
      return x`<img src=${url} alt=${this.title || "asset"} loading="lazy" />`;
    }
    const labelMap = {
      image: "图片",
      video: "视频",
      audio: "音频",
      pdf: "PDF",
      unknown: "文件"
    };
    return x`<span>${labelMap[kind]}</span>`;
  }
  renderOverlay() {
    if (!this.previewVisible)
      return null;
    const kind = this.resolveType();
    return x`
      <div class="overlay" @click=${this.closePreview}>
        <div class="overlay-content" @click=${(e2) => e2.stopPropagation()}>
          <header>
            <h3>${this.title || this.src}</h3>
            <button @click=${this.closePreview}>关闭</button>
          </header>
          ${kind === "image" ? x`<img src=${this.src} alt=${this.title || "asset"} />` : kind === "pdf" ? x`<iframe src=${this.src} title="PDF preview"></iframe>` : kind === "video" ? x`<video src=${this.src} controls></video>` : kind === "audio" ? x`<audio src=${this.src} controls></audio>` : x`<p>暂不支持预览该文件类型</p>`}
        </div>
      </div>
    `;
  }
  render() {
    return x`
      <div class="card">
        <div class="preview" @click=${this.openPreview}>
          ${this.renderPreviewThumb()}
        </div>
        <div class="meta">
          <p class="title">${this.title || this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button @click=${this.openPreview}>预览</button>
          ${this.downloadable && this.src ? x`<a class="button-link" href=${this.src} download target="_blank" rel="noreferrer">下载</a>` : null}
        </div>
      </div>
      ${this.renderOverlay()}
    `;
  }
};
SeAssetViewer.styles = i$4`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }

    .card {
      border: 1px solid var(--asset-border, #e5e7eb);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--asset-bg, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .preview {
      width: 96px;
      height: 72px;
      border-radius: 8px;
      overflow: hidden;
      background: #f8fafc;
      display: grid;
      place-items: center;
      cursor: pointer;
      position: relative;
    }

    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .meta {
      flex: 1;
      min-width: 0;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: #111827;
      line-height: 1.4;
    }

    .meta small {
      display: block;
      color: #6b7280;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    button,
    a.button-link {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: #fff;
      color: #111827;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    button:hover,
    a.button-link:hover {
      border-color: var(--su-color-primary-hover, #2563eb);
      color: var(--su-color-primary-hover, #2563eb);
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: grid;
      place-items: center;
      z-index: 9999;
      padding: 24px;
    }

    .overlay-content {
      background: #fff;
      padding: 12px;
      border-radius: 10px;
      max-width: min(90vw, 960px);
      max-height: 90vh;
      display: grid;
      gap: 10px;
    }

    .overlay header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .overlay header h3 {
      margin: 0;
      font-size: 15px;
    }

    .overlay img,
    .overlay iframe,
    .overlay video,
    .overlay audio {
      max-width: 100%;
      max-height: 72vh;
      border-radius: 8px;
    }
  `;
__decorateClass$u([
  n2({ type: String })
], SeAssetViewer.prototype, "src", 2);
__decorateClass$u([
  n2({ type: String })
], SeAssetViewer.prototype, "thumbnail", 2);
__decorateClass$u([
  n2({ type: String })
], SeAssetViewer.prototype, "title", 2);
__decorateClass$u([
  n2({ type: Boolean })
], SeAssetViewer.prototype, "downloadable", 2);
__decorateClass$u([
  n2({ type: String })
], SeAssetViewer.prototype, "type", 2);
__decorateClass$u([
  r$1()
], SeAssetViewer.prototype, "previewVisible", 2);
SeAssetViewer = __decorateClass$u([
  t$2("se-asset-viewer")
], SeAssetViewer);
const baseControlStyles = i$4`
  :host {
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: var(--su-text-1);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
const focusRingStyles = i$4`
  :focus-visible {
    outline: 2px solid var(--su-color-primary);
    outline-offset: 1px;
  }
`;
function parseJsonArray(value, fallback) {
  if (!value)
    return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
var __defProp$t = Object.defineProperty;
var __getOwnPropDesc$t = Object.getOwnPropertyDescriptor;
var __decorateClass$t = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$t(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$t(target, key, result);
  return result;
};
let SuSelect = class extends i$1 {
  constructor() {
    super(...arguments);
    this.options = [];
    this.optionsJson = "";
    this.value = "";
    this.placeholder = "请选择";
    this.disabled = false;
  }
  get mergedOptions() {
    if (this.options.length > 0)
      return this.options;
    return parseJsonArray(this.optionsJson, []);
  }
  handleChange(event) {
    const target = event.target;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <select class="select" .value=${this.value} ?disabled=${this.disabled} @change=${this.handleChange}>
        <option value="">${this.placeholder}</option>
        ${this.mergedOptions.map(
      (option) => x`<option value=${String(option.value)} ?disabled=${Boolean(option.disabled)}>
              ${option.label}
            </option>`
    )}
      </select>
    `;
  }
};
SuSelect.styles = [
  baseControlStyles,
  focusRingStyles,
  i$4`
      :host {
        display: block;
      }

      .select {
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 8px 10px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: var(--su-bg-card);
      }

      .select:hover {
        border-color: var(--su-border-color-hover);
      }

      .select:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        background: var(--su-bg-muted);
      }
    `
];
__decorateClass$t([
  n2({ type: Array, attribute: false })
], SuSelect.prototype, "options", 2);
__decorateClass$t([
  n2({ type: String })
], SuSelect.prototype, "optionsJson", 2);
__decorateClass$t([
  n2({ type: String })
], SuSelect.prototype, "value", 2);
__decorateClass$t([
  n2({ type: String })
], SuSelect.prototype, "placeholder", 2);
__decorateClass$t([
  n2({ type: Boolean })
], SuSelect.prototype, "disabled", 2);
SuSelect = __decorateClass$t([
  t$2("su-select")
], SuSelect);
var __defProp$s = Object.defineProperty;
var __getOwnPropDesc$s = Object.getOwnPropertyDescriptor;
var __decorateClass$s = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$s(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$s(target, key, result);
  return result;
};
let SuSwitch = class extends i$1 {
  constructor() {
    super(...arguments);
    this.checked = false;
    this.disabled = false;
  }
  handleClick() {
    if (this.disabled)
      return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`<button type="button" ?disabled=${this.disabled} @click=${this.handleClick}></button>`;
  }
};
SuSwitch.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-flex;
      }

      button {
        width: 42px;
        height: 24px;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        position: relative;
        transition: background-color 0.2s ease;
        background: var(--su-border-color-hover);
      }

      button::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s ease;
        box-shadow: var(--su-shadow-sm);
      }

      :host([checked]) button {
        background: var(--su-color-primary);
      }

      :host([checked]) button::after {
        transform: translateX(18px);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
];
__decorateClass$s([
  n2({ type: Boolean, reflect: true })
], SuSwitch.prototype, "checked", 2);
__decorateClass$s([
  n2({ type: Boolean })
], SuSwitch.prototype, "disabled", 2);
SuSwitch = __decorateClass$s([
  t$2("su-switch")
], SuSwitch);
var __defProp$r = Object.defineProperty;
var __getOwnPropDesc$r = Object.getOwnPropertyDescriptor;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$r(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$r(target, key, result);
  return result;
};
let SuTextarea = class extends i$1 {
  constructor() {
    super(...arguments);
    this.value = "";
    this.placeholder = "请输入";
    this.rows = 4;
    this.disabled = false;
  }
  handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        rows=${this.rows}
        ?disabled=${this.disabled}
        @input=${this.handleInput}></textarea>
    `;
  }
};
SuTextarea.styles = [
  baseControlStyles,
  focusRingStyles,
  i$4`
      :host {
        display: block;
      }

      textarea {
        width: 100%;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        padding: 10px 12px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: var(--su-bg-card);
        resize: vertical;
      }

      textarea:hover {
        border-color: var(--su-border-color-hover);
      }

      textarea:disabled {
        color: var(--su-text-3);
        background: #f3f4f6;
        cursor: not-allowed;
      }
    `
];
__decorateClass$r([
  n2({ type: String })
], SuTextarea.prototype, "value", 2);
__decorateClass$r([
  n2({ type: String })
], SuTextarea.prototype, "placeholder", 2);
__decorateClass$r([
  n2({ type: Number })
], SuTextarea.prototype, "rows", 2);
__decorateClass$r([
  n2({ type: Boolean })
], SuTextarea.prototype, "disabled", 2);
SuTextarea = __decorateClass$r([
  t$2("su-textarea")
], SuTextarea);
var __defProp$q = Object.defineProperty;
var __getOwnPropDesc$q = Object.getOwnPropertyDescriptor;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$q(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$q(target, key, result);
  return result;
};
let SuFormItem = class extends i$1 {
  constructor() {
    super(...arguments);
    this.label = "";
    this.message = "";
    this.status = "default";
    this.required = false;
  }
  render() {
    return x`
      <div class="item">
        ${this.label ? x`<label class="label">${this.required ? x`<span class="required">*</span>` : E}${this.label}</label>` : E}
        <slot></slot>
        ${this.message ? x`<div class="message ${this.status}">${this.message}</div>` : E}
      </div>
    `;
  }
};
SuFormItem.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .item {
        display: grid;
        gap: 6px;
      }

      .label {
        font-size: var(--su-font-size-sm);
        color: var(--su-text-2);
      }

      .required {
        color: var(--su-color-error);
        margin-right: 4px;
      }

      .message {
        font-size: var(--su-font-size-xs);
      }

      .message.default {
        color: var(--su-text-3);
      }

      .message.error {
        color: var(--su-color-error);
      }

      .message.warning {
        color: var(--su-color-warning);
      }

      .message.success {
        color: var(--su-color-success);
      }
    `
];
__decorateClass$q([
  n2({ type: String })
], SuFormItem.prototype, "label", 2);
__decorateClass$q([
  n2({ type: String })
], SuFormItem.prototype, "message", 2);
__decorateClass$q([
  n2({ type: String })
], SuFormItem.prototype, "status", 2);
__decorateClass$q([
  n2({ type: Boolean })
], SuFormItem.prototype, "required", 2);
SuFormItem = __decorateClass$q([
  t$2("su-form-item")
], SuFormItem);
var __defProp$p = Object.defineProperty;
var __getOwnPropDesc$p = Object.getOwnPropertyDescriptor;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$p(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$p(target, key, result);
  return result;
};
let SuCheckbox = class extends i$1 {
  constructor() {
    super(...arguments);
    this.checked = false;
    this.disabled = false;
    this.label = "";
  }
  onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <label>
        <input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} @change=${this.onChange} />
        <span>${this.label}</span>
      </label>
    `;
  }
};
SuCheckbox.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-flex;
      }

      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }

      input[type='checkbox'] {
        width: 16px;
        height: 16px;
        accent-color: var(--su-color-primary);
      }

      input:disabled,
      input:disabled + span {
        cursor: not-allowed;
        opacity: 0.55;
      }
    `
];
__decorateClass$p([
  n2({ type: Boolean, reflect: true })
], SuCheckbox.prototype, "checked", 2);
__decorateClass$p([
  n2({ type: Boolean })
], SuCheckbox.prototype, "disabled", 2);
__decorateClass$p([
  n2({ type: String })
], SuCheckbox.prototype, "label", 2);
SuCheckbox = __decorateClass$p([
  t$2("su-checkbox")
], SuCheckbox);
var __defProp$o = Object.defineProperty;
var __getOwnPropDesc$o = Object.getOwnPropertyDescriptor;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$o(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$o(target, key, result);
  return result;
};
let SuRadioGroup = class extends i$1 {
  constructor() {
    super(...arguments);
    this.options = [];
    this.optionsJson = "";
    this.value = "";
    this.name = `su-radio-${Math.random().toString(36).slice(2)}`;
  }
  get mergedOptions() {
    if (this.options.length > 0)
      return this.options;
    return parseJsonArray(this.optionsJson, []);
  }
  onChange(event) {
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <div class="group">
        ${this.mergedOptions.map(
      (option) => x`
            <label>
              <input
                type="radio"
                name=${this.name}
                value=${option.value}
                .checked=${this.value === option.value}
                ?disabled=${Boolean(option.disabled)}
                @change=${this.onChange} />
              <span>${option.label}</span>
            </label>
          `
    )}
      </div>
    `;
  }
};
SuRadioGroup.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .group {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      label {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        color: var(--su-text-2);
        font-size: var(--su-font-size-sm);
      }

      input[type='radio'] {
        accent-color: var(--su-color-primary);
      }
    `
];
__decorateClass$o([
  n2({ type: Array, attribute: false })
], SuRadioGroup.prototype, "options", 2);
__decorateClass$o([
  n2({ type: String })
], SuRadioGroup.prototype, "optionsJson", 2);
__decorateClass$o([
  n2({ type: String })
], SuRadioGroup.prototype, "value", 2);
__decorateClass$o([
  n2({ type: String })
], SuRadioGroup.prototype, "name", 2);
SuRadioGroup = __decorateClass$o([
  t$2("su-radio-group")
], SuRadioGroup);
var __defProp$n = Object.defineProperty;
var __getOwnPropDesc$n = Object.getOwnPropertyDescriptor;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$n(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$n(target, key, result);
  return result;
};
let SuInputNumber = class extends i$1 {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.min = Number.MIN_SAFE_INTEGER;
    this.max = Number.MAX_SAFE_INTEGER;
    this.step = 1;
    this.disabled = false;
  }
  clamp(value) {
    return Math.min(this.max, Math.max(this.min, value));
  }
  emitChange(next) {
    const clamped = this.clamp(next);
    if (clamped === this.value) {
      this.requestUpdate();
      return;
    }
    this.value = clamped;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  onInput(event) {
    const raw = event.target.value;
    const parsed = Number(raw);
    if (raw === "" || Number.isNaN(parsed))
      return;
    this.emitChange(parsed);
  }
  onBlur(event) {
    const input = event.target;
    input.value = String(this.value);
  }
  render() {
    return x`
      <div class="wrapper">
        <button
          type="button"
          aria-label="减少"
          ?disabled=${this.disabled || this.value <= this.min}
          @click=${() => this.emitChange(this.value - this.step)}>
          −
        </button>
        <input
          type="number"
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          @change=${this.onInput}
          @blur=${this.onBlur} />
        <button
          type="button"
          aria-label="增加"
          ?disabled=${this.disabled || this.value >= this.max}
          @click=${() => this.emitChange(this.value + this.step)}>
          +
        </button>
      </div>
    `;
  }
};
SuInputNumber.styles = [
  baseControlStyles,
  focusRingStyles,
  i$4`
      :host {
        display: inline-block;
      }

      .wrapper {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        overflow: hidden;
        background: var(--su-bg-card);
      }

      .wrapper:hover {
        border-color: var(--su-border-color-hover);
      }

      .wrapper:focus-within {
        border-color: var(--su-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
      }

      button {
        width: 30px;
        border: none;
        background: var(--su-bg-muted);
        color: var(--su-text-2);
        cursor: pointer;
        font-size: var(--su-font-size-md);
      }

      button:hover:not(:disabled) {
        color: var(--su-color-primary);
      }

      button:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }

      input {
        width: 64px;
        border: none;
        outline: none;
        text-align: center;
        font-size: var(--su-font-size-md);
        color: var(--su-text-1);
        background: transparent;
        padding: 8px 4px;
        -moz-appearance: textfield;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
      }
    `
];
__decorateClass$n([
  n2({ type: Number })
], SuInputNumber.prototype, "value", 2);
__decorateClass$n([
  n2({ type: Number })
], SuInputNumber.prototype, "min", 2);
__decorateClass$n([
  n2({ type: Number })
], SuInputNumber.prototype, "max", 2);
__decorateClass$n([
  n2({ type: Number })
], SuInputNumber.prototype, "step", 2);
__decorateClass$n([
  n2({ type: Boolean })
], SuInputNumber.prototype, "disabled", 2);
SuInputNumber = __decorateClass$n([
  t$2("su-input-number")
], SuInputNumber);
var __defProp$m = Object.defineProperty;
var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$m(target, key, result);
  return result;
};
let SuCard = class extends i$1 {
  render() {
    return x`
      <section class="card">
        <header class="header"><slot name="header"></slot></header>
        <div class="content"><slot></slot></div>
        <footer class="footer"><slot name="footer"></slot></footer>
      </section>
    `;
  }
};
SuCard.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .card {
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        box-shadow: var(--su-shadow-sm);
      }

      .header,
      .footer {
        padding: 12px 14px;
        color: var(--su-text-2);
      }

      .header {
        border-bottom: 1px solid var(--su-border-color);
        font-size: var(--su-font-size-md);
        font-weight: 600;
      }

      .content {
        padding: 14px;
      }

      .footer {
        border-top: 1px solid var(--su-border-color);
      }
    `
];
SuCard = __decorateClass$m([
  t$2("su-card")
], SuCard);
var __defProp$l = Object.defineProperty;
var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$l(target, key, result);
  return result;
};
let SuTag = class extends i$1 {
  constructor() {
    super(...arguments);
    this.type = "default";
  }
  render() {
    return x`<span class="tag ${this.type}"><slot></slot></span>`;
  }
};
SuTag.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-flex;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 2px 10px;
        font-size: var(--su-font-size-xs);
        font-weight: 500;
        border: 1px solid transparent;
      }

      .tag.default {
        color: var(--su-text-2);
        background: var(--su-bg-hover);
        border-color: var(--su-border-color);
      }

      .tag.primary {
        color: var(--su-color-primary);
        background: rgba(var(--su-color-primary-rgb), 0.1);
      }

      .tag.success {
        color: var(--su-color-success);
        background: rgba(var(--su-color-success-rgb), 0.1);
      }

      .tag.warning {
        color: var(--su-color-warning);
        background: rgba(var(--su-color-warning-rgb), 0.12);
      }

      .tag.error {
        color: var(--su-color-error);
        background: rgba(var(--su-color-error-rgb), 0.12);
      }
    `
];
__decorateClass$l([
  n2({ type: String })
], SuTag.prototype, "type", 2);
SuTag = __decorateClass$l([
  t$2("su-tag")
], SuTag);
var __defProp$k = Object.defineProperty;
var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$k(target, key, result);
  return result;
};
let SuStatCard = class extends i$1 {
  constructor() {
    super(...arguments);
    this.title = "";
    this.value = "";
    this.trend = "";
    this.trendType = "flat";
  }
  render() {
    return x`
      <article class="card">
        <div class="title">${this.title}</div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trendType}">${this.trend}</div>
      </article>
    `;
  }
};
SuStatCard.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .card {
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-sm);
        padding: 14px;
      }

      .title {
        color: var(--su-text-3);
        font-size: var(--su-font-size-sm);
        margin-bottom: 8px;
      }

      .value {
        color: var(--su-text-1);
        font-size: 26px;
        line-height: 1.2;
        font-weight: 700;
      }

      .trend {
        margin-top: 8px;
        font-size: var(--su-font-size-sm);
      }

      .trend.up {
        color: var(--su-color-success);
      }

      .trend.down {
        color: var(--su-color-error);
      }

      .trend.flat {
        color: var(--su-text-3);
      }
    `
];
__decorateClass$k([
  n2({ type: String })
], SuStatCard.prototype, "title", 2);
__decorateClass$k([
  n2({ type: String })
], SuStatCard.prototype, "value", 2);
__decorateClass$k([
  n2({ type: String })
], SuStatCard.prototype, "trend", 2);
__decorateClass$k([
  n2({ type: String })
], SuStatCard.prototype, "trendType", 2);
SuStatCard = __decorateClass$k([
  t$2("su-stat-card")
], SuStatCard);
var __defProp$j = Object.defineProperty;
var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$j(target, key, result);
  return result;
};
let SuBadge = class extends i$1 {
  constructor() {
    super(...arguments);
    this.count = 0;
    this.max = 99;
    this.dot = false;
    this.showZero = false;
  }
  get text() {
    return this.count > this.max ? `${this.max}+` : String(this.count);
  }
  render() {
    const visible = this.dot || this.count > 0 || this.showZero && this.count === 0;
    return x`
      <slot></slot>
      ${visible ? x`<span class="badge ${this.dot ? "dot" : ""}">${this.dot ? "" : this.text}</span>` : E}
    `;
  }
};
SuBadge.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-flex;
        position: relative;
      }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background: var(--su-color-error);
        color: var(--su-color-error-contrast, #fff);
        border-radius: 999px;
        font-size: var(--su-font-size-xs);
        line-height: 1;
        padding: 3px 6px;
        min-width: 8px;
        text-align: center;
        box-shadow: 0 0 0 1px var(--su-bg-card);
      }

      .badge.dot {
        width: 8px;
        height: 8px;
        min-width: 0;
        padding: 0;
      }
    `
];
__decorateClass$j([
  n2({ type: Number })
], SuBadge.prototype, "count", 2);
__decorateClass$j([
  n2({ type: Number })
], SuBadge.prototype, "max", 2);
__decorateClass$j([
  n2({ type: Boolean })
], SuBadge.prototype, "dot", 2);
__decorateClass$j([
  n2({ type: Boolean })
], SuBadge.prototype, "showZero", 2);
SuBadge = __decorateClass$j([
  t$2("su-badge")
], SuBadge);
var __defProp$i = Object.defineProperty;
var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$i(target, key, result);
  return result;
};
let SuAvatar = class extends i$1 {
  constructor() {
    super(...arguments);
    this.src = "";
    this.name = "";
    this.size = "medium";
    this.shape = "circle";
    this.loadError = false;
  }
  updated(changed) {
    if (changed.has("src")) {
      this.loadError = false;
    }
  }
  render() {
    const showImage = this.src && !this.loadError;
    return x`
      <span class="avatar ${this.shape} ${this.size}">
        ${showImage ? x`<img src=${this.src} alt=${this.name} @error=${() => this.loadError = true} />` : x`${this.name.slice(0, 1).toUpperCase()}`}
      </span>
    `;
  }
};
SuAvatar.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-flex;
      }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--su-bg-muted);
        color: var(--su-text-2);
        font-weight: 600;
        flex: none;
      }

      .avatar.circle {
        border-radius: 50%;
      }

      .avatar.square {
        border-radius: var(--su-radius-sm);
      }

      .avatar.small {
        width: 24px;
        height: 24px;
        font-size: var(--su-font-size-xs);
      }

      .avatar.medium {
        width: 32px;
        height: 32px;
        font-size: var(--su-font-size-sm);
      }

      .avatar.large {
        width: 44px;
        height: 44px;
        font-size: var(--su-font-size-lg);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
];
__decorateClass$i([
  n2({ type: String })
], SuAvatar.prototype, "src", 2);
__decorateClass$i([
  n2({ type: String })
], SuAvatar.prototype, "name", 2);
__decorateClass$i([
  n2({ type: String })
], SuAvatar.prototype, "size", 2);
__decorateClass$i([
  n2({ type: String })
], SuAvatar.prototype, "shape", 2);
__decorateClass$i([
  r$1()
], SuAvatar.prototype, "loadError", 2);
SuAvatar = __decorateClass$i([
  t$2("su-avatar")
], SuAvatar);
var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$h(target, key, result);
  return result;
};
let SuEmpty = class extends i$1 {
  constructor() {
    super(...arguments);
    this.description = "暂无数据";
  }
  render() {
    return x`
      <div class="empty">
        <span class="icon" aria-hidden="true"></span>
        <span class="description">${this.description}</span>
        <slot></slot>
      </div>
    `;
  }
};
SuEmpty.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 32px 16px;
        color: var(--su-text-3);
      }

      .icon {
        width: 56px;
        height: 40px;
        border: 2px dashed var(--su-border-color);
        border-radius: var(--su-radius-sm);
        position: relative;
      }

      .icon::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 3px;
        border-radius: 999px;
        background: var(--su-border-color);
      }

      .description {
        font-size: var(--su-font-size-sm);
      }
    `
];
__decorateClass$h([
  n2({ type: String })
], SuEmpty.prototype, "description", 2);
SuEmpty = __decorateClass$h([
  t$2("su-empty")
], SuEmpty);
var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$g(target, key, result);
  return result;
};
let SuSkeleton = class extends i$1 {
  constructor() {
    super(...arguments);
    this.rows = 3;
    this.avatar = false;
    this.animated = true;
    this.loading = true;
  }
  render() {
    if (!this.loading)
      return x`<slot></slot>`;
    return x`
      <div class="skeleton ${this.animated ? "animated" : ""}" aria-busy="true">
        ${this.avatar ? x`<span class="avatar"></span>` : E}
        <div class="lines">
          ${Array.from({ length: Math.max(1, this.rows) }, () => x`<div class="row"></div>`)}
        </div>
      </div>
    `;
  }
};
SuSkeleton.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .skeleton {
        display: flex;
        gap: 12px;
      }

      .avatar {
        flex: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--su-bg-muted);
      }

      .lines {
        flex: 1;
        display: grid;
        gap: 10px;
        align-content: start;
      }

      .row {
        height: 14px;
        border-radius: 4px;
        background: var(--su-bg-muted);
      }

      .row:first-child {
        width: 38%;
      }

      .row:last-child {
        width: 62%;
      }

      .animated .avatar,
      .animated .row {
        background: linear-gradient(
          90deg,
          var(--su-bg-muted) 25%,
          var(--su-bg-hover) 50%,
          var(--su-bg-muted) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease infinite;
      }

      @keyframes shimmer {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
    `
];
__decorateClass$g([
  n2({ type: Number })
], SuSkeleton.prototype, "rows", 2);
__decorateClass$g([
  n2({ type: Boolean })
], SuSkeleton.prototype, "avatar", 2);
__decorateClass$g([
  n2({ type: Boolean })
], SuSkeleton.prototype, "animated", 2);
__decorateClass$g([
  n2({ type: Boolean })
], SuSkeleton.prototype, "loading", 2);
SuSkeleton = __decorateClass$g([
  t$2("su-skeleton")
], SuSkeleton);
var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$f(target, key, result);
  return result;
};
let SuDescriptions = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.header = "";
    this.column = 2;
    this.bordered = false;
  }
  willUpdate() {
    this.style.setProperty("--desc-column", String(Math.max(1, this.column)));
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  render() {
    return x`
      ${this.header ? x`<div class="title">${this.header}</div>` : E}
      <div class="grid ${this.bordered ? "bordered" : ""}">
        ${this.mergedItems.map(
      (item) => x`
            <div class="item">
              <span class="label">${item.label}</span>
              <span class="value">${item.value}</span>
            </div>
          `
    )}
      </div>
    `;
  }
};
SuDescriptions.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .title {
        font-size: var(--su-font-size-md);
        font-weight: 600;
        margin-bottom: 12px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(var(--desc-column, 2), 1fr);
        gap: 12px 24px;
      }

      .item {
        display: flex;
        gap: 8px;
        font-size: var(--su-font-size-sm);
        min-width: 0;
      }

      .label {
        color: var(--su-text-3);
        flex: none;
      }

      .value {
        color: var(--su-text-1);
        word-break: break-all;
      }

      .grid.bordered {
        gap: 0;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        overflow: hidden;
      }

      .grid.bordered .item {
        padding: 10px 12px;
        border-bottom: 1px solid var(--su-border-color);
        border-right: 1px solid var(--su-border-color);
      }

      .grid.bordered .label {
        min-width: 72px;
      }
    `
];
__decorateClass$f([
  n2({ type: Array, attribute: false })
], SuDescriptions.prototype, "items", 2);
__decorateClass$f([
  n2({ type: String })
], SuDescriptions.prototype, "itemsJson", 2);
__decorateClass$f([
  n2({ type: String })
], SuDescriptions.prototype, "header", 2);
__decorateClass$f([
  n2({ type: Number })
], SuDescriptions.prototype, "column", 2);
__decorateClass$f([
  n2({ type: Boolean })
], SuDescriptions.prototype, "bordered", 2);
SuDescriptions = __decorateClass$f([
  t$2("su-descriptions")
], SuDescriptions);
var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$e(target, key, result);
  return result;
};
let SuModal = class extends i$1 {
  constructor() {
    super(...arguments);
    this.open = false;
    this.title = "提示";
    this.maskClosable = true;
    this.hideFooter = false;
    this.confirmText = "确定";
    this.cancelText = "取消";
    this.onKeydown = (event) => {
      if (event.key === "Escape" && this.open && this.maskClosable) {
        this.close("mask");
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeydown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeydown);
  }
  closeByMask(event) {
    if (!this.maskClosable)
      return;
    if (event.target !== event.currentTarget)
      return;
    this.close("mask");
  }
  close(source) {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: { source },
        bubbles: true,
        composed: true
      })
    );
  }
  confirm() {
    this.dispatchEvent(new CustomEvent("confirm", { bubbles: true, composed: true }));
    this.close("confirm");
  }
  render() {
    if (!this.open)
      return E;
    return x`
      <div class="mask" @click=${this.closeByMask}>
        <section class="panel" role="dialog" aria-modal="true" aria-label=${this.title}>
          <header class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter ? E : x`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${() => this.close("cancel")}>${this.cancelText}</button>
                    <button class="confirm" type="button" @click=${this.confirm}>${this.confirmText}</button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `;
  }
};
SuModal.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: contents;
      }

      .mask {
        position: fixed;
        inset: 0;
        z-index: 999;
        background: rgba(15, 23, 42, 0.55);
        display: grid;
        place-items: center;
        padding: 20px;
      }

      .panel {
        width: min(560px, 100%);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-lg);
        box-shadow: var(--su-shadow-md);
        overflow: hidden;
      }

      .header,
      .footer {
        padding: 14px 16px;
      }

      .header {
        border-bottom: 1px solid var(--su-border-color);
        font-size: var(--su-font-size-lg);
        font-weight: 600;
      }

      .body {
        padding: 16px;
        color: var(--su-text-2);
      }

      .footer {
        border-top: 1px solid var(--su-border-color);
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      button {
        border: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-sm);
        color: var(--su-text-2);
        font-size: var(--su-font-size-md);
        padding: 6px 12px;
        cursor: pointer;
      }

      .confirm {
        border-color: var(--su-color-primary);
        background: var(--su-color-primary);
        color: var(--su-color-primary-contrast, #fff);
      }
    `
];
__decorateClass$e([
  n2({ type: Boolean, reflect: true })
], SuModal.prototype, "open", 2);
__decorateClass$e([
  n2({ type: String })
], SuModal.prototype, "title", 2);
__decorateClass$e([
  n2({ type: Boolean })
], SuModal.prototype, "maskClosable", 2);
__decorateClass$e([
  n2({ type: Boolean })
], SuModal.prototype, "hideFooter", 2);
__decorateClass$e([
  n2({ type: String })
], SuModal.prototype, "confirmText", 2);
__decorateClass$e([
  n2({ type: String })
], SuModal.prototype, "cancelText", 2);
SuModal = __decorateClass$e([
  t$2("su-modal")
], SuModal);
var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$d(target, key, result);
  return result;
};
let SuDrawer = class extends i$1 {
  constructor() {
    super(...arguments);
    this.open = false;
    this.title = "侧边面板";
    this.width = "360px";
    this.maskClosable = true;
    this.placement = "right";
    this.onKeydown = (event) => {
      if (event.key === "Escape" && this.open && this.maskClosable) {
        this.close("close");
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeydown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeydown);
  }
  willUpdate() {
    this.style.setProperty("--drawer-width", this.width);
  }
  close(source) {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("close", {
        detail: { source },
        bubbles: true,
        composed: true
      })
    );
  }
  handleMaskClick(event) {
    if (!this.maskClosable)
      return;
    if (event.target !== event.currentTarget)
      return;
    this.close("mask");
  }
  render() {
    if (!this.open)
      return E;
    return x`
      <div class="mask" @click=${this.handleMaskClick}>
        <aside class="panel" role="dialog" aria-modal="true">
          <header class="header">
            <span>${this.title}</span>
            <button @click=${() => this.close("close")}>关闭</button>
          </header>
          <div class="body"><slot></slot></div>
        </aside>
      </div>
    `;
  }
};
SuDrawer.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: contents;
      }

      .mask {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(15, 23, 42, 0.5);
      }

      .panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: var(--drawer-width, 360px);
        background: var(--su-bg-card);
        box-shadow: -8px 0 24px rgba(15, 23, 42, 0.14);
        display: flex;
        flex-direction: column;
      }

      :host([placement='left']) .panel {
        right: auto;
        left: 0;
        box-shadow: 8px 0 24px rgba(15, 23, 42, 0.14);
      }

      .header {
        padding: 14px 16px;
        border-bottom: 1px solid var(--su-border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--su-font-size-md);
        font-weight: 600;
      }

      .body {
        padding: 16px;
        overflow: auto;
      }

      button {
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--su-text-3);
      }
    `
];
__decorateClass$d([
  n2({ type: Boolean, reflect: true })
], SuDrawer.prototype, "open", 2);
__decorateClass$d([
  n2({ type: String })
], SuDrawer.prototype, "title", 2);
__decorateClass$d([
  n2({ type: String })
], SuDrawer.prototype, "width", 2);
__decorateClass$d([
  n2({ type: Boolean })
], SuDrawer.prototype, "maskClosable", 2);
__decorateClass$d([
  n2({ type: String, reflect: true })
], SuDrawer.prototype, "placement", 2);
SuDrawer = __decorateClass$d([
  t$2("su-drawer")
], SuDrawer);
var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$c(target, key, result);
  return result;
};
const ICONS$1 = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕"
};
let SuAlert = class extends i$1 {
  constructor() {
    super(...arguments);
    this.type = "info";
    this.header = "";
    this.closable = false;
    this.showIcon = true;
    this.closed = false;
  }
  handleClose() {
    this.closed = true;
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }
  render() {
    if (this.closed)
      return E;
    return x`
      <div class="alert ${this.type}" role="alert">
        ${this.showIcon ? x`<span class="icon">${ICONS$1[this.type]}</span>` : E}
        <div class="main">
          ${this.header ? x`<div class="header">${this.header}</div>` : E}
          <div class="content"><slot></slot></div>
        </div>
        ${this.closable ? x`<button class="close" type="button" aria-label="关闭" @click=${this.handleClose}>✕</button>` : E}
      </div>
    `;
  }
};
SuAlert.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .alert {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        border: 1px solid transparent;
        border-radius: var(--su-radius-sm);
        padding: 10px 12px;
        font-size: var(--su-font-size-sm);
      }

      .alert.info {
        color: var(--su-color-info);
        background: rgba(var(--su-color-info-rgb), 0.08);
        border-color: rgba(var(--su-color-info-rgb), 0.3);
      }

      .alert.success {
        color: var(--su-color-success);
        background: rgba(var(--su-color-success-rgb), 0.08);
        border-color: rgba(var(--su-color-success-rgb), 0.3);
      }

      .alert.warning {
        color: var(--su-color-warning);
        background: rgba(var(--su-color-warning-rgb), 0.1);
        border-color: rgba(var(--su-color-warning-rgb), 0.3);
      }

      .alert.error {
        color: var(--su-color-error);
        background: rgba(var(--su-color-error-rgb), 0.08);
        border-color: rgba(var(--su-color-error-rgb), 0.3);
      }

      .icon {
        flex: none;
        line-height: 1.5;
      }

      .main {
        flex: 1;
        min-width: 0;
      }

      .header {
        font-weight: 600;
        margin-bottom: 2px;
      }

      .content {
        color: var(--su-text-2);
      }

      .close {
        flex: none;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--su-text-3);
        padding: 0;
        line-height: 1.5;
      }

      .close:hover {
        color: var(--su-text-1);
      }
    `
];
__decorateClass$c([
  n2({ type: String })
], SuAlert.prototype, "type", 2);
__decorateClass$c([
  n2({ type: String })
], SuAlert.prototype, "header", 2);
__decorateClass$c([
  n2({ type: Boolean })
], SuAlert.prototype, "closable", 2);
__decorateClass$c([
  n2({ type: Boolean })
], SuAlert.prototype, "showIcon", 2);
__decorateClass$c([
  r$1()
], SuAlert.prototype, "closed", 2);
SuAlert = __decorateClass$c([
  t$2("su-alert")
], SuAlert);
var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$b(target, key, result);
  return result;
};
const ICONS = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕"
};
let SuMessage = class extends i$1 {
  constructor() {
    super(...arguments);
    this.type = "info";
    this.duration = 3e3;
  }
  firstUpdated() {
    if (this.duration > 0) {
      setTimeout(() => this.dismiss(), this.duration);
    }
  }
  dismiss() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    this.remove();
  }
  render() {
    return x`
      <div class="message" role="status">
        <span class="icon ${this.type}">${ICONS[this.type]}</span>
        <slot></slot>
      </div>
    `;
  }
};
SuMessage.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .message {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        box-shadow: var(--su-shadow-md);
        padding: 9px 14px;
        font-size: var(--su-font-size-sm);
        color: var(--su-text-1);
        animation: slide-in 0.2s ease;
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .icon.info {
        color: var(--su-color-info);
      }

      .icon.success {
        color: var(--su-color-success);
      }

      .icon.warning {
        color: var(--su-color-warning);
      }

      .icon.error {
        color: var(--su-color-error);
      }
    `
];
__decorateClass$b([
  n2({ type: String })
], SuMessage.prototype, "type", 2);
__decorateClass$b([
  n2({ type: Number })
], SuMessage.prototype, "duration", 2);
SuMessage = __decorateClass$b([
  t$2("su-message")
], SuMessage);
let container = null;
function ensureContainer() {
  if (container && container.isConnected)
    return container;
  container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2000",
    display: "grid",
    gap: "8px",
    justifyItems: "center",
    pointerEvents: "none"
  });
  document.body.appendChild(container);
  return container;
}
function message(content, options = {}) {
  const el = document.createElement("su-message");
  el.type = options.type ?? "info";
  el.duration = options.duration ?? 3e3;
  el.textContent = content;
  el.style.pointerEvents = "auto";
  ensureContainer().appendChild(el);
  return el;
}
message.info = (content, duration) => message(content, { type: "info", duration });
message.success = (content, duration) => message(content, { type: "success", duration });
message.warning = (content, duration) => message(content, { type: "warning", duration });
message.error = (content, duration) => message(content, { type: "error", duration });
var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$a(target, key, result);
  return result;
};
let SuTooltip = class extends i$1 {
  constructor() {
    super(...arguments);
    this.content = "";
    this.placement = "top";
  }
  render() {
    return x`
      <slot></slot>
      <div class="bubble" role="tooltip">${this.content}</div>
    `;
  }
};
SuTooltip.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-block;
        position: relative;
      }

      .bubble {
        position: absolute;
        z-index: 1100;
        max-width: 260px;
        width: max-content;
        background: rgba(17, 24, 39, 0.92);
        color: #fff;
        font-size: var(--su-font-size-xs);
        line-height: 1.5;
        padding: 6px 10px;
        border-radius: var(--su-radius-sm);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.15s ease;
        pointer-events: none;
      }

      :host(:hover) .bubble,
      :host(:focus-within) .bubble {
        opacity: 1;
        visibility: visible;
      }

      :host([placement='top']) .bubble {
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='bottom']) .bubble {
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([placement='left']) .bubble {
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }

      :host([placement='right']) .bubble {
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }
    `
];
__decorateClass$a([
  n2({ type: String })
], SuTooltip.prototype, "content", 2);
__decorateClass$a([
  n2({ type: String, reflect: true })
], SuTooltip.prototype, "placement", 2);
SuTooltip = __decorateClass$a([
  t$2("su-tooltip")
], SuTooltip);
var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$9(target, key, result);
  return result;
};
let SuSpin = class extends i$1 {
  constructor() {
    super(...arguments);
    this.spinning = true;
    this.size = "medium";
    this.tip = "";
  }
  renderIndicator() {
    return x`
      <div class="indicator" role="status" aria-label=${this.tip || "加载中"}>
        <span class="spinner ${this.size}"></span>
        ${this.tip ? x`<span class="tip">${this.tip}</span>` : E}
      </div>
    `;
  }
  render() {
    const hasContent = this.childNodes.length > 0;
    if (!hasContent) {
      return this.spinning ? this.renderIndicator() : E;
    }
    return x`
      <slot></slot>
      ${this.spinning ? x`<div class="overlay">${this.renderIndicator()}</div>` : E}
    `;
  }
};
SuSpin.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
        position: relative;
      }

      .indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;
      }

      .overlay {
        position: absolute;
        inset: 0;
        z-index: 10;
        background: var(--su-overlay);
        display: flex;
      }

      .overlay .indicator {
        margin: auto;
      }

      .spinner {
        border-radius: 50%;
        border: 2px solid rgba(var(--su-color-primary-rgb), 0.25);
        border-top-color: var(--su-color-primary);
        animation: rotate 0.8s linear infinite;
      }

      .spinner.small {
        width: 16px;
        height: 16px;
      }

      .spinner.medium {
        width: 24px;
        height: 24px;
      }

      .spinner.large {
        width: 34px;
        height: 34px;
        border-width: 3px;
      }

      .tip {
        color: var(--su-color-primary);
        font-size: var(--su-font-size-sm);
      }

      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    `
];
__decorateClass$9([
  n2({ type: Boolean })
], SuSpin.prototype, "spinning", 2);
__decorateClass$9([
  n2({ type: String })
], SuSpin.prototype, "size", 2);
__decorateClass$9([
  n2({ type: String })
], SuSpin.prototype, "tip", 2);
SuSpin = __decorateClass$9([
  t$2("su-spin")
], SuSpin);
var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$8(target, key, result);
  return result;
};
let SuProgress = class extends i$1 {
  constructor() {
    super(...arguments);
    this.percent = 0;
    this.status = "normal";
    this.showText = true;
    this.strokeHeight = "8px";
  }
  willUpdate() {
    this.style.setProperty("--stroke-height", this.strokeHeight);
  }
  get clampedPercent() {
    return Math.min(100, Math.max(0, this.percent));
  }
  render() {
    const percent = this.clampedPercent;
    return x`
      <div class="progress" role="progressbar" aria-valuenow=${percent} aria-valuemin="0" aria-valuemax="100">
        <div class="track">
          <div class="bar ${this.status}" style="width: ${percent}%"></div>
        </div>
        ${this.showText ? x`<span class="text">${percent}%</span>` : E}
      </div>
    `;
  }
};
SuProgress.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .progress {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .track {
        flex: 1;
        height: var(--stroke-height, 8px);
        border-radius: 999px;
        background: var(--su-bg-muted);
        overflow: hidden;
      }

      .bar {
        height: 100%;
        border-radius: 999px;
        background: var(--su-color-primary);
        transition: width 0.3s ease;
      }

      .bar.success {
        background: var(--su-color-success);
      }

      .bar.error {
        background: var(--su-color-error);
      }

      .text {
        flex: none;
        min-width: 40px;
        text-align: right;
        font-size: var(--su-font-size-xs);
        color: var(--su-text-2);
      }
    `
];
__decorateClass$8([
  n2({ type: Number })
], SuProgress.prototype, "percent", 2);
__decorateClass$8([
  n2({ type: String })
], SuProgress.prototype, "status", 2);
__decorateClass$8([
  n2({ type: Boolean })
], SuProgress.prototype, "showText", 2);
__decorateClass$8([
  n2({ type: String })
], SuProgress.prototype, "strokeHeight", 2);
SuProgress = __decorateClass$8([
  t$2("su-progress")
], SuProgress);
var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$7(target, key, result);
  return result;
};
let SuMenu = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.activeKey = "";
    this.collapsed = false;
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  onSelect(item) {
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: item,
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <nav class="menu" aria-label="menu">
        ${this.mergedItems.map(
      (item) => x`
            <button
              type="button"
              class="item ${item.key === this.activeKey ? "active" : ""}"
              @click=${() => this.onSelect(item)}>
              <span class="icon">${item.icon ?? ""}</span>
              ${this.collapsed ? "" : x`<span>${item.label}</span>`}
            </button>
          `
    )}
      </nav>
    `;
  }
};
SuMenu.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .menu {
        display: grid;
        gap: 6px;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        border: none;
        border-radius: var(--su-radius-sm);
        background: transparent;
        color: var(--su-text-2);
        padding: 9px 10px;
        cursor: pointer;
        text-align: left;
        width: 100%;
      }

      .item:hover {
        background: rgba(var(--su-color-primary-rgb), 0.08);
        color: var(--su-color-primary-hover);
      }

      .item.active {
        background: rgba(var(--su-color-primary-rgb), 0.14);
        color: var(--su-color-primary);
        font-weight: 600;
      }

      .icon {
        width: 16px;
        text-align: center;
      }
    `
];
__decorateClass$7([
  n2({ type: Array, attribute: false })
], SuMenu.prototype, "items", 2);
__decorateClass$7([
  n2({ type: String })
], SuMenu.prototype, "itemsJson", 2);
__decorateClass$7([
  n2({ type: String })
], SuMenu.prototype, "activeKey", 2);
__decorateClass$7([
  n2({ type: Boolean })
], SuMenu.prototype, "collapsed", 2);
SuMenu = __decorateClass$7([
  t$2("su-menu")
], SuMenu);
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$6(target, key, result);
  return result;
};
let SuBreadcrumb = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.separator = "/";
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  handleClick(item, index) {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { item, index },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const list = this.mergedItems;
    return x`
      <nav>
        ${list.map((item, index) => {
      const isLast = index === list.length - 1;
      return x`
            <button class=${isLast ? "current" : ""} @click=${() => this.handleClick(item, index)}>
              ${item.label}
            </button>
            ${isLast ? "" : x`<span class="sep">${this.separator}</span>`}
          `;
    })}
      </nav>
    `;
  }
};
SuBreadcrumb.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      nav {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: var(--su-font-size-sm);
      }

      button {
        border: none;
        background: transparent;
        color: var(--su-text-3);
        cursor: pointer;
        padding: 0;
      }

      button:hover {
        color: var(--su-color-primary);
      }

      .current {
        color: var(--su-text-1);
        font-weight: 500;
      }

      .sep {
        color: #9ca3af;
      }
    `
];
__decorateClass$6([
  n2({ type: Array, attribute: false })
], SuBreadcrumb.prototype, "items", 2);
__decorateClass$6([
  n2({ type: String })
], SuBreadcrumb.prototype, "itemsJson", 2);
__decorateClass$6([
  n2({ type: String })
], SuBreadcrumb.prototype, "separator", 2);
SuBreadcrumb = __decorateClass$6([
  t$2("su-breadcrumb")
], SuBreadcrumb);
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
let SuTabs = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.activeKey = "";
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  get currentKey() {
    var _a2;
    return this.activeKey || ((_a2 = this.mergedItems[0]) == null ? void 0 : _a2.key) || "";
  }
  onSelect(item) {
    if (item.disabled || item.key === this.currentKey)
      return;
    this.activeKey = item.key;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const current = this.currentKey;
    return x`
      <div class="nav" role="tablist">
        ${this.mergedItems.map(
      (item) => x`
            <button
              type="button"
              role="tab"
              aria-selected=${item.key === current ? "true" : "false"}
              class="tab ${item.key === current ? "active" : ""}"
              ?disabled=${Boolean(item.disabled)}
              @click=${() => this.onSelect(item)}>
              ${item.label}
            </button>
          `
    )}
      </div>
      <div class="panel" role="tabpanel">
        <slot name=${current}></slot>
        <slot></slot>
      </div>
    `;
  }
};
SuTabs.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .nav {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--su-border-color);
      }

      .tab {
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 10px 14px;
        font-size: var(--su-font-size-md);
        color: var(--su-text-2);
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .tab:hover:not(:disabled) {
        color: var(--su-color-primary);
      }

      .tab.active {
        color: var(--su-color-primary);
        border-bottom-color: var(--su-color-primary);
        font-weight: 600;
      }

      .tab:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .panel {
        padding: 14px 0;
      }
    `
];
__decorateClass$5([
  n2({ type: Array, attribute: false })
], SuTabs.prototype, "items", 2);
__decorateClass$5([
  n2({ type: String })
], SuTabs.prototype, "itemsJson", 2);
__decorateClass$5([
  n2({ type: String })
], SuTabs.prototype, "activeKey", 2);
SuTabs = __decorateClass$5([
  t$2("su-tabs")
], SuTabs);
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
let SuDropdown = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.open = false;
    this.onDocumentClick = (event) => {
      if (!this.open)
        return;
      if (event.composedPath().includes(this))
        return;
      this.open = false;
    };
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.onDocumentClick);
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  toggle() {
    this.open = !this.open;
  }
  onSelect(item) {
    if (item.disabled)
      return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
      <div class="trigger" @click=${this.toggle}>
        <slot></slot>
      </div>
      ${this.open ? x`
            <div class="menu" role="menu">
              ${this.mergedItems.map(
      (item) => x`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${item.danger ? "danger" : ""}"
                    ?disabled=${Boolean(item.disabled)}
                    @click=${() => this.onSelect(item)}>
                    ${item.label}
                  </button>
                `
    )}
            </div>
          ` : E}
    `;
  }
};
SuDropdown.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: inline-block;
        position: relative;
      }

      .trigger {
        cursor: pointer;
      }

      .menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        z-index: 1050;
        min-width: 140px;
        background: var(--su-bg-card);
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        box-shadow: var(--su-shadow-md);
        padding: 4px;
        display: grid;
      }

      .item {
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        padding: 8px 10px;
        border-radius: 4px;
        font-size: var(--su-font-size-sm);
        color: var(--su-text-2);
      }

      .item:hover:not(:disabled) {
        background: var(--su-bg-hover);
        color: var(--su-text-1);
      }

      .item.danger {
        color: var(--su-color-error);
      }

      .item.danger:hover:not(:disabled) {
        background: rgba(var(--su-color-error-rgb), 0.08);
        color: var(--su-color-error);
      }

      .item:disabled {
        color: var(--su-text-3);
        cursor: not-allowed;
        opacity: 0.6;
      }
    `
];
__decorateClass$4([
  n2({ type: Array, attribute: false })
], SuDropdown.prototype, "items", 2);
__decorateClass$4([
  n2({ type: String })
], SuDropdown.prototype, "itemsJson", 2);
__decorateClass$4([
  r$1()
], SuDropdown.prototype, "open", 2);
SuDropdown = __decorateClass$4([
  t$2("su-dropdown")
], SuDropdown);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
let SuSteps = class extends i$1 {
  constructor() {
    super(...arguments);
    this.items = [];
    this.itemsJson = "";
    this.current = 0;
  }
  get mergedItems() {
    if (this.items.length > 0)
      return this.items;
    return parseJsonArray(this.itemsJson, []);
  }
  render() {
    const list = this.mergedItems;
    return x`
      <div class="steps">
        ${list.map((item, index) => {
      const state = index < this.current ? "finished" : index === this.current ? "active" : "";
      return x`
            <div class="step ${state}">
              <span class="indicator">${index < this.current ? "✓" : index + 1}</span>
              <div class="content">
                <div class="title">${item.title}</div>
                ${item.description ? x`<div class="description">${item.description}</div>` : E}
              </div>
              ${index < list.length - 1 ? x`<span class="connector"></span>` : E}
            </div>
          `;
    })}
      </div>
    `;
  }
};
SuSteps.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      .steps {
        display: flex;
        gap: 12px;
      }

      .step {
        flex: 1;
        display: flex;
        gap: 10px;
        min-width: 0;
      }

      .indicator {
        flex: none;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: var(--su-font-size-sm);
        border: 1px solid var(--su-border-color);
        color: var(--su-text-3);
        background: var(--su-bg-card);
      }

      .step.finished .indicator {
        border-color: var(--su-color-primary);
        color: var(--su-color-primary);
        background: rgba(var(--su-color-primary-rgb), 0.1);
      }

      .step.active .indicator {
        border-color: var(--su-color-primary);
        background: var(--su-color-primary);
        color: var(--su-color-primary-contrast, #fff);
      }

      .content {
        min-width: 0;
        padding-top: 3px;
      }

      .title {
        font-size: var(--su-font-size-sm);
        font-weight: 600;
        color: var(--su-text-3);
      }

      .step.active .title,
      .step.finished .title {
        color: var(--su-text-1);
      }

      .description {
        margin-top: 2px;
        font-size: var(--su-font-size-xs);
        color: var(--su-text-3);
      }

      .connector {
        flex: 1;
        height: 1px;
        margin-top: 13px;
        background: var(--su-border-color);
      }

      .step.finished .connector {
        background: var(--su-color-primary);
      }
    `
];
__decorateClass$3([
  n2({ type: Array, attribute: false })
], SuSteps.prototype, "items", 2);
__decorateClass$3([
  n2({ type: String })
], SuSteps.prototype, "itemsJson", 2);
__decorateClass$3([
  n2({ type: Number })
], SuSteps.prototype, "current", 2);
SuSteps = __decorateClass$3([
  t$2("su-steps")
], SuSteps);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
let SuContainer = class extends i$1 {
  constructor() {
    super(...arguments);
    this.siderWidth = "220px";
    this.headerHeight = "56px";
  }
  willUpdate() {
    this.style.setProperty("--sider-width", this.siderWidth);
    this.style.setProperty("--header-height", this.headerHeight);
  }
  render() {
    return x`
      <div class="layout">
        <aside class="sider"><slot name="sider"></slot></aside>
        <header class="header"><slot name="header"></slot></header>
        <main class="content"><slot></slot></main>
      </div>
    `;
  }
};
SuContainer.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--su-bg-page);
      }

      .layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: var(--sider-width, 220px) 1fr;
        grid-template-rows: var(--header-height, 56px) 1fr;
        grid-template-areas:
          'sider header'
          'sider content';
      }

      .sider {
        grid-area: sider;
        border-right: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        padding: 12px;
      }

      .header {
        grid-area: header;
        border-bottom: 1px solid var(--su-border-color);
        background: var(--su-bg-card);
        display: flex;
        align-items: center;
        padding: 0 16px;
      }

      .content {
        grid-area: content;
        padding: 16px;
      }

      @media (max-width: 960px) {
        .layout {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto 1fr;
          grid-template-areas:
            'header'
            'sider'
            'content';
        }

        .sider {
          border-right: none;
          border-bottom: 1px solid var(--su-border-color);
        }
      }
    `
];
__decorateClass$2([
  n2({ type: String })
], SuContainer.prototype, "siderWidth", 2);
__decorateClass$2([
  n2({ type: String })
], SuContainer.prototype, "headerHeight", 2);
SuContainer = __decorateClass$2([
  t$2("su-container")
], SuContainer);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
let SuDivider = class extends i$1 {
  constructor() {
    super(...arguments);
    this.direction = "horizontal";
    this.dashed = false;
  }
  render() {
    if (this.direction === "vertical") {
      return x``;
    }
    const hasText = this.childNodes.length > 0;
    return x`
      <div class="divider ${hasText ? "" : "plain"}" role="separator">
        <slot></slot>
      </div>
    `;
  }
};
SuDivider.styles = [
  baseControlStyles,
  i$4`
      :host {
        display: block;
      }

      :host([direction='vertical']) {
        display: inline-block;
        height: 1em;
        vertical-align: middle;
        margin: 0 10px;
        border-left: 1px solid var(--su-border-color);
      }

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 16px 0;
        color: var(--su-text-3);
        font-size: var(--su-font-size-sm);
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        border-top: 1px solid var(--su-border-color);
      }

      :host([dashed]) .divider::before,
      :host([dashed]) .divider::after {
        border-top-style: dashed;
      }

      /* 无文字时两条线合并为一条 */
      .divider.plain {
        gap: 0;
      }
    `
];
__decorateClass$1([
  n2({ type: String, reflect: true })
], SuDivider.prototype, "direction", 2);
__decorateClass$1([
  n2({ type: Boolean, reflect: true })
], SuDivider.prototype, "dashed", 2);
SuDivider = __decorateClass$1([
  t$2("su-divider")
], SuDivider);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i3 = decorators.length - 1, decorator; i3 >= 0; i3--)
    if (decorator = decorators[i3])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
let SuThemeToggle = class extends i$1 {
  constructor() {
    super(...arguments);
    this.mode = "light";
    this.onThemeChange = () => {
      this.mode = getThemeMode();
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.mode = getThemeMode();
    window.addEventListener("su-theme-change", this.onThemeChange);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("su-theme-change", this.onThemeChange);
  }
  handleClick() {
    this.mode = toggleThemeMode();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { mode: this.mode },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const isDark = this.mode === "dark";
    return x`
      <button
        type="button"
        aria-label=${isDark ? "切换到亮色主题" : "切换到暗色主题"}
        title=${isDark ? "切换到亮色主题" : "切换到暗色主题"}
        @click=${this.handleClick}>
        ${isDark ? "🌙" : "☀️"}
      </button>
    `;
  }
};
SuThemeToggle.styles = [
  baseControlStyles,
  focusRingStyles,
  i$4`
      :host {
        display: inline-flex;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid var(--su-border-color);
        border-radius: 50%;
        background: var(--su-bg-card);
        color: var(--su-text-2);
        font-size: 16px;
        cursor: pointer;
        transition: border-color 0.15s ease, color 0.15s ease;
      }

      button:hover {
        border-color: var(--su-color-primary);
        color: var(--su-color-primary);
      }
    `
];
__decorateClass([
  r$1()
], SuThemeToggle.prototype, "mode", 2);
SuThemeToggle = __decorateClass([
  t$2("su-theme-toggle")
], SuThemeToggle);
initTheme();
export {
  LineComponent,
  SeAssetViewer,
  SeInput,
  SePagination,
  SuAlert,
  SuAvatar,
  SuBadge,
  SuBreadcrumb,
  SuButton,
  SuCard,
  SuCheckbox,
  SuContainer,
  SuDescriptions,
  SuDivider,
  SuDrawer,
  SuDropdown,
  SuEmpty,
  SuFormItem,
  SuInputNumber,
  SuMenu,
  SuMessage,
  SuModal,
  SuProgress,
  SuRadioGroup,
  SuSelect,
  SuSkeleton,
  SuSpin,
  SuStatCard,
  SuSteps,
  SuSwitch,
  SuTabs,
  SuTag,
  SuTextarea,
  SuThemeToggle,
  SuTooltip,
  getThemeMode,
  initTheme,
  message,
  resetThemeColors,
  seImage,
  seTable,
  setThemeColors,
  setThemeMode,
  toggleThemeMode
};
//# sourceMappingURL=index.js.map
