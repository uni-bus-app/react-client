import { MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { NewPanelComponent } from '../components/NewPanel/NewPanel';
import { Map } from '../components/Map/Map';
import '../styles/globals.css';
import { Stop } from '../models/stop';
import { getStops } from '../api/APIUtils';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import styles from '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  const [value, setValue] = useState<MotionValue<number>>(null);
  const onPanelLoad = (motionValue: MotionValue<number>) => {
    setValue(motionValue);
  };
  const [stops, setStops] = useState([]);
  const [currentStop, setCurrentStop] = useState<Stop>();
  useEffect(() => {
    const getData = async () => {
      const res = await getStops();
      setStops(res);
    };
    getData();
  }, []);
  const selectStop = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentStop(event.target.value as Stop);
  };
  return (
    <>
      <Map
        position={{ lat: 50.794236, lng: -1.075 }}
        padding={{ bottom: process.browser && window.innerHeight / 2 }}
        logoPosition={value}
        stopMarkersEnabled={true}
        routeOverlayEnabled={true}
        currentStop={currentStop}
      />
      <NewPanelComponent
        onLoad={onPanelLoad}
        panel1Children={
          <>
            <FormControl className={styles.stopSelector}>
              <Select
                className={styles.stopSelectorSelect}
                value={currentStop}
                onChange={selectStop}
              >
                {stops.map((stop) => {
                  return <MenuItem value={stop}>{stop.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </>
        }
        panel2Children={<Component args={pageProps} />}
      />
    </>
  );
}

export default MyApp;
