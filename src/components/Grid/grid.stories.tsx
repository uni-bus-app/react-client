import Grid from './grid';
import React from 'react';

export default {
  title: 'Grid Component',
  component: Grid,
};

const Template = (args) => <Grid {...args} />;

export const Default = Template.bind({});

Default.args = {};
