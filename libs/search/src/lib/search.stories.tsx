import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Search } from './search';

export default {
  component: Search,
  title: 'Search',
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => <Search {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
