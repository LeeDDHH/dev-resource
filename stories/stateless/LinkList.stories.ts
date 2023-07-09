import type { Meta, StoryObj } from '@storybook/react';

import { LinkList } from '@/components/stateless/LinkList';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof LinkList> = {
  title: 'Stateless/LinkList',
  component: LinkList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LinkList>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
// https://storybook.js.org/blog/integrate-nextjs-and-storybook-automatically/
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
