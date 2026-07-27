!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).SilenceUi={})}(this,function(t){var e;const r="su-theme-mode",o="su-theme-colors",s="su-theme-dark",i="data-su-theme",a={primary:"--su-color-primary",primaryHover:"--su-color-primary-hover",success:"--su-color-success",warning:"--su-color-warning",error:"--su-color-error",info:"--su-color-info"};function n(t){let e=t.trim().replace(/^#/,"");if(3===e.length&&(e=e.split("").map(t=>t+t).join("")),!/^[0-9a-fA-F]{6}$/.test(e))return null;const r=parseInt(e,16);return[r>>16&255,r>>8&255,255&r]}function l(){window.dispatchEvent(new CustomEvent("su-theme-change",{detail:{mode:c(),colors:d()}}))}function d(){try{return JSON.parse(localStorage.getItem(o)??"{}")}catch{return{}}}function c(){return"dark"===document.documentElement.getAttribute(i)?"dark":"light"}function p(t){const e=document.documentElement;e.setAttribute(i,t),e.classList.toggle(s,"dark"===t);try{localStorage.setItem(r,t)}catch{}l()}function u(){const t="dark"===c()?"light":"dark";return p(t),t}function h(t){const e=document.documentElement;Object.keys(a).forEach(r=>{const o=t[r];if(!o)return;if(e.style.setProperty(a[r],o),"primaryHover"===r)return;const s=n(o);s&&e.style.setProperty(`${a[r]}-rgb`,s.join(", ")),e.style.setProperty(`${a[r]}-contrast`,function(t){const e=n(t);if(!e)return"#ffffff";const[r,o,s]=e;return(299*r+587*o+114*s)/1e3>=150?"#111827":"#ffffff"}(o))}),t.primary&&!t.primaryHover&&e.style.setProperty("--su-color-primary-hover",function(t,e){const r=n(t);if(!r)return t;const[o,s,i]=r.map(t=>Math.max(0,Math.round(t*(1-e))));return`#${[o,s,i].map(t=>t.toString(16).padStart(2,"0")).join("")}`}(t.primary,.15))}function g(){if("undefined"==typeof window)return;let t=null;try{t=localStorage.getItem(r)}catch{}if("dark"===t||"light"===t){const e=document.documentElement;e.setAttribute(i,t),e.classList.toggle(s,"dark"===t)}const e=d();Object.keys(e).length>0&&h(e)}
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const b=globalThis,v=b.ShadowRoot&&(void 0===b.ShadyCSS||b.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,y=Symbol(),m=new WeakMap;let f=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(v&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=m.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&m.set(e,t))}return t}toString(){return this.cssText}};const x=(t,...e)=>{const r=1===t.length?t[0]:e.reduce((e,r,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[o+1],t[0]);return new f(r,t,y)},w=v?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new f("string"==typeof t?t:t+"",void 0,y))(e)})(t):t,{is:S,defineProperty:$,getOwnPropertyDescriptor:k,getOwnPropertyNames:P,getOwnPropertySymbols:C,getPrototypeOf:_}=Object,A=globalThis,z=A.trustedTypes,E=z?z.emptyScript:"",T=A.reactiveElementPolyfillSupport,O=(t,e)=>t,M={toAttribute(t,e){switch(e){case Boolean:t=t?E:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(o){r=null}}return r}},D=(t,e)=>!S(t,e),j={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:D};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */Symbol.metadata??(Symbol.metadata=Symbol("metadata")),A.litPropertyMetadata??(A.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=j){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(t,r,e);void 0!==o&&$(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){const{get:o,set:s}=k(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const i=null==o?void 0:o.call(this);null==s||s.call(this,e),this.requestUpdate(t,i,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??j}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){const t=this.properties,e=[...P(t),...C(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const t=this._$Eu(e,r);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(w(t))}else void 0!==t&&e.push(w(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),null==(t=this.constructor.l)||t.forEach(t=>t(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),void 0!==this.renderRoot&&this.isConnected&&(null==(e=t.hostConnected)||e.call(t))}removeController(t){var e;null==(e=this._$EO)||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(v)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const r of e){const e=document.createElement("style"),o=b.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=r.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostConnected)?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostDisconnected)?void 0:e.call(t)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var r;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(void 0!==s&&!0===o.reflect){const i=(void 0!==(null==(r=o.converter)?void 0:r.toAttribute)?o.converter:M).toAttribute(e,o.type);this._$Em=t,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){var r,o;const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null==(r=t.converter)?void 0:r.fromAttribute)?t.converter:M;this._$Em=i,this[i]=a.fromAttribute(e,t.type)??(null==(o=this._$Ej)?void 0:o.get(i))??null,this._$Em=null}}requestUpdate(t,e,r){var o;if(void 0!==t){const s=this.constructor,i=this[t];if(r??(r=s.getPropertyOptions(t)),!((r.hasChanged??D)(i,e)||r.useDefault&&r.reflect&&i===(null==(o=this._$Ej)?void 0:o.get(t))&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:o,wrapped:s},i){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,i??e??this[t]),!0!==s||void 0!==i)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,r,o)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostUpdate)?void 0:e.call(t)}),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;null==(e=this._$EO)||e.forEach(t=>{var e;return null==(e=t.hostUpdated)?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[O("elementProperties")]=new Map,B[O("finalized")]=new Map,null==T||T({ReactiveElement:B}),(A.reactiveElementVersions??(A.reactiveElementVersions=[])).push("2.1.0");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const I=globalThis,N=I.trustedTypes,H=N?N.createPolicy("lit-html",{createHTML:t=>t}):void 0,R="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,V="?"+U,L=`<${V}>`,K=document,J=()=>K.createComment(""),q=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,Y=t=>F(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),X="[ \t\n\f\r]",W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,G=/>/g,Q=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),tt=/'/g,et=/"/g,rt=/^(?:script|style|textarea|title)$/i,ot=(lt=1,(t,...e)=>({_$litType$:lt,strings:t,values:e})),st=Symbol.for("lit-noChange"),it=Symbol.for("lit-nothing"),at=new WeakMap,nt=K.createTreeWalker(K,129);var lt;function dt(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==H?H.createHTML(e):e}const ct=(t,e)=>{const r=t.length-1,o=[];let s,i=2===e?"<svg>":3===e?"<math>":"",a=W;for(let n=0;n<r;n++){const e=t[n];let r,l,d=-1,c=0;for(;c<e.length&&(a.lastIndex=c,l=a.exec(e),null!==l);)c=a.lastIndex,a===W?"!--"===l[1]?a=Z:void 0!==l[1]?a=G:void 0!==l[2]?(rt.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=Q):void 0!==l[3]&&(a=Q):a===Q?">"===l[0]?(a=s??W,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?Q:'"'===l[3]?et:tt):a===et||a===tt?a=Q:a===Z||a===G?a=W:(a=Q,s=void 0);const p=a===Q&&t[n+1].startsWith("/>")?" ":"";i+=a===W?e+L:d>=0?(o.push(r),e.slice(0,d)+R+e.slice(d)+U+p):e+U+(-2===d?n:p)}return[dt(t,i+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class pt{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let s=0,i=0;const a=t.length-1,n=this.parts,[l,d]=ct(t,e);if(this.el=pt.createElement(l,r),nt.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=nt.nextNode())&&n.length<a;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(R)){const e=d[i++],r=o.getAttribute(t).split(U),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:s,name:a[2],strings:r,ctor:"."===a[1]?vt:"?"===a[1]?yt:"@"===a[1]?mt:bt}),o.removeAttribute(t)}else t.startsWith(U)&&(n.push({type:6,index:s}),o.removeAttribute(t));if(rt.test(o.tagName)){const t=o.textContent.split(U),e=t.length-1;if(e>0){o.textContent=N?N.emptyScript:"";for(let r=0;r<e;r++)o.append(t[r],J()),nt.nextNode(),n.push({type:2,index:++s});o.append(t[e],J())}}}else if(8===o.nodeType)if(o.data===V)n.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(U,t+1));)n.push({type:7,index:s}),t+=U.length-1}s++}}static createElement(t,e){const r=K.createElement("template");return r.innerHTML=t,r}}function ut(t,e,r=t,o){var s,i;if(e===st)return e;let a=void 0!==o?null==(s=r._$Co)?void 0:s[o]:r._$Cl;const n=q(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==n&&(null==(i=null==a?void 0:a._$AO)||i.call(a,!1),void 0===n?a=void 0:(a=new n(t),a._$AT(t,r,o)),void 0!==o?(r._$Co??(r._$Co=[]))[o]=a:r._$Cl=a),void 0!==a&&(e=ut(t,a._$AS(t,e.values),a,o)),e}let ht=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,o=((null==t?void 0:t.creationScope)??K).importNode(e,!0);nt.currentNode=o;let s=nt.nextNode(),i=0,a=0,n=r[0];for(;void 0!==n;){if(i===n.index){let e;2===n.type?e=new gt(s,s.nextSibling,this,t):1===n.type?e=new n.ctor(s,n.name,n.strings,this,t):6===n.type&&(e=new ft(s,this,t)),this._$AV.push(e),n=r[++a]}i!==(null==n?void 0:n.index)&&(s=nt.nextNode(),i++)}return nt.currentNode=K,o}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}};class gt{get _$AU(){var t;return(null==(t=this._$AM)?void 0:t._$AU)??this._$Cv}constructor(t,e,r,o){this.type=2,this._$AH=it,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cv=(null==o?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ut(this,t,e),q(t)?t===it||null==t||""===t?(this._$AH!==it&&this._$AR(),this._$AH=it):t!==this._$AH&&t!==st&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):Y(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==it&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=pt.createElement(dt(o.h,o.h[0]),this.options)),o);if((null==(e=this._$AH)?void 0:e._$AD)===s)this._$AH.p(r);else{const t=new ht(s,this),e=t.u(this.options);t.p(r),this.T(e),this._$AH=t}}_$AC(t){let e=at.get(t.strings);return void 0===e&&at.set(t.strings,e=new pt(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const s of t)o===e.length?e.push(r=new gt(this.O(J()),this.O(J()),this,this.options)):r=e[o],r._$AI(s),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var r;for(null==(r=this._$AP)||r.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cv=t,null==(e=this._$AP)||e.call(this,t))}}class bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,o,s){this.type=1,this._$AH=it,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=it}_$AI(t,e=this,r,o){const s=this.strings;let i=!1;if(void 0===s)t=ut(this,t,e,0),i=!q(t)||t!==this._$AH&&t!==st,i&&(this._$AH=t);else{const o=t;let a,n;for(t=s[0],a=0;a<s.length-1;a++)n=ut(this,o[r+a],e,a),n===st&&(n=this._$AH[a]),i||(i=!q(n)||n!==this._$AH[a]),n===it?t=it:t!==it&&(t+=(n??"")+s[a+1]),this._$AH[a]=n}i&&!o&&this.j(t)}j(t){t===it?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class vt extends bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===it?void 0:t}}class yt extends bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==it)}}class mt extends bt{constructor(t,e,r,o,s){super(t,e,r,o,s),this.type=5}_$AI(t,e=this){if((t=ut(this,t,e,0)??it)===st)return;const r=this._$AH,o=t===it&&r!==it||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==it&&(r===it||o);o&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;"function"==typeof this._$AH?this._$AH.call((null==(e=this.options)?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ft{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ut(this,t)}}const xt={M:R,P:U,A:V,C:1,L:ct,R:ht,D:Y,V:ut,I:gt,H:bt,N:yt,U:mt,B:vt,F:ft},wt=I.litHtmlPolyfillSupport;null==wt||wt(pt,gt),(I.litHtmlVersions??(I.litHtmlVersions=[])).push("3.3.0");const St=globalThis;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */let $t=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const o=(null==r?void 0:r.renderBefore)??e;let s=o._$litPart$;if(void 0===s){const t=(null==r?void 0:r.renderBefore)??null;o._$litPart$=s=new gt(e.insertBefore(J(),t),t,void 0,r??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null==(t=this._$Do)||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null==(t=this._$Do)||t.setConnected(!1)}render(){return st}};$t._$litElement$=!0,$t.finalized=!0,null==(e=St.litElementHydrateSupport)||e.call(St,{LitElement:$t});const kt=St.litElementPolyfillSupport;null==kt||kt({LitElement:$t}),(St.litElementVersions??(St.litElementVersions=[])).push("4.2.0");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const Pt=t=>(e,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},Ct={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:D},_t=(t=Ct,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(void 0===i&&globalThis.litPropertyMetadata.set(s,i=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),"accessor"===o){const{name:o}=r;return{set(r){const s=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,s,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=r;return function(r){const s=this[o];e.call(this,r),this.requestUpdate(o,s,t)}}throw Error("Unsupported decorator location: "+o)};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */function At(t){return(e,r)=>"object"==typeof r?_t(t,e,r):((t,e,r)=>{const o=e.hasOwnProperty(r);return e.constructor.createProperty(r,t),o?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */function zt(t){return At({...t,state:!0,attribute:!1})}const Et=x`
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
`,Tt=x`
  :focus-visible {
    outline: 2px solid var(--su-color-primary);
    outline-offset: 1px;
  }
`,Ot=[Tt,x`
    :host {
      display: inline-block;
      --su-button-min-width: 72px;
      --su-button-min-height: 36px;
      --su-button-font-size: var(--su-font-size-md);
      --su-button-padding-x: 14px;
      min-width: var(--su-button-min-width);
      min-height: var(--su-button-min-height);
      border-radius: var(--su-radius-sm);
      box-sizing: border-box;
      vertical-align: middle;
    }

    button {
      all: unset;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-height: var(--su-button-min-height);
      padding: 0 var(--su-button-padding-x);
      gap: 6px;
      border-radius: inherit;
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        opacity 0.2s ease;
      font-size: var(--su-button-font-size);
      font-weight: 500;
      line-height: 1;
      user-select: none;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    :host([loading]) button:disabled {
      cursor: wait;
      opacity: 0.85;
    }

    .spinner {
      width: 14px;
      height: 14px;
      flex: none;
      border: 2px solid currentcolor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: su-spin 0.8s linear infinite;
    }

    .label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    :host([loading]) .label {
      opacity: 0.72;
    }

    .icon {
      flex: none;
      line-height: 1;
    }

    @keyframes su-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes su-ripple-expand {
      from {
        transform: scale(0);
        opacity: 0.45;
      }
      to {
        transform: scale(1);
        opacity: 0;
      }
    }

    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: color-mix(in srgb, currentColor 28%, transparent);
      transform: scale(0);
      animation: su-ripple-expand 560ms ease-out forwards;
      z-index: 1;
    }

    /* types */
    :host([type='primary']) button {
      background: var(--su-color-primary);
      color: var(--su-color-primary-contrast, #fff);
    }

    :host([type='primary']) button:hover:not(:disabled) {
      background: var(--su-color-primary-hover);
    }

    :host([type='secondary']) button {
      background: var(--su-text-2);
      color: var(--su-bg-card);
    }

    :host([type='secondary']) button:hover:not(:disabled) {
      background: var(--su-text-1);
    }

    :host([type='success']) button {
      background: var(--su-color-success);
      color: var(--su-color-success-contrast, #fff);
    }

    :host([type='success']) button:hover:not(:disabled) {
      filter: brightness(0.92);
    }

    :host([type='warning']) button {
      background: var(--su-color-warning);
      color: var(--su-color-warning-contrast, #fff);
    }

    :host([type='warning']) button:hover:not(:disabled) {
      filter: brightness(0.92);
    }

    :host([type='danger']) button {
      background: var(--su-color-error);
      color: var(--su-color-error-contrast, #fff);
    }

    :host([type='danger']) button:hover:not(:disabled) {
      filter: brightness(0.92);
    }

    :host([type='info']) button {
      background: var(--su-color-info);
      color: var(--su-color-info-contrast, #fff);
    }

    :host([type='info']) button:hover:not(:disabled) {
      filter: brightness(0.92);
    }

    :host([type='light']) button {
      background: var(--su-bg-hover);
      color: var(--su-text-1);
      border-color: var(--su-border-color);
    }

    :host([type='light']) button:hover:not(:disabled) {
      background: var(--su-bg-muted);
      border-color: var(--su-border-color-hover);
    }

    :host([type='dark']) button {
      background: var(--su-text-1);
      color: var(--su-bg-card);
    }

    :host([type='dark']) button:hover:not(:disabled) {
      opacity: 0.9;
    }

    :host([type='link']) button {
      background: transparent;
      color: var(--su-color-primary);
      min-width: 0;
      padding: 0;
    }

    :host([type='link']) button:hover:not(:disabled) {
      color: var(--su-color-primary-hover);
      text-decoration: underline;
    }

    /* sizes */
    :host([size='small']) {
      --su-button-min-width: 56px;
      --su-button-min-height: 30px;
      --su-button-font-size: var(--su-font-size-sm);
      --su-button-padding-x: 10px;
    }

    :host([size='large']) {
      --su-button-min-width: 92px;
      --su-button-min-height: 42px;
      --su-button-font-size: var(--su-font-size-lg);
      --su-button-padding-x: 18px;
    }

    :host([block]) {
      display: block;
      width: 100%;
    }

    :host([round]) {
      border-radius: 999px;
    }

    :host([type='link']) {
      min-width: 0;
      min-height: auto;
    }
  `];var Mt=Object.defineProperty,Dt=Object.getOwnPropertyDescriptor,jt=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Dt(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Mt(e,r,i),i};t.SuButton=class extends $t{constructor(){super(...arguments),this.size="medium",this.type="primary",this.disabled=!1,this.loading=!1,this.iconClass="",this.iconPosition="left",this.rippleColor="",this.ripple=!0,this.block=!1,this.round=!1,this.nativeType="button"}get isInactive(){return this.disabled||this.loading}handleClick(t){if(this.isInactive)return t.stopImmediatePropagation(),void t.preventDefault();if(this.ripple)try{const e=t.currentTarget;!function(t,e={},r){const o=r||t.currentTarget;if(!o)return;const s=o.getBoundingClientRect(),i=t.clientX-s.left,a=t.clientY-s.top,n=[Math.hypot(i,a),Math.hypot(s.width-i,a),Math.hypot(i,s.height-a),Math.hypot(s.width-i,s.height-a)],l=2*Math.max(...n),d=e.duration??560;o.querySelectorAll(".ripple-effect").forEach(t=>t.remove());const c=document.createElement("span");c.className="ripple-effect",c.setAttribute("aria-hidden","true"),c.style.left=i-l/2+"px",c.style.top=a-l/2+"px",c.style.width=`${l}px`,c.style.height=`${l}px`,e.color&&(c.style.backgroundColor=e.color),e.duration&&(c.style.animationDuration=`${d}ms`),o.appendChild(c),window.setTimeout(()=>c.remove(),d)}(t,this.rippleColor?{color:this.rippleColor}:{},e??void 0)}catch(e){console.error("Error creating ripple effect:",e)}}renderIcon(t){return this.iconClass&&this.iconPosition===t?ot`<i class="icon ${t} ${this.iconClass}" aria-hidden="true"></i>`:it}render(){return ot`
      <button
        type=${this.nativeType}
        ?disabled=${this.isInactive}
        aria-busy=${this.loading?"true":"false"}
        aria-disabled=${this.isInactive?"true":"false"}
        @click=${this.handleClick}
      >
        ${this.loading?ot`<span class="spinner" aria-hidden="true"></span>`:it}
        <span class="label">
          ${this.renderIcon("left")}
          <slot></slot>
          ${this.renderIcon("right")}
        </span>
      </button>
    `}},t.SuButton.styles=Ot,jt([At({type:String,reflect:!0})],t.SuButton.prototype,"size",2),jt([At({type:String,reflect:!0})],t.SuButton.prototype,"type",2),jt([At({type:Boolean,reflect:!0})],t.SuButton.prototype,"disabled",2),jt([At({type:Boolean,reflect:!0})],t.SuButton.prototype,"loading",2),jt([At({type:String})],t.SuButton.prototype,"iconClass",2),jt([At({type:String})],t.SuButton.prototype,"iconPosition",2),jt([At({type:String})],t.SuButton.prototype,"rippleColor",2),jt([At({type:Boolean})],t.SuButton.prototype,"ripple",2),jt([At({type:Boolean,reflect:!0})],t.SuButton.prototype,"block",2),jt([At({type:Boolean,reflect:!0})],t.SuButton.prototype,"round",2),jt([At({type:String})],t.SuButton.prototype,"nativeType",2),t.SuButton=jt([Pt("su-button")],t.SuButton);var Bt=Object.defineProperty,It=Object.getOwnPropertyDescriptor,Nt=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?It(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Bt(e,r,i),i};t.SeInput=class extends $t{constructor(){super(...arguments),this.value="",this.placeholder="请输入",this.disabled=!1,this.type="text",this.readonly=!1,this.error=!1,this.label="",this.helperText="",this.clearable=!1}emitChange(){this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}handleInput(t){const e=t.target;this.value=e.value,this.emitChange()}handleClear(){var t,e;this.disabled||this.readonly||(this.value="",this.emitChange(),null==(e=null==(t=this.shadowRoot)?void 0:t.querySelector("input"))||e.focus())}render(){return ot`
      <div class="input-container">
        ${this.label?ot`<label class="label" for="input">${this.label}</label>`:""}
        <div class="input-wrapper">
          <input
            id="input"
            class="${this.error?"error":""} ${this.clearable?"clearable":""}"
            .value=${this.value}
            .placeholder=${this.placeholder}
            .type=${this.type}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${this.handleInput}
            aria-invalid=${this.error?"true":"false"}
            aria-readonly=${this.readonly?"true":"false"}
          />
          ${this.clearable&&this.value?ot`<button class="clear-btn" type="button" aria-label="清空" @click=${this.handleClear}>✕</button>`:""}
        </div>
        ${this.helperText?ot`<span class="helper-text ${this.error?"error":""}">${this.helperText}</span>`:""}
      </div>
    `}},t.SeInput.styles=[Et,Tt,x`
      :host {
        display: block;
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

      input.clearable {
        padding-right: 32px;
      }

      input:hover:not(:disabled) {
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
        background-color: rgba(var(--su-color-error-rgb, 239, 68, 68), 0.08);
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
        padding: 0;
        line-height: 1;
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
    `],Nt([At({type:String})],t.SeInput.prototype,"value",2),Nt([At({type:String})],t.SeInput.prototype,"placeholder",2),Nt([At({type:Boolean})],t.SeInput.prototype,"disabled",2),Nt([At({type:String})],t.SeInput.prototype,"type",2),Nt([At({type:Boolean})],t.SeInput.prototype,"readonly",2),Nt([At({type:Boolean})],t.SeInput.prototype,"error",2),Nt([At({type:String})],t.SeInput.prototype,"label",2),Nt([At({type:String})],t.SeInput.prototype,"helperText",2),Nt([At({type:Boolean})],t.SeInput.prototype,"clearable",2),t.SeInput=Nt([Pt("su-input")],t.SeInput);
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const Ht=2;class Rt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const{I:Ut}=xt,Vt=()=>document.createComment(""),Lt=(t,e,r)=>{var o;const s=t._$AA.parentNode,i=void 0===e?t._$AB:e._$AA;if(void 0===r){const e=s.insertBefore(Vt(),i),o=s.insertBefore(Vt(),i);r=new Ut(e,o,t,t.options)}else{const e=r._$AB.nextSibling,a=r._$AM,n=a!==t;if(n){let e;null==(o=r._$AQ)||o.call(r,t),r._$AM=t,void 0!==r._$AP&&(e=t._$AU)!==a._$AU&&r._$AP(e)}if(e!==i||n){let t=r._$AA;for(;t!==e;){const e=t.nextSibling;s.insertBefore(t,i),t=e}}}return r},Kt=(t,e,r=t)=>(t._$AI(e,r),t),Jt={},qt=t=>{var e;null==(e=t._$AP)||e.call(t,!1,!0);let r=t._$AA;const o=t._$AB.nextSibling;for(;r!==o;){const t=r.nextSibling;r.remove(),r=t}},Ft=(t,e,r)=>{const o=new Map;for(let s=e;s<=r;s++)o.set(t[s],s);return o},Yt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Rt{constructor(t){if(super(t),t.type!==Ht)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;void 0===r?r=e:void 0!==e&&(o=e);const s=[],i=[];let a=0;for(const n of t)s[a]=o?o(n,a):a,i[a]=r(n,a),a++;return{values:i,keys:s}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const s=t._$AH,{values:i,keys:a}=this.dt(e,r,o);if(!Array.isArray(s))return this.ut=a,i;const n=this.ut??(this.ut=[]),l=[];let d,c,p=0,u=s.length-1,h=0,g=i.length-1;for(;p<=u&&h<=g;)if(null===s[p])p++;else if(null===s[u])u--;else if(n[p]===a[h])l[h]=Kt(s[p],i[h]),p++,h++;else if(n[u]===a[g])l[g]=Kt(s[u],i[g]),u--,g--;else if(n[p]===a[g])l[g]=Kt(s[p],i[g]),Lt(t,l[g+1],s[p]),p++,g--;else if(n[u]===a[h])l[h]=Kt(s[u],i[h]),Lt(t,s[p],s[u]),u--,h++;else if(void 0===d&&(d=Ft(a,h,g),c=Ft(n,p,u)),d.has(n[p]))if(d.has(n[u])){const e=c.get(a[h]),r=void 0!==e?s[e]:null;if(null===r){const e=Lt(t,s[p]);Kt(e,i[h]),l[h]=e}else l[h]=Kt(r,i[h]),Lt(t,s[p],r),s[e]=null;h++}else qt(s[u]),u--;else qt(s[p]),p++;for(;h<=g;){const e=Lt(t,l[g+1]);Kt(e,i[h]),l[h++]=e}for(;p<=u;){const t=s[p++];null!==t&&qt(t)}return this.ut=a,((t,e=Jt)=>{t._$AH=e})(t,l),st}}),Xt=x`
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
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */var Wt=Object.defineProperty,Zt=Object.getOwnPropertyDescriptor,Gt=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Zt(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Wt(e,r,i),i};t.SePagination=class extends $t{constructor(){super(...arguments),this.currentPage=1,this.total=0,this.pageSize=10}get totalPages(){return this.total<=0?1:Math.max(1,Math.ceil(this.total/this.pageSize))}clampPage(t){return Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1))}emitChange(t){const e=this.clampPage(t);e!==this.currentPage&&(this.currentPage=e,this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0})))}handlePageInput(t){const e=t.target;this.emitChange(Number(e.value))}handlePrevPage(){this.emitChange(this.currentPage-1)}handleNextPage(){this.emitChange(this.currentPage+1)}render(){return ot`
      <div class="pagination">
        <button type="button" @click="${this.handlePrevPage}" ?disabled="${this.currentPage<=1}">
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
          ?disabled="${this.currentPage>=this.totalPages}">
          下一页
        </button>
      </div>
    `}},t.SePagination.styles=x`
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
  `,Gt([At({type:Number})],t.SePagination.prototype,"currentPage",2),Gt([At({type:Number})],t.SePagination.prototype,"total",2),Gt([At({type:Number})],t.SePagination.prototype,"pageSize",2),t.SePagination=Gt([Pt("se-pagination")],t.SePagination);var Qt=Object.defineProperty,te=Object.getOwnPropertyDescriptor,ee=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?te(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Qt(e,r,i),i};t.seTable=class extends $t{constructor(){super(),this.data=[],this.columns=[],this.noDataText="暂无数据",this.borderStyle="1px solid var(--su-border-color)",this.rowLines=!0,this.columnLines=!0,this.theadBgColor="",this.theadTextColor="",this.pageSize=10,this.pagination=!0,this.striped=!1,this.hoverable=!1,this.stickyHeader=!1,this.height="",this.rowKey="id",this.selectable=!1,this.selectedKeys=[],this.loading=!1,this.infiniteScroll=!1,this.hasMore=!1,this.loadingMore=!1,this.loadMoreOffset=80,this.loadMoreText="下拉到底部加载更多",this.loadingText="加载中...",this.noMoreText="没有更多数据了",this.virtualScroll=!1,this.virtualThreshold=1e3,this.virtualRowHeight=44,this.virtualBuffer=8,this.currentPage=1,this.sortedColumns=[],this.sortedData=[],this.scrollTop=0,this.viewportHeight=0,this.loadMorePending=!1,this.sortedColumns=[...this.columns],this.sortedData=[...this.data],this.sortColumn=t=>{const e=this.sortedColumns[t];if(!e.sortable)return;const r="asc"===e.sortDirection?"desc":"desc"===e.sortDirection?"":"asc";this.sortedColumns=this.sortedColumns.map((e,o)=>({...e,sortDirection:o===t?r:""})),this.sortedData=""===r?[...this.data]:[...this.data].sort((t,o)=>{const s=this.compareValues(t[e.key],o[e.key]);return"asc"===r?s:-1*s}),this.currentPage=1,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("sort-change",{detail:{column:e.key,direction:r},bubbles:!0,composed:!0}))}}willUpdate(t){if(t.has("borderStyle")&&this.style.setProperty("--border-style",this.borderStyle),t.has("rowLines")){const t=this.rowLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--row-line",t)}if(t.has("columnLines")){const t=this.columnLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--column-line",t)}t.has("theadBgColor")&&(this.theadBgColor?this.style.setProperty("--thead-bg-color",this.theadBgColor):this.style.removeProperty("--thead-bg-color")),t.has("theadTextColor")&&(this.theadTextColor?this.style.setProperty("--thead-text-color",this.theadTextColor):this.style.removeProperty("--thead-text-color")),(t.has("columns")||t.has("data"))&&(this.sortedColumns=this.columns.map(t=>({...t,sortDirection:""})),this.sortedData=[...this.data],this.currentPage=1),(t.has("pageSize")||t.has("pagination")||t.has("infiniteScroll"))&&(this.currentPage=1,this.scrollTop=0,this.resetViewportScroll()),t.has("loadingMore")&&!this.loadingMore&&(this.loadMorePending=!1)}firstUpdated(){this.measureViewportHeight()}updated(){this.measureViewportHeight()}compareValues(t,e){if(null==t&&null==e)return 0;if(null==t)return-1;if(null==e)return 1;if("number"==typeof t&&"number"==typeof e)return t-e;const r=String(t),o=String(e);return r.localeCompare(o,"en",{numeric:!0,sensitivity:"base"})}get totalPages(){return Math.max(1,Math.ceil(this.sortedData.length/this.pageSize))}get shouldUsePagination(){return this.pagination&&!this.infiniteScroll}get paginatedData(){const t=(this.currentPage-1)*this.pageSize,e=t+this.pageSize;return this.sortedData.slice(t,e)}get sourceData(){return this.shouldUsePagination?this.paginatedData:this.sortedData}get shouldUseVirtualScroll(){return!this.spanMethod&&(this.virtualScroll||this.sourceData.length>=this.virtualThreshold)}get effectiveHeight(){return this.height||"420px"}get totalColumnCount(){return Math.max(1,this.sortedColumns.length+(this.selectable?1:0))}isRowSelected(t,e){return this.selectedKeys.includes(this.getRowKey(t,e))}emitSelectionChange(t){this.selectedKeys=t;const e=new Set(t),r=this.sortedData.filter((t,r)=>e.has(this.getRowKey(t,r)));this.dispatchEvent(new CustomEvent("selection-change",{detail:{keys:t,rows:r},bubbles:!0,composed:!0}))}toggleRowSelection(t,e){const r=this.getRowKey(t,e),o=this.selectedKeys.includes(r)?this.selectedKeys.filter(t=>t!==r):[...this.selectedKeys,r];this.emitSelectionChange(o)}toggleAllSelection(){const t=this.sourceData.map((t,e)=>this.getRowKey(t,e)),e=t.length>0&&t.every(t=>this.selectedKeys.includes(t))?this.selectedKeys.filter(e=>!t.includes(e)):[...new Set([...this.selectedKeys,...t])];this.emitSelectionChange(e)}get virtualState(){const t=this.sourceData;if(!this.shouldUseVirtualScroll)return{start:0,rows:t,topPadding:0,bottomPadding:0};const e=this.viewportHeight||420,r=Math.ceil(e/this.virtualRowHeight)+2*this.virtualBuffer,o=Math.max(0,Math.floor(this.scrollTop/this.virtualRowHeight)-this.virtualBuffer),s=Math.min(t.length,o+r);return{start:o,rows:t.slice(o,s),topPadding:o*this.virtualRowHeight,bottomPadding:(t.length-s)*this.virtualRowHeight}}measureViewportHeight(){const t=this.getViewportElement();t&&this.viewportHeight!==t.clientHeight&&t.clientHeight>0&&(this.viewportHeight=t.clientHeight)}getViewportElement(){var t;return null==(t=this.renderRoot)?void 0:t.querySelector(".table-viewport")}resetViewportScroll(){const t=this.getViewportElement();t&&(t.scrollTop=0)}getRowKey(t,e){const r=t[this.rowKey];return null!=r&&""!==r?String(r):`row-${e}`}getCellDisplayValue(t,e,r){const o=t[e.key];return e.formatter?e.formatter(o,t,r):o??""}normalizeSpan(t){if(!t)return{rowspan:1,colspan:1};if(Array.isArray(t)){return{rowspan:Math.max(0,Math.floor(t[0]??1)),colspan:Math.max(0,Math.floor(t[1]??1))}}return{rowspan:Math.max(0,Math.floor(t.rowspan??1)),colspan:Math.max(0,Math.floor(t.colspan??1))}}getCellSpan(t){return this.spanMethod?this.normalizeSpan(this.spanMethod(t)):{rowspan:1,colspan:1}}setCurrentPage(t){const e=Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1));this.currentPage=e,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0}))}handlePaginationChange(t){var e;const r=t;this.setCurrentPage((null==(e=r.detail)?void 0:e.currentPage)??1)}maybeEmitLoadMore(t){if(!this.infiniteScroll||!this.hasMore||this.loadingMore||this.loadMorePending)return;t.scrollHeight-t.scrollTop-t.clientHeight>this.loadMoreOffset||(this.loadMorePending=!0,this.dispatchEvent(new CustomEvent("load-more",{detail:{loadedCount:this.sortedData.length},bubbles:!0,composed:!0})))}handleBodyScroll(t){const e=t.target;this.scrollTop=e.scrollTop,e.clientHeight!==this.viewportHeight&&e.clientHeight>0&&(this.viewportHeight=e.clientHeight),this.maybeEmitLoadMore(e)}handleRowClick(t,e){this.dispatchEvent(new CustomEvent("row-click",{detail:{row:t,rowIndex:e},bubbles:!0,composed:!0}))}renderRows(){const t=this.virtualState;if(!(t.rows.length>0))return ot`
        <tr>
          <td colspan="${this.totalColumnCount}" class="empty">${this.noDataText}</td>
        </tr>
      `;const e=t.topPadding>0?ot`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${t.topPadding}px;"></td>
            </tr>
          `:it,r=t.bottomPadding>0?ot`
            <tr class="virtual-spacer" aria-hidden="true">
              <td
                colspan="${this.totalColumnCount}"
                style="height: ${t.bottomPadding}px;"
              ></td>
            </tr>
          `:it,o=this.shouldUsePagination?(this.currentPage-1)*this.pageSize:0,s=new Set,i=Yt(t.rows,(e,r)=>this.getRowKey(e,t.start+r),(e,r)=>{const i=t.start+r,a=o+i;return ot`
          <tr
            class="${this.striped?"striped":""} ${this.hoverable?"hoverable":""}"
            @click="${()=>this.handleRowClick(e,i)}"
          >
            ${this.selectable?ot`
                  <td class="selection-cell" @click="${t=>t.stopPropagation()}">
                    <input
                      type="checkbox"
                      .checked="${this.isRowSelected(e,i)}"
                      @change="${()=>this.toggleRowSelection(e,i)}"
                    />
                  </td>
                `:it}
            ${this.sortedColumns.map((t,r)=>{const o=`${i}-${r}`;if(s.has(o))return it;const n=this.getCellSpan({row:e,rowIndex:a,column:t,columnIndex:r,data:this.sourceData,columns:this.sortedColumns});if(n.rowspan<=0||n.colspan<=0)return it;for(let e=0;e<n.rowspan;e+=1)for(let t=0;t<n.colspan;t+=1)0===e&&0===t||s.add(`${i+e}-${r+t}`);const l=t.align??"center",d=this.getCellDisplayValue(e,t,i);return ot`
                <td
                  class="${t.ellipsis?"ellipsis":""}"
                  rowspan="${n.rowspan}"
                  colspan="${n.colspan}"
                  style="text-align: ${l}; max-width: ${t.width||"auto"};"
                >
                  ${d}
                </td>
              `})}
          </tr>
        `});return ot`${e}${i}${r}`}renderPagination(){return this.shouldUsePagination?ot`
      <se-pagination
        class="pagination"
        .currentPage="${this.currentPage}"
        .total="${this.sortedData.length}"
        .pageSize="${this.pageSize}"
        @page-change="${this.handlePaginationChange}"
      ></se-pagination>
    `:it}renderLoadMoreStatus(){return this.infiniteScroll?this.loadingMore?ot`<div class="status-line">${this.loadingText}</div>`:this.hasMore?ot`<div class="status-line">${this.loadMoreText}</div>`:ot`<div class="status-line">${this.noMoreText}</div>`:it}renderSelectionHeader(){if(!this.selectable)return it;const t=this.sourceData.map((t,e)=>this.getRowKey(t,e)),e=t.filter(t=>this.selectedKeys.includes(t)),r=t.length>0&&e.length===t.length,o=e.length>0&&!r;return ot`
      <th class="selection-cell">
        <input
          type="checkbox"
          aria-label="全选"
          .checked="${r}"
          .indeterminate="${o}"
          @change="${()=>this.toggleAllSelection()}"
        />
      </th>
    `}render(){const t=this.infiniteScroll||this.shouldUseVirtualScroll;return ot`
      <div class="table-wrapper">
        <div
          class="table-viewport ${t?"scrollable":""}"
          style="${t?`height: ${this.effectiveHeight};`:""}"
          @scroll="${this.handleBodyScroll}"
        >
          <table>
            <thead class="${this.stickyHeader&&t?"sticky":""}">
              <tr>
                ${this.renderSelectionHeader()}
                ${this.sortedColumns.map((t,e)=>ot`
                    <th
                      class="${t.sortable?"sortable":""}"
                      style="width: ${t.width||"auto"}; text-align: ${t.align||"center"};"
                      data-sort="${"asc"===t.sortDirection?"↑":"desc"===t.sortDirection?"↓":"⇅"}"
                      @click="${()=>this.sortColumn(e)}"
                    >
                      ${t.label}
                    </th>
                  `)}
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
        ${this.loading?ot`<div class="loading-overlay"><span class="loading-spinner"></span></div>`:it}
        ${this.renderLoadMoreStatus()} ${this.renderPagination()}
      </div>
    `}},t.seTable.styles=[Xt,x`
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
    `],ee([At({type:Array})],t.seTable.prototype,"data",2),ee([At({type:Array})],t.seTable.prototype,"columns",2),ee([At({type:String})],t.seTable.prototype,"noDataText",2),ee([At({type:String})],t.seTable.prototype,"borderStyle",2),ee([At({type:Boolean})],t.seTable.prototype,"rowLines",2),ee([At({type:Boolean})],t.seTable.prototype,"columnLines",2),ee([At({type:String})],t.seTable.prototype,"theadBgColor",2),ee([At({type:String})],t.seTable.prototype,"theadTextColor",2),ee([At({type:Number})],t.seTable.prototype,"pageSize",2),ee([At({type:Boolean})],t.seTable.prototype,"pagination",2),ee([At({type:Boolean})],t.seTable.prototype,"striped",2),ee([At({type:Boolean})],t.seTable.prototype,"hoverable",2),ee([At({type:Boolean})],t.seTable.prototype,"stickyHeader",2),ee([At({type:String})],t.seTable.prototype,"height",2),ee([At({type:String})],t.seTable.prototype,"rowKey",2),ee([At({type:Boolean})],t.seTable.prototype,"selectable",2),ee([At({attribute:!1})],t.seTable.prototype,"selectedKeys",2),ee([At({type:Boolean})],t.seTable.prototype,"loading",2),ee([At({attribute:!1})],t.seTable.prototype,"spanMethod",2),ee([At({type:Boolean})],t.seTable.prototype,"infiniteScroll",2),ee([At({type:Boolean})],t.seTable.prototype,"hasMore",2),ee([At({type:Boolean})],t.seTable.prototype,"loadingMore",2),ee([At({type:Number})],t.seTable.prototype,"loadMoreOffset",2),ee([At({type:String})],t.seTable.prototype,"loadMoreText",2),ee([At({type:String})],t.seTable.prototype,"loadingText",2),ee([At({type:String})],t.seTable.prototype,"noMoreText",2),ee([At({type:Boolean})],t.seTable.prototype,"virtualScroll",2),ee([At({type:Number})],t.seTable.prototype,"virtualThreshold",2),ee([At({type:Number})],t.seTable.prototype,"virtualRowHeight",2),ee([At({type:Number})],t.seTable.prototype,"virtualBuffer",2),ee([zt()],t.seTable.prototype,"currentPage",2),ee([zt()],t.seTable.prototype,"sortedColumns",2),ee([zt()],t.seTable.prototype,"sortedData",2),ee([zt()],t.seTable.prototype,"scrollTop",2),ee([zt()],t.seTable.prototype,"viewportHeight",2),ee([zt()],t.seTable.prototype,"loadMorePending",2),t.seTable=ee([Pt("se-table")],t.seTable);var re=Object.defineProperty,oe=Object.getOwnPropertyDescriptor,se=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?oe(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&re(e,r,i),i};let ie=class extends $t{constructor(){super(...arguments),this.src="",this.rotation=0}handleClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return ot`
      <div class="preview">
        <img src="${this.src}" style="--rotation: ${this.rotation}deg;" />
        <button class="close-btn" @click="${this.handleClose}">关闭</button>
        <button class="rotate-btn" @click="${this.handleRotate}">旋转</button>
      </div>
    `}};ie.styles=x`
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
  `,se([At({type:String})],ie.prototype,"src",2),se([zt()],ie.prototype,"rotation",2),ie=se([Pt("se-image-preview")],ie);var ae=Object.defineProperty,ne=Object.getOwnPropertyDescriptor,le=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?ne(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&ae(e,r,i),i};t.seImage=class extends $t{constructor(){super(...arguments),this.src="",this.alt="",this.lazy=!1,this.placeholder="",this.errorPlaceholder="",this.width=100,this.height=100,this.isError=!1,this.isPreviewVisible=!1,this.rotation=0,this._isVisible=!1}firstUpdated(){var t;this.lazy&&(this._observer=new IntersectionObserver(t=>{var e;t[0].isIntersecting&&(this._isVisible=!0,null==(e=this._observer)||e.disconnect(),this.requestUpdate())}),this._observer.observe(null==(t=this.shadowRoot)?void 0:t.querySelector("img")))}loadImage(){var t;const e=null==(t=this.shadowRoot)?void 0:t.querySelector("img");e&&this.src&&(e.src=this.src)}handleError(){this.isError=!0}handleImageClick(){this.isPreviewVisible=!0}handleClosePreview(){this.isPreviewVisible=!1}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return ot`
      <div
        class="image-container"
        style="width: ${this.width+"px"}; height: ${this.height+"px"};"
      >
        <img
          class="w-full h-auto block cursor-pointer"
          src="${this.isError?this.errorPlaceholder:this.lazy?this.placeholder:this.src}"
          alt="${this.alt}"
          @error="${this.handleError}"
          @click="${this.handleImageClick}"
          loading="${this.lazy?"lazy":"eager"}"
        />
        <button class="preview-icon" @click="${this.handleImageClick}">预览</button>
        ${this.isPreviewVisible?ot`
              <se-image-preview
                .src="${this.src}"
                @close="${this.handleClosePreview}"
              ></se-image-preview>
            `:""}
      </div>
    `}},t.seImage.styles=x`
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
  `,le([At({type:String})],t.seImage.prototype,"src",2),le([At({type:String})],t.seImage.prototype,"alt",2),le([At({type:Boolean})],t.seImage.prototype,"lazy",2),le([At({type:String})],t.seImage.prototype,"placeholder",2),le([At({type:String})],t.seImage.prototype,"errorPlaceholder",2),le([At({type:Number})],t.seImage.prototype,"width",2),le([At({type:Number})],t.seImage.prototype,"height",2),le([zt()],t.seImage.prototype,"isError",2),le([zt()],t.seImage.prototype,"isPreviewVisible",2),le([zt()],t.seImage.prototype,"rotation",2),t.seImage=le([Pt("se-image")],t.seImage);var de=Object.defineProperty,ce=Object.getOwnPropertyDescriptor,pe=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?ce(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&de(e,r,i),i};t.LineComponent=class extends $t{constructor(){super(...arguments),this.direction="horizontal",this.color="#000"}render(){return ot`
      <div
        class="line ${"horizontal"===this.direction?"horizontal":"vertical"}"
        style="background-color: ${this.color};"
      ></div>
    `}},t.LineComponent.styles=x`
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
  `,pe([At({type:String})],t.LineComponent.prototype,"direction",2),pe([At({type:String})],t.LineComponent.prototype,"color",2),t.LineComponent=pe([Pt("line-component")],t.LineComponent);var ue=Object.defineProperty,he=Object.getOwnPropertyDescriptor,ge=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?he(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&ue(e,r,i),i};function be(t,e){if(!t)return e;try{const r=JSON.parse(t);return Array.isArray(r)?r:e}catch{return e}}t.SeAssetViewer=class extends $t{constructor(){super(...arguments),this.src="",this.thumbnail="",this.title="",this.downloadable=!0,this.type="unknown",this.previewVisible=!1}resolveType(){if("unknown"!==this.type)return this.type;const t=this.src.toLowerCase();return t.match(/\.(png|jpe?g|gif|webp|svg)$/)?"image":t.match(/\.(mp4|webm|mov)$/)?"video":t.match(/\.(mp3|wav|ogg)$/)?"audio":t.endsWith(".pdf")?"pdf":"unknown"}openPreview(){this.src&&(this.previewVisible=!0,this.dispatchEvent(new CustomEvent("asset-open",{detail:{src:this.src,type:this.resolveType()},bubbles:!0,composed:!0})))}closePreview(){this.previewVisible=!1}renderPreviewThumb(){const t=this.resolveType();if("image"===t){const t=this.thumbnail||this.src;return ot`<img src=${t} alt=${this.title||"asset"} loading="lazy" />`}return ot`<span>${{image:"图片",video:"视频",audio:"音频",pdf:"PDF",unknown:"文件"}[t]}</span>`}renderOverlay(){if(!this.previewVisible)return null;const t=this.resolveType();return ot`
      <div class="overlay" @click=${this.closePreview}>
        <div class="overlay-content" @click=${t=>t.stopPropagation()}>
          <header>
            <h3>${this.title||this.src}</h3>
            <button @click=${this.closePreview}>关闭</button>
          </header>
          ${"image"===t?ot`<img src=${this.src} alt=${this.title||"asset"} />`:"pdf"===t?ot`<iframe src=${this.src} title="PDF preview"></iframe>`:"video"===t?ot`<video src=${this.src} controls></video>`:"audio"===t?ot`<audio src=${this.src} controls></audio>`:ot`<p>暂不支持预览该文件类型</p>`}
        </div>
      </div>
    `}render(){return ot`
      <div class="card">
        <div class="preview" @click=${this.openPreview}>${this.renderPreviewThumb()}</div>
        <div class="meta">
          <p class="title">${this.title||this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button @click=${this.openPreview}>预览</button>
          ${this.downloadable&&this.src?ot`<a class="button-link" href=${this.src} download target="_blank" rel="noreferrer"
                >下载</a
              >`:null}
        </div>
      </div>
      ${this.renderOverlay()}
    `}},t.SeAssetViewer.styles=[Et,x`
      :host {
        display: block;
      }

      .card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-sm);
      }

      .preview {
        position: relative;
        display: grid;
        place-items: center;
        flex: none;
        width: 96px;
        height: 72px;
        overflow: hidden;
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-muted);
        color: var(--su-text-3);
        cursor: pointer;
      }

      .preview img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .meta {
        flex: 1;
        min-width: 0;
      }

      .title {
        margin: 0 0 6px;
        color: var(--su-text-1);
        font-size: var(--su-font-size-sm);
        font-weight: 600;
        line-height: 1.4;
      }

      .meta small {
        display: block;
        color: var(--su-text-3);
        line-height: 1.6;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      button,
      a.button-link {
        padding: 6px 10px;
        border: 1px solid var(--su-border-color);
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-card);
        color: var(--su-text-1);
        font-size: var(--su-font-size-xs);
        cursor: pointer;
        text-decoration: none;
        transition: border-color 0.2s ease, color 0.2s ease;
      }

      button:hover,
      a.button-link:hover {
        border-color: var(--su-color-primary-hover);
        color: var(--su-color-primary-hover);
      }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(15, 23, 42, 0.55);
      }

      .overlay-content {
        display: grid;
        gap: 10px;
        max-width: min(90vw, 960px);
        max-height: 90vh;
        padding: 12px;
        border-radius: var(--su-radius-md);
        background: var(--su-bg-card);
        box-shadow: var(--su-shadow-md);
      }

      .overlay header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .overlay header h3 {
        margin: 0;
        color: var(--su-text-1);
        font-size: var(--su-font-size-md);
      }

      .overlay img,
      .overlay iframe,
      .overlay video,
      .overlay audio {
        max-width: 100%;
        max-height: 72vh;
        border-radius: var(--su-radius-sm);
      }
    `],ge([At({type:String})],t.SeAssetViewer.prototype,"src",2),ge([At({type:String})],t.SeAssetViewer.prototype,"thumbnail",2),ge([At({type:String})],t.SeAssetViewer.prototype,"title",2),ge([At({type:Boolean})],t.SeAssetViewer.prototype,"downloadable",2),ge([At({type:String})],t.SeAssetViewer.prototype,"type",2),ge([zt()],t.SeAssetViewer.prototype,"previewVisible",2),t.SeAssetViewer=ge([Pt("se-asset-viewer")],t.SeAssetViewer);var ve=Object.defineProperty,ye=Object.getOwnPropertyDescriptor,me=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?ye(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&ve(e,r,i),i};t.SuSelect=class extends $t{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.placeholder="请选择",this.disabled=!1}get mergedOptions(){return this.options.length>0?this.options:be(this.optionsJson,[])}handleChange(t){const e=t.target;this.value=e.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return ot`
      <select class="select" .value=${this.value} ?disabled=${this.disabled} @change=${this.handleChange}>
        <option value="">${this.placeholder}</option>
        ${this.mergedOptions.map(t=>ot`<option value=${String(t.value)} ?disabled=${Boolean(t.disabled)}>
              ${t.label}
            </option>`)}
      </select>
    `}},t.SuSelect.styles=[Et,Tt,x`
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
    `],me([At({type:Array,attribute:!1})],t.SuSelect.prototype,"options",2),me([At({type:String})],t.SuSelect.prototype,"optionsJson",2),me([At({type:String})],t.SuSelect.prototype,"value",2),me([At({type:String})],t.SuSelect.prototype,"placeholder",2),me([At({type:Boolean})],t.SuSelect.prototype,"disabled",2),t.SuSelect=me([Pt("su-select")],t.SuSelect);var fe=Object.defineProperty,xe=Object.getOwnPropertyDescriptor,we=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?xe(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&fe(e,r,i),i};t.SuSwitch=class extends $t{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}handleClick(){this.disabled||(this.checked=!this.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0})))}render(){return ot`<button type="button" ?disabled=${this.disabled} @click=${this.handleClick}></button>`}},t.SuSwitch.styles=[Et,x`
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
    `],we([At({type:Boolean,reflect:!0})],t.SuSwitch.prototype,"checked",2),we([At({type:Boolean})],t.SuSwitch.prototype,"disabled",2),t.SuSwitch=we([Pt("su-switch")],t.SuSwitch);var Se=Object.defineProperty,$e=Object.getOwnPropertyDescriptor,ke=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?$e(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Se(e,r,i),i};t.SuTextarea=class extends $t{constructor(){super(...arguments),this.value="",this.placeholder="请输入",this.rows=4,this.disabled=!1}handleInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return ot`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        rows=${this.rows}
        ?disabled=${this.disabled}
        @input=${this.handleInput}></textarea>
    `}},t.SuTextarea.styles=[Et,Tt,x`
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

      textarea:focus {
        border-color: var(--su-color-primary);
        box-shadow: 0 0 0 3px rgba(var(--su-color-primary-rgb), 0.16);
        outline: none;
      }

      textarea:disabled {
        color: var(--su-text-3);
        background: var(--su-bg-muted);
        cursor: not-allowed;
      }
    `],ke([At({type:String})],t.SuTextarea.prototype,"value",2),ke([At({type:String})],t.SuTextarea.prototype,"placeholder",2),ke([At({type:Number})],t.SuTextarea.prototype,"rows",2),ke([At({type:Boolean})],t.SuTextarea.prototype,"disabled",2),t.SuTextarea=ke([Pt("su-textarea")],t.SuTextarea);var Pe=Object.defineProperty,Ce=Object.getOwnPropertyDescriptor,_e=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Ce(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Pe(e,r,i),i};t.SuFormItem=class extends $t{constructor(){super(...arguments),this.label="",this.message="",this.status="default",this.required=!1}render(){return ot`
      <div class="item">
        ${this.label?ot`<label class="label">${this.required?ot`<span class="required">*</span>`:it}${this.label}</label>`:it}
        <slot></slot>
        ${this.message?ot`<div class="message ${this.status}">${this.message}</div>`:it}
      </div>
    `}},t.SuFormItem.styles=[Et,x`
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
    `],_e([At({type:String})],t.SuFormItem.prototype,"label",2),_e([At({type:String})],t.SuFormItem.prototype,"message",2),_e([At({type:String})],t.SuFormItem.prototype,"status",2),_e([At({type:Boolean})],t.SuFormItem.prototype,"required",2),t.SuFormItem=_e([Pt("su-form-item")],t.SuFormItem);var Ae=Object.defineProperty,ze=Object.getOwnPropertyDescriptor,Ee=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?ze(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ae(e,r,i),i};t.SuCheckbox=class extends $t{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.label=""}onChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return ot`
      <label>
        <input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} @change=${this.onChange} />
        <span>${this.label}</span>
      </label>
    `}},t.SuCheckbox.styles=[Et,x`
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
    `],Ee([At({type:Boolean,reflect:!0})],t.SuCheckbox.prototype,"checked",2),Ee([At({type:Boolean})],t.SuCheckbox.prototype,"disabled",2),Ee([At({type:String})],t.SuCheckbox.prototype,"label",2),t.SuCheckbox=Ee([Pt("su-checkbox")],t.SuCheckbox);var Te=Object.defineProperty,Oe=Object.getOwnPropertyDescriptor,Me=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Oe(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Te(e,r,i),i};t.SuRadioGroup=class extends $t{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.name=`su-radio-${Math.random().toString(36).slice(2)}`}get mergedOptions(){return this.options.length>0?this.options:be(this.optionsJson,[])}onChange(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return ot`
      <div class="group">
        ${this.mergedOptions.map(t=>ot`
            <label>
              <input
                type="radio"
                name=${this.name}
                value=${t.value}
                .checked=${this.value===t.value}
                ?disabled=${Boolean(t.disabled)}
                @change=${this.onChange} />
              <span>${t.label}</span>
            </label>
          `)}
      </div>
    `}},t.SuRadioGroup.styles=[Et,x`
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
    `],Me([At({type:Array,attribute:!1})],t.SuRadioGroup.prototype,"options",2),Me([At({type:String})],t.SuRadioGroup.prototype,"optionsJson",2),Me([At({type:String})],t.SuRadioGroup.prototype,"value",2),Me([At({type:String})],t.SuRadioGroup.prototype,"name",2),t.SuRadioGroup=Me([Pt("su-radio-group")],t.SuRadioGroup);var De=Object.defineProperty,je=Object.getOwnPropertyDescriptor,Be=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?je(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&De(e,r,i),i};t.SuInputNumber=class extends $t{constructor(){super(...arguments),this.value=0,this.min=Number.MIN_SAFE_INTEGER,this.max=Number.MAX_SAFE_INTEGER,this.step=1,this.disabled=!1}clamp(t){return Math.min(this.max,Math.max(this.min,t))}emitChange(t){const e=this.clamp(t);e!==this.value?(this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))):this.requestUpdate()}onInput(t){const e=t.target.value,r=Number(e);""===e||Number.isNaN(r)||this.emitChange(r)}onBlur(t){t.target.value=String(this.value)}render(){return ot`
      <div class="wrapper">
        <button
          type="button"
          aria-label="减少"
          ?disabled=${this.disabled||this.value<=this.min}
          @click=${()=>this.emitChange(this.value-this.step)}>
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
          ?disabled=${this.disabled||this.value>=this.max}
          @click=${()=>this.emitChange(this.value+this.step)}>
          +
        </button>
      </div>
    `}},t.SuInputNumber.styles=[Et,Tt,x`
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
    `],Be([At({type:Number})],t.SuInputNumber.prototype,"value",2),Be([At({type:Number})],t.SuInputNumber.prototype,"min",2),Be([At({type:Number})],t.SuInputNumber.prototype,"max",2),Be([At({type:Number})],t.SuInputNumber.prototype,"step",2),Be([At({type:Boolean})],t.SuInputNumber.prototype,"disabled",2),t.SuInputNumber=Be([Pt("su-input-number")],t.SuInputNumber);var Ie=Object.defineProperty,Ne=Object.getOwnPropertyDescriptor;t.SuCard=class extends $t{render(){return ot`
      <section class="card">
        <header class="header"><slot name="header"></slot></header>
        <div class="content"><slot></slot></div>
        <footer class="footer"><slot name="footer"></slot></footer>
      </section>
    `}},t.SuCard.styles=[Et,x`
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
    `],t.SuCard=((t,e,r,o)=>{for(var s,i=o>1?void 0:o?Ne(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ie(e,r,i),i})([Pt("su-card")],t.SuCard);var He=Object.defineProperty,Re=Object.getOwnPropertyDescriptor,Ue=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Re(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&He(e,r,i),i};t.SuTag=class extends $t{constructor(){super(...arguments),this.type="default"}render(){return ot`<span class="tag ${this.type}"><slot></slot></span>`}},t.SuTag.styles=[Et,x`
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
    `],Ue([At({type:String})],t.SuTag.prototype,"type",2),t.SuTag=Ue([Pt("su-tag")],t.SuTag);var Ve=Object.defineProperty,Le=Object.getOwnPropertyDescriptor,Ke=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Le(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ve(e,r,i),i};t.SuStatCard=class extends $t{constructor(){super(...arguments),this.title="",this.value="",this.trend="",this.trendType="flat"}render(){return ot`
      <article class="card">
        <div class="title">${this.title}</div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trendType}">${this.trend}</div>
      </article>
    `}},t.SuStatCard.styles=[Et,x`
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
    `],Ke([At({type:String})],t.SuStatCard.prototype,"title",2),Ke([At({type:String})],t.SuStatCard.prototype,"value",2),Ke([At({type:String})],t.SuStatCard.prototype,"trend",2),Ke([At({type:String})],t.SuStatCard.prototype,"trendType",2),t.SuStatCard=Ke([Pt("su-stat-card")],t.SuStatCard);var Je=Object.defineProperty,qe=Object.getOwnPropertyDescriptor,Fe=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?qe(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Je(e,r,i),i};t.SuBadge=class extends $t{constructor(){super(...arguments),this.count=0,this.max=99,this.dot=!1,this.showZero=!1}get text(){return this.count>this.max?`${this.max}+`:String(this.count)}render(){const t=this.dot||this.count>0||this.showZero&&0===this.count;return ot`
      <slot></slot>
      ${t?ot`<span class="badge ${this.dot?"dot":""}">${this.dot?"":this.text}</span>`:it}
    `}},t.SuBadge.styles=[Et,x`
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
    `],Fe([At({type:Number})],t.SuBadge.prototype,"count",2),Fe([At({type:Number})],t.SuBadge.prototype,"max",2),Fe([At({type:Boolean})],t.SuBadge.prototype,"dot",2),Fe([At({type:Boolean})],t.SuBadge.prototype,"showZero",2),t.SuBadge=Fe([Pt("su-badge")],t.SuBadge);var Ye=Object.defineProperty,Xe=Object.getOwnPropertyDescriptor,We=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Xe(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ye(e,r,i),i};t.SuAvatar=class extends $t{constructor(){super(...arguments),this.src="",this.name="",this.size="medium",this.shape="circle",this.loadError=!1}updated(t){t.has("src")&&(this.loadError=!1)}render(){const t=this.src&&!this.loadError;return ot`
      <span class="avatar ${this.shape} ${this.size}">
        ${t?ot`<img src=${this.src} alt=${this.name} @error=${()=>this.loadError=!0} />`:ot`${this.name.slice(0,1).toUpperCase()}`}
      </span>
    `}},t.SuAvatar.styles=[Et,x`
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
    `],We([At({type:String})],t.SuAvatar.prototype,"src",2),We([At({type:String})],t.SuAvatar.prototype,"name",2),We([At({type:String})],t.SuAvatar.prototype,"size",2),We([At({type:String})],t.SuAvatar.prototype,"shape",2),We([zt()],t.SuAvatar.prototype,"loadError",2),t.SuAvatar=We([Pt("su-avatar")],t.SuAvatar);var Ze=Object.defineProperty,Ge=Object.getOwnPropertyDescriptor,Qe=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Ge(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ze(e,r,i),i};t.SuEmpty=class extends $t{constructor(){super(...arguments),this.description="暂无数据"}render(){return ot`
      <div class="empty">
        <span class="icon" aria-hidden="true"></span>
        <span class="description">${this.description}</span>
        <slot></slot>
      </div>
    `}},t.SuEmpty.styles=[Et,x`
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
    `],Qe([At({type:String})],t.SuEmpty.prototype,"description",2),t.SuEmpty=Qe([Pt("su-empty")],t.SuEmpty);var tr=Object.defineProperty,er=Object.getOwnPropertyDescriptor,rr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?er(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&tr(e,r,i),i};t.SuSkeleton=class extends $t{constructor(){super(...arguments),this.rows=3,this.avatar=!1,this.animated=!0,this.loading=!0}render(){return this.loading?ot`
      <div class="skeleton ${this.animated?"animated":""}" aria-busy="true">
        ${this.avatar?ot`<span class="avatar"></span>`:it}
        <div class="lines">
          ${Array.from({length:Math.max(1,this.rows)},()=>ot`<div class="row"></div>`)}
        </div>
      </div>
    `:ot`<slot></slot>`}},t.SuSkeleton.styles=[Et,x`
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
    `],rr([At({type:Number})],t.SuSkeleton.prototype,"rows",2),rr([At({type:Boolean})],t.SuSkeleton.prototype,"avatar",2),rr([At({type:Boolean})],t.SuSkeleton.prototype,"animated",2),rr([At({type:Boolean})],t.SuSkeleton.prototype,"loading",2),t.SuSkeleton=rr([Pt("su-skeleton")],t.SuSkeleton);var or=Object.defineProperty,sr=Object.getOwnPropertyDescriptor,ir=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?sr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&or(e,r,i),i};t.SuDescriptions=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.header="",this.column=2,this.bordered=!1}willUpdate(){this.style.setProperty("--desc-column",String(Math.max(1,this.column)))}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}render(){return ot`
      ${this.header?ot`<div class="title">${this.header}</div>`:it}
      <div class="grid ${this.bordered?"bordered":""}">
        ${this.mergedItems.map(t=>ot`
            <div class="item">
              <span class="label">${t.label}</span>
              <span class="value">${t.value}</span>
            </div>
          `)}
      </div>
    `}},t.SuDescriptions.styles=[Et,x`
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
    `],ir([At({type:Array,attribute:!1})],t.SuDescriptions.prototype,"items",2),ir([At({type:String})],t.SuDescriptions.prototype,"itemsJson",2),ir([At({type:String})],t.SuDescriptions.prototype,"header",2),ir([At({type:Number})],t.SuDescriptions.prototype,"column",2),ir([At({type:Boolean})],t.SuDescriptions.prototype,"bordered",2),t.SuDescriptions=ir([Pt("su-descriptions")],t.SuDescriptions);var ar=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,lr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?nr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&ar(e,r,i),i};t.SuModal=class extends $t{constructor(){super(...arguments),this.open=!1,this.title="提示",this.maskClosable=!0,this.hideFooter=!1,this.confirmText="确定",this.cancelText="取消",this.onKeydown=t=>{"Escape"===t.key&&this.open&&this.maskClosable&&this.close("mask")}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown)}closeByMask(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}confirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0})),this.close("confirm")}render(){return this.open?ot`
      <div class="mask" @click=${this.closeByMask}>
        <section class="panel" role="dialog" aria-modal="true" aria-label=${this.title}>
          <header class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter?it:ot`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${()=>this.close("cancel")}>${this.cancelText}</button>
                    <button class="confirm" type="button" @click=${this.confirm}>${this.confirmText}</button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `:it}},t.SuModal.styles=[Et,x`
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
    `],lr([At({type:Boolean,reflect:!0})],t.SuModal.prototype,"open",2),lr([At({type:String})],t.SuModal.prototype,"title",2),lr([At({type:Boolean})],t.SuModal.prototype,"maskClosable",2),lr([At({type:Boolean})],t.SuModal.prototype,"hideFooter",2),lr([At({type:String})],t.SuModal.prototype,"confirmText",2),lr([At({type:String})],t.SuModal.prototype,"cancelText",2),t.SuModal=lr([Pt("su-modal")],t.SuModal);var dr=Object.defineProperty,cr=Object.getOwnPropertyDescriptor,pr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?cr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&dr(e,r,i),i};t.SuDrawer=class extends $t{constructor(){super(...arguments),this.open=!1,this.title="侧边面板",this.width="360px",this.maskClosable=!0,this.placement="right",this.onKeydown=t=>{"Escape"===t.key&&this.open&&this.maskClosable&&this.close("close")}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown)}willUpdate(){this.style.setProperty("--drawer-width",this.width)}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}handleMaskClick(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}render(){return this.open?ot`
      <div class="mask" @click=${this.handleMaskClick}>
        <aside class="panel" role="dialog" aria-modal="true">
          <header class="header">
            <span>${this.title}</span>
            <button @click=${()=>this.close("close")}>关闭</button>
          </header>
          <div class="body"><slot></slot></div>
        </aside>
      </div>
    `:it}},t.SuDrawer.styles=[Et,x`
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
    `],pr([At({type:Boolean,reflect:!0})],t.SuDrawer.prototype,"open",2),pr([At({type:String})],t.SuDrawer.prototype,"title",2),pr([At({type:String})],t.SuDrawer.prototype,"width",2),pr([At({type:Boolean})],t.SuDrawer.prototype,"maskClosable",2),pr([At({type:String,reflect:!0})],t.SuDrawer.prototype,"placement",2),t.SuDrawer=pr([Pt("su-drawer")],t.SuDrawer);var ur=Object.defineProperty,hr=Object.getOwnPropertyDescriptor,gr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?hr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&ur(e,r,i),i};const br={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};t.SuAlert=class extends $t{constructor(){super(...arguments),this.type="info",this.header="",this.closable=!1,this.showIcon=!0,this.closed=!1}handleClose(){this.closed=!0,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.closed?it:ot`
      <div class="alert ${this.type}" role="alert">
        ${this.showIcon?ot`<span class="icon">${br[this.type]}</span>`:it}
        <div class="main">
          ${this.header?ot`<div class="header">${this.header}</div>`:it}
          <div class="content"><slot></slot></div>
        </div>
        ${this.closable?ot`<button class="close" type="button" aria-label="关闭" @click=${this.handleClose}>✕</button>`:it}
      </div>
    `}},t.SuAlert.styles=[Et,x`
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
    `],gr([At({type:String})],t.SuAlert.prototype,"type",2),gr([At({type:String})],t.SuAlert.prototype,"header",2),gr([At({type:Boolean})],t.SuAlert.prototype,"closable",2),gr([At({type:Boolean})],t.SuAlert.prototype,"showIcon",2),gr([zt()],t.SuAlert.prototype,"closed",2),t.SuAlert=gr([Pt("su-alert")],t.SuAlert);var vr=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,mr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?yr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&vr(e,r,i),i};const fr={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};t.SuMessage=class extends $t{constructor(){super(...arguments),this.type="info",this.duration=3e3}firstUpdated(){this.duration>0&&setTimeout(()=>this.dismiss(),this.duration)}dismiss(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})),this.remove()}render(){return ot`
      <div class="message" role="status">
        <span class="icon ${this.type}">${fr[this.type]}</span>
        <slot></slot>
      </div>
    `}},t.SuMessage.styles=[Et,x`
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
    `],mr([At({type:String})],t.SuMessage.prototype,"type",2),mr([At({type:Number})],t.SuMessage.prototype,"duration",2),t.SuMessage=mr([Pt("su-message")],t.SuMessage);let xr=null;function wr(t,e={}){const r=document.createElement("su-message");return r.type=e.type??"info",r.duration=e.duration??3e3,r.textContent=t,r.style.pointerEvents="auto",(xr&&xr.isConnected||(xr=document.createElement("div"),Object.assign(xr.style,{position:"fixed",top:"16px",left:"50%",transform:"translateX(-50%)",zIndex:"2000",display:"grid",gap:"8px",justifyItems:"center",pointerEvents:"none"}),document.body.appendChild(xr)),xr).appendChild(r),r}wr.info=(t,e)=>wr(t,{type:"info",duration:e}),wr.success=(t,e)=>wr(t,{type:"success",duration:e}),wr.warning=(t,e)=>wr(t,{type:"warning",duration:e}),wr.error=(t,e)=>wr(t,{type:"error",duration:e});var Sr=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,kr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?$r(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Sr(e,r,i),i};t.SuTooltip=class extends $t{constructor(){super(...arguments),this.content="",this.placement="top"}render(){return ot`
      <slot></slot>
      <div class="bubble" role="tooltip">${this.content}</div>
    `}},t.SuTooltip.styles=[Et,x`
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
    `],kr([At({type:String})],t.SuTooltip.prototype,"content",2),kr([At({type:String,reflect:!0})],t.SuTooltip.prototype,"placement",2),t.SuTooltip=kr([Pt("su-tooltip")],t.SuTooltip);var Pr=Object.defineProperty,Cr=Object.getOwnPropertyDescriptor,_r=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Cr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Pr(e,r,i),i};t.SuSpin=class extends $t{constructor(){super(...arguments),this.spinning=!0,this.size="medium",this.tip=""}renderIndicator(){return ot`
      <div class="indicator" role="status" aria-label=${this.tip||"加载中"}>
        <span class="spinner ${this.size}"></span>
        ${this.tip?ot`<span class="tip">${this.tip}</span>`:it}
      </div>
    `}render(){return this.childNodes.length>0?ot`
      <slot></slot>
      ${this.spinning?ot`<div class="overlay">${this.renderIndicator()}</div>`:it}
    `:this.spinning?this.renderIndicator():it}},t.SuSpin.styles=[Et,x`
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
    `],_r([At({type:Boolean})],t.SuSpin.prototype,"spinning",2),_r([At({type:String})],t.SuSpin.prototype,"size",2),_r([At({type:String})],t.SuSpin.prototype,"tip",2),t.SuSpin=_r([Pt("su-spin")],t.SuSpin);var Ar=Object.defineProperty,zr=Object.getOwnPropertyDescriptor,Er=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?zr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ar(e,r,i),i};t.SuProgress=class extends $t{constructor(){super(...arguments),this.percent=0,this.status="normal",this.showText=!0,this.strokeHeight="8px"}willUpdate(){this.style.setProperty("--stroke-height",this.strokeHeight)}get clampedPercent(){return Math.min(100,Math.max(0,this.percent))}render(){const t=this.clampedPercent;return ot`
      <div class="progress" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="track">
          <div class="bar ${this.status}" style="width: ${t}%"></div>
        </div>
        ${this.showText?ot`<span class="text">${t}%</span>`:it}
      </div>
    `}},t.SuProgress.styles=[Et,x`
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
    `],Er([At({type:Number})],t.SuProgress.prototype,"percent",2),Er([At({type:String})],t.SuProgress.prototype,"status",2),Er([At({type:Boolean})],t.SuProgress.prototype,"showText",2),Er([At({type:String})],t.SuProgress.prototype,"strokeHeight",2),t.SuProgress=Er([Pt("su-progress")],t.SuProgress);var Tr=Object.defineProperty,Or=Object.getOwnPropertyDescriptor,Mr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Or(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Tr(e,r,i),i};t.SuMenu=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey="",this.collapsed=!1}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}onSelect(t){this.activeKey=t.key,this.dispatchEvent(new CustomEvent("select",{detail:t,bubbles:!0,composed:!0}))}render(){return ot`
      <nav class="menu" aria-label="menu">
        ${this.mergedItems.map(t=>ot`
            <button
              type="button"
              class="item ${t.key===this.activeKey?"active":""}"
              @click=${()=>this.onSelect(t)}>
              <span class="icon">${t.icon??""}</span>
              ${this.collapsed?"":ot`<span>${t.label}</span>`}
            </button>
          `)}
      </nav>
    `}},t.SuMenu.styles=[Et,x`
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
    `],Mr([At({type:Array,attribute:!1})],t.SuMenu.prototype,"items",2),Mr([At({type:String})],t.SuMenu.prototype,"itemsJson",2),Mr([At({type:String})],t.SuMenu.prototype,"activeKey",2),Mr([At({type:Boolean})],t.SuMenu.prototype,"collapsed",2),t.SuMenu=Mr([Pt("su-menu")],t.SuMenu);var Dr=Object.defineProperty,jr=Object.getOwnPropertyDescriptor,Br=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?jr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Dr(e,r,i),i};t.SuBreadcrumb=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.separator="/"}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}handleClick(t,e){this.dispatchEvent(new CustomEvent("navigate",{detail:{item:t,index:e},bubbles:!0,composed:!0}))}render(){const t=this.mergedItems;return ot`
      <nav>
        ${t.map((e,r)=>{const o=r===t.length-1;return ot`
            <button class=${o?"current":""} @click=${()=>this.handleClick(e,r)}>
              ${e.label}
            </button>
            ${o?"":ot`<span class="sep">${this.separator}</span>`}
          `})}
      </nav>
    `}},t.SuBreadcrumb.styles=[Et,x`
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
    `],Br([At({type:Array,attribute:!1})],t.SuBreadcrumb.prototype,"items",2),Br([At({type:String})],t.SuBreadcrumb.prototype,"itemsJson",2),Br([At({type:String})],t.SuBreadcrumb.prototype,"separator",2),t.SuBreadcrumb=Br([Pt("su-breadcrumb")],t.SuBreadcrumb);var Ir=Object.defineProperty,Nr=Object.getOwnPropertyDescriptor,Hr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Nr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ir(e,r,i),i};t.SuTabs=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey=""}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}get currentKey(){var t;return this.activeKey||(null==(t=this.mergedItems[0])?void 0:t.key)||""}onSelect(t){t.disabled||t.key===this.currentKey||(this.activeKey=t.key,this.dispatchEvent(new CustomEvent("change",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})))}render(){const t=this.currentKey;return ot`
      <div class="nav" role="tablist">
        ${this.mergedItems.map(e=>ot`
            <button
              type="button"
              role="tab"
              aria-selected=${e.key===t?"true":"false"}
              class="tab ${e.key===t?"active":""}"
              ?disabled=${Boolean(e.disabled)}
              @click=${()=>this.onSelect(e)}>
              ${e.label}
            </button>
          `)}
      </div>
      <div class="panel" role="tabpanel">
        <slot name=${t}></slot>
        <slot></slot>
      </div>
    `}},t.SuTabs.styles=[Et,x`
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
    `],Hr([At({type:Array,attribute:!1})],t.SuTabs.prototype,"items",2),Hr([At({type:String})],t.SuTabs.prototype,"itemsJson",2),Hr([At({type:String})],t.SuTabs.prototype,"activeKey",2),t.SuTabs=Hr([Pt("su-tabs")],t.SuTabs);var Rr=Object.defineProperty,Ur=Object.getOwnPropertyDescriptor,Vr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Ur(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Rr(e,r,i),i};t.SuDropdown=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.open=!1,this.onDocumentClick=t=>{this.open&&(t.composedPath().includes(this)||(this.open=!1))}}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.onDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.onDocumentClick)}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}toggle(){this.open=!this.open}onSelect(t){t.disabled||(this.open=!1,this.dispatchEvent(new CustomEvent("select",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})))}render(){return ot`
      <div class="trigger" @click=${this.toggle}>
        <slot></slot>
      </div>
      ${this.open?ot`
            <div class="menu" role="menu">
              ${this.mergedItems.map(t=>ot`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${t.danger?"danger":""}"
                    ?disabled=${Boolean(t.disabled)}
                    @click=${()=>this.onSelect(t)}>
                    ${t.label}
                  </button>
                `)}
            </div>
          `:it}
    `}},t.SuDropdown.styles=[Et,x`
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
    `],Vr([At({type:Array,attribute:!1})],t.SuDropdown.prototype,"items",2),Vr([At({type:String})],t.SuDropdown.prototype,"itemsJson",2),Vr([zt()],t.SuDropdown.prototype,"open",2),t.SuDropdown=Vr([Pt("su-dropdown")],t.SuDropdown);var Lr=Object.defineProperty,Kr=Object.getOwnPropertyDescriptor,Jr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Kr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Lr(e,r,i),i};t.SuSteps=class extends $t{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.current=0}get mergedItems(){return this.items.length>0?this.items:be(this.itemsJson,[])}render(){const t=this.mergedItems;return ot`
      <div class="steps">
        ${t.map((e,r)=>{const o=r<this.current?"finished":r===this.current?"active":"";return ot`
            <div class="step ${o}">
              <span class="indicator">${r<this.current?"✓":r+1}</span>
              <div class="content">
                <div class="title">${e.title}</div>
                ${e.description?ot`<div class="description">${e.description}</div>`:it}
              </div>
              ${r<t.length-1?ot`<span class="connector"></span>`:it}
            </div>
          `})}
      </div>
    `}},t.SuSteps.styles=[Et,x`
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
    `],Jr([At({type:Array,attribute:!1})],t.SuSteps.prototype,"items",2),Jr([At({type:String})],t.SuSteps.prototype,"itemsJson",2),Jr([At({type:Number})],t.SuSteps.prototype,"current",2),t.SuSteps=Jr([Pt("su-steps")],t.SuSteps);var qr=Object.defineProperty,Fr=Object.getOwnPropertyDescriptor,Yr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Fr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&qr(e,r,i),i};t.SuContainer=class extends $t{constructor(){super(...arguments),this.siderWidth="220px",this.headerHeight="56px"}willUpdate(){this.style.setProperty("--sider-width",this.siderWidth),this.style.setProperty("--header-height",this.headerHeight)}render(){return ot`
      <div class="layout">
        <aside class="sider"><slot name="sider"></slot></aside>
        <header class="header"><slot name="header"></slot></header>
        <main class="content"><slot></slot></main>
      </div>
    `}},t.SuContainer.styles=[Et,x`
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
    `],Yr([At({type:String})],t.SuContainer.prototype,"siderWidth",2),Yr([At({type:String})],t.SuContainer.prototype,"headerHeight",2),t.SuContainer=Yr([Pt("su-container")],t.SuContainer);var Xr=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,Zr=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Wr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Xr(e,r,i),i};t.SuDivider=class extends $t{constructor(){super(...arguments),this.direction="horizontal",this.dashed=!1}render(){if("vertical"===this.direction)return ot``;const t=this.childNodes.length>0;return ot`
      <div class="divider ${t?"":"plain"}" role="separator">
        <slot></slot>
      </div>
    `}},t.SuDivider.styles=[Et,x`
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
    `],Zr([At({type:String,reflect:!0})],t.SuDivider.prototype,"direction",2),Zr([At({type:Boolean,reflect:!0})],t.SuDivider.prototype,"dashed",2),t.SuDivider=Zr([Pt("su-divider")],t.SuDivider);var Gr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,to=(t,e,r,o)=>{for(var s,i=o>1?void 0:o?Qr(e,r):e,a=t.length-1;a>=0;a--)(s=t[a])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Gr(e,r,i),i};t.SuThemeToggle=class extends $t{constructor(){super(...arguments),this.mode="light",this.onThemeChange=()=>{this.mode=c()}}connectedCallback(){super.connectedCallback(),this.mode=c(),window.addEventListener("su-theme-change",this.onThemeChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("su-theme-change",this.onThemeChange)}handleClick(){this.mode=u(),this.dispatchEvent(new CustomEvent("change",{detail:{mode:this.mode},bubbles:!0,composed:!0}))}render(){const t="dark"===this.mode;return ot`
      <button
        type="button"
        aria-label=${t?"切换到亮色主题":"切换到暗色主题"}
        title=${t?"切换到亮色主题":"切换到暗色主题"}
        @click=${this.handleClick}>
        ${t?"🌙":"☀️"}
      </button>
    `}},t.SuThemeToggle.styles=[Et,Tt,x`
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
    `],to([zt()],t.SuThemeToggle.prototype,"mode",2),t.SuThemeToggle=to([Pt("su-theme-toggle")],t.SuThemeToggle),g(),t.getThemeMode=c,t.initTheme=g,t.message=wr,t.resetThemeColors=function(){const t=document.documentElement;Object.values(a).forEach(e=>{t.style.removeProperty(e),t.style.removeProperty(`${e}-rgb`),t.style.removeProperty(`${e}-contrast`)});try{localStorage.removeItem(o)}catch{}l()},t.setThemeColors=function(t){const e={...d(),...t};h(e);try{localStorage.setItem(o,JSON.stringify(e))}catch{}l()},t.setThemeMode=p,t.toggleThemeMode=u,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=index.umd.cjs.map
