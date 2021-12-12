import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import { Map } from './components/Map';
import Home from './components/Home';
import { Message, Stop } from './models';
import StopView from './components/StopView';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getStops } from './api/APIUtils';
import idbService from './api/LocalDB';
import Card from '@mui/material/Card';
import { PaletteMode } from '@mui/material';
import { grey } from '@mui/material/colors';
import config from './config';

function App() {
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [stops, setStops] = useState([]);
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const logoContainer = useRef() as any;

  useEffect(() => {
    const getData = async () => {
      const res = await getStops();
      setStops(res);
    };
    getData();
  }, []);

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
  const navigate = useNavigate();
  const onMarkerSelect = (stop: Stop) => {
    navigate('/stopview');
    setCurrentStop(stop);
  };

  const unSelectStop = () => {
    setCurrentStop(undefined);
    navigate('home');
  };

  useEffect(() => {
    idbService.sync();
  }, []);

  useEffect(() => {
    fetch(`${config.apiUrl}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
