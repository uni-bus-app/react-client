import DataBox from './databox';
import React, { useRef } from 'react';
import { DirectionsBus } from '@material-ui/icons';

export default {
  title: 'DataBox',
  component: DataBox,
};

const Template = (args) => <DataBox {...args} />;

export const Default = Template.bind({});

Default.args = {
  icon: [<DirectionsBus />],
  text: '15 Minutes',
};
