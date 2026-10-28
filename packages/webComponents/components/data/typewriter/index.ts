import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseControlStyles } from '../../_shared/styles';

export type TypewriterEffect = 'type' | 'fade' | 'slide' | 'blur' | 'rainbow';
export type TypewriterCursor = 'line' | 'block' | 'underscore' | 'none';
export interface TypewriterTextDetail {
  text: string;
  index: number;
}

/** 多文本打字动画；仅渲染纯文本，卸载时释放所有计时器与媒体查询监听。 */
@customElement('su-typewriter')
export class SuTypewriter extends LitElement {
  @property({ type: String }) text = '';
  @property({ attribute: false }) texts: string[] = [];
  @property({ type: Number }) speed = 80;
  @property({ type: Number, attribute: 'delete-speed' }) deleteSpeed = 40;
  @property({ type: Number, attribute: 'hold-delay' }) holdDelay = 1500;
  @property({ type: Number, attribute: 'start-delay' }) startDelay = 0;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean, reflect: true }) paused = false;
  @property({ type: String, reflect: true }) effect: TypewriterEffect = 'type';
  @property({ type: String }) cursor: TypewriterCursor = 'line';
  @state() private count = 0;
  @state() private itemIndex = 0;
  @state() private reducedMotion = false;
  private items: string[] = [];
  private characters: string[][] = [];
  private phase: 'typing' | 'holding' | 'deleting' | 'finished' = 'typing';
  private timer?: ReturnType<typeof setTimeout>;
  private media?: MediaQueryList;

  static styles = [
    baseControlStyles,
    css`
      :host {
        display: inline;
        font-family: inherit;
        color: var(--su-typewriter-color, var(--su-text-1, inherit));
      }
      .visual {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .character {
        display: inline-block;
        white-space: pre;
      }
      :host([effect='fade']) .character {
        animation: fade 240ms ease-out both;
      }
      :host([effect='slide']) .character {
        animation: slide 240ms ease-out both;
      }
      :host([effect='blur']) .character {
        animation: blur 300ms ease-out both;
      }
      :host([effect='rainbow']) .character:nth-child(3n + 1) {
        color: var(--su-color-primary);
      }
      :host([effect='rainbow']) .character:nth-child(3n + 2) {
        color: var(--su-color-success);
      }
      :host([effect='rainbow']) .character:nth-child(3n) {
        color: var(--su-color-warning);
      }
      .cursor {
        display: inline-block;
        color: var(--su-typewriter-cursor-color, var(--su-color-primary, currentColor));
        animation: blink 1s step-end infinite;
      }
      :host([paused]) .cursor,
      :host([paused]) .character {
        animation-play-state: paused;
      }
      .accessible {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      @keyframes fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slide {
        from {
          opacity: 0;
          transform: translateY(0.4em);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes blur {
        from {
          opacity: 0;
          filter: blur(4px);
        }
        to {
          opacity: 1;
          filter: blur(0);
        }
      }
      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .character,
        .cursor {
          animation: none !important;
        }
      }
    `,
  ];

  /** 监听系统减少动态效果设置，重挂载时从第一条重新播放。 */
  connectedCallback() {
    super.connectedCallback();
    this.media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.reducedMotion = this.media?.matches ?? false;
    this.media?.addEventListener('change', this.handleMotionChange);
    if (this.hasUpdated) this.restart();
  }

  /** 离开页面后不再推进动画或派发完成事件。 */
  disconnectedCallback() {
    this.clearTimer();
    this.media?.removeEventListener('change', this.handleMotionChange);
    super.disconnectedCallback();
  }

  /** 内容变化重新开始；速度和暂停变化保留当前文本进度。 */
  protected willUpdate(changed: PropertyValues) {
    if (changed.has('text') || changed.has('texts')) {
      this.restart();
    } else if (
      ['paused', 'speed', 'deleteSpeed', 'holdDelay', 'loop'].some((key) => changed.has(key))
    ) {
      this.schedule();
    }
  }

  /** 从第一条开始重播，保留调用方设置的暂停状态。 */
  restart() {
    this.clearTimer();
    this.items = Array.isArray(this.texts)
      ? this.texts.filter((item) => typeof item === 'string' && item.length > 0)
      : [];
    if (!this.items.length && typeof this.text === 'string' && this.text) this.items = [this.text];
    const segmenter =
      typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : undefined;
    this.characters = this.items.map((item) =>
      segmenter ? Array.from(segmenter.segment(item), (part) => part.segment) : Array.from(item)
    );
    this.itemIndex = 0;
    this.count = 0;
    this.phase = this.items.length ? 'typing' : 'finished';
    this.requestUpdate();
    this.schedule(this.delay(this.startDelay, 0) + this.delay(this.speed, 80));
  }

  /** 暂停当前进度并立即取消下一步计时。 */
  pause() {
    this.paused = true;
    this.clearTimer();
  }

  /** 从当前字符继续；下一步使用完整间隔。 */
  resume() {
    this.paused = false;
    this.schedule();
  }

  /** 系统偏好变更时切换静态内容，关闭减少动态效果后重新播放。 */
  private handleMotionChange = (event: MediaQueryListEvent) => {
    this.reducedMotion = event.matches;
    this.restart();
  };

  /** 非法时间回退到默认值，避免 NaN/负值产生忙循环。 */
  private delay(value: number, fallback: number) {
    return Number.isFinite(value) && value >= 0 ? Math.min(value, 2147483647) : fallback;
  }

  /** 始终只保留一个待执行计时器。 */
  private clearTimer() {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  /** 按输入、停留或删除阶段安排下一步，零间隔最低为一毫秒。 */
  private schedule(delay?: number) {
    this.clearTimer();
    if (!this.isConnected || this.paused || this.reducedMotion || this.phase === 'finished') return;
    const interval =
      this.phase === 'holding'
        ? this.delay(this.holdDelay, 1500)
        : this.phase === 'deleting'
          ? this.delay(this.deleteSpeed, 40)
          : this.delay(this.speed, 80);
    this.timer = setTimeout(
      () => this.tick(),
      Math.max(1, Math.min(delay ?? interval, 2147483647))
    );
  }

  /** 输入整条后停留、删除并切换；非循环模式保留最后一条。 */
  private tick() {
    if (!this.isConnected || this.paused || this.reducedMotion) return;
    const characters = this.characters[this.itemIndex];
    if (!characters) return;
    if (this.phase === 'typing') {
      this.count++;
      if (this.count === characters.length) {
        const finished = !this.loop && this.itemIndex === this.items.length - 1;
        this.phase = finished ? 'finished' : 'holding';
        const detail: TypewriterTextDetail = {
          text: this.items[this.itemIndex],
          index: this.itemIndex,
        };
        this.schedule();
        this.dispatchEvent(
          new CustomEvent('text-complete', { detail, bubbles: true, composed: true })
        );
        if (finished)
          this.dispatchEvent(
            new CustomEvent('complete', { detail, bubbles: true, composed: true })
          );
        return;
      }
    } else if (this.phase === 'holding') {
      this.phase = 'deleting';
    } else if (this.phase === 'deleting') {
      this.count--;
      if (this.count === 0) {
        this.itemIndex = (this.itemIndex + 1) % this.items.length;
        this.phase = 'typing';
      }
    }
    this.schedule();
  }

  /** 屏幕阅读器一次读取完整内容，避免逐字播报；动画层仅用于视觉展示。 */
  render() {
    const visible = (this.characters[this.itemIndex] ?? []).slice(0, this.count);
    const cursors = { line: '|', block: '▍', underscore: '_', none: '' };
    return html`<span class="accessible">${this.items.join('；')}</span
      ><span class="visual" part="text" aria-hidden="true"
        >${this.reducedMotion
          ? this.items.join('；')
          : repeat(
              visible,
              (_, index) => `${this.itemIndex}-${index}`,
              (character) =>
                character === '\n' ? character : html`<span class="character">${character}</span>`
            )}</span
      >${!this.reducedMotion && this.items.length && cursors[this.cursor]
        ? html`<span class="cursor" part="cursor" aria-hidden="true">${cursors[this.cursor]}</span>`
        : ''}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'su-typewriter': SuTypewriter;
  }
}
