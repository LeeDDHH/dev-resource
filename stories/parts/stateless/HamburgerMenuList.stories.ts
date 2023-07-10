import type { Meta, StoryObj } from '@storybook/react';

import { HamburgerMenuList } from '@/components/parts/stateless/HamburgerMenuList';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof HamburgerMenuList> = {
  title: 'Components/Parts/Stateless/HamburgerMenuList',
  component: HamburgerMenuList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HamburgerMenuList>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * デフォルト表示兼検索ページ選択時
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/',
      },
    },
  },
};

/**
 * 一覧ページ選択時
 */
export const List: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/list',
      },
    },
  },
};

/**
 * タグページ選択時
 */
export const Tags: Story = {
  parameters: {
    nextjs: {
      router: {
        asPath: '/tags',
      },
    },
  },
};
