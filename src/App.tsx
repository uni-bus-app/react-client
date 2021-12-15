import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import styles from './App.module.css';
import { Map } from './components/Map';
import Home from './components/Home';
import { Message, Stop } from './models';
import StopView from './components/StopView';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getMessages, getStops } from './api/APIUtils';
import idbService from './api/LocalDB';
import Card from '@mui/material/Card';
import { Button, PaletteMode, Snackbar } from '@mui/material';
import { grey } from '@mui/material/colors';

function App() {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [updateSnackBarVisible, setUpdateSnackbarVisible] =
    useState<boolean>(false);

  const logoContainer = useRef() as any;
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {}
        : {
            background: {
              default: grey[800],
              paper: grey[800],
            },
          }),
    },
  });
  const theme = useMemo(
    () => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  const onMarkerSelect = (stop: Stop) => {
    navigate('/stopview');
    setCurrentStop(stop);
  };
  const unSelectStop = () => {
    setCurrentStop(undefined);
    navigate('home');
  };

  const onUpdate = (registration: ServiceWorkerRegistration) => {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'update_installed') {
        setUpdateSnackbarVisible(true);
      }
    });
    registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate });

    getStops().then(setStops);

    getMessages().then(setMessages);

    idbService.sync();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar
          open={updateSnackBarVisible}
          message="Update available"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          action={
            <Button onClick={() => window.location.reload()}>reload</Button>
          }
        />
        <Map
          stopMarkersEnabled={true}
          routeOverlayEnabled={true}
          darkModeEnabled={darkMode}
          currentStop={currentStop}
          onMarkerSelect={onMarkerSelect}
          logoContainer={logoContainer}
        />
        <div className={styles.logoContainer} ref={logoContainer} />
        <Card className={styles.mainCard}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <Home
                  stops={stops}
                  setCurrentStop={setCurrentStop}
                  currentStop={currentStop}
                  messages={messages}
                />
              }
            />
            <Route
              path="/stopview"
              element={
                currentStop && (
                  <StopView
                    stop={currentStop}
                    unSelectStop={unSelectStop}
                    darkMode={darkMode}
                  />
                )
              }
            />
          </Routes>
        </Card>
      </ThemeProvider>
    </>
  );
}

export default App;
