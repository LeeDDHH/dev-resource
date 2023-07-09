import type { Meta, StoryObj } from '@storybook/react';

import { MobileHamburgerMenu } from '@/components/parts/stateless/MobileHamburgerMenu';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof MobileHamburgerMenu> = {
  title: 'Components/Parts/Stateless/MobileHamburgerMenu',
  component: MobileHamburgerMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MobileHamburgerMenu>;

const defaultMockProps = {
  args: { menuToggle: () => {}, openMenu: false },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * 基本的に閉じている状態
 */
export const Default: Story = {
  args: {
    ...defaultMockProps.args,
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
