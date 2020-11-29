import Rater from './rater';
import React, { useRef } from 'react';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

export default {
  title: 'Rater',
  component: Rater,
};

const Template = (args) => <Rater {...args} />;

export const Default = Template.bind({});

Default.args = {
  icon: [<ExpandLess />, <ExpandMore />],
  text: 'How are you finding the bus application so far?',
};
