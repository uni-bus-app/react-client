import { useRef } from 'react';
import { Map } from '../components/Map/Map';
import { NewPanelComponent } from '../components/NewPanel/NewPanel';

export default function Home() {
  const constraintsRef = useRef(null);
  return (
    <>
      <Map
        width="100vw"
        height="100vh"
        position={{ lat: 50.767688, lng: -1.077812 }}
        stopMarkersEnabled={true}
        routeOverlayEnabled={true}
      ></Map>
      <NewPanelComponent />
    </>
  );
}
