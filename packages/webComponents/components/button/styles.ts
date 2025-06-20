import { css } from 'lit';

export const styleMap = `
  @unocss-placeholder; 
  import 'uno.css';
  :host {
    display: inline-block;
    --ripple-color: rgba(0, 0, 0, 0.1);
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