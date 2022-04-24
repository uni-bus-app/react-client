import { Button, PaletteMode, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import lazy from 'react-lazy-with-preload';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getMessages, getStops } from './api/APIUtils';
import idbService from './api/LocalDB';
import styles from './App.module.css';
import Home from './components/Home';
import { useUpdate } from './hooks';
import { Message, Stop, Time } from './types';

const Map = lazy(() => import('./components/Map'));
const StopView = lazy(() => import('./components/StopView'));

const UpdateSnackBar = ({ updateAvailable, restarting, restart }: any) => {
  return (
    <Snackbar
      open={updateAvailable}
      message={restarting ? 'Update installing' : 'Update available'}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      className={styles.updateSnackBar}
      action={
        restarting ? (
          <Box sx={{ display: 'flex', paddingRight: '0.75em' }}>
            <CircularProgress size={23} />
          </Box>
        ) : (
          <Button onClick={restart}>reload</Button>
        )
      }
    />
  );
};

const App = () => {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [loadingStop, setLoadingStop] = useState<Promise<Time[]>>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  // const { noServiceInfo, messages } = useServiceUpdates();
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(7);
  const [markerSelect, setMarkerSelect] = useState<boolean>(false);

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
    setMarkerSelect(true);
    navigate('/stopview');
    setCurrentStop(stop);
    // window.setTimeout(() => {
    //   navigate('/stopview', { state: { currentStop: stop } });
    // }, 1000);
  };
  const unSelectStop = () => {
    setCurrentStop(undefined);
    navigate('home');
  };

  useEffect(() => {
    getStops().then(setStops);

    getMessages().then(setMessages);

    idbService.sync();
  }, []);

  const update = useUpdate();

  useEffect(() => {
    if (currentStop) {
      logEvent(getAnalytics(), 'stop_view', {
        stop_id: currentStop.id,
        stop_name: currentStop.name,
      });
    }
  }, [currentStop]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UpdateSnackBar
          updateAvailable={update.updateAvailable}
          restarting={update.restarting}
          restart={update.restart}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Map
            stopMarkersEnabled={true}
            routeOverlayEnabled={true}
            darkModeEnabled={darkMode}
            currentStop={currentStop}
            onMarkerSelect={onMarkerSelect}
            logoContainer={logoContainer}
          />
        </Suspense>
        <div className={styles.logoContainer} ref={logoContainer} />
        <Card className={styles.mainCard} elevation={24}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <Home
                  stops={stops}
                  setCurrentStop={setCurrentStop}
                  currentStop={currentStop}
                  loadingTimes={loadingStop}
                  setLoadingTimes={setLoadingStop}
                  messages={messages}
                  onLoad={() => StopView.preload()}
                  checkForUpdates={update.checkForUpdates}
                />
              }
            />
            <Route
              path="/stopview"
              element={
                currentStop || markerSelect ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    <StopView
                      stop={currentStop}
                      unSelectStop={unSelectStop}
                      darkMode={darkMode}
                    />
                  </Suspense>
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
          </Routes>
        </Card>
      </ThemeProvider>
    </>
  );
};

export default App;
