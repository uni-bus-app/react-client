import { Map } from './Map';
import React from 'react';

export default {
  title: 'Map',
  component: Map,
};

const Template = (args: any) => <Map {...args} />;

export const Default = Template.bind({});

Default.args = {
  position: { lat: 50.794236, lng: -1.075 },
};
