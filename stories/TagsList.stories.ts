import type { Meta, StoryObj } from '@storybook/react';

import { TagsList } from '@/components/screen/TagsList';

import { fullTagCount } from '@/fixtures/tagCount';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof TagsList> = {
  title: 'Components/Screen/TagsList',
  component: TagsList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TagsList>;

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
