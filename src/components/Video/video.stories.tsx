import VideoComponent from './video';
import React from 'react';
import vid from '../../assets/video/demovid.webm';
import vid2 from '../../assets/video/demovid2.webm';

export default {
  title: 'Video Component',
  component: VideoComponent,
};

const Template = (args) => <VideoComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  src: [vid, vid2],
  specific: true,
};
