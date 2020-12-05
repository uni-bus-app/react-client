import React, { useState, useEffect } from "react";
import { MotionValue } from "framer-motion";
import logo from "./logo.svg";
import "./App.css";
import { Map } from "./components/Map/Map";
import { NewPanelComponent } from "./components/NewPanel/NewPanel";
// import "../styles/globals.css";
import { Stop } from "./models/stop";
import { getStops } from "./api/APIUtils";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import styles from "./styles/Home.module.css";

function App() {
  const [value, setValue] = useState<MotionValue<number>>(new MotionValue(0));
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
    // <div className="App">
    <>
      <Map
        position={{ lat: 50.794236, lng: -1.075 }}
        padding={{ bottom: 812 / 2 }}
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
                {stops.map((stop: Stop) => {
                  return <MenuItem value={stop as any}>{stop.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </>
        }
      />
    </>
    // </div>
  );
}

export default App;
