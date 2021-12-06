import React, {
  useState,
  ChangeEvent,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import { Map } from './components/Map/Map';
import Home from './components/Home/Home';
import { Stop, Time } from './models';
import StopView from './components/StopView/StopView';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { getStops } from './api/APIUtils';
import idbService from './api/LocalDB';
import { Card } from '@material-ui/core';

function App() {
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [stops, setStops] = useState([]);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [systemTheme, setSystemTheme] = useState<boolean>(true);
  const [darkModeOverride, setDarkModeOverride] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    prefersDarkMode || darkModeOverride
  );
  const logoContainer = useRef() as any;

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
  const onMarkerSelect = (stop: Stop) => {
    navigate('stopview');
    setCurrentStop(stop);
  };
  const [nextBusTime, setNextBusTime] = useState<Time>();

  const unSelectStop = () => {
    setCurrentStop(undefined);
    navigate('home');
  };

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
          logoContainer={logoContainer}
        />
        <div className={styles.logoContainer} ref={logoContainer} />
        <Card
          style={{
            width: '100%',
            height: '62.5%',
            top: '37.5%',
            position: 'absolute',
          }}
        >
          <Routes>
            <Route path="/">
              <Navigate to="/home" />
            </Route>
            <Route path="/home">
              <Home
                stops={stops}
                setCurrentStop={setCurrentStop}
                currentStop={currentStop}
              />
            </Route>
            <Route path="/stopview">
              {currentStop && (
                <StopView
                  stop={currentStop}
                  nextTime={nextBusTime}
                  unSelectStop={unSelectStop}
                />
              )}
            </Route>
          </Routes>
        </Card>
      </ThemeProvider>
    </>
  );
}

export default App;
