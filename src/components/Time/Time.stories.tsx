import { TimeComponent } from './Time';
import React from 'react';

export default {
  title: 'TimeComponent',
  component: TimeComponent,
};

const Template = (args) => <TimeComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  destination: 'University Library',
  service: 'U1',
  time: '11:15',
  eta: '32 min',
};
