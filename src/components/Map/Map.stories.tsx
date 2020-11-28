import { Map } from './Map';
import React from 'react';

export default {
  title: 'Map',
  component: Map,
};

const Template = (args) => <Map {...args} />;

export const Default = Template.bind({});

Default.args = {
  position: { lat: 50.794236, lng: -1.075 },
  width: window.innerWidth,
  height: window.innerHeight,
};
