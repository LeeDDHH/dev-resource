import type { Meta, StoryObj } from '@storybook/react';

import { TagsPage } from '@/components/screen/TagsPage';

import { fullTagCount } from '@/fixtures/tagCount';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof TagsPage> = {
  title: 'Components/Screen/TagsList',
  component: TagsPage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TagsPage>;

const mockProps = {
  tagCountList: fullTagCount,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * タグ一覧
 */
export const Default: Story = {
  args: {
    tagCountList: mockProps.tagCountList,
  },
};
