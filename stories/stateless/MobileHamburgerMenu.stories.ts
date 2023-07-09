import type { Meta, StoryObj } from '@storybook/react';

import { MobileHamburgerMenu } from '@/components/stateless/MobileHamburgerMenu';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof MobileHamburgerMenu> = {
  title: 'Stateless/MobileHamburgerMenu',
  component: MobileHamburgerMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MobileHamburgerMenu>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * 基本的に閉じている状態
 */
export const Default: Story = {
  args: {
    menuToggle: () => {},
    openMenu: false,
  },
};

/**
 * ボタンを押したら、開かれた状態
 */
export const Opened: Story = {
  args: {
    ...Default.args,
    openMenu: true,
  },
};
