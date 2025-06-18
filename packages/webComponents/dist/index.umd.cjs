!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).SilenceUi={})}(this,function(t){"use strict";
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */var e;const r=globalThis,n=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let i=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&s.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const r=1===t.length?t[0]:e.reduce((e,r,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new i(r,t,o)},l=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:u,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:g}=Object,b=globalThis,y=b.trustedTypes,f=y?y.emptyScript:"",v=b.reactiveElementPolyfillSupport,m=(t,e)=>t,x={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(n){r=null}}return r}},$=(t,e)=>!u(t,e),w={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:$};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */Symbol.metadata??(Symbol.metadata=Symbol("metadata")),b.litPropertyMetadata??(b.litPropertyMetadata=new WeakMap);let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(t,r,e);void 0!==n&&c(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){const{get:n,set:o}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=null==n?void 0:n.call(this);null==o||o.call(this,e),this.requestUpdate(t,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const t=this._$Eu(e,r);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),null==(t=this.constructor.l)||t.forEach(t=>t(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),void 0!==this.renderRoot&&this.isConnected&&(null==(e=t.hostConnected)||e.call(t))}removeController(t){var e;null==(e=this._$EO)||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(n)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const n of e){const e=document.createElement("style"),o=r.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=n.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostConnected)?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostDisconnected)?void 0:e.call(t)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var r;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(void 0!==o&&!0===n.reflect){const s=(void 0!==(null==(r=n.converter)?void 0:r.toAttribute)?n.converter:x).toAttribute(e,n.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){var r,n;const o=this.constructor,s=o._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=o.getPropertyOptions(s),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null==(r=t.converter)?void 0:r.fromAttribute)?t.converter:x;this._$Em=s,this[s]=i.fromAttribute(e,t.type)??(null==(n=this._$Ej)?void 0:n.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var n;if(void 0!==t){const o=this.constructor,s=this[t];if(r??(r=o.getPropertyOptions(t)),!((r.hasChanged??$)(s,e)||r.useDefault&&r.reflect&&s===(null==(n=this._$Ej)?void 0:n.get(t))&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:n,wrapped:o},s){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,r,n)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),null==(t=this._$EO)||t.forEach(t=>{var e;return null==(e=t.hostUpdate)?void 0:e.call(t)}),this.update(r)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;null==(e=this._$EO)||e.forEach(t=>{var e;return null==(e=t.hostUpdated)?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[m("elementProperties")]=new Map,k[m("finalized")]=new Map,null==v||v({ReactiveElement:k}),(b.reactiveElementVersions??(b.reactiveElementVersions=[])).push("2.1.0");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const _=globalThis,S=_.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,z=`<${P}>`,T=document,O=()=>T.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,B="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,R=/>/g,D=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,N=/"/g,L=/^(?:script|style|textarea|title)$/i,V=(W=1,(t,...e)=>({_$litType$:W,strings:t,values:e})),q=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),Y=new WeakMap,Z=T.createTreeWalker(T,129);var W;function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}class K{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let o=0,s=0;const i=t.length-1,a=this.parts,[l,u]=((t,e)=>{const r=t.length-1,n=[];let o,s=2===e?"<svg>":3===e?"<math>":"",i=M;for(let a=0;a<r;a++){const e=t[a];let r,l,u=-1,c=0;for(;c<e.length&&(i.lastIndex=c,l=i.exec(e),null!==l);)c=i.lastIndex,i===M?"!--"===l[1]?i=j:void 0!==l[1]?i=R:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=D):void 0!==l[3]&&(i=D):i===D?">"===l[0]?(i=o??M,u=-1):void 0===l[1]?u=-2:(u=i.lastIndex-l[2].length,r=l[1],i=void 0===l[3]?D:'"'===l[3]?N:H):i===N||i===H?i=D:i===j||i===R?i=M:(i=D,o=void 0);const p=i===D&&t[a+1].startsWith("/>")?" ":"";s+=i===M?e+z:u>=0?(n.push(r),e.slice(0,u)+E+e.slice(u)+C+p):e+C+(-2===u?a:p)}return[J(t,s+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]})(t,e);if(this.el=K.createElement(l,r),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=Z.nextNode())&&a.length<i;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(E)){const e=u[s++],r=n.getAttribute(t).split(C),i=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:i[2],strings:r,ctor:"."===i[1]?et:"?"===i[1]?rt:"@"===i[1]?nt:tt}),n.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),n.removeAttribute(t));if(L.test(n.tagName)){const t=n.textContent.split(C),e=t.length-1;if(e>0){n.textContent=S?S.emptyScript:"";for(let r=0;r<e;r++)n.append(t[r],O()),Z.nextNode(),a.push({type:2,index:++o});n.append(t[e],O())}}}else if(8===n.nodeType)if(n.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const r=T.createElement("template");return r.innerHTML=t,r}}function F(t,e,r=t,n){var o,s;if(e===q)return e;let i=void 0!==n?null==(o=r._$Co)?void 0:o[n]:r._$Cl;const a=I(e)?void 0:e._$litDirective$;return(null==i?void 0:i.constructor)!==a&&(null==(s=null==i?void 0:i._$AO)||s.call(i,!1),void 0===a?i=void 0:(i=new a(t),i._$AT(t,r,n)),void 0!==n?(r._$Co??(r._$Co=[]))[n]=i:r._$Cl=i),void 0!==i&&(e=F(t,i._$AS(t,e.values),i,n)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,n=((null==t?void 0:t.creationScope)??T).importNode(e,!0);Z.currentNode=n;let o=Z.nextNode(),s=0,i=0,a=r[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=r[++i]}s!==(null==a?void 0:a.index)&&(o=Z.nextNode(),s++)}return Z.currentNode=T,n}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Q{get _$AU(){var t;return(null==(t=this._$AM)?void 0:t._$AU)??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=(null==n?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),I(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:n}=t,o="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=K.createElement(J(n.h,n.h[0]),this.options)),n);if((null==(e=this._$AH)?void 0:e._$AD)===o)this._$AH.p(r);else{const t=new G(o,this),e=t.u(this.options);t.p(r),this.T(e),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,n=0;for(const o of t)n===e.length?e.push(r=new Q(this.O(O()),this.O(O()),this,this.options)):r=e[n],r._$AI(o),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var r;for(null==(r=this._$AP)||r.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cv=t,null==(e=this._$AP)||e.call(this,t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,o){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=X}_$AI(t,e=this,r,n){const o=this.strings;let s=!1;if(void 0===o)t=F(this,t,e,0),s=!I(t)||t!==this._$AH&&t!==q,s&&(this._$AH=t);else{const n=t;let i,a;for(t=o[0],i=0;i<o.length-1;i++)a=F(this,n[r+i],e,i),a===q&&(a=this._$AH[i]),s||(s=!I(a)||a!==this._$AH[i]),a===X?t=X:t!==X&&(t+=(a??"")+o[i+1]),this._$AH[i]=a}s&&!n&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class nt extends tt{constructor(t,e,r,n,o){super(t,e,r,n,o),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??X)===q)return;const r=this._$AH,n=t===X&&r!==X||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==X&&(r===X||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;"function"==typeof this._$AH?this._$AH.call((null==(e=this.options)?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}}const st=_.litHtmlPolyfillSupport;null==st||st(K,Q),(_.litHtmlVersions??(_.litHtmlVersions=[])).push("3.3.0");const it=globalThis;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */class at extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const n=(null==r?void 0:r.renderBefore)??e;let o=n._$litPart$;if(void 0===o){const t=(null==r?void 0:r.renderBefore)??null;n._$litPart$=o=new Q(e.insertBefore(O(),t),t,void 0,r??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null==(t=this._$Do)||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null==(t=this._$Do)||t.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,null==(e=it.litElementHydrateSupport)||e.call(it,{LitElement:at});const lt=it.litElementPolyfillSupport;null==lt||lt({LitElement:at}),(it.litElementVersions??(it.litElementVersions=[])).push("4.2.0");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const ut=t=>(e,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:$},pt=(t=ct,e,r)=>{const{kind:n,metadata:o}=r;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),"accessor"===n){const{name:n}=r;return{set(r){const o=e.get.call(this);e.set.call(this,r),this.requestUpdate(n,o,t)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=r;return function(r){const o=this[n];e.call(this,r),this.requestUpdate(n,o,t)}}throw Error("Unsupported decorator location: "+n)};
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */function ht(t){return(e,r)=>"object"==typeof r?pt(t,e,r):((t,e,r)=>{const n=e.hasOwnProperty(r);return e.constructor.createProperty(r,t),n?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */function dt(t){return ht({...t,state:!0,attribute:!1})}var gt=Object.defineProperty,bt=Object.getOwnPropertyDescriptor,yt=(t,e,r,n)=>{for(var o,s=n>1?void 0:n?bt(e,r):e,i=t.length-1;i>=0;i--)(o=t[i])&&(s=(n?o(e,r,s):o(s))||s);return n&&s&&gt(e,r,s),s};t.SeButton=class extends at{constructor(){super(...arguments),this.size="medium",this.type="primary",this.disabled=!1,this.loading=!1,this.iconClass="",this.iconPosition="left",this.rippleColor=""}handleClick(t){if(this.disabled||this.loading)return;((t,e={})=>{const r=t.currentTarget,n=document.createElement("div"),o=Math.max(r.clientWidth,r.clientHeight),s=o/2,i=r.getBoundingClientRect(),a=t.clientX-i.left-s,l=t.clientY-i.top-s;n.style.width=n.style.height=`${o}px`,n.style.left=`${a}px`,n.style.top=`${l}px`,n.style.position="absolute",n.classList.add("ripple"),e.color&&n.style.setProperty("--ripple-color",e.color),r.querySelectorAll(".ripple").forEach(t=>t.remove()),r.appendChild(n),n.addEventListener("animationend",()=>{n.remove()})})(t,{color:this.rippleColor||getComputedStyle(this).getPropertyValue("--ripple-color")})}render(){return V`
      <button
        class=${this.getButtonClasses()}
        @click=${this.handleClick}
        ?disabled=${this.disabled}
      >
        ${this.renderIcon("left")}
        ${this.loading?this.renderSpinner():V`<slot></slot>`}
        ${this.renderIcon("right")}
      </button>
    `}getButtonClasses(){return["inline-block w-auto h-auto border-none rounded",this.getSizeClasses(),this.getTypeClasses(),this.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer","relative overflow-hidden"].join(" ")}getSizeClasses(){return{small:"px-2 py-1 text-sm",medium:"px-3 py-2 text-base",large:"px-4 py-3 text-lg"}[this.size]}getTypeClasses(){return{primary:"bg-blue-500 text-white hover:bg-blue-600",secondary:"bg-gray-600 text-white hover:bg-gray-700",success:"bg-green-600 text-white hover:bg-green-700",warning:"bg-yellow-600 text-white hover:bg-yellow-700",danger:"bg-red-500 text-white hover:bg-red-600",info:"bg-blue-400 text-white hover:bg-blue-500",light:"bg-gray-100 text-gray-800 hover:bg-gray-200",dark:"bg-gray-900 text-white hover:bg-gray-800",link:"text-blue-600 hover:text-blue-700 bg-transparent"}[this.type]}renderSpinner(){return V`<span class="spinner"></span>`}renderIcon(t){if(this.iconClass&&this.iconPosition===t)return V`<i class="icon ${"right"===t?"ml-2":"mr-2"} ${this.iconClass}"></i>`}},t.SeButton.styles=a`
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
`,yt([ht({type:String})],t.SeButton.prototype,"size",2),yt([ht({type:String})],t.SeButton.prototype,"type",2),yt([ht({type:Boolean})],t.SeButton.prototype,"disabled",2),yt([ht({type:Boolean})],t.SeButton.prototype,"loading",2),yt([ht({type:String})],t.SeButton.prototype,"iconClass",2),yt([ht({type:String})],t.SeButton.prototype,"iconPosition",2),yt([ht({type:String})],t.SeButton.prototype,"rippleColor",2),t.SeButton=yt([ut("se-button")],t.SeButton);var ft=Object.defineProperty,vt=Object.getOwnPropertyDescriptor,mt=(t,e,r,n)=>{for(var o,s=n>1?void 0:n?vt(e,r):e,i=t.length-1;i>=0;i--)(o=t[i])&&(s=(n?o(e,r,s):o(s))||s);return n&&s&&ft(e,r,s),s};t.SeInput=class extends at{constructor(){super(...arguments),this.value="",this.placeholder="Enter text",this.disabled=!1,this.type="text",this.readonly=!1,this.error=!1,this.label="",this.helperText=""}handleInput(t){const e=t.target;this.value=e.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value}}))}render(){return V`
      <div class="input-container">
        ${this.label?V`<label class="label" for="input">${this.label}</label>`:""}
        <div class="input-wrapper">
          <input
            id="input"
            class="${this.error?"error":""}"
            .value="${this.value}"
            .placeholder="${this.placeholder}"
            .type="${this.type}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            @input="${this.handleInput}"
            aria-invalid="${this.error?"true":"false"}"
            aria-readonly="${this.readonly?"true":"false"}"
          />
        </div>
        ${this.helperText?V`<span class="helper-text ${this.error?"error":""}">
              ${this.helperText}
            </span>`:""}
      </div>
    `}},t.SeInput.styles=a`
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
  `,mt([ht({type:String})],t.SeInput.prototype,"value",2),mt([ht({type:String})],t.SeInput.prototype,"placeholder",2),mt([ht({type:Boolean})],t.SeInput.prototype,"disabled",2),mt([ht({type:String})],t.SeInput.prototype,"type",2),mt([ht({type:Boolean})],t.SeInput.prototype,"readonly",2),mt([ht({type:Boolean})],t.SeInput.prototype,"error",2),mt([ht({type:String})],t.SeInput.prototype,"label",2),mt([ht({type:String})],t.SeInput.prototype,"helperText",2),t.SeInput=mt([ut("se-input")],t.SeInput);var xt=Object.defineProperty,$t=Object.getOwnPropertyDescriptor,wt=(t,e,r,n)=>{for(var o,s=n>1?void 0:n?$t(e,r):e,i=t.length-1;i>=0;i--)(o=t[i])&&(s=(n?o(e,r,s):o(s))||s);return n&&s&&xt(e,r,s),s};t.seTable=class extends at{constructor(){super(),this.data=[],this.columns=[],this.noDataText="No data available",this.borderStyle="1px solid none",this.rowLines=!0,this.columnLines=!0,this.theadBgColor="bg-gray-200",this.theadTextColor="text-gray-800",this.pageSize=10,this.currentPage=1,this.sortedColumns=[],this.sortedData=[],this.sortedColumns=[...this.columns],this.sortedData=[...this.data],this.sortColumn=t=>{const e=this.sortedColumns[t];e.sortable&&(this.sortedData.sort((t,r)=>t[e.key]<r[e.key]?-1:t[e.key]>r[e.key]?1:0),this.sortedColumns=[...this.sortedColumns],this.sortedData=[...this.sortedData])}}willUpdate(t){if(t.has("borderStyle")&&this.style.setProperty("--border-style",this.borderStyle),t.has("rowLines")){const t=this.rowLines?"1px solid #ddd":"none";this.style.setProperty("--row-line",t)}if(t.has("columnLines")){const t=this.columnLines?"1px solid #ddd":"none";this.style.setProperty("--column-line",t)}t.has("theadBgColor")&&this.style.setProperty("--thead-bg-color",this.theadBgColor),t.has("theadTextColor")&&this.style.setProperty("--thead-text-color",this.theadTextColor),(t.has("columns")||t.has("data"))&&(this.sortedColumns=[...this.columns],this.sortedData=[...this.data])}get paginatedData(){const t=(this.currentPage-1)*this.pageSize,e=t+this.pageSize;return this.sortedData.slice(t,e)}handlePageChange(t){const e=t.target;this.currentPage=Number(e.value)}render(){return V`
      <div>
        <table class="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              ${this.sortedColumns.map((t,e)=>V`
                  <th
                    class="${this.theadBgColor} ${this.theadTextColor} font-bold p-2 border-b-2 border-gray-300 ${t.sortable?"cursor-pointer":""}"
                    style="width: ${t.width||"auto"}"
                    @click="${()=>this.sortColumn(e)}">
                    ${t.label}
                  </th>
                `)}
            </tr>
          </thead>
          <tbody>
            ${0===this.paginatedData.length?V`
                  <tr>
                    <td
                      colspan="${this.columns.length}"
                      class="text-center p-2 border border-gray-300">
                      ${this.noDataText}
                    </td>
                  </tr>
                `:this.paginatedData.map(t=>V`
                    <tr>
                      ${this.sortedColumns.map(e=>V`
                          <td class="p-2 border text-center border-gray-300">${t[e.key]}</td>
                        `)}
                    </tr>
                  `)}
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
          of ${Math.ceil(this.sortedData.length/this.pageSize)}
        </div>
      </div>
    `}},t.seTable.styles=a`
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
  `,wt([ht({type:Array})],t.seTable.prototype,"data",2),wt([ht({type:Array})],t.seTable.prototype,"columns",2),wt([ht({type:String})],t.seTable.prototype,"noDataText",2),wt([ht({type:String})],t.seTable.prototype,"borderStyle",2),wt([ht({type:Boolean})],t.seTable.prototype,"rowLines",2),wt([ht({type:Boolean})],t.seTable.prototype,"columnLines",2),wt([ht({type:String})],t.seTable.prototype,"theadBgColor",2),wt([ht({type:String})],t.seTable.prototype,"theadTextColor",2),wt([ht({type:Number})],t.seTable.prototype,"pageSize",2),wt([dt()],t.seTable.prototype,"currentPage",2),wt([dt()],t.seTable.prototype,"sortedColumns",2),wt([dt()],t.seTable.prototype,"sortedData",2),t.seTable=wt([ut("se-table")],t.seTable);var kt=Object.defineProperty,_t=Object.getOwnPropertyDescriptor,St=(t,e,r,n)=>{for(var o,s=n>1?void 0:n?_t(e,r):e,i=t.length-1;i>=0;i--)(o=t[i])&&(s=(n?o(e,r,s):o(s))||s);return n&&s&&kt(e,r,s),s};let At=class extends at{constructor(){super(...arguments),this.src="",this.rotation=0}handleClose(){this.dispatchEvent(new CustomEvent("close"))}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return V`
      <div class="preview">
        <img src="${this.src}" style="--rotation: ${this.rotation}deg;" />
        <button class="close-btn" @click="${this.handleClose}">关闭</button>
        <button class="rotate-btn" @click="${this.handleRotate}">旋转</button>
      </div>
    `}};At.styles=a`
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
  `,St([ht({type:String})],At.prototype,"src",2),St([dt()],At.prototype,"rotation",2),At=St([ut("se-image-preview")],At);var Et=Object.defineProperty,Ct=Object.getOwnPropertyDescriptor,Pt=(t,e,r,n)=>{for(var o,s=n>1?void 0:n?Ct(e,r):e,i=t.length-1;i>=0;i--)(o=t[i])&&(s=(n?o(e,r,s):o(s))||s);return n&&s&&Et(e,r,s),s};t.seImage=class extends at{constructor(){super(...arguments),this.src="",this.alt="",this.lazy=!1,this.placeholder="",this.errorPlaceholder="",this.width=100,this.height=100,this.isError=!1,this.isPreviewVisible=!1,this.rotation=0,this.observer=null}firstUpdated(){var t;this.lazy&&(this.observer=new IntersectionObserver(t=>{t.forEach(t=>{var e;t.isIntersecting&&(this.loadImage(),null==(e=this.observer)||e.disconnect())})}),this.observer.observe(null==(t=this.shadowRoot)?void 0:t.querySelector("img")))}loadImage(){var t;const e=null==(t=this.shadowRoot)?void 0:t.querySelector("img");e&&this.src&&(e.src=this.src)}handleError(){this.isError=!0}handleImageClick(){this.isPreviewVisible=!0}handleClosePreview(){this.isPreviewVisible=!1}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return V`
      <div class="image-container" style="width: ${this.width+"px"}; height: ${this.height+"px"};">
        <img
          class="w-full h-auto block cursor-pointer"
          src="${this.isError?this.errorPlaceholder:this.lazy?this.placeholder:this.src}"
          alt="${this.alt}"
          @error="${this.handleError}"
          @click="${this.handleImageClick}"
        />
        <button class="preview-icon" @click="${this.handleImageClick}">预览</button>
        ${this.isPreviewVisible?V`
          <se-image-preview
            .src="${this.src}"
            @close="${this.handleClosePreview}"
          ></se-image-preview>
        `:""}
      </div>
    `}},t.seImage.styles=a`
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
  `,Pt([ht({type:String})],t.seImage.prototype,"src",2),Pt([ht({type:String})],t.seImage.prototype,"alt",2),Pt([ht({type:Boolean})],t.seImage.prototype,"lazy",2),Pt([ht({type:String})],t.seImage.prototype,"placeholder",2),Pt([ht({type:String})],t.seImage.prototype,"errorPlaceholder",2),Pt([ht({type:Number})],t.seImage.prototype,"width",2),Pt([ht({type:Number})],t.seImage.prototype,"height",2),Pt([dt()],t.seImage.prototype,"isError",2),Pt([dt()],t.seImage.prototype,"isPreviewVisible",2),Pt([dt()],t.seImage.prototype,"rotation",2),t.seImage=Pt([ut("se-image")],t.seImage),console.log(11),Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=index.umd.cjs.map
