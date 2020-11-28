import { TimesListComponent } from './TimesList';
import React from 'react';

export default {
  title: 'TimesListComponent',
  component: TimesListComponent,
};

const Template = (args) => <TimesListComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  stopID: '9uK0wx3SueAKnJ29cbgk',
};
