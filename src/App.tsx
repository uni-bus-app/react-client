import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import lazy from 'react-lazy-with-preload';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import HomepageView from './beta-components/Views/HomepageView';
import Nav from './beta-components/Nav';
import SettingsView from './beta-components/Views/SettingsView';
import { useScreenTracking, useUpdate } from './hooks';
import { LatLng, Stop } from './types';
import { useSettings } from './components/SettingsProvider';
import InitialStartup from './beta-components/InitialStartup';
import AlertComponent from './beta-components/Alert';
import { getRoutePath, getStops } from './api/APIUtils';

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

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    background: {
      default: '#eeeeee',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#222222',
    },
    icon: {
      default: '#000000',
    },
  },
});

const App = () => {
  useScreenTracking();
  const update = useUpdate();
  const [currentStop, setCurrentStop] = useState<Stop>();

  const [timesSheetOpen, setTimesSheetOpen] = useState<boolean>(false); //BETA - Show times sheet
  const [nextCardOpen, setNextCardOpen] = useState(false); // ISSUE 65 - Show next card popup

  const [pathName, setPathname] = useState(''); // BETA - Track page location
  const [showAlert, setShowAlert] = useState(false); // BETA - Show alert

  const [userLocation, setUserLocation] = useState<any>(); // BETA - Users location
  const [persistActive, setPersistActive] = useState(false); // 74 - Turn on persistant tracking mode
  const [walkingTime, setWalkingTime] = useState(0); // BETA - Walking time to stop

  const settings = useSettings();

  // Moved from map, move to own service
  const [stops, setStops] = useState<Stop[]>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();
  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const logoContainer = useRef() as any;
  const location = useLocation(); // Fetch page location on each page change (BETA)

  const theme = useMemo(
    () => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  // Set the current stop when a marker is selected
  const onMarkerSelect = (stop: Stop) => {
    setPersistActive(false);
    setCurrentStop(stop);
    setNextCardOpen(true);
  };

  // Clear the markers whenevever tapping away from the sheet
  useEffect(() => {
    if (!nextCardOpen) {
      setCurrentStop(undefined);
    }
  }, [nextCardOpen]);

  // Log StopView event for analytics
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

  // Fetch Users Location (BETA)
  // TODO: Move to hook
  const getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  // Update pathName on page change (BETA)
  useEffect(() => {
    setPathname(location.pathname);
  }, [location, pathName]);

  // Show alert for downloaded content (BETA)
  // TODO: Delete this, it should be dynamically generated
  useEffect(() => {
    const showAlertAfterDelay = setTimeout(() => {
      setShowAlert(true);
    }, 1000);
    return () => clearTimeout(showAlertAfterDelay);
  }, []);

  const isBigDisplay = useMediaQuery('(min-width:600px)');

  return (
      <ThemeProvider theme={theme}>
        <AlertComponent
          message="Offline content downloaded"
          alertSeverity="Success"
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />
        <CssBaseline />
        <UpdateSnackBar
          updateAvailable={update.updateAvailable}
          restarting={update.restarting}
          restart={update.restart}
        />
        <Suspense fallback={<div>Loading...</div>}></Suspense>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isBigDisplay ? '/map' : '/home'} />}
          />
          <Route path="/home" element={<HomepageView stops={stops} />} />
          <Route path="/settings" element={<SettingsView stops={stops} />} />
          <Route
            path="/map"
            element={
              <Map
                stopMarkersEnabled={true}
                routeOverlayEnabled={true}
                darkModeEnabled={false /**darkMode */}
                currentStop={currentStop}
                onMarkerSelect={onMarkerSelect}
                logoContainer={logoContainer}
                stops={stops}
                routeOverlay={routeOverlay}
                setTimesSheetOpen={setTimesSheetOpen}
                nextCardOpen={nextCardOpen}
                setNextCardOpen={setNextCardOpen}
                persistActive={persistActive}
                setPersistActive={setPersistActive}
                walkingTime={walkingTime}
                setWalkingTime={setWalkingTime}
              />
            }
          />
        </Routes>
        <NextTimesSheet
          openNextTimesSheet={timesSheetOpen}
          setOpenNextTimesSheet={setTimesSheetOpen}
          stop={currentStop}
        />
        <Nav
          pathName={pathName}
          getLocation={getCurrentLocation}
          setNextCardOpen={setNextCardOpen}
          setPersistActive={setPersistActive}
          persistActive={persistActive}
        />
      </ThemeProvider>
  );
};

export default App;
