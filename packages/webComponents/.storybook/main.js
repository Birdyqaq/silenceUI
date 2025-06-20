module.exports = {
    stories: [
        '../components/**/*.stories.@(js|ts|mdx)'
    ],
    addons: [
        '@storybook/addon-essentials'
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {}
    }
};
