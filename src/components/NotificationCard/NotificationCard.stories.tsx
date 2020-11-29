import { NotificationCardComponent } from './NotificationCard';
import { Error } from '@material-ui/icons';
import React from 'react';

export default {
  title: 'NotificationCardComponent',
  component: NotificationCardComponent,
};

const Template = (args) => <NotificationCardComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  icon: <Error />,
  text: 'Hello there',
};
