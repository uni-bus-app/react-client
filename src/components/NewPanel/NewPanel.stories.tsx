import { NewPanelComponent } from './NewPanel';
import React from 'react';

export default {
  title: 'NewPanelComponent',
  component: NewPanelComponent,
};

const Template = (args) => <NewPanelComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  panel1Children: <div>Panel1</div>,
  panel2Children: <div>Panel2</div>,
};
