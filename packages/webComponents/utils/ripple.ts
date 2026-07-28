export interface RippleOptions {
  /** 自定义波纹颜色；不传则使用按钮 currentColor 混合色（由 CSS 控制） */
  color?: string;
  duration?: number;
}

/**
 * 在目标元素内创建一次点击水波纹。
 * 动画依赖宿主 Shadow DOM 中的 `.ripple-effect` / `@keyframes su-ripple-expand`。
 */
export function rippleEffect(
  event: MouseEvent,
  options: RippleOptions = {},
  targetElement?: HTMLElement
) {
  const button = targetElement || (event.currentTarget as HTMLElement);
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const centerX = event.clientX - rect.left;
  const centerY = event.clientY - rect.top;

  const distances = [
    Math.hypot(centerX, centerY),
    Math.hypot(rect.width - centerX, centerY),
    Math.hypot(centerX, rect.height - centerY),
    Math.hypot(rect.width - centerX, rect.height - centerY)
  ];
  const diameter = Math.max(...distances) * 2;
  const duration = options.duration ?? 560;

  button.querySelectorAll('.ripple-effect').forEach((el) => el.remove());

  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.setAttribute('aria-hidden', 'true');
  ripple.style.left = `${centerX - diameter / 2}px`;
  ripple.style.top = `${centerY - diameter / 2}px`;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  if (options.color) {
    ripple.style.backgroundColor = options.color;
  }
  if (options.duration) {
    ripple.style.animationDuration = `${duration}ms`;
  }

  button.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), duration);
}
