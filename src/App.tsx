import { PaletteMode } from '@mui/material';
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
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styles from './App.module.css';
import HomepageView from './beta-components/Views/HomepageView';
import Nav from './beta-components/Nav';
import NotificationsView from './beta-components/Views/NotificationsView';
import SettingsView from './beta-components/Views/SettingsView';
import { useScreenTracking, useUpdate } from './hooks';
import { Stop } from './types';
import SettingsProvider from './components/SettingsProvider';
import InitialStartup from './beta-components/InitialStartup';
import LowDataModeView from './beta-components/Views/LowDataModeView';
import AlertComponent from './beta-components/Alert';

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
  const [currentStop, setCurrentStop] = useState<Stop>();

  const [timesSheetOpen, setTimesSheetOpen] = useState<boolean>(false); //BETA - Show times sheet
  const [pathName, setPathname] = useState(''); // BETA - Track page location
  const [splashScreen, setSplashScreen] = useState(true); // BETA - Show splash screen
  const [showAlert, setShowAlert] = useState(false); // BETA - Show alert
  const [userLocation, setUserLocation] = useState<any>(); // BETA - Users location
  const [userSettings, setUserSettings] = useState<any>({
    darkMode: false,
    openingPage: '/map',
    lowData: false,
    location: false,
  }); // BETA - Users settings

  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const logoContainer = useRef() as any;

  const location = useLocation(); // Fetch page location on each page change (BETA)

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
    console.log(pathName);
    if (pathName === '') {
      setPathname(userSettings.openingPage);
    } else {
      setPathname(location.pathname);
    }
  }, [location, pathName, userSettings.openingPage]);

  // Check localhost to see if the user has seen the splash screen (BETA)
  useEffect(() => {
    if (localStorage.getItem('splashScreen') === 'true') {
      setSplashScreen(false);
    }
  }, []);

  // Show alert for downloaded content (BETA)
  // TODO: Delete this, it should be dynamically generated
  useEffect(() => {
    const showAlertAfterDelay = setTimeout(() => {
      setShowAlert(true);
    }, 1000);
    return () => clearTimeout(showAlertAfterDelay);
  }, []);

  return (
    <SettingsProvider>
      {/* If the user has low data mode on, show them this */}
      {userSettings.lowData ? (
        <LowDataModeView />
      ) : (
        <>
          {splashScreen ? (
            <InitialStartup setSplashScreen={setSplashScreen} />
          ) : (
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
              <div className={styles.logoContainer} ref={logoContainer} />
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={userSettings.openingPage} />}
                />
                <Route path="/home" element={<HomepageView />} />
                <Route path="/notifications" element={<NotificationsView />} />
                <Route
                  path="/settings"
                  element={
                    <SettingsView
                      userSettings={userSettings}
                      setUserSettings={setUserSettings}
                    />
                  }
                />
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
        </>
      )}
    </SettingsProvider>
  );
};

export default App;
