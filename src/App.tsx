import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import { Map } from './components/Map/Map';
import Home from './components/Home/Home';
import { Stop } from './models/stop';
import { TimesListComponent } from './components/TimesList/TimesList';
import StopView from './components/StopView/StopView';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getStops } from './api/APIUtils';
import { Time } from './models/time';
import idbService from './api/LocalDB';

function App() {
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stops, setStops] = useState([]);
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

  useEffect(() => {
    const getData = async () => {
      const res = await getStops();
      setStops(res);
    };
    getData();
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );
  const navigate = useNavigate();
  const selectStop = (event: SelectChangeEvent<Stop>) => {
    setCurrentStop(event.target.value as Stop);
  };
  const onMarkerSelect = (stop: Stop) => {
    navigate('stopview');
    setCurrentStop(stop);
  };
  const [nextBusTime, setNextBusTime] = useState<Time>();

  const handleNextTimeChange = (nextTime: Time) => {
    setNextBusTime(nextTime);
  };

  useEffect(() => {
    idbService.sync();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Map
          position={{ lat: 50.794236, lng: -1.075 }}
          stopMarkersEnabled={true}
          routeOverlayEnabled={true}
          darkModeEnabled={prefersDarkMode}
          currentStop={currentStop}
          onMarkerSelect={onMarkerSelect}
        />
        <div style={{ width: '100%', height: '50%' }}>
          <Routes>
            <Route path="/">
              <Navigate to="/home" />
            </Route>
            <Route path="/home">
              {/* <Home onStopSelected={setCurrentStop} currentStop={currentStop} /> */}
              <>
                <FormControl className={styles.stopSelector}>
                  <InputLabel>Select a stop</InputLabel>
                  <Select
                    className={styles.stopSelectorSelect}
                    value={currentStop}
                    onChange={selectStop}
                    label="Select a stop"
                  >
                    {stops.map((stop: Stop) => {
                      return (
                        <MenuItem value={stop as any}>{stop.name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </>
            </Route>
            <Route path="/stopview">
              {currentStop && (
                <StopView stop={currentStop} nextTime={nextBusTime} />
              )}
            </Route>
          </Routes>
        </div>
        {/* <NewPanelComponent
          onLoad={onPanelLoad}
          panel1Children={
            
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
        /> */}
      </ThemeProvider>
    </>
  );
}

export default App;
