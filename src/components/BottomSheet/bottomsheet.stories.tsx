import BottomSheet from './bottomsheet';
import React from 'react';

export default {
  title: 'BottomSheet',
  component: BottomSheet,
};

const Template = (args) => <BottomSheet {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'TEST',
  open: true,
};
