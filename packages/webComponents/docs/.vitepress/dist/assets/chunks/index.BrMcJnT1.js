const qt="su-theme-mode",ft="su-theme-colors",Ft="su-theme-dark",yt="data-su-theme",Ae={primary:"--su-color-primary",primaryHover:"--su-color-primary-hover",success:"--su-color-success",warning:"--su-color-warning",error:"--su-color-error",info:"--su-color-info"};function mt(t){let e=t.trim().replace(/^#/,"");if(e.length===3&&(e=e.split("").map(o=>o+o).join("")),!/^[0-9a-fA-F]{6}$/.test(e))return null;const s=parseInt(e,16);return[s>>16&255,s>>8&255,s&255]}function sr(t,e){const s=mt(t);if(!s)return t;const[o,r,a]=s.map(i=>Math.max(0,Math.round(i*(1-e))));return`#${[o,r,a].map(i=>i.toString(16).padStart(2,"0")).join("")}`}function or(t){const e=mt(t);if(!e)return"#ffffff";const[s,o,r]=e;return(s*299+o*587+r*114)/1e3>=150?"#111827":"#ffffff"}function xt(){window.dispatchEvent(new CustomEvent("su-theme-change",{detail:{mode:Ze(),colors:$t()}}))}function $t(){try{return JSON.parse(localStorage.getItem(ft)??"{}")}catch{return{}}}function Ze(){return document.documentElement.getAttribute(yt)==="dark"?"dark":"light"}function ir(t){const e=document.documentElement;e.setAttribute(yt,t),e.classList.toggle(Ft,t==="dark");try{localStorage.setItem(qt,t)}catch{}xt()}function ar(){const t=Ze()==="dark"?"light":"dark";return ir(t),t}function Wt(t){const e=document.documentElement;Object.keys(Ae).forEach(s=>{const o=t[s];if(!o||(e.style.setProperty(Ae[s],o),s==="primaryHover"))return;const r=mt(o);r&&e.style.setProperty(`${Ae[s]}-rgb`,r.join(", ")),e.style.setProperty(`${Ae[s]}-contrast`,or(o))}),t.primary&&!t.primaryHover&&e.style.setProperty("--su-color-primary-hover",sr(t.primary,.15))}function uo(t){const e={...$t(),...t};Wt(e);try{localStorage.setItem(ft,JSON.stringify(e))}catch{}xt()}function vo(){const t=document.documentElement;Object.values(Ae).forEach(e=>{t.style.removeProperty(e),t.style.removeProperty(`${e}-rgb`),t.style.removeProperty(`${e}-contrast`)});try{localStorage.removeItem(ft)}catch{}xt()}function nr(){if(typeof window>"u")return;let t=null;try{t=localStorage.getItem(qt)}catch{}if(t==="dark"||t==="light"){const s=document.documentElement;s.setAttribute(yt,t),s.classList.toggle(Ft,t==="dark")}const e=$t();Object.keys(e).length>0&&Wt(e)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe=globalThis,wt=Xe.ShadowRoot&&(Xe.ShadyCSS===void 0||Xe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_t=Symbol(),Mt=new WeakMap;let Yt=class{constructor(e,s,o){if(this._$cssResult$=!0,o!==_t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o;const s=this.t;if(wt&&e===void 0){const o=s!==void 0&&s.length===1;o&&(e=Mt.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Mt.set(s,e))}return e}toString(){return this.cssText}};const lr=t=>new Yt(typeof t=="string"?t:t+"",void 0,_t),b=(t,...e)=>{const s=t.length===1?t[0]:e.reduce((o,r,a)=>o+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[a+1],t[0]);return new Yt(s,t,_t)},pr=(t,e)=>{if(wt)t.adoptedStyleSheets=e.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of e){const o=document.createElement("style"),r=Xe.litNonce;r!==void 0&&o.setAttribute("nonce",r),o.textContent=s.cssText,t.appendChild(o)}},Tt=wt?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(const o of e.cssRules)s+=o.cssText;return lr(s)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:dr,getOwnPropertyDescriptor:hr,getOwnPropertyNames:ur,getOwnPropertySymbols:vr,getPrototypeOf:br}=Object,j=globalThis,jt=j.trustedTypes,gr=jt?jt.emptyScript:"",dt=j.reactiveElementPolyfillSupport,Ee=(t,e)=>t,Ge={toAttribute(t,e){switch(e){case Boolean:t=t?gr:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},St=(t,e)=>!cr(t,e),Bt={attribute:!0,type:String,converter:Ge,reflect:!1,useDefault:!1,hasChanged:St};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),j.litPropertyMetadata??(j.litPropertyMetadata=new WeakMap);let le=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=Bt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(e,s),!s.noAccessor){const o=Symbol(),r=this.getPropertyDescriptor(e,o,s);r!==void 0&&dr(this.prototype,e,r)}}static getPropertyDescriptor(e,s,o){const{get:r,set:a}=hr(this.prototype,e)??{get(){return this[s]},set(i){this[s]=i}};return{get:r,set(i){const c=r==null?void 0:r.call(this);a==null||a.call(this,i),this.requestUpdate(e,c,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Bt}static _$Ei(){if(this.hasOwnProperty(Ee("elementProperties")))return;const e=br(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ee("properties"))){const s=this.properties,o=[...ur(s),...vr(s)];for(const r of o)this.createProperty(r,s[r])}const e=this[Symbol.metadata];if(e!==null){const s=litPropertyMetadata.get(e);if(s!==void 0)for(const[o,r]of s)this.elementProperties.set(o,r)}this._$Eh=new Map;for(const[s,o]of this.elementProperties){const r=this._$Eu(s,o);r!==void 0&&this._$Eh.set(r,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const s=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const r of o)s.unshift(Tt(r))}else e!==void 0&&s.push(Tt(e));return s}static _$Eu(e,s){const o=s.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(s=>s(this))}addController(e){var s;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var s;(s=this._$EO)==null||s.delete(e)}_$E_(){const e=new Map,s=this.constructor.elementProperties;for(const o of s.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pr(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(s=>{var o;return(o=s.hostConnected)==null?void 0:o.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(s=>{var o;return(o=s.hostDisconnected)==null?void 0:o.call(s)})}attributeChangedCallback(e,s,o){this._$AK(e,o)}_$ET(e,s){var a;const o=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,o);if(r!==void 0&&o.reflect===!0){const i=(((a=o.converter)==null?void 0:a.toAttribute)!==void 0?o.converter:Ge).toAttribute(s,o.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,s){var a,i;const o=this.constructor,r=o._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const c=o.getPropertyOptions(r),p=typeof c.converter=="function"?{fromAttribute:c.converter}:((a=c.converter)==null?void 0:a.fromAttribute)!==void 0?c.converter:Ge;this._$Em=r,this[r]=p.fromAttribute(s,c.type)??((i=this._$Ej)==null?void 0:i.get(r))??null,this._$Em=null}}requestUpdate(e,s,o){var r;if(e!==void 0){const a=this.constructor,i=this[e];if(o??(o=a.getPropertyOptions(e)),!((o.hasChanged??St)(i,s)||o.useDefault&&o.reflect&&i===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,s,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,s,{useDefault:o,reflect:r,wrapped:a},i){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,i??s??this[e]),a!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(s=void 0),this._$AL.set(e,s)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,i]of this._$Ep)this[a]=i;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[a,i]of r){const{wrapped:c}=i,p=this[a];c!==!0||this._$AL.has(a)||p===void 0||this.C(a,void 0,i,p)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(o=this._$EO)==null||o.forEach(r=>{var a;return(a=r.hostUpdate)==null?void 0:a.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(e){}_$AE(e){var s;(s=this._$EO)==null||s.forEach(o=>{var r;return(r=o.hostUpdated)==null?void 0:r.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(s=>this._$ET(s,this[s]))),this._$EM()}updated(e){}firstUpdated(e){}};le.elementStyles=[],le.shadowRootOptions={mode:"open"},le[Ee("elementProperties")]=new Map,le[Ee("finalized")]=new Map,dt==null||dt({ReactiveElement:le}),(j.reactiveElementVersions??(j.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ze=globalThis,Qe=ze.trustedTypes,Ht=Qe?Qe.createPolicy("lit-html",{createHTML:t=>t}):void 0,Xt="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Zt="?"+T,fr=`<${Zt}>`,X=document,ke=()=>X.createComment(""),De=t=>t===null||typeof t!="object"&&typeof t!="function",Pt=Array.isArray,yr=t=>Pt(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",ht=`[ 	
\f\r]`,Ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,It=/-->/g,Nt=/>/g,J=RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Ut=/"/g,Gt=/^(?:script|style|textarea|title)$/i,mr=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),l=mr(1),Z=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Lt=new WeakMap,W=X.createTreeWalker(X,129);function Qt(t,e){if(!Pt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(e):e}const xr=(t,e)=>{const s=t.length-1,o=[];let r,a=e===2?"<svg>":e===3?"<math>":"",i=Ce;for(let c=0;c<s;c++){const p=t[c];let u,m,d=-1,w=0;for(;w<p.length&&(i.lastIndex=w,m=i.exec(p),m!==null);)w=i.lastIndex,i===Ce?m[1]==="!--"?i=It:m[1]!==void 0?i=Nt:m[2]!==void 0?(Gt.test(m[2])&&(r=RegExp("</"+m[2],"g")),i=J):m[3]!==void 0&&(i=J):i===J?m[0]===">"?(i=r??Ce,d=-1):m[1]===void 0?d=-2:(d=i.lastIndex-m[2].length,u=m[1],i=m[3]===void 0?J:m[3]==='"'?Ut:Rt):i===Ut||i===Rt?i=J:i===It||i===Nt?i=Ce:(i=J,r=void 0);const $=i===J&&t[c+1].startsWith("/>")?" ":"";a+=i===Ce?p+fr:d>=0?(o.push(u),p.slice(0,d)+Xt+p.slice(d)+T+$):p+T+(d===-2?c:$)}return[Qt(t,a+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Me{constructor({strings:e,_$litType$:s},o){let r;this.parts=[];let a=0,i=0;const c=e.length-1,p=this.parts,[u,m]=xr(e,s);if(this.el=Me.createElement(u,o),W.currentNode=this.el.content,s===2||s===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=W.nextNode())!==null&&p.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Xt)){const w=m[i++],$=r.getAttribute(d).split(T),_=/([.?@])?(.*)/.exec(w);p.push({type:1,index:a,name:_[2],strings:$,ctor:_[1]==="."?wr:_[1]==="?"?_r:_[1]==="@"?Sr:st}),r.removeAttribute(d)}else d.startsWith(T)&&(p.push({type:6,index:a}),r.removeAttribute(d));if(Gt.test(r.tagName)){const d=r.textContent.split(T),w=d.length-1;if(w>0){r.textContent=Qe?Qe.emptyScript:"";for(let $=0;$<w;$++)r.append(d[$],ke()),W.nextNode(),p.push({type:2,index:++a});r.append(d[w],ke())}}}else if(r.nodeType===8)if(r.data===Zt)p.push({type:2,index:a});else{let d=-1;for(;(d=r.data.indexOf(T,d+1))!==-1;)p.push({type:7,index:a}),d+=T.length-1}a++}}static createElement(e,s){const o=X.createElement("template");return o.innerHTML=e,o}}function pe(t,e,s=t,o){var i,c;if(e===Z)return e;let r=o!==void 0?(i=s._$Co)==null?void 0:i[o]:s._$Cl;const a=De(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((c=r==null?void 0:r._$AO)==null||c.call(r,!1),a===void 0?r=void 0:(r=new a(t),r._$AT(t,s,o)),o!==void 0?(s._$Co??(s._$Co=[]))[o]=r:s._$Cl=r),r!==void 0&&(e=pe(t,r._$AS(t,e.values),r,o)),e}let $r=class{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:s},parts:o}=this._$AD,r=((e==null?void 0:e.creationScope)??X).importNode(s,!0);W.currentNode=r;let a=W.nextNode(),i=0,c=0,p=o[0];for(;p!==void 0;){if(i===p.index){let u;p.type===2?u=new fe(a,a.nextSibling,this,e):p.type===1?u=new p.ctor(a,p.name,p.strings,this,e):p.type===6&&(u=new Pr(a,this,e)),this._$AV.push(u),p=o[++c]}i!==(p==null?void 0:p.index)&&(a=W.nextNode(),i++)}return W.currentNode=X,r}p(e){let s=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,s),s+=o.strings.length-2):o._$AI(e[s])),s++}};class fe{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,s,o,r){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=o,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=pe(this,e,s),De(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==Z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):yr(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&De(this._$AH)?this._$AA.nextSibling.data=e:this.T(X.createTextNode(e)),this._$AH=e}$(e){var a;const{values:s,_$litType$:o}=e,r=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Me.createElement(Qt(o.h,o.h[0]),this.options)),o);if(((a=this._$AH)==null?void 0:a._$AD)===r)this._$AH.p(s);else{const i=new $r(r,this),c=i.u(this.options);i.p(s),this.T(c),this._$AH=i}}_$AC(e){let s=Lt.get(e.strings);return s===void 0&&Lt.set(e.strings,s=new Me(e)),s}k(e){Pt(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let o,r=0;for(const a of e)r===s.length?s.push(o=new fe(this.O(ke()),this.O(ke()),this,this.options)):o=s[r],o._$AI(a),r++;r<s.length&&(this._$AR(o&&o._$AB.nextSibling,r),s.length=r)}_$AR(e=this._$AA.nextSibling,s){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,s);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var s;this._$AM===void 0&&(this._$Cv=e,(s=this._$AP)==null||s.call(this,e))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,o,r,a){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=s,this._$AM=r,this.options=a,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=h}_$AI(e,s=this,o,r){const a=this.strings;let i=!1;if(a===void 0)e=pe(this,e,s,0),i=!De(e)||e!==this._$AH&&e!==Z,i&&(this._$AH=e);else{const c=e;let p,u;for(e=a[0],p=0;p<a.length-1;p++)u=pe(this,c[o+p],s,p),u===Z&&(u=this._$AH[p]),i||(i=!De(u)||u!==this._$AH[p]),u===h?e=h:e!==h&&(e+=(u??"")+a[p+1]),this._$AH[p]=u}i&&!r&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class wr extends st{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}}class _r extends st{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}}class Sr extends st{constructor(e,s,o,r,a){super(e,s,o,r,a),this.type=5}_$AI(e,s=this){if((e=pe(this,e,s,0)??h)===Z)return;const o=this._$AH,r=e===h&&o!==h||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,a=e!==h&&(o===h||r);r&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,e):this._$AH.handleEvent(e)}}class Pr{constructor(e,s,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){pe(this,e)}}const Cr={I:fe},ut=ze.litHtmlPolyfillSupport;ut==null||ut(Me,fe),(ze.litHtmlVersions??(ze.litHtmlVersions=[])).push("3.3.0");const Or=(t,e,s)=>{const o=(s==null?void 0:s.renderBefore)??e;let r=o._$litPart$;if(r===void 0){const a=(s==null?void 0:s.renderBefore)??null;o._$litPart$=r=new fe(e.insertBefore(ke(),a),a,void 0,s??{})}return r._$AI(t),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=globalThis;let v=class extends le{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var s;const e=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=e.firstChild),e}update(e){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Or(s,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Z}};var Jt;v._$litElement$=!0,v.finalized=!0,(Jt=Y.litElementHydrateSupport)==null||Jt.call(Y,{LitElement:v});const vt=Y.litElementPolyfillSupport;vt==null||vt({LitElement:v});(Y.litElementVersions??(Y.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const f=t=>(e,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ar={attribute:!0,type:String,converter:Ge,reflect:!1,hasChanged:St},Er=(t=Ar,e,s)=>{const{kind:o,metadata:r}=s;let a=globalThis.litPropertyMetadata.get(r);if(a===void 0&&globalThis.litPropertyMetadata.set(r,a=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),a.set(s.name,t),o==="accessor"){const{name:i}=s;return{set(c){const p=e.get.call(this);e.set.call(this,c),this.requestUpdate(i,p,t)},init(c){return c!==void 0&&this.C(i,void 0,t,c),c}}}if(o==="setter"){const{name:i}=s;return function(c){const p=this[i];e.call(this,c),this.requestUpdate(i,p,t)}}throw Error("Unsupported decorator location: "+o)};function n(t){return(e,s)=>typeof s=="object"?Er(t,e,s):((o,r,a)=>{const i=r.hasOwnProperty(a);return r.constructor.createProperty(a,o),i?Object.getOwnPropertyDescriptor(r,a):void 0})(t,e,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(t){return n({...t,state:!0,attribute:!1})}function zr(t,e={},s){const o=s||t.currentTarget;if(!o)return;const r=o.getBoundingClientRect(),a=t.clientX-r.left,i=t.clientY-r.top,c=[Math.hypot(a,i),Math.hypot(r.width-a,i),Math.hypot(a,r.height-i),Math.hypot(r.width-a,r.height-i)],p=Math.max(...c)*2,u=e.duration??560;o.querySelectorAll(".ripple-effect").forEach(d=>d.remove());const m=document.createElement("span");m.className="ripple-effect",m.setAttribute("aria-hidden","true"),m.style.left=`${a-p/2}px`,m.style.top=`${i-p/2}px`,m.style.width=`${p}px`,m.style.height=`${p}px`,e.color&&(m.style.backgroundColor=e.color),e.duration&&(m.style.animationDuration=`${u}ms`),o.appendChild(m),window.setTimeout(()=>m.remove(),u)}const x=b`
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
`,ye=b`
  :focus-visible {
    outline: 2px solid var(--su-color-primary);
    outline-offset: 1px;
  }
`,kr=[ye,b`
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
  `];var Dr=Object.defineProperty,Mr=Object.getOwnPropertyDescriptor,A=(t,e,s,o)=>{for(var r=o>1?void 0:o?Mr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Dr(e,s,r),r};let P=class extends v{constructor(){super(...arguments),this.size="medium",this.type="primary",this.disabled=!1,this.loading=!1,this.iconClass="",this.iconPosition="left",this.rippleColor="",this.ripple=!0,this.block=!1,this.round=!1,this.nativeType="button"}get isInactive(){return this.disabled||this.loading}handleClick(t){if(this.isInactive){t.stopImmediatePropagation(),t.preventDefault();return}if(this.ripple)try{const e=t.currentTarget;zr(t,this.rippleColor?{color:this.rippleColor}:{},e??void 0)}catch(e){console.error("Error creating ripple effect:",e)}}renderIcon(t){return!this.iconClass||this.iconPosition!==t?h:l`<i class="icon ${t} ${this.iconClass}" aria-hidden="true"></i>`}render(){return l`
      <button
        type=${this.nativeType}
        ?disabled=${this.isInactive}
        aria-busy=${this.loading?"true":"false"}
        aria-disabled=${this.isInactive?"true":"false"}
        @click=${this.handleClick}
      >
        ${this.loading?l`<span class="spinner" aria-hidden="true"></span>`:h}
        <span class="label">
          ${this.renderIcon("left")}
          <slot></slot>
          ${this.renderIcon("right")}
        </span>
      </button>
    `}};P.styles=kr;A([n({type:String,reflect:!0})],P.prototype,"size",2);A([n({type:String,reflect:!0})],P.prototype,"type",2);A([n({type:Boolean,reflect:!0})],P.prototype,"disabled",2);A([n({type:Boolean,reflect:!0})],P.prototype,"loading",2);A([n({type:String})],P.prototype,"iconClass",2);A([n({type:String})],P.prototype,"iconPosition",2);A([n({type:String})],P.prototype,"rippleColor",2);A([n({type:Boolean})],P.prototype,"ripple",2);A([n({type:Boolean,reflect:!0})],P.prototype,"block",2);A([n({type:Boolean,reflect:!0})],P.prototype,"round",2);A([n({type:String})],P.prototype,"nativeType",2);P=A([f("su-button")],P);var Tr=Object.defineProperty,jr=Object.getOwnPropertyDescriptor,k=(t,e,s,o)=>{for(var r=o>1?void 0:o?jr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Tr(e,s,r),r};let O=class extends v{constructor(){super(...arguments),this.value="",this.placeholder="请输入",this.disabled=!1,this.type="text",this.readonly=!1,this.error=!1,this.label="",this.helperText="",this.clearable=!1}emitChange(){this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}handleInput(t){const e=t.target;this.value=e.value,this.emitChange()}handleClear(){var t,e;this.disabled||this.readonly||(this.value="",this.emitChange(),(e=(t=this.shadowRoot)==null?void 0:t.querySelector("input"))==null||e.focus())}render(){return l`
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
          ${this.clearable&&this.value?l`<button class="clear-btn" type="button" aria-label="清空" @click=${this.handleClear}>✕</button>`:""}
        </div>
        ${this.helperText?l`<span class="helper-text ${this.error?"error":""}">${this.helperText}</span>`:""}
      </div>
    `}};O.styles=[x,ye,b`
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
    `];k([n({type:String})],O.prototype,"value",2);k([n({type:String})],O.prototype,"placeholder",2);k([n({type:Boolean})],O.prototype,"disabled",2);k([n({type:String})],O.prototype,"type",2);k([n({type:Boolean})],O.prototype,"readonly",2);k([n({type:Boolean})],O.prototype,"error",2);k([n({type:String})],O.prototype,"label",2);k([n({type:String})],O.prototype,"helperText",2);k([n({type:Boolean})],O.prototype,"clearable",2);O=k([f("su-input")],O);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Br={CHILD:2},Hr=t=>(...e)=>({_$litDirective$:t,values:e});class Ir{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,o){this._$Ct=e,this._$AM=s,this._$Ci=o}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Nr}=Cr,Kt=()=>document.createComment(""),Oe=(t,e,s)=>{var a;const o=t._$AA.parentNode,r=e===void 0?t._$AB:e._$AA;if(s===void 0){const i=o.insertBefore(Kt(),r),c=o.insertBefore(Kt(),r);s=new Nr(i,c,t,t.options)}else{const i=s._$AB.nextSibling,c=s._$AM,p=c!==t;if(p){let u;(a=s._$AQ)==null||a.call(s,t),s._$AM=t,s._$AP!==void 0&&(u=t._$AU)!==c._$AU&&s._$AP(u)}if(i!==r||p){let u=s._$AA;for(;u!==i;){const m=u.nextSibling;o.insertBefore(u,r),u=m}}}return s},q=(t,e,s=t)=>(t._$AI(e,s),t),Rr={},Ur=(t,e=Rr)=>t._$AH=e,Lr=t=>t._$AH,bt=t=>{var o;(o=t._$AP)==null||o.call(t,!1,!0);let e=t._$AA;const s=t._$AB.nextSibling;for(;e!==s;){const r=e.nextSibling;e.remove(),e=r}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt=(t,e,s)=>{const o=new Map;for(let r=e;r<=s;r++)o.set(t[r],r);return o},Kr=Hr(class extends Ir{constructor(t){if(super(t),t.type!==Br.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,s){let o;s===void 0?s=e:e!==void 0&&(o=e);const r=[],a=[];let i=0;for(const c of t)r[i]=o?o(c,i):i,a[i]=s(c,i),i++;return{values:a,keys:r}}render(t,e,s){return this.dt(t,e,s).values}update(t,[e,s,o]){const r=Lr(t),{values:a,keys:i}=this.dt(e,s,o);if(!Array.isArray(r))return this.ut=i,a;const c=this.ut??(this.ut=[]),p=[];let u,m,d=0,w=r.length-1,$=0,_=a.length-1;for(;d<=w&&$<=_;)if(r[d]===null)d++;else if(r[w]===null)w--;else if(c[d]===i[$])p[$]=q(r[d],a[$]),d++,$++;else if(c[w]===i[_])p[_]=q(r[w],a[_]),w--,_--;else if(c[d]===i[_])p[_]=q(r[d],a[_]),Oe(t,p[_+1],r[d]),d++,_--;else if(c[w]===i[$])p[$]=q(r[w],a[$]),Oe(t,r[d],r[w]),w--,$++;else if(u===void 0&&(u=Vt(i,$,_),m=Vt(c,d,w)),u.has(c[d]))if(u.has(c[w])){const E=m.get(i[$]),Pe=E!==void 0?r[E]:null;if(Pe===null){const V=Oe(t,r[d]);q(V,a[$]),p[$]=V}else p[$]=q(Pe,a[$]),Oe(t,r[d],Pe),r[E]=null;$++}else bt(r[w]),w--;else bt(r[d]),d++;for(;$<=_;){const E=Oe(t,p[_+1]);q(E,a[$]),p[$++]=E}for(;d<=w;){const E=r[d++];E!==null&&bt(E)}return this.ut=i,Ur(t,p),Z}}),Vr=b`
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
`;var Jr=Object.defineProperty,qr=Object.getOwnPropertyDescriptor,ot=(t,e,s,o)=>{for(var r=o>1?void 0:o?qr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Jr(e,s,r),r};let ce=class extends v{constructor(){super(...arguments),this.currentPage=1,this.total=0,this.pageSize=10}get totalPages(){return this.total<=0?1:Math.max(1,Math.ceil(this.total/this.pageSize))}clampPage(t){return Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1))}emitChange(t){const e=this.clampPage(t);e!==this.currentPage&&(this.currentPage=e,this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0})))}handlePageInput(t){const e=t.target;this.emitChange(Number(e.value))}handlePrevPage(){this.emitChange(this.currentPage-1)}handleNextPage(){this.emitChange(this.currentPage+1)}render(){return l`
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
    `}};ce.styles=b`
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
  `;ot([n({type:Number})],ce.prototype,"currentPage",2);ot([n({type:Number})],ce.prototype,"total",2);ot([n({type:Number})],ce.prototype,"pageSize",2);ce=ot([f("se-pagination")],ce);var Fr=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,y=(t,e,s,o)=>{for(var r=o>1?void 0:o?Wr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Fr(e,s,r),r};let g=class extends v{constructor(){super(),this.data=[],this.columns=[],this.noDataText="暂无数据",this.borderStyle="1px solid var(--su-border-color)",this.rowLines=!0,this.columnLines=!0,this.theadBgColor="",this.theadTextColor="",this.pageSize=10,this.pagination=!0,this.striped=!1,this.hoverable=!1,this.stickyHeader=!1,this.height="",this.rowKey="id",this.selectable=!1,this.selectedKeys=[],this.loading=!1,this.infiniteScroll=!1,this.hasMore=!1,this.loadingMore=!1,this.loadMoreOffset=80,this.loadMoreText="下拉到底部加载更多",this.loadingText="加载中...",this.noMoreText="没有更多数据了",this.virtualScroll=!1,this.virtualThreshold=1e3,this.virtualRowHeight=44,this.virtualBuffer=8,this.currentPage=1,this.sortedColumns=[],this.sortedData=[],this.scrollTop=0,this.viewportHeight=0,this.loadMorePending=!1,this.sortedColumns=[...this.columns],this.sortedData=[...this.data],this.sortColumn=t=>{const e=this.sortedColumns[t];if(!e.sortable)return;const s=e.sortDirection==="asc"?"desc":e.sortDirection==="desc"?"":"asc";this.sortedColumns=this.sortedColumns.map((o,r)=>({...o,sortDirection:r===t?s:""})),s===""?this.sortedData=[...this.data]:this.sortedData=[...this.data].sort((o,r)=>{const a=this.compareValues(o[e.key],r[e.key]);return s==="asc"?a:a*-1}),this.currentPage=1,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("sort-change",{detail:{column:e.key,direction:s},bubbles:!0,composed:!0}))}}willUpdate(t){if(t.has("borderStyle")&&this.style.setProperty("--border-style",this.borderStyle),t.has("rowLines")){const e=this.rowLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--row-line",e)}if(t.has("columnLines")){const e=this.columnLines?"1px solid var(--su-border-color)":"none";this.style.setProperty("--column-line",e)}t.has("theadBgColor")&&(this.theadBgColor?this.style.setProperty("--thead-bg-color",this.theadBgColor):this.style.removeProperty("--thead-bg-color")),t.has("theadTextColor")&&(this.theadTextColor?this.style.setProperty("--thead-text-color",this.theadTextColor):this.style.removeProperty("--thead-text-color")),(t.has("columns")||t.has("data"))&&(this.sortedColumns=this.columns.map(e=>({...e,sortDirection:""})),this.sortedData=[...this.data],this.currentPage=1),(t.has("pageSize")||t.has("pagination")||t.has("infiniteScroll"))&&(this.currentPage=1,this.scrollTop=0,this.resetViewportScroll()),t.has("loadingMore")&&!this.loadingMore&&(this.loadMorePending=!1)}firstUpdated(){this.measureViewportHeight()}updated(){this.measureViewportHeight()}compareValues(t,e){if(t==null&&e==null)return 0;if(t==null)return-1;if(e==null)return 1;if(typeof t=="number"&&typeof e=="number")return t-e;const s=String(t),o=String(e);return s.localeCompare(o,"en",{numeric:!0,sensitivity:"base"})}get totalPages(){return Math.max(1,Math.ceil(this.sortedData.length/this.pageSize))}get shouldUsePagination(){return this.pagination&&!this.infiniteScroll}get paginatedData(){const t=(this.currentPage-1)*this.pageSize,e=t+this.pageSize;return this.sortedData.slice(t,e)}get sourceData(){return this.shouldUsePagination?this.paginatedData:this.sortedData}get shouldUseVirtualScroll(){return this.spanMethod?!1:this.virtualScroll||this.sourceData.length>=this.virtualThreshold}get effectiveHeight(){return this.height||"420px"}get totalColumnCount(){return Math.max(1,this.sortedColumns.length+(this.selectable?1:0))}isRowSelected(t,e){return this.selectedKeys.includes(this.getRowKey(t,e))}emitSelectionChange(t){this.selectedKeys=t;const e=new Set(t),s=this.sortedData.filter((o,r)=>e.has(this.getRowKey(o,r)));this.dispatchEvent(new CustomEvent("selection-change",{detail:{keys:t,rows:s},bubbles:!0,composed:!0}))}toggleRowSelection(t,e){const s=this.getRowKey(t,e),o=this.selectedKeys.includes(s)?this.selectedKeys.filter(r=>r!==s):[...this.selectedKeys,s];this.emitSelectionChange(o)}toggleAllSelection(){const t=this.sourceData.map((o,r)=>this.getRowKey(o,r)),s=t.length>0&&t.every(o=>this.selectedKeys.includes(o))?this.selectedKeys.filter(o=>!t.includes(o)):[...new Set([...this.selectedKeys,...t])];this.emitSelectionChange(s)}get virtualState(){const t=this.sourceData;if(!this.shouldUseVirtualScroll)return{start:0,rows:t,topPadding:0,bottomPadding:0};const e=this.viewportHeight||420,s=Math.ceil(e/this.virtualRowHeight)+this.virtualBuffer*2,o=Math.max(0,Math.floor(this.scrollTop/this.virtualRowHeight)-this.virtualBuffer),r=Math.min(t.length,o+s);return{start:o,rows:t.slice(o,r),topPadding:o*this.virtualRowHeight,bottomPadding:(t.length-r)*this.virtualRowHeight}}measureViewportHeight(){const t=this.getViewportElement();t&&this.viewportHeight!==t.clientHeight&&t.clientHeight>0&&(this.viewportHeight=t.clientHeight)}getViewportElement(){var t;return(t=this.renderRoot)==null?void 0:t.querySelector(".table-viewport")}resetViewportScroll(){const t=this.getViewportElement();t&&(t.scrollTop=0)}getRowKey(t,e){const s=t[this.rowKey];return s!=null&&s!==""?String(s):`row-${e}`}getCellDisplayValue(t,e,s){const o=t[e.key];return e.formatter?e.formatter(o,t,s):o??""}normalizeSpan(t){if(!t)return{rowspan:1,colspan:1};if(Array.isArray(t)){const o=Math.max(0,Math.floor(t[0]??1)),r=Math.max(0,Math.floor(t[1]??1));return{rowspan:o,colspan:r}}const e=Math.max(0,Math.floor(t.rowspan??1)),s=Math.max(0,Math.floor(t.colspan??1));return{rowspan:e,colspan:s}}getCellSpan(t){return this.spanMethod?this.normalizeSpan(this.spanMethod(t)):{rowspan:1,colspan:1}}setCurrentPage(t){const e=Math.min(this.totalPages,Math.max(1,Number.isFinite(t)?t:1));this.currentPage=e,this.scrollTop=0,this.resetViewportScroll(),this.dispatchEvent(new CustomEvent("page-change",{detail:{currentPage:e},bubbles:!0,composed:!0}))}handlePaginationChange(t){var s;const e=t;this.setCurrentPage(((s=e.detail)==null?void 0:s.currentPage)??1)}maybeEmitLoadMore(t){!this.infiniteScroll||!this.hasMore||this.loadingMore||this.loadMorePending||t.scrollHeight-t.scrollTop-t.clientHeight>this.loadMoreOffset||(this.loadMorePending=!0,this.dispatchEvent(new CustomEvent("load-more",{detail:{loadedCount:this.sortedData.length},bubbles:!0,composed:!0})))}handleBodyScroll(t){const e=t.target;this.scrollTop=e.scrollTop,e.clientHeight!==this.viewportHeight&&e.clientHeight>0&&(this.viewportHeight=e.clientHeight),this.maybeEmitLoadMore(e)}handleRowClick(t,e){this.dispatchEvent(new CustomEvent("row-click",{detail:{row:t,rowIndex:e},bubbles:!0,composed:!0}))}renderRows(){const t=this.virtualState;if(!(t.rows.length>0))return l`
        <tr>
          <td colspan="${this.totalColumnCount}" class="empty">${this.noDataText}</td>
        </tr>
      `;const s=t.topPadding>0?l`
            <tr class="virtual-spacer" aria-hidden="true">
              <td colspan="${this.totalColumnCount}" style="height: ${t.topPadding}px;"></td>
            </tr>
          `:h,o=t.bottomPadding>0?l`
            <tr class="virtual-spacer" aria-hidden="true">
              <td
                colspan="${this.totalColumnCount}"
                style="height: ${t.bottomPadding}px;"
              ></td>
            </tr>
          `:h,r=this.shouldUsePagination?(this.currentPage-1)*this.pageSize:0,a=new Set,i=Kr(t.rows,(c,p)=>this.getRowKey(c,t.start+p),(c,p)=>{const u=t.start+p,m=r+u;return l`
          <tr
            class="${this.striped?"striped":""} ${this.hoverable?"hoverable":""}"
            @click="${()=>this.handleRowClick(c,u)}"
          >
            ${this.selectable?l`
                  <td class="selection-cell" @click="${d=>d.stopPropagation()}">
                    <input
                      type="checkbox"
                      .checked="${this.isRowSelected(c,u)}"
                      @change="${()=>this.toggleRowSelection(c,u)}"
                    />
                  </td>
                `:h}
            ${this.sortedColumns.map((d,w)=>{const $=`${u}-${w}`;if(a.has($))return h;const _=this.getCellSpan({row:c,rowIndex:m,column:d,columnIndex:w,data:this.sourceData,columns:this.sortedColumns});if(_.rowspan<=0||_.colspan<=0)return h;for(let V=0;V<_.rowspan;V+=1)for(let Ye=0;Ye<_.colspan;Ye+=1)V===0&&Ye===0||a.add(`${u+V}-${w+Ye}`);const E=d.align??"center",Pe=this.getCellDisplayValue(c,d,u);return l`
                <td
                  class="${d.ellipsis?"ellipsis":""}"
                  rowspan="${_.rowspan}"
                  colspan="${_.colspan}"
                  style="text-align: ${E}; max-width: ${d.width||"auto"};"
                >
                  ${Pe}
                </td>
              `})}
          </tr>
        `});return l`${s}${i}${o}`}renderPagination(){return this.shouldUsePagination?l`
      <se-pagination
        class="pagination"
        .currentPage="${this.currentPage}"
        .total="${this.sortedData.length}"
        .pageSize="${this.pageSize}"
        @page-change="${this.handlePaginationChange}"
      ></se-pagination>
    `:h}renderLoadMoreStatus(){return this.infiniteScroll?this.loadingMore?l`<div class="status-line">${this.loadingText}</div>`:this.hasMore?l`<div class="status-line">${this.loadMoreText}</div>`:l`<div class="status-line">${this.noMoreText}</div>`:h}renderSelectionHeader(){if(!this.selectable)return h;const t=this.sourceData.map((r,a)=>this.getRowKey(r,a)),e=t.filter(r=>this.selectedKeys.includes(r)),s=t.length>0&&e.length===t.length,o=e.length>0&&!s;return l`
      <th class="selection-cell">
        <input
          type="checkbox"
          aria-label="全选"
          .checked="${s}"
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
                ${this.sortedColumns.map((e,s)=>l`
                    <th
                      class="${e.sortable?"sortable":""}"
                      style="width: ${e.width||"auto"}; text-align: ${e.align||"center"};"
                      data-sort="${e.sortDirection==="asc"?"↑":e.sortDirection==="desc"?"↓":"⇅"}"
                      @click="${()=>this.sortColumn(s)}"
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
        ${this.loading?l`<div class="loading-overlay"><span class="loading-spinner"></span></div>`:h}
        ${this.renderLoadMoreStatus()} ${this.renderPagination()}
      </div>
    `}};g.styles=[Vr,b`
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
    `];y([n({type:Array})],g.prototype,"data",2);y([n({type:Array})],g.prototype,"columns",2);y([n({type:String})],g.prototype,"noDataText",2);y([n({type:String})],g.prototype,"borderStyle",2);y([n({type:Boolean})],g.prototype,"rowLines",2);y([n({type:Boolean})],g.prototype,"columnLines",2);y([n({type:String})],g.prototype,"theadBgColor",2);y([n({type:String})],g.prototype,"theadTextColor",2);y([n({type:Number})],g.prototype,"pageSize",2);y([n({type:Boolean})],g.prototype,"pagination",2);y([n({type:Boolean})],g.prototype,"striped",2);y([n({type:Boolean})],g.prototype,"hoverable",2);y([n({type:Boolean})],g.prototype,"stickyHeader",2);y([n({type:String})],g.prototype,"height",2);y([n({type:String})],g.prototype,"rowKey",2);y([n({type:Boolean})],g.prototype,"selectable",2);y([n({attribute:!1})],g.prototype,"selectedKeys",2);y([n({type:Boolean})],g.prototype,"loading",2);y([n({attribute:!1})],g.prototype,"spanMethod",2);y([n({type:Boolean})],g.prototype,"infiniteScroll",2);y([n({type:Boolean})],g.prototype,"hasMore",2);y([n({type:Boolean})],g.prototype,"loadingMore",2);y([n({type:Number})],g.prototype,"loadMoreOffset",2);y([n({type:String})],g.prototype,"loadMoreText",2);y([n({type:String})],g.prototype,"loadingText",2);y([n({type:String})],g.prototype,"noMoreText",2);y([n({type:Boolean})],g.prototype,"virtualScroll",2);y([n({type:Number})],g.prototype,"virtualThreshold",2);y([n({type:Number})],g.prototype,"virtualRowHeight",2);y([n({type:Number})],g.prototype,"virtualBuffer",2);y([S()],g.prototype,"currentPage",2);y([S()],g.prototype,"sortedColumns",2);y([S()],g.prototype,"sortedData",2);y([S()],g.prototype,"scrollTop",2);y([S()],g.prototype,"viewportHeight",2);y([S()],g.prototype,"loadMorePending",2);g=y([f("se-table")],g);var Yr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,Ct=(t,e,s,o)=>{for(var r=o>1?void 0:o?Xr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Yr(e,s,r),r};let Te=class extends v{constructor(){super(...arguments),this.src="",this.rotation=0}handleClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return l`
      <div class="preview">
        <img src="${this.src}" style="--rotation: ${this.rotation}deg;" />
        <button class="close-btn" @click="${this.handleClose}">关闭</button>
        <button class="rotate-btn" @click="${this.handleRotate}">旋转</button>
      </div>
    `}};Te.styles=b`
    import 'uno.css';
    @unocss-placeholder;

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
  `;Ct([n({type:String})],Te.prototype,"src",2);Ct([S()],Te.prototype,"rotation",2);Te=Ct([f("se-image-preview")],Te);var Zr=Object.defineProperty,Gr=Object.getOwnPropertyDescriptor,z=(t,e,s,o)=>{for(var r=o>1?void 0:o?Gr(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Zr(e,s,r),r};let C=class extends v{constructor(){super(...arguments),this.src="",this.alt="",this.lazy=!1,this.placeholder="",this.errorPlaceholder="",this.width=100,this.height=100,this.isError=!1,this.isPreviewVisible=!1,this.rotation=0,this._isVisible=!1}firstUpdated(){var t;this.lazy&&(this._observer=new IntersectionObserver(e=>{var s;e[0].isIntersecting&&(this._isVisible=!0,(s=this._observer)==null||s.disconnect(),this.requestUpdate())}),this._observer.observe((t=this.shadowRoot)==null?void 0:t.querySelector("img")))}loadImage(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("img");t&&this.src&&(t.src=this.src)}handleError(){this.isError=!0}handleImageClick(){this.isPreviewVisible=!0}handleClosePreview(){this.isPreviewVisible=!1}handleRotate(){this.rotation=(this.rotation+90)%360}render(){return l`
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
        ${this.isPreviewVisible?l`
              <se-image-preview
                .src="${this.src}"
                @close="${this.handleClosePreview}"
              ></se-image-preview>
            `:""}
      </div>
    `}};C.styles=b`
    import 'uno.css';
    @unocss-placeholder;

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
  `;z([n({type:String})],C.prototype,"src",2);z([n({type:String})],C.prototype,"alt",2);z([n({type:Boolean})],C.prototype,"lazy",2);z([n({type:String})],C.prototype,"placeholder",2);z([n({type:String})],C.prototype,"errorPlaceholder",2);z([n({type:Number})],C.prototype,"width",2);z([n({type:Number})],C.prototype,"height",2);z([S()],C.prototype,"isError",2);z([S()],C.prototype,"isPreviewVisible",2);z([S()],C.prototype,"rotation",2);C=z([f("se-image")],C);var Qr=Object.defineProperty,es=Object.getOwnPropertyDescriptor,Ot=(t,e,s,o)=>{for(var r=o>1?void 0:o?es(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Qr(e,s,r),r};let je=class extends v{constructor(){super(...arguments),this.direction="horizontal",this.color="#000"}render(){return l`
      <div
        class="line ${this.direction==="horizontal"?"horizontal":"vertical"}"
        style="background-color: ${this.color};"
      ></div>
    `}};je.styles=b`
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
  `;Ot([n({type:String})],je.prototype,"direction",2);Ot([n({type:String})],je.prototype,"color",2);je=Ot([f("line-component")],je);var ts=Object.defineProperty,rs=Object.getOwnPropertyDescriptor,ae=(t,e,s,o)=>{for(var r=o>1?void 0:o?rs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ts(e,s,r),r};let D=class extends v{constructor(){super(...arguments),this.src="",this.thumbnail="",this.title="",this.downloadable=!0,this.type="unknown",this.previewVisible=!1}resolveType(){if(this.type!=="unknown")return this.type;const t=this.src.toLowerCase();return t.match(/\.(png|jpe?g|gif|webp|svg)$/)?"image":t.match(/\.(mp4|webm|mov)$/)?"video":t.match(/\.(mp3|wav|ogg)$/)?"audio":t.endsWith(".pdf")?"pdf":"unknown"}openPreview(){this.src&&(this.previewVisible=!0,this.dispatchEvent(new CustomEvent("asset-open",{detail:{src:this.src,type:this.resolveType()},bubbles:!0,composed:!0})))}closePreview(){this.previewVisible=!1}renderPreviewThumb(){const t=this.resolveType();if(t==="image"){const s=this.thumbnail||this.src;return l`<img src=${s} alt=${this.title||"asset"} loading="lazy" />`}return l`<span>${{image:"图片",video:"视频",audio:"音频",pdf:"PDF",unknown:"文件"}[t]}</span>`}renderOverlay(){if(!this.previewVisible)return null;const t=this.resolveType();return l`
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
    `}};D.styles=[x,b`
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
    `];ae([n({type:String})],D.prototype,"src",2);ae([n({type:String})],D.prototype,"thumbnail",2);ae([n({type:String})],D.prototype,"title",2);ae([n({type:Boolean})],D.prototype,"downloadable",2);ae([n({type:String})],D.prototype,"type",2);ae([S()],D.prototype,"previewVisible",2);D=ae([f("se-asset-viewer")],D);function K(t,e){if(!t)return e;try{const s=JSON.parse(t);return Array.isArray(s)?s:e}catch{return e}}var ss=Object.defineProperty,os=Object.getOwnPropertyDescriptor,me=(t,e,s,o)=>{for(var r=o>1?void 0:o?os(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ss(e,s,r),r};let B=class extends v{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.placeholder="请选择",this.disabled=!1}get mergedOptions(){return this.options.length>0?this.options:K(this.optionsJson,[])}handleChange(t){const e=t.target;this.value=e.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return l`
      <select class="select" .value=${this.value} ?disabled=${this.disabled} @change=${this.handleChange}>
        <option value="">${this.placeholder}</option>
        ${this.mergedOptions.map(t=>l`<option value=${String(t.value)} ?disabled=${!!t.disabled}>
              ${t.label}
            </option>`)}
      </select>
    `}};B.styles=[x,ye,b`
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
    `];me([n({type:Array,attribute:!1})],B.prototype,"options",2);me([n({type:String})],B.prototype,"optionsJson",2);me([n({type:String})],B.prototype,"value",2);me([n({type:String})],B.prototype,"placeholder",2);me([n({type:Boolean})],B.prototype,"disabled",2);B=me([f("su-select")],B);var is=Object.defineProperty,as=Object.getOwnPropertyDescriptor,At=(t,e,s,o)=>{for(var r=o>1?void 0:o?as(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&is(e,s,r),r};let Be=class extends v{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}handleClick(){this.disabled||(this.checked=!this.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0})))}render(){return l`<button type="button" ?disabled=${this.disabled} @click=${this.handleClick}></button>`}};Be.styles=[x,b`
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
    `];At([n({type:Boolean,reflect:!0})],Be.prototype,"checked",2);At([n({type:Boolean})],Be.prototype,"disabled",2);Be=At([f("su-switch")],Be);var ns=Object.defineProperty,ls=Object.getOwnPropertyDescriptor,Ue=(t,e,s,o)=>{for(var r=o>1?void 0:o?ls(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ns(e,s,r),r};let G=class extends v{constructor(){super(...arguments),this.value="",this.placeholder="请输入",this.rows=4,this.disabled=!1}handleInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return l`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        rows=${this.rows}
        ?disabled=${this.disabled}
        @input=${this.handleInput}></textarea>
    `}};G.styles=[x,ye,b`
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
    `];Ue([n({type:String})],G.prototype,"value",2);Ue([n({type:String})],G.prototype,"placeholder",2);Ue([n({type:Number})],G.prototype,"rows",2);Ue([n({type:Boolean})],G.prototype,"disabled",2);G=Ue([f("su-textarea")],G);var ps=Object.defineProperty,cs=Object.getOwnPropertyDescriptor,Le=(t,e,s,o)=>{for(var r=o>1?void 0:o?cs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ps(e,s,r),r};let Q=class extends v{constructor(){super(...arguments),this.label="",this.message="",this.status="default",this.required=!1}render(){return l`
      <div class="item">
        ${this.label?l`<label class="label">${this.required?l`<span class="required">*</span>`:h}${this.label}</label>`:h}
        <slot></slot>
        ${this.message?l`<div class="message ${this.status}">${this.message}</div>`:h}
      </div>
    `}};Q.styles=[x,b`
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
    `];Le([n({type:String})],Q.prototype,"label",2);Le([n({type:String})],Q.prototype,"message",2);Le([n({type:String})],Q.prototype,"status",2);Le([n({type:Boolean})],Q.prototype,"required",2);Q=Le([f("su-form-item")],Q);var ds=Object.defineProperty,hs=Object.getOwnPropertyDescriptor,it=(t,e,s,o)=>{for(var r=o>1?void 0:o?hs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ds(e,s,r),r};let de=class extends v{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.label=""}onChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return l`
      <label>
        <input type="checkbox" .checked=${this.checked} ?disabled=${this.disabled} @change=${this.onChange} />
        <span>${this.label}</span>
      </label>
    `}};de.styles=[x,b`
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
    `];it([n({type:Boolean,reflect:!0})],de.prototype,"checked",2);it([n({type:Boolean})],de.prototype,"disabled",2);it([n({type:String})],de.prototype,"label",2);de=it([f("su-checkbox")],de);var us=Object.defineProperty,vs=Object.getOwnPropertyDescriptor,Ke=(t,e,s,o)=>{for(var r=o>1?void 0:o?vs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&us(e,s,r),r};let ee=class extends v{constructor(){super(...arguments),this.options=[],this.optionsJson="",this.value="",this.name=`su-radio-${Math.random().toString(36).slice(2)}`}get mergedOptions(){return this.options.length>0?this.options:K(this.optionsJson,[])}onChange(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return l`
      <div class="group">
        ${this.mergedOptions.map(t=>l`
            <label>
              <input
                type="radio"
                name=${this.name}
                value=${t.value}
                .checked=${this.value===t.value}
                ?disabled=${!!t.disabled}
                @change=${this.onChange} />
              <span>${t.label}</span>
            </label>
          `)}
      </div>
    `}};ee.styles=[x,b`
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
    `];Ke([n({type:Array,attribute:!1})],ee.prototype,"options",2);Ke([n({type:String})],ee.prototype,"optionsJson",2);Ke([n({type:String})],ee.prototype,"value",2);Ke([n({type:String})],ee.prototype,"name",2);ee=Ke([f("su-radio-group")],ee);var bs=Object.defineProperty,gs=Object.getOwnPropertyDescriptor,xe=(t,e,s,o)=>{for(var r=o>1?void 0:o?gs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&bs(e,s,r),r};let H=class extends v{constructor(){super(...arguments),this.value=0,this.min=Number.MIN_SAFE_INTEGER,this.max=Number.MAX_SAFE_INTEGER,this.step=1,this.disabled=!1}clamp(t){return Math.min(this.max,Math.max(this.min,t))}emitChange(t){const e=this.clamp(t);if(e===this.value){this.requestUpdate();return}this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}onInput(t){const e=t.target.value,s=Number(e);e===""||Number.isNaN(s)||this.emitChange(s)}onBlur(t){const e=t.target;e.value=String(this.value)}render(){return l`
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
    `}};H.styles=[x,ye,b`
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
    `];xe([n({type:Number})],H.prototype,"value",2);xe([n({type:Number})],H.prototype,"min",2);xe([n({type:Number})],H.prototype,"max",2);xe([n({type:Number})],H.prototype,"step",2);xe([n({type:Boolean})],H.prototype,"disabled",2);H=xe([f("su-input-number")],H);var fs=Object.getOwnPropertyDescriptor,ys=(t,e,s,o)=>{for(var r=o>1?void 0:o?fs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=i(r)||r);return r};let gt=class extends v{render(){return l`
      <section class="card">
        <header class="header"><slot name="header"></slot></header>
        <div class="content"><slot></slot></div>
        <footer class="footer"><slot name="footer"></slot></footer>
      </section>
    `}};gt.styles=[x,b`
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
    `];gt=ys([f("su-card")],gt);var ms=Object.defineProperty,xs=Object.getOwnPropertyDescriptor,er=(t,e,s,o)=>{for(var r=o>1?void 0:o?xs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ms(e,s,r),r};let et=class extends v{constructor(){super(...arguments),this.type="default"}render(){return l`<span class="tag ${this.type}"><slot></slot></span>`}};et.styles=[x,b`
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
    `];er([n({type:String})],et.prototype,"type",2);et=er([f("su-tag")],et);var $s=Object.defineProperty,ws=Object.getOwnPropertyDescriptor,Ve=(t,e,s,o)=>{for(var r=o>1?void 0:o?ws(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&$s(e,s,r),r};let te=class extends v{constructor(){super(...arguments),this.title="",this.value="",this.trend="",this.trendType="flat"}render(){return l`
      <article class="card">
        <div class="title">${this.title}</div>
        <div class="value">${this.value}</div>
        <div class="trend ${this.trendType}">${this.trend}</div>
      </article>
    `}};te.styles=[x,b`
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
    `];Ve([n({type:String})],te.prototype,"title",2);Ve([n({type:String})],te.prototype,"value",2);Ve([n({type:String})],te.prototype,"trend",2);Ve([n({type:String})],te.prototype,"trendType",2);te=Ve([f("su-stat-card")],te);var _s=Object.defineProperty,Ss=Object.getOwnPropertyDescriptor,Je=(t,e,s,o)=>{for(var r=o>1?void 0:o?Ss(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&_s(e,s,r),r};let re=class extends v{constructor(){super(...arguments),this.count=0,this.max=99,this.dot=!1,this.showZero=!1}get text(){return this.count>this.max?`${this.max}+`:String(this.count)}render(){const t=this.dot||this.count>0||this.showZero&&this.count===0;return l`
      <slot></slot>
      ${t?l`<span class="badge ${this.dot?"dot":""}">${this.dot?"":this.text}</span>`:h}
    `}};re.styles=[x,b`
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
    `];Je([n({type:Number})],re.prototype,"count",2);Je([n({type:Number})],re.prototype,"max",2);Je([n({type:Boolean})],re.prototype,"dot",2);Je([n({type:Boolean})],re.prototype,"showZero",2);re=Je([f("su-badge")],re);var Ps=Object.defineProperty,Cs=Object.getOwnPropertyDescriptor,$e=(t,e,s,o)=>{for(var r=o>1?void 0:o?Cs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Ps(e,s,r),r};let I=class extends v{constructor(){super(...arguments),this.src="",this.name="",this.size="medium",this.shape="circle",this.loadError=!1}updated(t){t.has("src")&&(this.loadError=!1)}render(){const t=this.src&&!this.loadError;return l`
      <span class="avatar ${this.shape} ${this.size}">
        ${t?l`<img src=${this.src} alt=${this.name} @error=${()=>this.loadError=!0} />`:l`${this.name.slice(0,1).toUpperCase()}`}
      </span>
    `}};I.styles=[x,b`
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
    `];$e([n({type:String})],I.prototype,"src",2);$e([n({type:String})],I.prototype,"name",2);$e([n({type:String})],I.prototype,"size",2);$e([n({type:String})],I.prototype,"shape",2);$e([S()],I.prototype,"loadError",2);I=$e([f("su-avatar")],I);var Os=Object.defineProperty,As=Object.getOwnPropertyDescriptor,tr=(t,e,s,o)=>{for(var r=o>1?void 0:o?As(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Os(e,s,r),r};let tt=class extends v{constructor(){super(...arguments),this.description="暂无数据"}render(){return l`
      <div class="empty">
        <span class="icon" aria-hidden="true"></span>
        <span class="description">${this.description}</span>
        <slot></slot>
      </div>
    `}};tt.styles=[x,b`
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
    `];tr([n({type:String})],tt.prototype,"description",2);tt=tr([f("su-empty")],tt);var Es=Object.defineProperty,zs=Object.getOwnPropertyDescriptor,qe=(t,e,s,o)=>{for(var r=o>1?void 0:o?zs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Es(e,s,r),r};let se=class extends v{constructor(){super(...arguments),this.rows=3,this.avatar=!1,this.animated=!0,this.loading=!0}render(){return this.loading?l`
      <div class="skeleton ${this.animated?"animated":""}" aria-busy="true">
        ${this.avatar?l`<span class="avatar"></span>`:h}
        <div class="lines">
          ${Array.from({length:Math.max(1,this.rows)},()=>l`<div class="row"></div>`)}
        </div>
      </div>
    `:l`<slot></slot>`}};se.styles=[x,b`
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
    `];qe([n({type:Number})],se.prototype,"rows",2);qe([n({type:Boolean})],se.prototype,"avatar",2);qe([n({type:Boolean})],se.prototype,"animated",2);qe([n({type:Boolean})],se.prototype,"loading",2);se=qe([f("su-skeleton")],se);var ks=Object.defineProperty,Ds=Object.getOwnPropertyDescriptor,we=(t,e,s,o)=>{for(var r=o>1?void 0:o?Ds(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ks(e,s,r),r};let N=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.header="",this.column=2,this.bordered=!1}willUpdate(){this.style.setProperty("--desc-column",String(Math.max(1,this.column)))}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}render(){return l`
      ${this.header?l`<div class="title">${this.header}</div>`:h}
      <div class="grid ${this.bordered?"bordered":""}">
        ${this.mergedItems.map(t=>l`
            <div class="item">
              <span class="label">${t.label}</span>
              <span class="value">${t.value}</span>
            </div>
          `)}
      </div>
    `}};N.styles=[x,b`
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
    `];we([n({type:Array,attribute:!1})],N.prototype,"items",2);we([n({type:String})],N.prototype,"itemsJson",2);we([n({type:String})],N.prototype,"header",2);we([n({type:Number})],N.prototype,"column",2);we([n({type:Boolean})],N.prototype,"bordered",2);N=we([f("su-descriptions")],N);var Ms=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,ne=(t,e,s,o)=>{for(var r=o>1?void 0:o?Ts(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Ms(e,s,r),r};let M=class extends v{constructor(){super(...arguments),this.open=!1,this.title="提示",this.maskClosable=!0,this.hideFooter=!1,this.confirmText="确定",this.cancelText="取消",this.onKeydown=t=>{t.key==="Escape"&&this.open&&this.maskClosable&&this.close("mask")}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown)}closeByMask(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}confirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0})),this.close("confirm")}render(){return this.open?l`
      <div class="mask" @click=${this.closeByMask}>
        <section class="panel" role="dialog" aria-modal="true" aria-label=${this.title}>
          <header class="header">${this.title}</header>
          <div class="body"><slot></slot></div>
          ${this.hideFooter?h:l`
                <footer class="footer">
                  <slot name="footer">
                    <button type="button" @click=${()=>this.close("cancel")}>${this.cancelText}</button>
                    <button class="confirm" type="button" @click=${this.confirm}>${this.confirmText}</button>
                  </slot>
                </footer>
              `}
        </section>
      </div>
    `:h}};M.styles=[x,b`
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
    `];ne([n({type:Boolean,reflect:!0})],M.prototype,"open",2);ne([n({type:String})],M.prototype,"title",2);ne([n({type:Boolean})],M.prototype,"maskClosable",2);ne([n({type:Boolean})],M.prototype,"hideFooter",2);ne([n({type:String})],M.prototype,"confirmText",2);ne([n({type:String})],M.prototype,"cancelText",2);M=ne([f("su-modal")],M);var js=Object.defineProperty,Bs=Object.getOwnPropertyDescriptor,_e=(t,e,s,o)=>{for(var r=o>1?void 0:o?Bs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&js(e,s,r),r};let R=class extends v{constructor(){super(...arguments),this.open=!1,this.title="侧边面板",this.width="360px",this.maskClosable=!0,this.placement="right",this.onKeydown=t=>{t.key==="Escape"&&this.open&&this.maskClosable&&this.close("close")}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeydown)}willUpdate(){this.style.setProperty("--drawer-width",this.width)}close(t){this.open=!1,this.dispatchEvent(new CustomEvent("close",{detail:{source:t},bubbles:!0,composed:!0}))}handleMaskClick(t){this.maskClosable&&t.target===t.currentTarget&&this.close("mask")}render(){return this.open?l`
      <div class="mask" @click=${this.handleMaskClick}>
        <aside class="panel" role="dialog" aria-modal="true">
          <header class="header">
            <span>${this.title}</span>
            <button @click=${()=>this.close("close")}>关闭</button>
          </header>
          <div class="body"><slot></slot></div>
        </aside>
      </div>
    `:h}};R.styles=[x,b`
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
    `];_e([n({type:Boolean,reflect:!0})],R.prototype,"open",2);_e([n({type:String})],R.prototype,"title",2);_e([n({type:String})],R.prototype,"width",2);_e([n({type:Boolean})],R.prototype,"maskClosable",2);_e([n({type:String,reflect:!0})],R.prototype,"placement",2);R=_e([f("su-drawer")],R);var Hs=Object.defineProperty,Is=Object.getOwnPropertyDescriptor,Se=(t,e,s,o)=>{for(var r=o>1?void 0:o?Is(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Hs(e,s,r),r};const Ns={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};let U=class extends v{constructor(){super(...arguments),this.type="info",this.header="",this.closable=!1,this.showIcon=!0,this.closed=!1}handleClose(){this.closed=!0,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return this.closed?h:l`
      <div class="alert ${this.type}" role="alert">
        ${this.showIcon?l`<span class="icon">${Ns[this.type]}</span>`:h}
        <div class="main">
          ${this.header?l`<div class="header">${this.header}</div>`:h}
          <div class="content"><slot></slot></div>
        </div>
        ${this.closable?l`<button class="close" type="button" aria-label="关闭" @click=${this.handleClose}>✕</button>`:h}
      </div>
    `}};U.styles=[x,b`
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
    `];Se([n({type:String})],U.prototype,"type",2);Se([n({type:String})],U.prototype,"header",2);Se([n({type:Boolean})],U.prototype,"closable",2);Se([n({type:Boolean})],U.prototype,"showIcon",2);Se([S()],U.prototype,"closed",2);U=Se([f("su-alert")],U);var Rs=Object.defineProperty,Us=Object.getOwnPropertyDescriptor,Et=(t,e,s,o)=>{for(var r=o>1?void 0:o?Us(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Rs(e,s,r),r};const Ls={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};let He=class extends v{constructor(){super(...arguments),this.type="info",this.duration=3e3}firstUpdated(){this.duration>0&&setTimeout(()=>this.dismiss(),this.duration)}dismiss(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0})),this.remove()}render(){return l`
      <div class="message" role="status">
        <span class="icon ${this.type}">${Ls[this.type]}</span>
        <slot></slot>
      </div>
    `}};He.styles=[x,b`
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
    `];Et([n({type:String})],He.prototype,"type",2);Et([n({type:Number})],He.prototype,"duration",2);He=Et([f("su-message")],He);let F=null;function Ks(){return F&&F.isConnected||(F=document.createElement("div"),Object.assign(F.style,{position:"fixed",top:"16px",left:"50%",transform:"translateX(-50%)",zIndex:"2000",display:"grid",gap:"8px",justifyItems:"center",pointerEvents:"none"}),document.body.appendChild(F)),F}function L(t,e={}){const s=document.createElement("su-message");return s.type=e.type??"info",s.duration=e.duration??3e3,s.textContent=t,s.style.pointerEvents="auto",Ks().appendChild(s),s}L.info=(t,e)=>L(t,{type:"info",duration:e});L.success=(t,e)=>L(t,{type:"success",duration:e});L.warning=(t,e)=>L(t,{type:"warning",duration:e});L.error=(t,e)=>L(t,{type:"error",duration:e});var Vs=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,zt=(t,e,s,o)=>{for(var r=o>1?void 0:o?Js(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Vs(e,s,r),r};let Ie=class extends v{constructor(){super(...arguments),this.content="",this.placement="top"}render(){return l`
      <slot></slot>
      <div class="bubble" role="tooltip">${this.content}</div>
    `}};Ie.styles=[x,b`
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
    `];zt([n({type:String})],Ie.prototype,"content",2);zt([n({type:String,reflect:!0})],Ie.prototype,"placement",2);Ie=zt([f("su-tooltip")],Ie);var qs=Object.defineProperty,Fs=Object.getOwnPropertyDescriptor,at=(t,e,s,o)=>{for(var r=o>1?void 0:o?Fs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&qs(e,s,r),r};let he=class extends v{constructor(){super(...arguments),this.spinning=!0,this.size="medium",this.tip=""}renderIndicator(){return l`
      <div class="indicator" role="status" aria-label=${this.tip||"加载中"}>
        <span class="spinner ${this.size}"></span>
        ${this.tip?l`<span class="tip">${this.tip}</span>`:h}
      </div>
    `}render(){return this.childNodes.length>0?l`
      <slot></slot>
      ${this.spinning?l`<div class="overlay">${this.renderIndicator()}</div>`:h}
    `:this.spinning?this.renderIndicator():h}};he.styles=[x,b`
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
    `];at([n({type:Boolean})],he.prototype,"spinning",2);at([n({type:String})],he.prototype,"size",2);at([n({type:String})],he.prototype,"tip",2);he=at([f("su-spin")],he);var Ws=Object.defineProperty,Ys=Object.getOwnPropertyDescriptor,Fe=(t,e,s,o)=>{for(var r=o>1?void 0:o?Ys(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Ws(e,s,r),r};let oe=class extends v{constructor(){super(...arguments),this.percent=0,this.status="normal",this.showText=!0,this.strokeHeight="8px"}willUpdate(){this.style.setProperty("--stroke-height",this.strokeHeight)}get clampedPercent(){return Math.min(100,Math.max(0,this.percent))}render(){const t=this.clampedPercent;return l`
      <div class="progress" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="track">
          <div class="bar ${this.status}" style="width: ${t}%"></div>
        </div>
        ${this.showText?l`<span class="text">${t}%</span>`:h}
      </div>
    `}};oe.styles=[x,b`
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
    `];Fe([n({type:Number})],oe.prototype,"percent",2);Fe([n({type:String})],oe.prototype,"status",2);Fe([n({type:Boolean})],oe.prototype,"showText",2);Fe([n({type:String})],oe.prototype,"strokeHeight",2);oe=Fe([f("su-progress")],oe);var Xs=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,We=(t,e,s,o)=>{for(var r=o>1?void 0:o?Zs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Xs(e,s,r),r};let ie=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey="",this.collapsed=!1}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}onSelect(t){this.activeKey=t.key,this.dispatchEvent(new CustomEvent("select",{detail:t,bubbles:!0,composed:!0}))}render(){return l`
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
    `}};ie.styles=[x,b`
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
    `];We([n({type:Array,attribute:!1})],ie.prototype,"items",2);We([n({type:String})],ie.prototype,"itemsJson",2);We([n({type:String})],ie.prototype,"activeKey",2);We([n({type:Boolean})],ie.prototype,"collapsed",2);ie=We([f("su-menu")],ie);var Gs=Object.defineProperty,Qs=Object.getOwnPropertyDescriptor,nt=(t,e,s,o)=>{for(var r=o>1?void 0:o?Qs(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&Gs(e,s,r),r};let ue=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.separator="/"}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}handleClick(t,e){this.dispatchEvent(new CustomEvent("navigate",{detail:{item:t,index:e},bubbles:!0,composed:!0}))}render(){const t=this.mergedItems;return l`
      <nav>
        ${t.map((e,s)=>{const o=s===t.length-1;return l`
            <button class=${o?"current":""} @click=${()=>this.handleClick(e,s)}>
              ${e.label}
            </button>
            ${o?"":l`<span class="sep">${this.separator}</span>`}
          `})}
      </nav>
    `}};ue.styles=[x,b`
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
    `];nt([n({type:Array,attribute:!1})],ue.prototype,"items",2);nt([n({type:String})],ue.prototype,"itemsJson",2);nt([n({type:String})],ue.prototype,"separator",2);ue=nt([f("su-breadcrumb")],ue);var eo=Object.defineProperty,to=Object.getOwnPropertyDescriptor,lt=(t,e,s,o)=>{for(var r=o>1?void 0:o?to(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&eo(e,s,r),r};let ve=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.activeKey=""}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}get currentKey(){var t;return this.activeKey||((t=this.mergedItems[0])==null?void 0:t.key)||""}onSelect(t){t.disabled||t.key===this.currentKey||(this.activeKey=t.key,this.dispatchEvent(new CustomEvent("change",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})))}render(){const t=this.currentKey;return l`
      <div class="nav" role="tablist">
        ${this.mergedItems.map(e=>l`
            <button
              type="button"
              role="tab"
              aria-selected=${e.key===t?"true":"false"}
              class="tab ${e.key===t?"active":""}"
              ?disabled=${!!e.disabled}
              @click=${()=>this.onSelect(e)}>
              ${e.label}
            </button>
          `)}
      </div>
      <div class="panel" role="tabpanel">
        <slot name=${t}></slot>
        <slot></slot>
      </div>
    `}};ve.styles=[x,b`
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
    `];lt([n({type:Array,attribute:!1})],ve.prototype,"items",2);lt([n({type:String})],ve.prototype,"itemsJson",2);lt([n({type:String})],ve.prototype,"activeKey",2);ve=lt([f("su-tabs")],ve);var ro=Object.defineProperty,so=Object.getOwnPropertyDescriptor,pt=(t,e,s,o)=>{for(var r=o>1?void 0:o?so(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ro(e,s,r),r};let be=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.open=!1,this.onDocumentClick=t=>{this.open&&(t.composedPath().includes(this)||(this.open=!1))}}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.onDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.onDocumentClick)}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}toggle(){this.open=!this.open}onSelect(t){t.disabled||(this.open=!1,this.dispatchEvent(new CustomEvent("select",{detail:{key:t.key,item:t},bubbles:!0,composed:!0})))}render(){return l`
      <div class="trigger" @click=${this.toggle}>
        <slot></slot>
      </div>
      ${this.open?l`
            <div class="menu" role="menu">
              ${this.mergedItems.map(t=>l`
                  <button
                    type="button"
                    role="menuitem"
                    class="item ${t.danger?"danger":""}"
                    ?disabled=${!!t.disabled}
                    @click=${()=>this.onSelect(t)}>
                    ${t.label}
                  </button>
                `)}
            </div>
          `:h}
    `}};be.styles=[x,b`
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
    `];pt([n({type:Array,attribute:!1})],be.prototype,"items",2);pt([n({type:String})],be.prototype,"itemsJson",2);pt([S()],be.prototype,"open",2);be=pt([f("su-dropdown")],be);var oo=Object.defineProperty,io=Object.getOwnPropertyDescriptor,ct=(t,e,s,o)=>{for(var r=o>1?void 0:o?io(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&oo(e,s,r),r};let ge=class extends v{constructor(){super(...arguments),this.items=[],this.itemsJson="",this.current=0}get mergedItems(){return this.items.length>0?this.items:K(this.itemsJson,[])}render(){const t=this.mergedItems;return l`
      <div class="steps">
        ${t.map((e,s)=>{const o=s<this.current?"finished":s===this.current?"active":"";return l`
            <div class="step ${o}">
              <span class="indicator">${s<this.current?"✓":s+1}</span>
              <div class="content">
                <div class="title">${e.title}</div>
                ${e.description?l`<div class="description">${e.description}</div>`:h}
              </div>
              ${s<t.length-1?l`<span class="connector"></span>`:h}
            </div>
          `})}
      </div>
    `}};ge.styles=[x,b`
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
    `];ct([n({type:Array,attribute:!1})],ge.prototype,"items",2);ct([n({type:String})],ge.prototype,"itemsJson",2);ct([n({type:Number})],ge.prototype,"current",2);ge=ct([f("su-steps")],ge);var ao=Object.defineProperty,no=Object.getOwnPropertyDescriptor,kt=(t,e,s,o)=>{for(var r=o>1?void 0:o?no(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&ao(e,s,r),r};let Ne=class extends v{constructor(){super(...arguments),this.siderWidth="220px",this.headerHeight="56px"}willUpdate(){this.style.setProperty("--sider-width",this.siderWidth),this.style.setProperty("--header-height",this.headerHeight)}render(){return l`
      <div class="layout">
        <aside class="sider"><slot name="sider"></slot></aside>
        <header class="header"><slot name="header"></slot></header>
        <main class="content"><slot></slot></main>
      </div>
    `}};Ne.styles=[x,b`
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
    `];kt([n({type:String})],Ne.prototype,"siderWidth",2);kt([n({type:String})],Ne.prototype,"headerHeight",2);Ne=kt([f("su-container")],Ne);var lo=Object.defineProperty,po=Object.getOwnPropertyDescriptor,Dt=(t,e,s,o)=>{for(var r=o>1?void 0:o?po(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&lo(e,s,r),r};let Re=class extends v{constructor(){super(...arguments),this.direction="horizontal",this.dashed=!1}render(){if(this.direction==="vertical")return l``;const t=this.childNodes.length>0;return l`
      <div class="divider ${t?"":"plain"}" role="separator">
        <slot></slot>
      </div>
    `}};Re.styles=[x,b`
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
    `];Dt([n({type:String,reflect:!0})],Re.prototype,"direction",2);Dt([n({type:Boolean,reflect:!0})],Re.prototype,"dashed",2);Re=Dt([f("su-divider")],Re);var co=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,rr=(t,e,s,o)=>{for(var r=o>1?void 0:o?ho(e,s):e,a=t.length-1,i;a>=0;a--)(i=t[a])&&(r=(o?i(e,s,r):i(r))||r);return o&&r&&co(e,s,r),r};let rt=class extends v{constructor(){super(...arguments),this.mode="light",this.onThemeChange=()=>{this.mode=Ze()}}connectedCallback(){super.connectedCallback(),this.mode=Ze(),window.addEventListener("su-theme-change",this.onThemeChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("su-theme-change",this.onThemeChange)}handleClick(){this.mode=ar(),this.dispatchEvent(new CustomEvent("change",{detail:{mode:this.mode},bubbles:!0,composed:!0}))}render(){const t=this.mode==="dark";return l`
      <button
        type="button"
        aria-label=${t?"切换到亮色主题":"切换到暗色主题"}
        title=${t?"切换到亮色主题":"切换到暗色主题"}
        @click=${this.handleClick}>
        ${t?"🌙":"☀️"}
      </button>
    `}};rt.styles=[x,ye,b`
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
    `];rr([S()],rt.prototype,"mode",2);rt=rr([f("su-theme-toggle")],rt);nr();export{je as LineComponent,D as SeAssetViewer,O as SeInput,ce as SePagination,U as SuAlert,I as SuAvatar,re as SuBadge,ue as SuBreadcrumb,P as SuButton,gt as SuCard,de as SuCheckbox,Ne as SuContainer,N as SuDescriptions,Re as SuDivider,R as SuDrawer,be as SuDropdown,tt as SuEmpty,Q as SuFormItem,H as SuInputNumber,ie as SuMenu,He as SuMessage,M as SuModal,oe as SuProgress,ee as SuRadioGroup,B as SuSelect,se as SuSkeleton,he as SuSpin,te as SuStatCard,ge as SuSteps,Be as SuSwitch,ve as SuTabs,et as SuTag,G as SuTextarea,rt as SuThemeToggle,Ie as SuTooltip,Ze as getThemeMode,nr as initTheme,L as message,vo as resetThemeColors,C as seImage,g as seTable,uo as setThemeColors,ir as setThemeMode,ar as toggleThemeMode};
