import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from '@/components/common/Tag';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Tag> = {
  title: 'Components/Common/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

const defaultMockProps = {
  args: { tag: 'React', onClick: () => {} },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * 基本的なタグ表示
 */
export const Default: Story = {
  args: {
    ...defaultMockProps.args,
  },
};

/**
 * タグ一覧での表示
 */
export const TagWithCount: Story = {
  args: {
    ...Default.args,
    count: 100,
  },
};
