import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from '@/components/common/Tag';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Tag> = {
  title: 'Common/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    tag: 'React',
    onClick: () => {},
  },
};

export const TagWithCount: Story = {
  args: {
    ...Default.args,
    count: 100,
  },
};
