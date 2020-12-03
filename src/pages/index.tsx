import { MotionValue } from 'framer-motion';
import { useState } from 'react';
import { Map } from '../components/Map/Map';
import { NewPanelComponent } from '../components/NewPanel/NewPanel';

export default function Home() {
  const [value, setValue] = useState<MotionValue<number>>(null);
  const onPanelLoad = (motionValue: MotionValue<number>) => {
    setValue(motionValue);
  };
  return (
    <>
      <Map
        position={{ lat: 50.794236, lng: -1.075 }}
        padding={{ bottom: process.browser && window.innerHeight / 2 }}
        logoPosition={value}
        stopMarkersEnabled={true}
        routeOverlayEnabled={true}
      />
      <NewPanelComponent onLoad={onPanelLoad} />
    </>
  );
}
