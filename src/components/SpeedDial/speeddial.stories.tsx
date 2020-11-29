import SpeedDials from './speeddial';
import React from 'react';
import {
  ShoppingCart,
  Home,
  Settings,
  School,
  Favorite,
} from '@material-ui/icons';

export default {
  title: 'SpeedDial',
  component: SpeedDials,
};

const Template = () => (
  <SpeedDials
    actions={[
      { icon: <Settings />, name: 'Settings' },
      { icon: <Home />, name: 'Home' },
      { icon: <School />, name: 'University' },
      { icon: <ShoppingCart />, name: 'Tesco' },
      { icon: <Favorite />, name: 'Friends House' },
    ]}
  />
);

export const Default = Template.bind({});
