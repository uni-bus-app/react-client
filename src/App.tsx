import { AlertTitle, Collapse, IconButton, PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import lazy from 'react-lazy-with-preload';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styles from './App.module.css';
import Header from './beta-components/Header';
import Alert from '@mui/material/Alert';
import HomepageView from './beta-components/Views/HomepageView';
import Nav from './beta-components/Nav';
import NotificationsView from './beta-components/Views/NotificationsView';
import SettingsView from './beta-components/Views/SettingsView';
import { useScreenTracking, useUpdate } from './hooks';
import { Message, Stop } from './types';
import SettingsProvider from './components/SettingsProvider';
import InitialStartup from './beta-components/InitialStartup';
import CloseIcon from '@mui/icons-material/Close';

const Map = lazy(() => import('./components/Map'));
const NextTimesSheet = lazy(() => import('./components/NextTimesSheet'));

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
  useScreenTracking();
  const update = useUpdate();
  const [stops, setStops] = useState([]);
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [messages, setMessages] = useState<Message[]>([]);

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
    setTimesSheetOpen(true);
    setCurrentStop(stop);
  };

  // useEffect(() => {
  //   getStops().then(setStops);
  //   getMessages().then(setMessages);
  //   idbService.sync();
  // }, []);

  useEffect(() => {
    if (currentStop) {
      window.setTimeout(() => {
        logEvent(getAnalytics(), 'stop_view', {
          stop_id: currentStop.id,
          stop_name: currentStop.name,
        });
      }, 500);
    }
  }, [currentStop]);

  // User Location (BETA)
  const [userLocation, setUserLocation] = useState<any>();
  const getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  // Fetch page location on each page change (BETA)
  const location = useLocation();

  // Show Hide Top Nav (BETA)
  // TODO: Remove
  // const [showHeader, setShowHeader] = useState(false);
  // useEffect(() => {
  //   setShowHeader(() => location.pathname === '/map');
  // }, [location]);

  // Move pill on nav depending on page (BETA)
  const [pathName, setPathname] = useState('/home');
  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  // Check localhost to see if the user has seen the splash screen (BETA)
  const [splashScreen, setSplashScreen] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('splashScreen') === 'true') {
      setSplashScreen(false);
    }
  }, []);

  // Distance from user to stops location data
  const [stopDistanceData, setStopDistanceData] = useState(null);

  const [timesSheetOpen, setTimesSheetOpen] = useState<boolean>(false);

  // Show alert for downloaded content (BETA)
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const showAlertAfterDelay = setTimeout(() => {
      setShowAlert(true);
      const hideAlert = setTimeout(() => {
        setShowAlert(false);
      }, 5000); // Dismiss the alert after 5 seconds
      return () => clearTimeout(hideAlert);
    }, 1000); // Show the alert after 5 seconds
    return () => clearTimeout(showAlertAfterDelay);
  }, []);
  const animationDuration = 0.25; // seconds
  const transitionStyles = {
    entering: { opacity: 0, transform: 'translateY(-100%)' },
    entered: { opacity: 1, transform: 'translateY(0)' },
    exiting: { opacity: 0, transform: 'translateY(-100%)' },
    exited: { opacity: 0, transform: 'translateY(-100%)' },
  };

  return (
    <SettingsProvider>
      {/*
          We only want this to display once to the user 
          If the user has already seen this, don't display 
      */}
      {splashScreen && <InitialStartup setSplashScreen={setSplashScreen} />}

      {/* If the user has already seen the splashscreen, just load the app */}
      {!splashScreen && (
        <ThemeProvider theme={theme}>
          {/* Alert message */}
          <div
            style={{
              position: 'fixed',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              top: '6px',
              zIndex: 9999,
              transition: `opacity ${animationDuration}s, transform ${animationDuration}s`,
              ...transitionStyles[showAlert ? 'entered' : 'exited'],
            }}
          >
            <Alert sx={{ borderRadius: '8px' }} severity="success">
              Offline data downloaded
            </Alert>
          </div>
          <CssBaseline />
          <UpdateSnackBar
            updateAvailable={update.updateAvailable}
            restarting={update.restarting}
            restart={update.restart}
          />
          <Suspense fallback={<div>Loading...</div>}></Suspense>
          {/* <Header showHeader={showHeader} /> */}
          {/* <div className={styles.logoContainer} ref={logoContainer} /> */}
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomepageView />} />
            <Route path="/notifications" element={<NotificationsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route
              path="/map"
              element={
                <>
                  <Map
                    stopMarkersEnabled={true}
                    routeOverlayEnabled={true}
                    darkModeEnabled={false /**darkMode */}
                    currentStop={currentStop}
                    onMarkerSelect={onMarkerSelect}
                    logoContainer={logoContainer}
                    userLocation={userLocation}
                    width={'100vw'}
                    height={'100vh'}
                    stopDistanceData={stopDistanceData}
                    setStopDistanceData={setStopDistanceData}
                  />
                </>
              }
            />
          </Routes>
          <NextTimesSheet
            open={timesSheetOpen}
            setOpen={setTimesSheetOpen}
            stop={currentStop}
          />
          <Nav pathName={pathName} getLocation={getCurrentLocation} />
        </ThemeProvider>
      )}
    </SettingsProvider>
  );
};

export default App;
