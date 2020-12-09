import React from 'react';
import VideoComponent from '../Video/video';
import Dual from './dual';

export default {
  title: 'Dual Component',
  component: Dual,
};

const Template = (args) => <Dual {...args} />;

export const Default = Template.bind({});

Default.args = {};
