import { css } from 'lit';

export const styleMap = css`
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
