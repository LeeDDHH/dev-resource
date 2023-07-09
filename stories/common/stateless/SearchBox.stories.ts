import type { Meta, StoryObj } from '@storybook/react';

import { SearchBox } from '@/components/common/stateless/SearchBox';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SearchBox> = {
  title: 'Components/Common/Stateless/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

const defaultMockProps = {
  args: { value: 'React', changeSearchText: () => {}, searchTextHandler: () => {} },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
/**
 * 基本的な表示
 */
export const Default: Story = {
  args: {
    ...defaultMockProps.args,
  },
};
