
export interface RippleOptions {
    color?: string;
    opacity?: number;
    duration?: number; // 新增：动画持续时间
}

export const rippleEffect = (
    event: MouseEvent,
    options: RippleOptions = {},
    targetElement?: HTMLElement
) => {
    const button = targetElement || (event.currentTarget as HTMLElement);
    
    // 确保按钮有 relative 定位
    const computedStyle = getComputedStyle(button);
    if (computedStyle.position === 'static') {
        button.style.position = 'relative';
    }
    
    // 确保按钮有 overflow hidden
    if (computedStyle.overflow !== 'hidden') {
        button.style.overflow = 'hidden';
    }

    // 创建水波纹元素
    const ripple = document.createElement('div');
    
    // 获取按钮的边界框
    const rect = button.getBoundingClientRect();
    
    // 计算到按钮各个角的距离，选择最大的作为水波纹半径
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    const distances = [
        Math.sqrt(centerX ** 2 + centerY ** 2), // 到左上角
        Math.sqrt((rect.width - centerX) ** 2 + centerY ** 2), // 到右上角
        Math.sqrt(centerX ** 2 + (rect.height - centerY) ** 2), // 到左下角
        Math.sqrt((rect.width - centerX) ** 2 + (rect.height - centerY) ** 2) // 到右下角
    ];
    
    const maxDistance = Math.max(...distances);
    const diameter = maxDistance * 2;
    
    // 计算水波纹的位置（使其中心在点击位置）
    const x = centerX - diameter / 2;
    const y = centerY - diameter / 2;
    
    // 设置水波纹样式
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${diameter}px;
        height: ${diameter}px;
        border-radius: 50%;
        background-color: ${options.color || 'rgba(255, 255, 255, 0.5)'};
        pointer-events: none;
        z-index: 999;
        transform: scale(0);
        opacity: 1;
        animation: rippleExpand ${options.duration || 600}ms ease-out forwards;
    `;
    
    // 添加CSS动画到文档头部（只添加一次）
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
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
    
    // 清理现有水波纹
    const existingRipples = button.querySelectorAll('.ripple-effect');
    existingRipples.forEach(el => el.remove());
    
    // 添加水波纹到按钮
    button.appendChild(ripple);
    
    // 动画结束后清理
    const duration = options.duration || 600;
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, duration);
};