import type { Meta, StoryObj } from '@storybook/web-components';

export default {
  title: 'Components/SuButton',
  component: 'su-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'SilenceUI 按钮组件，支持多种样式和状态配置。'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: '按钮类型'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '按钮尺寸'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    loading: {
      control: 'boolean',
      description: '是否加载中'
    }
  }
} as Meta;

export const Primary: StoryObj = {
  args: {
    type: 'primary',
    children: 'Primary Button'
  },
  render: ({ type, size, disabled, loading, children }) =>
    `<su-button type="${type}" size="${size || 'medium'}"${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}>${children}</su-button>`
};

export const AllVariants: StoryObj = {
  render: () => `
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <su-button type="primary">Primary</su-button>
      <su-button type="secondary">Secondary</su-button>
      <su-button type="success">Success</su-button>
      <su-button type="warning">Warning</su-button>
      <su-button type="danger">Danger</su-button>
    </div>
  `
};

export const Sizes: StoryObj = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      <su-button type="primary" size="small">Small</su-button>
      <su-button type="primary" size="medium">Medium</su-button>
      <su-button type="primary" size="large">Large</su-button>
    </div>
  `
};
  },
render: Primary.render,
};
