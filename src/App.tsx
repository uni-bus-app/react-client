import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MotionValue } from 'framer-motion';
import styles from './App.module.css';
import { Map } from './components/Map/Map';
import { NewPanelComponent } from './components/NewPanel/NewPanel';
import Home from './components/Home/Home';
import { Stop } from './models/stop';
import { TimesListComponent } from './components/TimesList/TimesList';
import StopView from './components/StopView/StopView';
import Settings from './components/Settings/Settings';
import {
  createMuiTheme,
  FormControl,
  MenuItem,
  Select,
  ThemeProvider,
  useMediaQuery,
} from '@material-ui/core';
import { getStops } from './api/APIUtils';
import { Time } from './models/time';

function App() {
  const [value, setValue] = useState<MotionValue<number>>(new MotionValue(0));
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stops, setStops] = useState([]);
  const onPanelLoad = (motionValue: MotionValue<number>) => {
    setValue(motionValue);
  };
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [systemTheme, setSystemTheme] = useState<boolean>(true);
  const [darkModeOverride, setDarkModeOverride] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    prefersDarkMode || darkModeOverride
  );

  const handleAutoDarkModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setSystemTheme(checked);
    setDarkMode(checked || darkModeOverride);
  };
  const handleDarkModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setDarkModeOverride(checked);
    setDarkMode(checked || systemTheme);
  };
  const onMarkerSelect = (stop: Stop) => {
    // console.log(stop);
    setCurrentStop(stop);
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getStops();
      setStops(res);
    };
    getData();
  }, []);

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );
  const navigate = useNavigate();
  const selectStop = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentStop(event.target.value as Stop);

    // navigate('stopview');
  };

  const [nextBusTime, setNextBusTime] = useState<Time>();

  const handleNextTimeChange = (nextTime: Time) => {
    setNextBusTime(nextTime);
  };

  return (
    <>
      {/* <Router> */}
      <ThemeProvider theme={theme}>
        <Map
          position={{ lat: 50.794236, lng: -1.075 }}
          padding={{ bottom: 812 / 2 }}
          logoPosition={value}
          stopMarkersEnabled={true}
          routeOverlayEnabled={true}
          darkModeEnabled={darkMode}
          currentStop={currentStop}
          onMarkerSelect={onMarkerSelect}
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
              <Routes>
                <Route path="/">
                  <Navigate to="/home" />
                </Route>
                <Route path="/home">
                  <Home
                    onStopSelected={setCurrentStop}
                    currentStop={currentStop}
                  />
                </Route>
                <Route path="/stopview">
                  {currentStop && (
                    <StopView stop={currentStop} nextTime={nextBusTime} />
                  )}
                </Route>
              </Routes>
            </>
          }
          panel2Children={
            <Routes>
              <Route path="/stopview">
                {currentStop && (
                  <TimesListComponent
                    stopID={currentStop.id}
                    onNextStopUpdate={handleNextTimeChange}
                  />
                )}
              </Route>
              <Route path="/settings">
                <Settings
                  darkMode={darkModeOverride}
                  onDarkModeChange={handleDarkModeChange}
                  autoDarkMode={systemTheme}
                  onAutoDarkModeChange={handleAutoDarkModeChange}
                />
              </Route>
            </Routes>
          }
        />
      </ThemeProvider>
      {/* </Router> */}
    </>
  );
}

export default App;
