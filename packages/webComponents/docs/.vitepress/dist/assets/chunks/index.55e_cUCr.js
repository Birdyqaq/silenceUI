const ir="su-theme-mode",Pt="su-theme-colors",ar="su-theme-dark",Ct="data-su-theme",Re={primary:"--su-color-primary",primaryHover:"--su-color-primary-hover",success:"--su-color-success",warning:"--su-color-warning",error:"--su-color-error",info:"--su-color-info"};function At(t){let e=t.trim().replace(/^#/,"");if(e.length===3&&(e=e.split("").map(o=>o+o).join("")),!/^[0-9a-fA-F]{6}$/.test(e))return null;const r=parseInt(e,16);return[r>>16&255,r>>8&255,r&255]}function wr(t,e){const r=At(t);if(!r)return t;const[o,s,i]=r.map(a=>Math.max(0,Math.round(a*(1-e))));return`#${[o,s,i].map(a=>a.toString(16).padStart(2,"0")).join("")}`}function _r(t){const e=At(t);if(!e)return"#ffffff";const[r,o,s]=e;return(r*299+o*587+s*114)/1e3>=150?"#111827":"#ffffff"}function Ot(){window.dispatchEvent(new CustomEvent("su-theme-change",{detail:{mode:st(),colors:kt()}}))}function kt(){try{return JSON.parse(localStorage.getItem(Pt)??"{}")}catch{return{}}}function st(){return document.documentElement.getAttribute(Ct)==="dark"?"dark":"light"}function Sr(t){const e=document.documentElement;e.setAttribute(Ct,t),e.classList.toggle(ar,t==="dark");try{localStorage.setItem(ir,t)}catch{}Ot()}function Pr(){const t=st()==="dark"?"light":"dark";return Sr(t),t}function nr(t){const e=document.documentElement;Object.keys(Re).forEach(r=>{const o=t[r];if(!o||(e.style.setProperty(Re[r],o),r==="primaryHover"))return;const s=At(o);s&&e.style.setProperty(`${Re[r]}-rgb`,s.join(", ")),e.style.setProperty(`${Re[r]}-contrast`,_r(o))}),t.primary&&!t.primaryHover&&e.style.setProperty("--su-color-primary-hover",wr(t.primary,.15))}function Mo(t){const e={...kt(),...t};nr(e);try{localStorage.setItem(Pt,JSON.stringify(e))}catch{}Ot()}function jo(){const t=document.documentElement;Object.values(Re).forEach(e=>{t.style.removeProperty(e),t.style.removeProperty(`${e}-rgb`),t.style.removeProperty(`${e}-contrast`)});try{localStorage.removeItem(Pt)}catch{}Ot()}function Cr(){if(typeof window>"u")return;let t=null;try{t=localStorage.getItem(ir)}catch{}if(t==="dark"||t==="light"){const r=document.documentElement;r.setAttribute(Ct,t),r.classList.toggle(ar,t==="dark")}const e=kt();Object.keys(e).length>0&&nr(e)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt=globalThis,Et=rt.ShadowRoot&&(rt.ShadyCSS===void 0||rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zt=Symbol(),Ft=new WeakMap;let lr=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==zt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(Et&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Ft.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Ft.set(r,e))}return e}toString(){return this.cssText}};const Ar=t=>new lr(typeof t=="string"?t:t+"",void 0,zt),g=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,s,i)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new lr(r,t,zt)},Or=(t,e)=>{if(Et)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),s=rt.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},Jt=Et?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Ar(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:kr,defineProperty:Er,getOwnPropertyDescriptor:zr,getOwnPropertyNames:Dr,getOwnPropertySymbols:Tr,getPrototypeOf:Mr}=Object,U=globalThis,Wt=U.trustedTypes,jr=Wt?Wt.emptyScript:"",ft=U.reactiveElementPolyfillSupport,Be=(t,e)=>t,ot={toAttribute(t,e){switch(e){case Boolean:t=t?jr:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Dt=(t,e)=>!kr(t,e),Yt={attribute:!0,type:String,converter:ot,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),U.litPropertyMetadata??(U.litPropertyMetadata=new WeakMap);let ve=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Yt){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&Er(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=zr(this.prototype,e)??{get(){return this[r]},set(a){this[r]=a}};return{get:s,set(a){const d=s==null?void 0:s.call(this);i==null||i.call(this,a),this.requestUpdate(e,d,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Yt}static _$Ei(){if(this.hasOwnProperty(Be("elementProperties")))return;const e=Mr(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Be("properties"))){const r=this.properties,o=[...Dr(r),...Tr(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(Jt(s))}else e!==void 0&&r.push(Jt(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Or(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var i;const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const a=(((i=o.converter)==null?void 0:i.toAttribute)!==void 0?o.converter:ot).toAttribute(r,o.type);this._$Em=e,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,r){var i,a;const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const d=o.getPropertyOptions(s),c=typeof d.converter=="function"?{fromAttribute:d.converter}:((i=d.converter)==null?void 0:i.fromAttribute)!==void 0?d.converter:ot;this._$Em=s,this[s]=c.fromAttribute(r,d.type)??((a=this._$Ej)==null?void 0:a.get(s))??null,this._$Em=null}}requestUpdate(e,r,o){var s;if(e!==void 0){const i=this.constructor,a=this[e];if(o??(o=i.getPropertyOptions(e)),!((o.hasChanged??Dt)(a,r)||o.useDefault&&o.reflect&&a===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},a){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??r??this[e]),i!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:d}=a,c=this[i];d!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var s;return(s=o.hostUpdated)==null?void 0:s.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};ve.elementStyles=[],ve.shadowRootOptions={mode:"open"},ve[Be("elementProperties")]=new Map,ve[Be("finalized")]=new Map,ft==null||ft({ReactiveElement:ve}),(U.reactiveElementVersions??(U.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie=globalThis,it=Ie.trustedTypes,Xt=it?it.createPolicy("lit-html",{createHTML:t=>t}):void 0,cr="$lit$",H=`lit$${Math.random().toFixed(9).slice(2)}$`,dr="?"+H,Rr=`<${dr}>`,se=document,He=()=>se.createComment(""),Ue=t=>t===null||typeof t!="object"&&typeof t!="function",Tt=Array.isArray,Br=t=>Tt(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",yt=`[ 	
\f\r]`,Me=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Zt=/-->/g,Gt=/>/g,G=RegExp(`>|${yt}(?:([^\\s"'>=/]+)(${yt}*=${yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Qt=/'/g,er=/"/g,pr=/^(?:script|style|textarea|title)$/i,Ir=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),l=Ir(1),L=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),tr=new WeakMap,te=se.createTreeWalker(se,129);function ur(t,e){if(!Tt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xt!==void 0?Xt.createHTML(e):e}const Nr=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",a=Me;for(let d=0;d<r;d++){const c=t[d];let h,m,u=-1,w=0;for(;w<c.length&&(a.lastIndex=w,m=a.exec(c),m!==null);)w=a.lastIndex,a===Me?m[1]==="!--"?a=Zt:m[1]!==void 0?a=Gt:m[2]!==void 0?(pr.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=G):m[3]!==void 0&&(a=G):a===G?m[0]===">"?(a=s??Me,u=-1):m[1]===void 0?u=-2:(u=a.lastIndex-m[2].length,h=m[1],a=m[3]===void 0?G:m[3]==='"'?er:Qt):a===er||a===Qt?a=G:a===Zt||a===Gt?a=Me:(a=G,s=void 0);const $=a===G&&t[d+1].startsWith("/>")?" ":"";i+=a===Me?c+Rr:u>=0?(o.push(h),c.slice(0,u)+cr+c.slice(u)+H+$):c+H+(u===-2?d:$)}return[ur(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Le{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,a=0;const d=e.length-1,c=this.parts,[h,m]=Nr(e,r);if(this.el=Le.createElement(h,o),te.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=te.nextNode())!==null&&c.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(cr)){const w=m[a++],$=s.getAttribute(u).split(H),_=/([.?@])?(.*)/.exec(w);c.push({type:1,index:i,name:_[2],strings:$,ctor:_[1]==="."?Ur:_[1]==="?"?Lr:_[1]==="@"?Kr:ct}),s.removeAttribute(u)}else u.startsWith(H)&&(c.push({type:6,index:i}),s.removeAttribute(u));if(pr.test(s.tagName)){const u=s.textContent.split(H),w=u.length-1;if(w>0){s.textContent=it?it.emptyScript:"";for(let $=0;$<w;$++)s.append(u[$],He()),te.nextNode(),c.push({type:2,index:++i});s.append(u[w],He())}}}else if(s.nodeType===8)if(s.data===dr)c.push({type:2,index:i});else{let u=-1;for(;(u=s.data.indexOf(H,u+1))!==-1;)c.push({type:7,index:i}),u+=H.length-1}i++}}static createElement(e,r){const o=se.createElement("template");return o.innerHTML=e,o}}function ye(t,e,r=t,o){var a,d;if(e===L)return e;let s=o!==void 0?(a=r._$Co)==null?void 0:a[o]:r._$Cl;const i=Ue(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((d=s==null?void 0:s._$AO)==null||d.call(s,!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=s:r._$Cl=s),s!==void 0&&(e=ye(t,s._$AS(t,e.values),s,o)),e}let Hr=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=((e==null?void 0:e.creationScope)??se).importNode(r,!0);te.currentNode=s;let i=te.nextNode(),a=0,d=0,c=o[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new Pe(i,i.nextSibling,this,e):c.type===1?h=new c.ctor(i,c.name,c.strings,this,e):c.type===6&&(h=new Vr(i,this,e)),this._$AV.push(h),c=o[++d]}a!==(c==null?void 0:c.index)&&(i=te.nextNode(),a++)}return te.currentNode=se,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}};class Pe{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ye(this,e,r),Ue(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==L&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Br(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&Ue(this._$AH)?this._$AA.nextSibling.data=e:this.T(se.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Le.createElement(ur(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const a=new Hr(s,this),d=a.u(this.options);a.p(r),this.T(d),this._$AH=a}}_$AC(e){let r=tr.get(e.strings);return r===void 0&&tr.set(e.strings,r=new Le(e)),r}k(e){Tt(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new Pe(this.O(He()),this.O(He()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class ct{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=p}_$AI(e,r=this,o,s){const i=this.strings;let a=!1;if(i===void 0)e=ye(this,e,r,0),a=!Ue(e)||e!==this._$AH&&e!==L,a&&(this._$AH=e);else{const d=e;let c,h;for(e=i[0],c=0;c<i.length-1;c++)h=ye(this,d[o+c],r,c),h===L&&(h=this._$AH[c]),a||(a=!Ue(h)||h!==this._$AH[c]),h===p?e=p:e!==p&&(e+=(h??"")+i[c+1]),this._$AH[c]=h}a&&!s&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ur extends ct{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class Lr extends ct{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class Kr extends ct{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=ye(this,e,r,0)??p)===L)return;const o=this._$AH,s=e===p&&o!==p||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==p&&(o===p||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class Vr{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ye(this,e)}}const qr={I:Pe},mt=Ie.litHtmlPolyfillSupport;mt==null||mt(Le,Pe),(Ie.litHtmlVersions??(Ie.litHtmlVersions=[])).push("3.3.0");const Fr=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let s=o._$litPart$;if(s===void 0){const i=(r==null?void 0:r.renderBefore)??null;o._$litPart$=s=new Pe(e.insertBefore(He(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const re=globalThis;let b=class extends ve{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Fr(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return L}};var or;b._$litElement$=!0,b.finalized=!0,(or=re.litElementHydrateSupport)==null||or.call(re,{LitElement:b});const xt=re.litElementPolyfillSupport;xt==null||xt({LitElement:b});(re.litElementVersions??(re.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const f=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jr={attribute:!0,type:String,converter:ot,reflect:!1,hasChanged:Dt},Wr=(t=Jr,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:a}=r;return{set(d){const c=e.get.call(this);e.set.call(this,d),this.requestUpdate(a,c,t)},init(d){return d!==void 0&&this.C(a,void 0,t,d),d}}}if(o==="setter"){const{name:a}=r;return function(d){const c=this[a];e.call(this,d),this.requestUpdate(a,c,t)}}throw Error("Unsupported decorator location: "+o)};function n(t){return(e,r)=>typeof r=="object"?Wr(t,e,r):((o,s,i)=>{const a=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),a?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function P(t){return n({...t,state:!0,attribute:!1})}function Yr(t,e={},r){const o=r||t.currentTarget;if(!o)return;const s=o.getBoundingClientRect(),i=t.clientX-s.left,a=t.clientY-s.top,d=[Math.hypot(i,a),Math.hypot(s.width-i,a),Math.hypot(i,s.height-a),Math.hypot(s.width-i,s.height-a)],c=Math.max(...d)*2,h=e.duration??560;o.querySelectorAll(".ripple-effect").forEach(u=>u.remove());const m=document.createElement("span");m.className="ripple-effect",m.setAttribute("aria-hidden","true"),m.style.left=`${i-c/2}px`,m.style.top=`${a-c/2}px`,m.style.width=`${c}px`,m.style.height=`${c}px`,e.color&&(m.style.backgroundColor=e.color),e.duration&&(m.style.animationDuration=`${h}ms`),o.appendChild(m),window.setTimeout(()=>m.remove(),h)}function X(t,e){if(!t)return e;try{const r=JSON.parse(t);return Array.isArray(r)?r:e}catch{return e}}function Xr(t){let e=t;for(;e;){const r=e.closest("form");if(r)return r;const o=e.getRootNode();e=o instanceof ShadowRoot?o.host:null}return null}const x=g`
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
`,z=g`
  :focus-visible {
    outline: 2px solid var(--su-color-primary);
    outline-offset: 1px;
  }
`,Zr=[z,g`
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
  `];var Gr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,k=(t,e,r,o)=>{for(var s=o>1?void 0:o?Qr(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Gr(e,r,s),s};let C=class extends b{constructor(){super(...arguments),this.size="medium",this.type="primary",this.disabled=!1,this.loading=!1,this.iconClass="",this.iconPosition="left",this.rippleColor="",this.ripple=!0,this.block=!1,this.round=!1,this.nativeType="button"}static get observedAttributes(){return[...super.observedAttributes,"nativetype"]}attributeChangedCallback(t,e,r){if(t==="nativetype"){this.hasAttribute("native-type")||(this.nativeType=r==="submit"||r==="reset"||r==="button"?r:"button");return}super.attributeChangedCallback(t,e,r)}get isInactive(){return this.disabled||this.loading}get resolvedNativeType(){const t=this.getAttribute("native-type")??this.getAttribute("nativetype");return t==="submit"||t==="reset"||t==="button"?t:this.nativeType??"button"}handleClick(t){if(this.isInactive){t.stopImmediatePropagation(),t.preventDefault();return}if(this.ripple)try{const r=t.currentTarget;Yr(t,this.rippleColor?{color:this.rippleColor}:{},r??void 0)}catch(r){console.error("Error creating ripple effect:",r)}const e=Xr(this);e&&(this.resolvedNativeType==="submit"?(t.preventDefault(),e.requestSubmit()):this.resolvedNativeType==="reset"&&(t.preventDefault(),e.reset()))}renderIcon(t){return!this.iconClass||this.iconPosition!==t?p:l`<i class="icon ${t} ${this.iconClass}" aria-hidden="true"></i>`}render(){return l`
      <button
        type=${this.resolvedNativeType}
        ?disabled=${this.isInactive}
        aria-busy=${this.loading?"true":"false"}
        aria-disabled=${this.isInactive?"true":"false"}
        @click=${this.handleClick}
      >
        ${this.loading?l`<span class="spinner" aria-hidden="true"></span>`:p}
        <span class="label">
          ${this.renderIcon("left")}
          <slot></slot>
          ${this.renderIcon("right")}
        </span>
      </button>
    `}};C.styles=Zr;k([n({type:String,reflect:!0})],C.prototype,"size",2);k([n({type:String,reflect:!0})],C.prototype,"type",2);k([n({type:Boolean,reflect:!0})],C.prototype,"disabled",2);k([n({type:Boolean,reflect:!0})],C.prototype,"loading",2);k([n({type:String})],C.prototype,"iconClass",2);k([n({type:String})],C.prototype,"iconPosition",2);k([n({type:String})],C.prototype,"rippleColor",2);k([n({type:Boolean})],C.prototype,"ripple",2);k([n({type:Boolean,reflect:!0})],C.prototype,"block",2);k([n({type:Boolean,reflect:!0})],C.prototype,"round",2);k([n({type:String,attribute:"native-type"})],C.prototype,"nativeType",2);C=k([f("su-button")],C);class de{constructor(e,r){this.host=e,this.getValue=r,e.addController(this);try{this.internals=e.attachInternals()}catch{this.internals=null}}hostUpdated(){this.sync()}sync(){var e,r;(r=(e=this.internals)==null?void 0:e.setFormValue)==null||r.call(e,this.getValue())}get form(){var e;return((e=this.internals)==null?void 0:e.form)??null}}var es=Object.defineProperty,ts=Object.getOwnPropertyDescriptor,D=(t,e,r,o)=>{for(var s=o>1?void 0:o?ts(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&es(e,r,s),s};let A=class extends b{constructor(){super(...arguments),this.value="",this.name="",this.placeholder="请输入",this.disabled=!1,this.type="text",this.readonly=!1,this.error=!1,this.label="",this.helperText="",this.clearable=!1,this.defaultValue="",this.formValue=new de(this,()=>this.disabled?null:this.value)}emitChange(){this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}handleInput(t){const e=t.target;this.value=e.value,this.emitChange()}handleClear(){var t,e;this.disabled||this.readonly||(this.value="",this.emitChange(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),(e=(t=this.shadowRoot)==null?void 0:t.querySelector("input"))==null||e.focus())}firstUpdated(){this.defaultValue=this.value}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(t){typeof t=="string"&&(this.value=t)}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("input"))==null||r.focus(t)}render(){return l`
      <div class="input-container">
        ${this.label?l`<label class="label" for="input">${this.label}</label>`:""}
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
          ${this.clearable&&this.value?l`<button
                class="clear-btn"
                type="button"
                aria-label="清空"
                @click=${this.handleClear}
              >
                ✕
              </button>`:""}
        </div>
        ${this.helperText?l`<span class="helper-text ${this.error?"error":""}">${this.helperText}</span>`:""}
      </div>
    `}};A.formAssociated=!0;A.styles=[x,z,g`
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
    `];D([n({type:String})],A.prototype,"value",2);D([n({type:String})],A.prototype,"name",2);D([n({type:String})],A.prototype,"placeholder",2);D([n({type:Boolean,reflect:!0})],A.prototype,"disabled",2);D([n({type:String})],A.prototype,"type",2);D([n({type:Boolean})],A.prototype,"readonly",2);D([n({type:Boolean})],A.prototype,"error",2);D([n({type:String})],A.prototype,"label",2);D([n({type:String})],A.prototype,"helperText",2);D([n({type:Boolean})],A.prototype,"clearable",2);A=D([f("su-input")],A);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hr={ATTRIBUTE:1,CHILD:2},br=t=>(...e)=>({_$litDirective$:t,values:e});let gr=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:rs}=qr,rr=()=>document.createComment(""),je=(t,e,r)=>{var i;const o=t._$AA.parentNode,s=e===void 0?t._$AB:e._$AA;if(r===void 0){const a=o.insertBefore(rr(),s),d=o.insertBefore(rr(),s);r=new rs(a,d,t,t.options)}else{const a=r._$AB.nextSibling,d=r._$AM,c=d!==t;if(c){let h;(i=r._$AQ)==null||i.call(r,t),r._$AM=t,r._$AP!==void 0&&(h=t._$AU)!==d._$AU&&r._$AP(h)}if(a!==s||c){let h=r._$AA;for(;h!==a;){const m=h.nextSibling;o.insertBefore(h,s),h=m}}}return r},Q=(t,e,r=t)=>(t._$AI(e,r),t),ss={},os=(t,e=ss)=>t._$AH=e,is=t=>t._$AH,$t=t=>{var o;(o=t._$AP)==null||o.call(t,!1,!0);let e=t._$AA;const r=t._$AB.nextSibling;for(;e!==r;){const s=e.nextSibling;e.remove(),e=s}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sr=(t,e,r)=>{const o=new Map;for(let s=e;s<=r;s++)o.set(t[s],s);return o},as=br(class extends gr{constructor(t){if(super(t),t.type!==hr.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;r===void 0?r=e:e!==void 0&&(o=e);const s=[],i=[];let a=0;for(const d of t)s[a]=o?o(d,a):a,i[a]=r(d,a),a++;return{values:i,keys:s}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const s=is(t),{values:i,keys:a}=this.dt(e,r,o);if(!Array.isArray(s))return this.ut=a,i;const d=this.ut??(this.ut=[]),c=[];let h,m,u=0,w=s.length-1,$=0,_=i.length-1;for(;u<=w&&$<=_;)if(s[u]===null)u++;else if(s[w]===null)w--;else if(d[u]===a[$])c[$]=Q(s[u],i[$]),u++,$++;else if(d[w]===a[_])c[_]=Q(s[w],i[_]),w--,_--;else if(d[u]===a[_])c[_]=Q(s[u],i[_]),je(t,c[_+1],s[u]),u++,_--;else if(d[w]===a[$])c[$]=Q(s[w],i[$]),je(t,s[u],s[w]),w--,$++;else if(h===void 0&&(h=sr(a,$,_),m=sr(d,u,w)),h.has(d[u]))if(h.has(d[w])){const E=m.get(a[$]),Te=E!==void 0?s[E]:null;if(Te===null){const Z=je(t,s[u]);Q(Z,i[$]),c[$]=Z}else c[$]=Q(Te,i[$]),je(t,s[u],Te),s[E]=null;$++}else $t(s[w]),w--;else $t(s[u]),u++;for(;$<=_;){const E=je(t,c[_+1]);Q(E,i[$]),c[$++]=E}for(;u<=w;){const E=s[u++];E!==null&&$t(E)}return this.ut=a,os(t,c),L}}),ns=g`
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
`;var ls=Object.defineProperty,cs=Object.getOwnPropertyDescriptor,dt=(t,e,r,o)=>{for(var s=o>1?void 0:o?cs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&ls(e,r,s),s};let me=class extends b{constructor(){super(...arguments),this.currentPage=1,this.total=0,this.pageSize=10}get totalPages(){return this.total<=0?1:Math.max(1,Math.ceil(this.total/this.pageSize))}clampPage(t){return Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1))}emitChange(t){const e=this.clampPage(t);e!==this.currentPage&&(this.currentPage=e,this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0})))}handlePageInput(t){const e=t.target;this.emitChange(Number(e.value))}handlePrevPage(){this.emitChange(this.currentPage-1)}handleNextPage(){this.emitChange(this.currentPage+1)}render(){return l`
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
    `}};me.styles=g`
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
  `;dt([n({type:Number})],me.prototype,"currentPage",2);dt([n({type:Number})],me.prototype,"total",2);dt([n({type:Number})],me.prototype,"pageSize",2);me=dt([f("se-pagination")],me);var ds=Object.defineProperty,ps=Object.getOwnPropertyDescriptor,y=(t,e,r,o)=>{for(var s=o>1?void 0:o?ps(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&ds(e,r,s),s};let v=class extends b{constructor(){super(),this.data=[],this.columns=[],this.noDataText="暂无数据",this.borderStyle="1px solid var(--su-border-color)",this.rowLines=!0,this.columnLines=!0,this.theadBgColor="",this.theadTextColor="",this.pageSize=10,this.pagination=!0,this.striped=!1,this.hoverable=!1,this.stickyHeader=!1,this.height="",this.rowKey="id",this.selectable=!1,this.selectedKeys=[],this.loading=!1,this.infiniteScroll=!1,this.hasMore=!1,this.loadingMore=!1,this.loadMoreOffset=80,this.loadMoreText="下拉到底部加载更多",this.loadingText="加载中...",this.noMoreText="没有更多数据了",this.virtualScroll=!1,this.virtualThreshold=1e3,this.virtualRowHeight=44,this.virtualBuffer=8,this.currentPage=1,this.sortedColumns=[],this.sortedData=[],this.scrollTop=0,this.viewportHeight=0,this.loadMorePending=!1,this.sortedColumns=[...this.columns],this.sortedData=[...this.data],this.sortColumn=t=>{const e=this.sortedColumns[t];if(!e.sortable)return;const r=e.sortDirection==="asc"?"desc":e.sortDirection==="desc"?"":"asc";this.sortedColumns=this.sortedColumns.map((o,s)=>({...o,sortDirection:s===t?r:""})),r===""?this.sortedData=[...this.data]:this.sortedData=[...this.data].sort((o,s)=>{const i=this.compareValues(o[e.key],s[e.key]);return r==="asc"?i:i*-1}),this.currentPage=1,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("sort-change",{detail:{column:e.key,direction:r},bubbles:!0,composed:!0}))}}willUpdate(t){if(t.has("borderStyle")&&this.style.setProperty("--border-style",this.borderStyle),t.has("rowLines")){const e=this.rowLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--row-line",e)}if(t.has("columnLines")){const e=this.columnLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--column-line",e)}t.has("theadBgColor")&&(this.theadBgColor?this.style.setProperty("--thead-bg-color",this.theadBgColor):this.style.removeProperty("--thead-bg-color")),t.has("theadTextColor")&&(this.theadTextColor?this.style.setProperty("--thead-text-color",this.theadTextColor):this.style.removeProperty("--thead-text-color")),(t.has("columns")||t.has("data"))&&(this.sortedColumns=this.columns.map(e=>({...e,sortDirection:""})),this.sortedData=[...this.data],this.currentPage=1),(t.has("pageSize")||t.has("pagination")||t.has("infiniteScroll"))&&(this.currentPage=1,this.scrollTop=0,this.resetViewportScroll()),t.has("loadingMore")&&!this.loadingMore&&(this.loadMorePending=!1)}firstUpdated(){this.measureViewportHeight()}updated(){this.measureViewportHeight()}compareValues(t,e){if(t==null&&e==null)return 0;if(t==null)return-1;if(e==null)return 1;if(typeof t=="number"&&typeof e=="number")return t-e;const r=String(t),o=String(e);return r.localeCompare(o,"en",{numeric:!0,sensitivity:"base"})}get totalPages(){return Math.max(1,Math.ceil(this.sortedData.length/this.pageSize))}get shouldUsePagination(){return this.pagination&&!this.infiniteScroll}get paginatedData(){const t=(this.currentPage-1)*this.pageSize,e=t+this.pageSize;return this.sortedData.slice(t,e)}get sourceData(){return this.shouldUsePagination?this.paginatedData:this.sortedData}get shouldUseVirtualScroll(){return this.spanMethod?!1:this.virtualScroll||this.sourceData.length>=this.virtualThreshold}get effectiveHeight(){return this.height||"420px"}get totalColumnCount(){return Math.max(1,this.sortedColumns.length+(this.selectable?1:0))}isRowSelected(t,e){return this.selectedKeys.includes(this.getRowKey(t,e))}emitSelectionChange(t){this.selectedKeys=t;const e=new Set(t),r=this.sortedData.filter((o,s)=>e.has(this.getRowKey(o,s)));this.dispatchEvent(new CustomEvent("selection-change",{detail:{keys:t,rows:r},bubbles:!0,composed:!0}))}toggleRowSelection(t,e){const r=this.getRowKey(t,e),o=this.selectedKeys.includes(r)?this.selectedKeys.filter(s=>s!==r):[...this.selectedKeys,r];this.emitSelectionChange(o)}toggleAllSelection(){const t=this.sourceData.map((o,s)=>this.getRowKey(o,s)),r=t.length>0&&t.every(o=>this.selectedKeys.includes(o))?this.selectedKeys.filter(o=>!t.includes(o)):[...new Set([...this.selectedKeys,...t])];this.emitSelectionChange(r)}get virtualState(){const t=this.sourceData;if(!this.shouldUseVirtualScroll)return{start:0,rows:t,topPadding:0,bottomPadding:0};const e=this.viewportHeight||420,r=Math.ceil(e/this.virtualRowHeight)+this.virtualBuffer*2,o=Math.max(0,Math.floor(this.scrollTop/this.virtualRowHeight)-this.virtualBuffer),s=Math.min(t.length,o+r);return{start:o,rows:t.slice(o,s),topPadding:o*this.virtualRowHeight,bottomPadding:(t.length-s)*this.virtualRowHeight}}measureViewportHeight(){const t=this.getViewportElement();t&&this.viewportHeight!==t.clientHeight&&t.clientHeight>0&&(this.viewportHeight=t.clientHeight)}getViewportElement(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".table-viewport")}resetViewportScroll(){const t=this.getViewportElement();t&&(t.scrollTop=0)}getRowKey(t,e){const r=t[this.rowKey];return r!=null&&r!==""?String(r):`row-${e}`}getCellDisplayValue(t,e,r){const o=t[e.key];return e.formatter?e.formatter(o,t,r):o??""}normalizeSpan(t){if(!t)return{rowspan:1,colspan:1};if(Array.isArray(t)){const o=Math.max(0,Math.floor(t[0]??1)),s=Math.max(0,Math.floor(t[1]??1));return{rowspan:o,colspan:s}}const e=Math.max(0,Math.floor(t.rowspan??1)),r=Math.max(0,Math.floor(t.colspan??1));return{rowspan:e,colspan:r}}getCellSpan(t){return this.spanMethod?this.normalizeSpan(this.spanMethod(t)):{rowspan:1,colspan:1}}setCurrentPage(t){const e=Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1));this.currentPage=e,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0}))}handlePaginationChange(t){var r;const e=t;this.setCurrentPage(((r=e.detail)==null?void 0:r.currentPage)??1)}maybeEmitLoadMore(t){!this.infiniteScroll||!this.hasMore||this.loadingMore||this.loadMorePending||t.scrollHeight-t.scrollTop-t.clientHeight>this.loadMoreOffset||(this.loadMorePending=!0,this.dispatchEvent(new CustomEvent("load-more",{detail:{loadedCount:this.sortedData.length},bubbles:!0,composed:!0})))}handleBodyScroll(t){const e=t.target;this.scrollTop=e.scrollTop,e.clientHeight!==this.viewportHeight&&e.clientHeight>0&&(this.viewportHeight=e.clientHeight),this.maybeEmitLoadMore(e)}handleRowClick(t,e){this.dispatchEvent(new CustomEvent("row-click",{detail:{row:t,rowIndex:e},bubbles:!0,composed:!0}))}renderRows(){const t=this.virtualState;if(!(t.rows.length>0))return l`
        <tr>
          <td colspan="${this.totalColumnCount}" class="empty">${this.noDataText}</td>
        </tr>
      `;const r=t.topPadding>0?l`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${t.topPadding}px;"></td>
            </tr>
          `:p,o=t.bottomPadding>0?l`
            <tr class="virtual-spacer" aria-hidden="true">
              <td
                colspan="${this.totalColumnCount}"
                style="height: ${t.bottomPadding}px;"
              ></td>
            </tr>
          `:p,s=this.shouldUsePagination?(this.currentPage-1)*this.pageSize:0,i=new Set,a=as(t.rows,(d,c)=>this.getRowKey(d,t.start+c),(d,c)=>{const h=t.start+c,m=s+h;return l`
          <tr
            class="${this.striped?"striped":""} ${this.hoverable?"hoverable":""}"
            @click="${()=>this.handleRowClick(d,h)}"
          >
            ${this.selectable?l`
                  <td class="selection-cell" @click="${u=>u.stopPropagation()}">
                    <input
                      type="checkbox"
                      .checked="${this.isRowSelected(d,h)}"
                      @change="${()=>this.toggleRowSelection(d,h)}"
                    />
                  </td>
                `:p}
            ${this.sortedColumns.map((u,w)=>{const $=`${h}-${w}`;if(i.has($))return p;const _=this.getCellSpan({row:d,rowIndex:m,column:u,columnIndex:w,data:this.sourceData,columns:this.sortedColumns});if(_.rowspan<=0||_.colspan<=0)return p;for(let Z=0;Z<_.rowspan;Z+=1)for(let tt=0;tt<_.colspan;tt+=1)Z===0&&tt===0||i.add(`${h+Z}-${w+tt}`);const E=u.align??"center",Te=this.getCellDisplayValue(d,u,h);return l`
                <td
                  class="${u.ellipsis?"ellipsis":""}"
                  rowspan="${_.rowspan}"
                  colspan="${_.colspan}"
                  style="text-align: ${E}; max-width: ${u.width||"auto"};"
                >
                  ${Te}
                </td>
              `})}
          </tr>
        `});return l`${r}${a}${o}`}renderPagination(){return this.shouldUsePagination?l`
      <se-pagination
        class="pagination"
        .currentPage="${this.currentPage}"
        .total="${this.sortedData.length}"
        .pageSize="${this.pageSize}"
        @page-change="${this.handlePaginationChange}"
      ></se-pagination>
    `:p}renderLoadMoreStatus(){return this.infiniteScroll?this.loadingMore?l`<div class="status-line">${this.loadingText}</div>`:this.hasMore?l`<div class="status-line">${this.loadMoreText}</div>`:l`<div class="status-line">${this.noMoreText}</div>`:p}renderSelectionHeader(){if(!this.selectable)return p;const t=this.sourceData.map((s,i)=>this.getRowKey(s,i)),e=t.filter(s=>this.selectedKeys.includes(s)),r=t.length>0&&e.length===t.length,o=e.length>0&&!r;return l`
      <th class="selection-cell">
        <input
          type="checkbox"
          aria-label="全选"
          .checked="${r}"
          .indeterminate="${o}"
          @change="${()=>this.toggleAllSelection()}"
        />
      </th>
    `}render(){const t=this.infiniteScroll||this.shouldUseVirtualScroll;return l`
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
                ${this.sortedColumns.map((e,r)=>l`
                    <th
                      class="${e.sortable?"sortable":""}"
                      style="width: ${e.width||"auto"}; text-align: ${e.align||"center"};"
                      data-sort="${e.sortDirection==="asc"?"↑":e.sortDirection==="desc"?"↓":"⇅"}"
                      @click="${()=>this.sortColumn(r)}"
                    >
                      ${e.label}
                    </th>
                  `)}
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
        ${this.loading?l`<div class="loading-overlay"><span class="loading-spinner"></span></div>`:p}
        ${this.renderLoadMoreStatus()} ${this.renderPagination()}
      </div>
    `}};v.styles=[ns,g`
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
    `];y([n({type:Array})],v.prototype,"data",2);y([n({type:Array})],v.prototype,"columns",2);y([n({type:String})],v.prototype,"noDataText",2);y([n({type:String})],v.prototype,"borderStyle",2);y([n({type:Boolean})],v.prototype,"rowLines",2);y([n({type:Boolean})],v.prototype,"columnLines",2);y([n({type:String})],v.prototype,"theadBgColor",2);y([n({type:String})],v.prototype,"theadTextColor",2);y([n({type:Number})],v.prototype,"pageSize",2);y([n({type:Boolean})],v.prototype,"pagination",2);y([n({type:Boolean})],v.prototype,"striped",2);y([n({type:Boolean})],v.prototype,"hoverable",2);y([n({type:Boolean})],v.prototype,"stickyHeader",2);y([n({type:String})],v.prototype,"height",2);y([n({type:String})],v.prototype,"rowKey",2);y([n({type:Boolean})],v.prototype,"selectable",2);y([n({attribute:!1})],v.prototype,"selectedKeys",2);y([n({type:Boolean})],v.prototype,"loading",2);y([n({attribute:!1})],v.prototype,"spanMethod",2);y([n({type:Boolean})],v.prototype,"infiniteScroll",2);y([n({type:Boolean})],v.prototype,"hasMore",2);y([n({type:Boolean})],v.prototype,"loadingMore",2);y([n({type:Number})],v.prototype,"loadMoreOffset",2);y([n({type:String})],v.prototype,"loadMoreText",2);y([n({type:String})],v.prototype,"loadingText",2);y([n({type:String})],v.prototype,"noMoreText",2);y([n({type:Boolean})],v.prototype,"virtualScroll",2);y([n({type:Number})],v.prototype,"virtualThreshold",2);y([n({type:Number})],v.prototype,"virtualRowHeight",2);y([n({type:Number})],v.prototype,"virtualBuffer",2);y([P()],v.prototype,"currentPage",2);y([P()],v.prototype,"sortedColumns",2);y([P()],v.prototype,"sortedData",2);y([P()],v.prototype,"scrollTop",2);y([P()],v.prototype,"viewportHeight",2);y([P()],v.prototype,"loadMorePending",2);v=y([f("se-table")],v);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vr="important",us=" !"+vr,_t=br(class extends gr{constructor(t){var e;if(super(t),t.type!==hr.ATTRIBUTE||t.name!=="style"||((e=t.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const o=t[r];return o==null?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:r}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const o of this.ft)e[o]==null&&(this.ft.delete(o),o.includes("-")?r.removeProperty(o):r[o]=null);for(const o in e){const s=e[o];if(s!=null){this.ft.add(o);const i=typeof s=="string"&&s.endsWith(us);o.includes("-")||i?r.setProperty(o,i?s.slice(0,-11):s,i?vr:""):r[o]=s}}return L}}),wt=["a[href]","button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(",");let Ne=0,fr="";const fe=[];function hs(t){return!t.hasAttribute("disabled")&&t.getAttribute("aria-hidden")!=="true"}function yr(t){const e=Array.from(t.querySelectorAll(wt));return t.querySelectorAll("slot").forEach(r=>{r.assignedElements({flatten:!0}).forEach(o=>{o instanceof HTMLElement&&o.matches(wt)&&e.push(o),e.push(...Array.from(o.querySelectorAll(wt)))})}),[...new Set(e)].filter(hs)}function Mt(){Ne===0&&(fr=document.body.style.overflow,document.body.style.overflow="hidden"),Ne+=1}function jt(){Ne=Math.max(0,Ne-1),Ne===0&&(document.body.style.overflow=fr)}function Rt(t){const e=fe.indexOf(t);e>=0&&fe.splice(e,1),fe.push(t)}function Bt(t){const e=fe.indexOf(t);e>=0&&fe.splice(e,1)}function It(t){return fe.at(-1)===t}function pt(){var e;let t=document.activeElement;for(;(e=t==null?void 0:t.shadowRoot)!=null&&e.activeElement;)t=t.shadowRoot.activeElement;return t instanceof HTMLElement?t:null}function Nt(t){(t.querySelector("[autofocus]")??yr(t)[0]??t).focus()}function Ht(t,e){if(t.key!=="Tab")return;const r=yr(e);if(r.length===0){t.preventDefault(),e.focus();return}const o=pt(),s=o?r.indexOf(o):-1;let i=s+(t.shiftKey?-1:1);if(s===-1)i=t.shiftKey?r.length-1:0;else if(i<0)i=r.length-1;else if(i>=r.length)i=0;else return;t.preventDefault(),r[i].focus()}var bs=Object.defineProperty,gs=Object.getOwnPropertyDescriptor,ut=(t,e,r,o)=>{for(var s=o>1?void 0:o?gs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&bs(e,r,s),s};let xe=class extends b{constructor(){super(...arguments),this.src="",this.alt="",this.rotation=0,this.previouslyFocused=null,this.onKeydown=t=>{var r;if(!It(this))return;const e=(r=this.shadowRoot)==null?void 0:r.querySelector(".preview");e&&Ht(t,e),t.key==="Escape"&&(t.preventDefault(),this.close())}}connectedCallback(){super.connectedCallback(),this.previouslyFocused=pt(),Rt(this),Mt(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){var t;super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown),Bt(this),jt(),(t=this.previouslyFocused)!=null&&t.isConnected&&this.previouslyFocused.focus()}firstUpdated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".preview");t&&Nt(t)}close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}closeByMask(t){t.target===t.currentTarget&&this.close()}rotate(){this.rotation=(this.rotation+90)%360}render(){return l`
      <div
        class="preview"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        tabindex="-1"
        @click=${this.closeByMask}
      >
        <img
          src=${this.src}
          alt=${this.alt}
          style=${_t({transform:`rotate(${this.rotation}deg)`})}
        />
        <div class="toolbar">
          <button type="button" aria-label="顺时针旋转 90 度" @click=${this.rotate}>旋转</button>
          <button type="button" aria-label="关闭图片预览" @click=${this.close}>关闭</button>
        </div>
      </div>
    `}};xe.styles=[x,z,g`
      :host {
        position: fixed;
        inset: 0;
        z-index: 1200;
      }

      .preview {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 56px;
        background: rgba(15, 23, 42, 0.82);
      }

      img {
        display: block;
        max-width: 100%;
        max-height: calc(100vh - 112px);
        object-fit: contain;
        transition: transform 0.2s ease;
      }

      .toolbar {
        position: fixed;
        top: 16px;
        right: 16px;
        display: flex;
        gap: 8px;
      }

      button {
        min-width: 40px;
        min-height: 36px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: var(--su-radius-sm);
        background: rgba(17, 24, 39, 0.88);
        color: #fff;
        cursor: pointer;
        font: inherit;
        padding: 6px 10px;
      }

      button:hover {
        background: rgb(17, 24, 39);
      }

      @media (max-width: 640px) {
        .preview {
          padding: 64px 16px 24px;
        }

        img {
          max-height: calc(100vh - 88px);
        }
      }
    `];ut([n({type:String})],xe.prototype,"src",2);ut([n({type:String})],xe.prototype,"alt",2);ut([P()],xe.prototype,"rotation",2);xe=ut([f("se-image-preview")],xe);var vs=Object.defineProperty,fs=Object.getOwnPropertyDescriptor,O=(t,e,r,o)=>{for(var s=o>1?void 0:o?fs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&vs(e,r,s),s};let S=class extends b{constructor(){super(...arguments),this.src="",this.alt="",this.lazy=!1,this.placeholder="",this.errorPlaceholder="",this.width=100,this.height=100,this.fit="cover",this.preview=!0,this.isError=!1,this.isLoaded=!1,this.isPreviewVisible=!1}willUpdate(t){t.has("src")&&(this.isError=!1,this.isLoaded=!1,this.isPreviewVisible=!1)}get displaySrc(){return this.isError&&this.errorPlaceholder?this.errorPlaceholder:this.src}handleLoad(){this.isLoaded=!0}handleError(){if(!this.isError&&this.errorPlaceholder){this.isError=!0,this.isLoaded=!1;return}this.isLoaded=!0}openPreview(){!this.preview||!this.displaySrc||(this.isPreviewVisible=!0)}closePreview(){this.isPreviewVisible=!1}renderImage(){return l`
      ${!this.isLoaded&&this.placeholder?l`<img class="placeholder" src=${this.placeholder} alt="" aria-hidden="true" />`:p}
      <img
        class="image ${this.isLoaded?"loaded":""}"
        src=${this.displaySrc}
        alt=${this.alt}
        loading=${this.lazy?"lazy":"eager"}
        style=${_t({objectFit:this.fit})}
        @load=${this.handleLoad}
        @error=${this.handleError}
      />
    `}render(){const t=_t({width:`${Math.max(0,this.width)}px`,height:`${Math.max(0,this.height)}px`});return l`
      <div style=${t}>
        ${this.preview?l`
              <button
                class="trigger"
                type="button"
                aria-label=${this.alt?`预览图片：${this.alt}`:"预览图片"}
                @click=${this.openPreview}
              >
                ${this.renderImage()}
              </button>
            `:l`<div class="frame">${this.renderImage()}</div>`}
      </div>
      ${this.isPreviewVisible?l`
            <se-image-preview
              .src=${this.displaySrc}
              .alt=${this.alt}
              @close=${this.closePreview}
            ></se-image-preview>
          `:p}
    `}};S.styles=[x,z,g`
      :host {
        display: inline-block;
      }

      .frame,
      .trigger {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: var(--su-radius-sm);
        background: var(--su-bg-muted);
      }

      .trigger {
        border: 0;
        padding: 0;
        cursor: zoom-in;
        color: inherit;
      }

      img {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }

      .placeholder {
        object-fit: cover;
      }

      .image {
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .image.loaded {
        opacity: 1;
      }
    `];O([n({type:String})],S.prototype,"src",2);O([n({type:String})],S.prototype,"alt",2);O([n({type:Boolean})],S.prototype,"lazy",2);O([n({type:String})],S.prototype,"placeholder",2);O([n({type:String})],S.prototype,"errorPlaceholder",2);O([n({type:Number})],S.prototype,"width",2);O([n({type:Number})],S.prototype,"height",2);O([n({type:String})],S.prototype,"fit",2);O([n({type:Boolean})],S.prototype,"preview",2);O([P()],S.prototype,"isError",2);O([P()],S.prototype,"isLoaded",2);O([P()],S.prototype,"isPreviewVisible",2);S=O([f("se-image")],S);var ys=Object.defineProperty,ms=Object.getOwnPropertyDescriptor,Ut=(t,e,r,o)=>{for(var s=o>1?void 0:o?ms(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&ys(e,r,s),s};let Ke=class extends b{constructor(){super(...arguments),this.direction="horizontal",this.color="#000"}render(){return l`
      <div
        class="line ${this.direction==="horizontal"?"horizontal":"vertical"}"
        style="background-color: ${this.color};"
      ></div>
    `}};Ke.styles=g`
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
  `;Ut([n({type:String})],Ke.prototype,"direction",2);Ut([n({type:String})],Ke.prototype,"color",2);Ke=Ut([f("line-component")],Ke);var xs=Object.defineProperty,$s=Object.getOwnPropertyDescriptor,pe=(t,e,r,o)=>{for(var s=o>1?void 0:o?$s(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&xs(e,r,s),s};let R=class extends b{constructor(){super(...arguments),this.src="",this.thumbnail="",this.title="",this.downloadable=!0,this.type="unknown",this.previewVisible=!1}resolveType(){if(this.type!=="unknown")return this.type;const t=this.src.toLowerCase();return t.match(/\.(png|jpe?g|gif|webp|svg)$/)?"image":t.match(/\.(mp4|webm|mov)$/)?"video":t.match(/\.(mp3|wav|ogg)$/)?"audio":t.endsWith(".pdf")?"pdf":"unknown"}openPreview(){this.src&&(this.previewVisible=!0,this.dispatchEvent(new CustomEvent("asset-open",{detail:{src:this.src,type:this.resolveType()},bubbles:!0,composed:!0})))}closePreview(){this.previewVisible=!1}renderPreviewThumb(){const t=this.resolveType();if(t==="image"){const r=this.thumbnail||this.src;return l`<img src=${r} alt=${this.title||"asset"} loading="lazy" />`}return l`<span>${{image:"图片",video:"视频",audio:"音频",pdf:"PDF",unknown:"文件"}[t]}</span>`}renderOverlay(){if(!this.previewVisible)return null;const t=this.resolveType();return l`
      <div class="overlay" @click=${this.closePreview}>
        <div class="overlay-content" @click=${e=>e.stopPropagation()}>
          <header>
            <h3>${this.title||this.src}</h3>
            <button @click=${this.closePreview}>关闭</button>
          </header>
          ${t==="image"?l`<img src=${this.src} alt=${this.title||"asset"} />`:t==="pdf"?l`<iframe src=${this.src} title="PDF preview"></iframe>`:t==="video"?l`<video src=${this.src} controls></video>`:t==="audio"?l`<audio src=${this.src} controls></audio>`:l`<p>暂不支持预览该文件类型</p>`}
        </div>
      </div>
    `}render(){return l`
      <div class="card">
        <div class="preview" @click=${this.openPreview}>${this.renderPreviewThumb()}</div>
        <div class="meta">
          <p class="title">${this.title||this.src}</p>
          <small>${this.resolveType().toUpperCase()} · 点击预览</small>
        </div>
        <div class="actions">
          <button @click=${this.openPreview}>预览</button>
          ${this.downloadable&&this.src?l`<a class="button-link" href=${this.src} download target="_blank" rel="noreferrer"
                >下载</a
              >`:null}
        </div>
      </div>
      ${this.renderOverlay()}
    `}};R.styles=[x,g`
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
    `];pe([n({type:String})],R.prototype,"src",2);pe([n({type:String})],R.prototype,"thumbnail",2);pe([n({type:String})],R.prototype,"title",2);pe([n({type:Boolean})],R.prototype,"downloadable",2);pe([n({type:String})],R.prototype,"type",2);pe([P()],R.prototype,"previewVisible",2);R=pe([f("se-asset-viewer")],R);var ws=Object.defineProperty,_s=Object.getOwnPropertyDescriptor,ue=(t,e,r,o)=>{for(var s=o>1?void 0:o?_s(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&ws(e,r,s),s};let T=class extends b{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.name="",this.placeholder="请选择",this.disabled=!1,this.defaultValue="",this.formValue=new de(this,()=>this.disabled?null:this.value)}get mergedOptions(){return this.options.length>0?this.options:X(this.optionsJson,[])}handleChange(t){const e=t.target;this.value=e.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}firstUpdated(){this.defaultValue=this.value}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(t){typeof t=="string"&&(this.value=t)}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("select"))==null||r.focus(t)}updated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("select");t&&t.value!==this.value&&(t.value=this.value)}render(){return l`
      <select
        class="select"
        .value=${this.value}
        ?disabled=${this.disabled}
        @change=${this.handleChange}
      >
        <option value="">${this.placeholder}</option>
        ${this.mergedOptions.map(t=>l`<option value=${String(t.value)} ?disabled=${!!t.disabled}>
              ${t.label}
            </option>`)}
      </select>
    `}};T.formAssociated=!0;T.styles=[x,z,g`
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
    `];ue([n({type:Array,attribute:!1})],T.prototype,"options",2);ue([n({type:String})],T.prototype,"optionsJson",2);ue([n({type:String})],T.prototype,"value",2);ue([n({type:String})],T.prototype,"name",2);ue([n({type:String})],T.prototype,"placeholder",2);ue([n({type:Boolean,reflect:!0})],T.prototype,"disabled",2);T=ue([f("su-select")],T);var Ss=Object.defineProperty,Ps=Object.getOwnPropertyDescriptor,We=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ps(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Ss(e,r,s),s};let K=class extends b{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.name="",this.value="on",this.defaultChecked=!1,this.formValue=new de(this,()=>this.disabled||!this.checked?null:this.value)}handleClick(){this.disabled||(this.checked=!this.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0})))}firstUpdated(){this.defaultChecked=this.checked}formResetCallback(){this.checked=this.defaultChecked}formStateRestoreCallback(t){this.checked=t!==null}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("button"))==null||r.focus(t)}render(){return l`
      <button
        class=${this.checked?"checked":""}
        type="button"
        role="switch"
        aria-checked=${this.checked?"true":"false"}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      ></button>
    `}};K.formAssociated=!0;K.styles=[x,z,g`
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

      button.checked {
        background: var(--su-color-primary);
      }

      button.checked::after {
        transform: translateX(18px);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `];We([n({type:Boolean})],K.prototype,"checked",2);We([n({type:Boolean,reflect:!0})],K.prototype,"disabled",2);We([n({type:String})],K.prototype,"name",2);We([n({type:String})],K.prototype,"value",2);K=We([f("su-switch")],K);var Cs=Object.defineProperty,As=Object.getOwnPropertyDescriptor,he=(t,e,r,o)=>{for(var s=o>1?void 0:o?As(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Cs(e,r,s),s};let M=class extends b{constructor(){super(...arguments),this.value="",this.name="",this.placeholder="请输入",this.rows=4,this.disabled=!1,this.readonly=!1,this.defaultValue="",this.formValue=new de(this,()=>this.disabled?null:this.value)}handleInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}firstUpdated(){this.defaultValue=this.value}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(t){typeof t=="string"&&(this.value=t)}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("textarea"))==null||r.focus(t)}render(){return l`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        rows=${this.rows}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        @input=${this.handleInput}
      ></textarea>
    `}};M.formAssociated=!0;M.styles=[x,z,g`
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
    `];he([n({type:String})],M.prototype,"value",2);he([n({type:String})],M.prototype,"name",2);he([n({type:String})],M.prototype,"placeholder",2);he([n({type:Number})],M.prototype,"rows",2);he([n({type:Boolean,reflect:!0})],M.prototype,"disabled",2);he([n({type:Boolean})],M.prototype,"readonly",2);M=he([f("su-textarea")],M);var Os=Object.defineProperty,ks=Object.getOwnPropertyDescriptor,Ye=(t,e,r,o)=>{for(var s=o>1?void 0:o?ks(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Os(e,r,s),s};let oe=class extends b{constructor(){super(...arguments),this.label="",this.message="",this.status="default",this.required=!1}render(){return l`
      <div class="item">
        ${this.label?l`<label class="label">${this.required?l`<span class="required">*</span>`:p}${this.label}</label>`:p}
        <slot></slot>
        ${this.message?l`<div class="message ${this.status}">${this.message}</div>`:p}
      </div>
    `}};oe.styles=[x,g`
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
    `];Ye([n({type:String})],oe.prototype,"label",2);Ye([n({type:String})],oe.prototype,"message",2);Ye([n({type:String})],oe.prototype,"status",2);Ye([n({type:Boolean})],oe.prototype,"required",2);oe=Ye([f("su-form-item")],oe);var Es=Object.defineProperty,zs=Object.getOwnPropertyDescriptor,Ce=(t,e,r,o)=>{for(var s=o>1?void 0:o?zs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Es(e,r,s),s};let B=class extends b{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.name="",this.value="on",this.label="",this.defaultChecked=!1,this.formValue=new de(this,()=>this.disabled||!this.checked?null:this.value)}onChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}firstUpdated(){this.defaultChecked=this.checked}formResetCallback(){this.checked=this.defaultChecked}formStateRestoreCallback(t){this.checked=t!==null}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("input"))==null||r.focus(t)}render(){return l`
      <label>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span>${this.label}</span>
      </label>
    `}};B.formAssociated=!0;B.styles=[x,g`
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
    `];Ce([n({type:Boolean})],B.prototype,"checked",2);Ce([n({type:Boolean,reflect:!0})],B.prototype,"disabled",2);Ce([n({type:String})],B.prototype,"name",2);Ce([n({type:String})],B.prototype,"value",2);Ce([n({type:String})],B.prototype,"label",2);B=Ce([f("su-checkbox")],B);var Ds=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,Ae=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ts(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Ds(e,r,s),s};let I=class extends b{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.name=`su-radio-${Math.random().toString(36).slice(2)}`,this.disabled=!1,this.defaultValue="",this.formValue=new de(this,()=>this.disabled||!this.value?null:this.value)}get mergedOptions(){return this.options.length>0?this.options:X(this.optionsJson,[])}onChange(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}firstUpdated(){this.defaultValue=this.value}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(t){typeof t=="string"&&(this.value=t)}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("input:checked, input:not(:disabled)"))==null||r.focus(t)}render(){return l`
      <div class="group">
        ${this.mergedOptions.map(t=>l`
            <label>
              <input
                type="radio"
                name=${this.name}
                value=${t.value}
                .checked=${this.value===t.value}
                ?disabled=${this.disabled||!!t.disabled}
                @change=${this.onChange}
              />
              <span>${t.label}</span>
            </label>
          `)}
      </div>
    `}};I.formAssociated=!0;I.styles=[x,g`
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
    `];Ae([n({type:Array,attribute:!1})],I.prototype,"options",2);Ae([n({type:String})],I.prototype,"optionsJson",2);Ae([n({type:String})],I.prototype,"value",2);Ae([n({type:String})],I.prototype,"name",2);Ae([n({type:Boolean,reflect:!0})],I.prototype,"disabled",2);I=Ae([f("su-radio-group")],I);var Ms=Object.defineProperty,js=Object.getOwnPropertyDescriptor,be=(t,e,r,o)=>{for(var s=o>1?void 0:o?js(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Ms(e,r,s),s};let j=class extends b{constructor(){super(...arguments),this.value=0,this.name="",this.min=Number.MIN_SAFE_INTEGER,this.max=Number.MAX_SAFE_INTEGER,this.step=1,this.disabled=!1,this.defaultValue=0,this.formValue=new de(this,()=>this.disabled?null:String(this.value))}clamp(t){return Math.min(this.max,Math.max(this.min,t))}get safeStep(){return Number.isFinite(this.step)&&this.step>0?this.step:1}emitChange(t){const e=this.clamp(t);if(e===this.value){this.requestUpdate();return}this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}onInput(t){const e=t.target.value,r=Number(e);e===""||Number.isNaN(r)||this.emitChange(r)}onBlur(t){const e=t.target;e.value=String(this.value)}firstUpdated(){this.defaultValue=this.value}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(t){if(typeof t!="string")return;const e=Number(t);Number.isNaN(e)||(this.value=this.clamp(e))}focus(t){var e,r;(r=(e=this.shadowRoot)==null?void 0:e.querySelector("input"))==null||r.focus(t)}render(){return l`
      <div class="wrapper">
        <button
          type="button"
          aria-label="减少"
          ?disabled=${this.disabled||this.value<=this.min}
          @click=${()=>this.emitChange(this.value-this.safeStep)}
        >
          −
        </button>
        <input
          type="number"
          .value=${String(this.value)}
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.safeStep)}
          ?disabled=${this.disabled}
          @change=${this.onInput}
          @blur=${this.onBlur}
        />
        <button
          type="button"
          aria-label="增加"
          ?disabled=${this.disabled||this.value>=this.max}
          @click=${()=>this.emitChange(this.value+this.safeStep)}
        >
          +
        </button>
      </div>
    `}};j.formAssociated=!0;j.styles=[x,z,g`
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
    `];be([n({type:Number})],j.prototype,"value",2);be([n({type:String})],j.prototype,"name",2);be([n({type:Number})],j.prototype,"min",2);be([n({type:Number})],j.prototype,"max",2);be([n({type:Number})],j.prototype,"step",2);be([n({type:Boolean,reflect:!0})],j.prototype,"disabled",2);j=be([f("su-input-number")],j);var Rs=Object.getOwnPropertyDescriptor,Bs=(t,e,r,o)=>{for(var s=o>1?void 0:o?Rs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=a(s)||s);return s};let St=class extends b{render(){return l`
      <section class="card">
        <header class="header"><slot name="header"></slot></header>
        <div class="content"><slot></slot></div>
        <footer class="footer"><slot name="footer"></slot></footer>
      </section>
    `}};St.styles=[x,g`
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
    `];St=Bs([f("su-card")],St);var Is=Object.defineProperty,Ns=Object.getOwnPropertyDescriptor,mr=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ns(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Is(e,r,s),s};let at=class extends b{constructor(){super(...arguments),this.type="default"}render(){return l`<span class="tag ${this.type}"><slot></slot></span>`}};at.styles=[x,g`
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
    `];mr([n({type:String})],at.prototype,"type",2);at=mr([f("su-tag")],at);var Hs=Object.defineProperty,Us=Object.getOwnPropertyDescriptor,Xe=(t,e,r,o)=>{for(var s=o>1?void 0:o?Us(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Hs(e,r,s),s};let ie=class extends b{constructor(){super(...arguments),this.title="",this.value="",this.trend="",this.trendType="flat"}render(){return l`
      <article class="card">
        <div class="title">${this.title}</div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trendType}">${this.trend}</div>
      </article>
    `}};ie.styles=[x,g`
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
    `];Xe([n({type:String})],ie.prototype,"title",2);Xe([n({type:String})],ie.prototype,"value",2);Xe([n({type:String})],ie.prototype,"trend",2);Xe([n({type:String})],ie.prototype,"trendType",2);ie=Xe([f("su-stat-card")],ie);var Ls=Object.defineProperty,Ks=Object.getOwnPropertyDescriptor,Ze=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ks(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Ls(e,r,s),s};let ae=class extends b{constructor(){super(...arguments),this.count=0,this.max=99,this.dot=!1,this.showZero=!1}get text(){return this.count>this.max?`${this.max}+`:String(this.count)}render(){const t=this.dot||this.count>0||this.showZero&&this.count===0;return l`
      <slot></slot>
      ${t?l`<span class="badge ${this.dot?"dot":""}">${this.dot?"":this.text}</span>`:p}
    `}};ae.styles=[x,g`
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
    `];Ze([n({type:Number})],ae.prototype,"count",2);Ze([n({type:Number})],ae.prototype,"max",2);Ze([n({type:Boolean})],ae.prototype,"dot",2);Ze([n({type:Boolean})],ae.prototype,"showZero",2);ae=Ze([f("su-badge")],ae);var Vs=Object.defineProperty,qs=Object.getOwnPropertyDescriptor,Oe=(t,e,r,o)=>{for(var s=o>1?void 0:o?qs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Vs(e,r,s),s};let V=class extends b{constructor(){super(...arguments),this.src="",this.name="",this.size="medium",this.shape="circle",this.loadError=!1}updated(t){t.has("src")&&(this.loadError=!1)}render(){const t=this.src&&!this.loadError;return l`
      <span class="avatar ${this.shape} ${this.size}">
        ${t?l`<img src=${this.src} alt=${this.name} @error=${()=>this.loadError=!0} />`:l`${this.name.slice(0,1).toUpperCase()}`}
      </span>
    `}};V.styles=[x,g`
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
    `];Oe([n({type:String})],V.prototype,"src",2);Oe([n({type:String})],V.prototype,"name",2);Oe([n({type:String})],V.prototype,"size",2);Oe([n({type:String})],V.prototype,"shape",2);Oe([P()],V.prototype,"loadError",2);V=Oe([f("su-avatar")],V);var Fs=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,xr=(t,e,r,o)=>{for(var s=o>1?void 0:o?Js(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Fs(e,r,s),s};let nt=class extends b{constructor(){super(...arguments),this.description="暂无数据"}render(){return l`
      <div class="empty">
        <span class="icon" aria-hidden="true"></span>
        <span class="description">${this.description}</span>
        <slot></slot>
      </div>
    `}};nt.styles=[x,g`
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
    `];xr([n({type:String})],nt.prototype,"description",2);nt=xr([f("su-empty")],nt);var Ws=Object.defineProperty,Ys=Object.getOwnPropertyDescriptor,Ge=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ys(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Ws(e,r,s),s};let ne=class extends b{constructor(){super(...arguments),this.rows=3,this.avatar=!1,this.animated=!0,this.loading=!0}render(){return this.loading?l`
      <div class="skeleton ${this.animated?"animated":""}" aria-busy="true">
        ${this.avatar?l`<span class="avatar"></span>`:p}
        <div class="lines">
          ${Array.from({length:Math.max(1,this.rows)},()=>l`<div class="row"></div>`)}
        </div>
      </div>
    `:l`<slot></slot>`}};ne.styles=[x,g`
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
    `];Ge([n({type:Number})],ne.prototype,"rows",2);Ge([n({type:Boolean})],ne.prototype,"avatar",2);Ge([n({type:Boolean})],ne.prototype,"animated",2);Ge([n({type:Boolean})],ne.prototype,"loading",2);ne=Ge([f("su-skeleton")],ne);var Xs=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,ke=(t,e,r,o)=>{for(var s=o>1?void 0:o?Zs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Xs(e,r,s),s};let q=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.header="",this.column=2,this.bordered=!1}willUpdate(){this.style.setProperty("--desc-column",String(Math.max(1,this.column)))}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}render(){return l`
      ${this.header?l`<div class="title">${this.header}</div>`:p}
      <div class="grid ${this.bordered?"bordered":""}">
        ${this.mergedItems.map(t=>l`
            <div class="item">
              <span class="label">${t.label}</span>
              <span class="value">${t.value}</span>
            </div>
          `)}
      </div>
    `}};q.styles=[x,g`
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
    `];ke([n({type:Array,attribute:!1})],q.prototype,"items",2);ke([n({type:String})],q.prototype,"itemsJson",2);ke([n({type:String})],q.prototype,"header",2);ke([n({type:Number})],q.prototype,"column",2);ke([n({type:Boolean})],q.prototype,"bordered",2);q=ke([f("su-descriptions")],q);var Gs=Object.defineProperty,Qs=Object.getOwnPropertyDescriptor,ge=(t,e,r,o)=>{for(var s=o>1?void 0:o?Qs(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Gs(e,r,s),s};let N=class extends b{constructor(){super(...arguments),this.open=!1,this.title="提示",this.maskClosable=!0,this.hideFooter=!1,this.confirmText="确定",this.cancelText="取消",this.overlayActive=!1,this.previouslyFocused=null,this.onKeydown=t=>{var r;if(!this.open||!It(this))return;const e=(r=this.shadowRoot)==null?void 0:r.querySelector(".panel");e&&Ht(t,e),t.key==="Escape"&&this.open&&this.maskClosable&&(t.preventDefault(),this.close("escape"))}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown),this.deactivateOverlay(!1)}closeByMask(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}confirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0,cancelable:!0}))&&this.close("confirm")}activateOverlay(){var e;if(this.overlayActive)return;this.overlayActive=!0,this.previouslyFocused=pt(),Rt(this),Mt();const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".panel");t&&Nt(t)}deactivateOverlay(t=!0){var e;this.overlayActive&&(this.overlayActive=!1,Bt(this),jt(),t&&((e=this.previouslyFocused)!=null&&e.isConnected)&&this.previouslyFocused.focus(),this.previouslyFocused=null)}updated(t){t.has("open")&&(this.open?this.activateOverlay():this.deactivateOverlay())}render(){return this.open?l`
      <div class="mask" @click=${this.closeByMask}>
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="su-modal-title"
          tabindex="-1"
        >
          <header id="su-modal-title" class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter?p:l`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${()=>this.close("cancel")}>
                      ${this.cancelText}
                    </button>
                    <button class="confirm" type="button" @click=${this.confirm}>
                      ${this.confirmText}
                    </button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `:p}};N.styles=[x,g`
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
        max-height: calc(100vh - 40px);
        background: var(--su-bg-card);
        border-radius: var(--su-radius-lg);
        box-shadow: var(--su-shadow-md);
        overflow: hidden;
        display: flex;
        flex-direction: column;
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
        overflow: auto;
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
    `];ge([n({type:Boolean,reflect:!0})],N.prototype,"open",2);ge([n({type:String})],N.prototype,"title",2);ge([n({type:Boolean})],N.prototype,"maskClosable",2);ge([n({type:Boolean})],N.prototype,"hideFooter",2);ge([n({type:String})],N.prototype,"confirmText",2);ge([n({type:String})],N.prototype,"cancelText",2);N=ge([f("su-modal")],N);var eo=Object.defineProperty,to=Object.getOwnPropertyDescriptor,Ee=(t,e,r,o)=>{for(var s=o>1?void 0:o?to(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&eo(e,r,s),s};let F=class extends b{constructor(){super(...arguments),this.open=!1,this.title="侧边面板",this.width="360px",this.maskClosable=!0,this.placement="right",this.overlayActive=!1,this.previouslyFocused=null,this.onKeydown=t=>{var r;if(!this.open||!It(this))return;const e=(r=this.shadowRoot)==null?void 0:r.querySelector(".panel");e&&Ht(t,e),t.key==="Escape"&&this.open&&this.maskClosable&&(t.preventDefault(),this.close("escape"))}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown),this.deactivateOverlay(!1)}willUpdate(){this.style.setProperty("--drawer-width",this.width)}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}handleMaskClick(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}activateOverlay(){var e;if(this.overlayActive)return;this.overlayActive=!0,this.previouslyFocused=pt(),Rt(this),Mt();const t=(e=this.shadowRoot)==null?void 0:e.querySelector(".panel");t&&Nt(t)}deactivateOverlay(t=!0){var e;this.overlayActive&&(this.overlayActive=!1,Bt(this),jt(),t&&((e=this.previouslyFocused)!=null&&e.isConnected)&&this.previouslyFocused.focus(),this.previouslyFocused=null)}updated(t){t.has("open")&&(this.open?this.activateOverlay():this.deactivateOverlay())}render(){return this.open?l`
      <div class="mask" @click=${this.handleMaskClick}>
        <aside
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="su-drawer-title"
          tabindex="-1"
        >
          <header class="header">
            <span id="su-drawer-title">${this.title}</span>
            <button type="button" aria-label="关闭抽屉" @click=${()=>this.close("close")}>
              关闭
            </button>
          </header>
          <div class="body"><slot></slot></div>
        </aside>
      </div>
    `:p}};F.styles=[x,g`
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
        width: min(var(--drawer-width, 360px), 100vw);
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
        font: inherit;
      }
    `];Ee([n({type:Boolean,reflect:!0})],F.prototype,"open",2);Ee([n({type:String})],F.prototype,"title",2);Ee([n({type:String})],F.prototype,"width",2);Ee([n({type:Boolean})],F.prototype,"maskClosable",2);Ee([n({type:String,reflect:!0})],F.prototype,"placement",2);F=Ee([f("su-drawer")],F);var ro=Object.defineProperty,so=Object.getOwnPropertyDescriptor,ze=(t,e,r,o)=>{for(var s=o>1?void 0:o?so(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&ro(e,r,s),s};const oo={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};let J=class extends b{constructor(){super(...arguments),this.type="info",this.header="",this.closable=!1,this.showIcon=!0,this.closed=!1}handleClose(){this.closed=!0,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.closed?p:l`
      <div class="alert ${this.type}" role="alert">
        ${this.showIcon?l`<span class="icon">${oo[this.type]}</span>`:p}
        <div class="main">
          ${this.header?l`<div class="header">${this.header}</div>`:p}
          <div class="content"><slot></slot></div>
        </div>
        ${this.closable?l`<button class="close" type="button" aria-label="关闭" @click=${this.handleClose}>✕</button>`:p}
      </div>
    `}};J.styles=[x,g`
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
    `];ze([n({type:String})],J.prototype,"type",2);ze([n({type:String})],J.prototype,"header",2);ze([n({type:Boolean})],J.prototype,"closable",2);ze([n({type:Boolean})],J.prototype,"showIcon",2);ze([P()],J.prototype,"closed",2);J=ze([f("su-alert")],J);var io=Object.defineProperty,ao=Object.getOwnPropertyDescriptor,Lt=(t,e,r,o)=>{for(var s=o>1?void 0:o?ao(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&io(e,r,s),s};const no={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};let Ve=class extends b{constructor(){super(...arguments),this.type="info",this.duration=3e3}firstUpdated(){this.duration>0&&setTimeout(()=>this.dismiss(),this.duration)}dismiss(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})),this.remove()}render(){return l`
      <div class="message" role="status">
        <span class="icon ${this.type}">${no[this.type]}</span>
        <slot></slot>
      </div>
    `}};Ve.styles=[x,g`
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
    `];Lt([n({type:String})],Ve.prototype,"type",2);Lt([n({type:Number})],Ve.prototype,"duration",2);Ve=Lt([f("su-message")],Ve);let ee=null;function lo(){return ee&&ee.isConnected||(ee=document.createElement("div"),Object.assign(ee.style,{position:"fixed",top:"16px",left:"50%",transform:"translateX(-50%)",zIndex:"2000",display:"grid",gap:"8px",justifyItems:"center",pointerEvents:"none"}),document.body.appendChild(ee)),ee}function W(t,e={}){const r=document.createElement("su-message");return r.type=e.type??"info",r.duration=e.duration??3e3,r.textContent=t,r.style.pointerEvents="auto",lo().appendChild(r),r}W.info=(t,e)=>W(t,{type:"info",duration:e});W.success=(t,e)=>W(t,{type:"success",duration:e});W.warning=(t,e)=>W(t,{type:"warning",duration:e});W.error=(t,e)=>W(t,{type:"error",duration:e});var co=Object.defineProperty,po=Object.getOwnPropertyDescriptor,Kt=(t,e,r,o)=>{for(var s=o>1?void 0:o?po(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&co(e,r,s),s};let qe=class extends b{constructor(){super(...arguments),this.content="",this.placement="top"}render(){return l`
      <slot></slot>
      <div class="bubble" role="tooltip">${this.content}</div>
    `}};qe.styles=[x,g`
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
    `];Kt([n({type:String})],qe.prototype,"content",2);Kt([n({type:String,reflect:!0})],qe.prototype,"placement",2);qe=Kt([f("su-tooltip")],qe);var uo=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,ht=(t,e,r,o)=>{for(var s=o>1?void 0:o?ho(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&uo(e,r,s),s};let $e=class extends b{constructor(){super(...arguments),this.spinning=!0,this.size="medium",this.tip=""}renderIndicator(){return l`
      <div class="indicator" role="status" aria-label=${this.tip||"加载中"}>
        <span class="spinner ${this.size}"></span>
        ${this.tip?l`<span class="tip">${this.tip}</span>`:p}
      </div>
    `}render(){return this.childNodes.length>0?l`
      <slot></slot>
      ${this.spinning?l`<div class="overlay">${this.renderIndicator()}</div>`:p}
    `:this.spinning?this.renderIndicator():p}};$e.styles=[x,g`
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
    `];ht([n({type:Boolean})],$e.prototype,"spinning",2);ht([n({type:String})],$e.prototype,"size",2);ht([n({type:String})],$e.prototype,"tip",2);$e=ht([f("su-spin")],$e);var bo=Object.defineProperty,go=Object.getOwnPropertyDescriptor,Qe=(t,e,r,o)=>{for(var s=o>1?void 0:o?go(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&bo(e,r,s),s};let le=class extends b{constructor(){super(...arguments),this.percent=0,this.status="normal",this.showText=!0,this.strokeHeight="8px"}willUpdate(){this.style.setProperty("--stroke-height",this.strokeHeight)}get clampedPercent(){return Math.min(100,Math.max(0,this.percent))}render(){const t=this.clampedPercent;return l`
      <div class="progress" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="track">
          <div class="bar ${this.status}" style="width: ${t}%"></div>
        </div>
        ${this.showText?l`<span class="text">${t}%</span>`:p}
      </div>
    `}};le.styles=[x,g`
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
    `];Qe([n({type:Number})],le.prototype,"percent",2);Qe([n({type:String})],le.prototype,"status",2);Qe([n({type:Boolean})],le.prototype,"showText",2);Qe([n({type:String})],le.prototype,"strokeHeight",2);le=Qe([f("su-progress")],le);var vo=Object.defineProperty,fo=Object.getOwnPropertyDescriptor,et=(t,e,r,o)=>{for(var s=o>1?void 0:o?fo(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&vo(e,r,s),s};let ce=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey="",this.collapsed=!1}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}onSelect(t){this.activeKey=t.key,this.dispatchEvent(new CustomEvent("select",{detail:t,bubbles:!0,composed:!0}))}render(){return l`
      <nav class="menu" aria-label="menu">
        ${this.mergedItems.map(t=>l`
            <button
              type="button"
              class="item ${t.key===this.activeKey?"active":""}"
              @click=${()=>this.onSelect(t)}>
              <span class="icon">${t.icon??""}</span>
              ${this.collapsed?"":l`<span>${t.label}</span>`}
            </button>
          `)}
      </nav>
    `}};ce.styles=[x,g`
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
    `];et([n({type:Array,attribute:!1})],ce.prototype,"items",2);et([n({type:String})],ce.prototype,"itemsJson",2);et([n({type:String})],ce.prototype,"activeKey",2);et([n({type:Boolean})],ce.prototype,"collapsed",2);ce=et([f("su-menu")],ce);var yo=Object.defineProperty,mo=Object.getOwnPropertyDescriptor,bt=(t,e,r,o)=>{for(var s=o>1?void 0:o?mo(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&yo(e,r,s),s};let we=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.separator="/"}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}handleClick(t,e){this.dispatchEvent(new CustomEvent("navigate",{detail:{item:t,index:e},bubbles:!0,composed:!0}))}render(){const t=this.mergedItems;return l`
      <nav>
        ${t.map((e,r)=>{const o=r===t.length-1;return l`
            <button class=${o?"current":""} @click=${()=>this.handleClick(e,r)}>
              ${e.label}
            </button>
            ${o?"":l`<span class="sep">${this.separator}</span>`}
          `})}
      </nav>
    `}};we.styles=[x,g`
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
    `];bt([n({type:Array,attribute:!1})],we.prototype,"items",2);bt([n({type:String})],we.prototype,"itemsJson",2);bt([n({type:String})],we.prototype,"separator",2);we=bt([f("su-breadcrumb")],we);var xo=Object.defineProperty,$o=Object.getOwnPropertyDescriptor,gt=(t,e,r,o)=>{for(var s=o>1?void 0:o?$o(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&xo(e,r,s),s};let wo=0,_e=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey="",this.idPrefix=`su-tabs-${++wo}`}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}get currentKey(){var e,r;const t=this.mergedItems.filter(o=>!o.disabled);return((e=t.find(o=>o.key===this.activeKey))==null?void 0:e.key)??((r=t[0])==null?void 0:r.key)??""}onSelect(t){t.disabled||t.key===this.currentKey||(this.activeKey=t.key,this.dispatchEvent(new CustomEvent("change",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})))}onKeyDown(t){const e=this.mergedItems.filter(i=>!i.disabled);if(e.length===0)return;const r=Math.max(0,e.findIndex(i=>i.key===this.currentKey));let o=r;if(t.key==="ArrowRight")o=(r+1)%e.length;else if(t.key==="ArrowLeft")o=(r-1+e.length)%e.length;else if(t.key==="Home")o=0;else if(t.key==="End")o=e.length-1;else return;t.preventDefault();const s=e[o];this.onSelect(s),this.updateComplete.then(()=>{var a;const i=Array.from(((a=this.shadowRoot)==null?void 0:a.querySelectorAll(".tab"))??[]).find(d=>d.dataset.key===s.key);i==null||i.focus()})}render(){const t=this.currentKey,e=this.mergedItems.findIndex(o=>o.key===t),r=`${this.idPrefix}-panel`;return l`
      <div class="nav" role="tablist" @keydown=${this.onKeyDown}>
        ${this.mergedItems.map((o,s)=>l`
            <button
              id=${`${this.idPrefix}-tab-${s}`}
              data-key=${o.key}
              type="button"
              role="tab"
              aria-selected=${o.key===t?"true":"false"}
              aria-controls=${r}
              tabindex=${o.key===t?0:-1}
              class="tab ${o.key===t?"active":""}"
              ?disabled=${!!o.disabled}
              @click=${()=>this.onSelect(o)}
            >
              ${o.label}
            </button>
          `)}
      </div>
      <div
        id=${r}
        class="panel"
        role="tabpanel"
        aria-labelledby=${e>=0?`${this.idPrefix}-tab-${e}`:""}
      >
        <slot name=${t}></slot>
        <slot></slot>
      </div>
    `}};_e.styles=[x,z,g`
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
    `];gt([n({type:Array,attribute:!1})],_e.prototype,"items",2);gt([n({type:String})],_e.prototype,"itemsJson",2);gt([n({type:String})],_e.prototype,"activeKey",2);_e=gt([f("su-tabs")],_e);var _o=Object.defineProperty,So=Object.getOwnPropertyDescriptor,De=(t,e,r,o)=>{for(var s=o>1?void 0:o?So(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&_o(e,r,s),s};let Po=0,Y=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.open=!1,this.disabled=!1,this.triggerNeedsTabStop=!0,this.menuId=`su-dropdown-${++Po}-menu`,this.triggerElement=null,this.onDocumentClick=t=>{this.open&&(t.composedPath().includes(this)||(this.open=!1))}}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.onDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.onDocumentClick)}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}updateTriggerAria(){var e,r;const t=((r=(e=this.triggerElement)==null?void 0:e.shadowRoot)==null?void 0:r.querySelector("button, a[href], input, select, textarea, [tabindex]"))??this.triggerElement;t==null||t.setAttribute("aria-haspopup","menu"),t==null||t.setAttribute("aria-expanded",String(this.open)),t==null||t.setAttribute("aria-controls",this.menuId)}onSlotChange(t){var s,i,a;const r=t.target.assignedElements({flatten:!0})[0];this.triggerElement=r instanceof HTMLElement?r:null;const o=((s=this.triggerElement)==null?void 0:s.matches("button, a[href], input, select, textarea, [tabindex]"))||!!((a=(i=this.triggerElement)==null?void 0:i.shadowRoot)!=null&&a.querySelector("button, a[href], input, select, textarea, [tabindex]"));this.triggerNeedsTabStop=!o,this.updateTriggerAria()}async openMenu(){var t,e;this.disabled||this.open||(this.open=!0,await this.updateComplete,(e=(t=this.shadowRoot)==null?void 0:t.querySelector(".item:not(:disabled)"))==null||e.focus())}toggle(){this.disabled||(this.open?this.open=!1:this.openMenu())}focusTrigger(){var e,r,o;const t=((r=(e=this.triggerElement)==null?void 0:e.shadowRoot)==null?void 0:r.querySelector("button, a[href], input, select, textarea, [tabindex]"))??this.triggerElement??((o=this.shadowRoot)==null?void 0:o.querySelector(".trigger"));t==null||t.focus()}onTriggerKeyDown(t){const e=t.currentTarget===t.target;t.key==="ArrowDown"||e&&(t.key==="Enter"||t.key===" ")?(t.preventDefault(),this.openMenu()):t.key==="Escape"&&this.open&&(t.preventDefault(),this.open=!1)}onMenuKeyDown(t){var s;const e=Array.from(((s=this.shadowRoot)==null?void 0:s.querySelectorAll(".item:not(:disabled)"))??[]);if(e.length===0)return;const r=Math.max(0,e.indexOf(t.target));let o=r;if(t.key==="ArrowDown")o=(r+1)%e.length;else if(t.key==="ArrowUp")o=(r-1+e.length)%e.length;else if(t.key==="Home")o=0;else if(t.key==="End")o=e.length-1;else if(t.key==="Escape"){t.preventDefault(),this.open=!1,this.focusTrigger();return}else if(t.key==="Tab"){this.open=!1;return}else return;t.preventDefault(),e[o].focus()}onSelect(t){t.disabled||(this.open=!1,this.dispatchEvent(new CustomEvent("select",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})),this.focusTrigger())}updated(t){t.has("open")&&this.updateTriggerAria()}render(){return l`
      <div
        class="trigger"
        role=${this.triggerNeedsTabStop?"button":p}
        tabindex=${this.triggerNeedsTabStop&&!this.disabled?0:-1}
        aria-haspopup=${this.triggerNeedsTabStop?"menu":p}
        aria-expanded=${this.triggerNeedsTabStop?String(this.open):p}
        aria-controls=${this.triggerNeedsTabStop?this.menuId:p}
        @click=${this.toggle}
        @keydown=${this.onTriggerKeyDown}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
      ${this.open?l`
            <div id=${this.menuId} class="menu" role="menu" @keydown=${this.onMenuKeyDown}>
              ${this.mergedItems.map(t=>l`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${t.danger?"danger":""}"
                    ?disabled=${!!t.disabled}
                    @click=${()=>this.onSelect(t)}
                  >
                    ${t.label}
                  </button>
                `)}
            </div>
          `:p}
    `}};Y.styles=[x,z,g`
      :host {
        display: inline-block;
        position: relative;
      }

      .trigger {
        cursor: pointer;
      }

      :host([disabled]) .trigger {
        cursor: not-allowed;
        opacity: 0.6;
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
    `];De([n({type:Array,attribute:!1})],Y.prototype,"items",2);De([n({type:String})],Y.prototype,"itemsJson",2);De([n({type:Boolean,reflect:!0})],Y.prototype,"open",2);De([n({type:Boolean,reflect:!0})],Y.prototype,"disabled",2);De([P()],Y.prototype,"triggerNeedsTabStop",2);Y=De([f("su-dropdown")],Y);var Co=Object.defineProperty,Ao=Object.getOwnPropertyDescriptor,vt=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ao(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Co(e,r,s),s};let Se=class extends b{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.current=0}get mergedItems(){return this.items.length>0?this.items:X(this.itemsJson,[])}render(){const t=this.mergedItems;return l`
      <div class="steps">
        ${t.map((e,r)=>{const o=r<this.current?"finished":r===this.current?"active":"";return l`
            <div class="step ${o}">
              <span class="indicator">${r<this.current?"✓":r+1}</span>
              <div class="content">
                <div class="title">${e.title}</div>
                ${e.description?l`<div class="description">${e.description}</div>`:p}
              </div>
              ${r<t.length-1?l`<span class="connector"></span>`:p}
            </div>
          `})}
      </div>
    `}};Se.styles=[x,g`
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
    `];vt([n({type:Array,attribute:!1})],Se.prototype,"items",2);vt([n({type:String})],Se.prototype,"itemsJson",2);vt([n({type:Number})],Se.prototype,"current",2);Se=vt([f("su-steps")],Se);var Oo=Object.defineProperty,ko=Object.getOwnPropertyDescriptor,Vt=(t,e,r,o)=>{for(var s=o>1?void 0:o?ko(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Oo(e,r,s),s};let Fe=class extends b{constructor(){super(...arguments),this.siderWidth="220px",this.headerHeight="56px"}willUpdate(){this.style.setProperty("--sider-width",this.siderWidth),this.style.setProperty("--header-height",this.headerHeight)}render(){return l`
      <div class="layout">
        <aside class="sider"><slot name="sider"></slot></aside>
        <header class="header"><slot name="header"></slot></header>
        <main class="content"><slot></slot></main>
      </div>
    `}};Fe.styles=[x,g`
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
    `];Vt([n({type:String})],Fe.prototype,"siderWidth",2);Vt([n({type:String})],Fe.prototype,"headerHeight",2);Fe=Vt([f("su-container")],Fe);var Eo=Object.defineProperty,zo=Object.getOwnPropertyDescriptor,qt=(t,e,r,o)=>{for(var s=o>1?void 0:o?zo(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Eo(e,r,s),s};let Je=class extends b{constructor(){super(...arguments),this.direction="horizontal",this.dashed=!1}render(){if(this.direction==="vertical")return l``;const t=this.childNodes.length>0;return l`
      <div class="divider ${t?"":"plain"}" role="separator">
        <slot></slot>
      </div>
    `}};Je.styles=[x,g`
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
    `];qt([n({type:String,reflect:!0})],Je.prototype,"direction",2);qt([n({type:Boolean,reflect:!0})],Je.prototype,"dashed",2);Je=qt([f("su-divider")],Je);var Do=Object.defineProperty,To=Object.getOwnPropertyDescriptor,$r=(t,e,r,o)=>{for(var s=o>1?void 0:o?To(e,r):e,i=t.length-1,a;i>=0;i--)(a=t[i])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Do(e,r,s),s};let lt=class extends b{constructor(){super(...arguments),this.mode="light",this.onThemeChange=()=>{this.mode=st()}}connectedCallback(){super.connectedCallback(),this.mode=st(),window.addEventListener("su-theme-change",this.onThemeChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("su-theme-change",this.onThemeChange)}handleClick(){this.mode=Pr(),this.dispatchEvent(new CustomEvent("change",{detail:{mode:this.mode},bubbles:!0,composed:!0}))}render(){const t=this.mode==="dark";return l`
      <button
        type="button"
        aria-label=${t?"切换到亮色主题":"切换到暗色主题"}
        title=${t?"切换到亮色主题":"切换到暗色主题"}
        @click=${this.handleClick}>
        ${t?"🌙":"☀️"}
      </button>
    `}};lt.styles=[x,z,g`
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
    `];$r([P()],lt.prototype,"mode",2);lt=$r([f("su-theme-toggle")],lt);Cr();export{Ke as LineComponent,R as SeAssetViewer,S as SeImage,A as SeInput,me as SePagination,J as SuAlert,V as SuAvatar,ae as SuBadge,we as SuBreadcrumb,C as SuButton,St as SuCard,B as SuCheckbox,Fe as SuContainer,q as SuDescriptions,Je as SuDivider,F as SuDrawer,Y as SuDropdown,nt as SuEmpty,oe as SuFormItem,A as SuInput,j as SuInputNumber,ce as SuMenu,Ve as SuMessage,N as SuModal,le as SuProgress,I as SuRadioGroup,T as SuSelect,ne as SuSkeleton,$e as SuSpin,ie as SuStatCard,Se as SuSteps,K as SuSwitch,_e as SuTabs,at as SuTag,M as SuTextarea,lt as SuThemeToggle,qe as SuTooltip,st as getThemeMode,Cr as initTheme,W as message,jo as resetThemeColors,S as seImage,v as seTable,Mo as setThemeColors,Sr as setThemeMode,Pr as toggleThemeMode};
