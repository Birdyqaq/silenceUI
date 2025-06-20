import type { Meta, StoryObj } from '@storybook/web-components';

export default {
  title: 'SuButton',
  component: 'su-button',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'link'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    rippleColor: { control: 'text' },
    iconClass: { control: 'text' },
    iconPosition: { control: 'select', options: ['left', 'right'] },
  },
} as Meta;

type Story = StoryObj;

export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'large',
    children: 'Primary Button',
  },
  render: ({ type, size, disabled, loading, rippleColor, iconClass, iconPosition, children }) =>
    `<su-button type="${type}" size="${size}"${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${rippleColor ? ` rippleColor="${rippleColor}"` : ''}${iconClass ? ` iconClass="${iconClass}"` : ''}${iconPosition ? ` iconPosition="${iconPosition}"` : ''}>${children ?? ''}</su-button>`,
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
  render: Primary.render,
};

export const Disabled: Story = {
  args: {
    type: 'secondary',
    size: 'medium',
    disabled: true,
    children: 'Disabled Button',
  },
  render: Primary.render,
};

export const Loading: Story = {
  args: {
    type: 'success',
    size: 'small',
    loading: true,
    children: 'Loading Button',
  },
  render: Primary.render,
};

export const Danger: Story = {
  args: {
    type: 'danger',
    size: 'large',
    iconClass: 'i-quill-trash',
    iconPosition: 'left',
    children: 'Delete',
  },
  render: Primary.render,
};
