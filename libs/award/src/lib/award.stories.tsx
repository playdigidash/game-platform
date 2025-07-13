import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Award } from './award';

export default {
  component: Award,
  title: 'Award',
} as ComponentMeta<typeof Award>;

const Template: ComponentStory<typeof Award> = (args) => <Award {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
