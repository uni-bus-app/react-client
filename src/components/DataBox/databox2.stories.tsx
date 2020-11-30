import DataBox from './databox';
import React, { useRef } from 'react';
import { DirectionsBus } from '@material-ui/icons';
import { NewPanelComponent } from '../NewPanel/NewPanel';

export default {
  title: 'DataBox in Panel',
  component: DataBox,
};

const Template = (args) => (
  <NewPanelComponent
    panel1Children={<DataBox {...args} />}
    panel2Children={<DataBox {...args} />}
  ></NewPanelComponent>
);

export const Default = Template.bind({});

Default.args = {
  icon: [<DirectionsBus />],
  text: '15 Minutes',
};
