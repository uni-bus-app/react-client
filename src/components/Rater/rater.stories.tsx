import Rater from './rater';
import React, { useRef } from 'react';

export default {
  title: 'Rater',
  component: Rater,
};

const Template = (args) => <Rater {...args} />;

export const Default = Template.bind({});

Default.args = {
  text: 'How are you finding the bus application so far?',
  action1: () => {
    console.log('Happy');
  },
  action2: () => {
    console.log('Not Upset/Happy');
  },
  action3: () => {
    console.log('Not Upset/Happy');
  },
};
