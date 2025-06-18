
export interface RippleOptions {
    color?: string;
    opacity?: number;
}

export const rippleEffect = (
    event: MouseEvent,
    options: RippleOptions = {}
) => {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement('div');

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.position = 'absolute';
    circle.classList.add('ripple');

    if (options.color) {
        circle.style.setProperty('--ripple-color', options.color);
    }

    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    button.appendChild(circle);

    circle.addEventListener('animationend', () => {
        circle.remove();
    });
};