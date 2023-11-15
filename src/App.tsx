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
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { getMessages, getStops } from './api/APIUtils';
import idbService from './api/LocalDB';
import styles from './App.module.css';
import Header from './beta-components/Header';
import HomepageView from './beta-components/Views/HomepageView';
import Nav from './beta-components/Nav';
import NotificationsView from './beta-components/Views/NotificationsView';
import SettingsView from './beta-components/Views/SettingsView';
import { useScreenTracking, useUpdate } from './hooks';
import { Message, Stop, Time } from './types';
import Carousel, { CarouselItem } from './beta-components/Carousel/carousel';
import {
  FinalScreenView,
  InitialStartup,
  LocationPermissionView,
} from './beta-components/SetupScreen';

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
  useScreenTracking();
  const navigate = useNavigate();
  const update = useUpdate();
  const [stops, setStops] = useState([]);
  const [loadingStop, setLoadingStop] = useState<Promise<Time[]>>();
  const [currentStop, setCurrentStop] = useState<Stop>();
  const [messages, setMessages] = useState<Message[]>([]);
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
      console.log(pos);
    });
  };

  // Fetch location on each state change (BETA)
  const location = useLocation();

  // Show Hide Top Nav (BETA)
  const [showHeader, setShowHeader] = useState(false);
  useEffect(() => {
    setShowHeader(() => location.pathname === '/map');
  }, [location]);

  // Move pill on nav depending on page (BETA)
  const [pathName, setPathname] = useState('/home');
  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  // Distance from user to stops location data
  const [stopDistanceData, setStopDistanceData] = useState(null);

  return (
    <>
      <Carousel>
        <CarouselItem>
          <InitialStartup />
        </CarouselItem>
        <CarouselItem>
          <LocationPermissionView />
        </CarouselItem>

        <CarouselItem>
          <FinalScreenView />
        </CarouselItem>
      </Carousel>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UpdateSnackBar
          updateAvailable={update.updateAvailable}
          restarting={update.restarting}
          restart={update.restart}
        />
        <Suspense fallback={<div>Loading...</div>}></Suspense>

        <Header showHeader={showHeader} />

        <Nav
          pathName={pathName}
          showHeader={showHeader}
          getLocation={getCurrentLocation}
        />

        {/* <div className={styles.logoContainer} ref={logoContainer} /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomepageView />} />
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
                {/* <Home
                  stops={stops}
                  setCurrentStop={setCurrentStop}
                  currentStop={currentStop}
                  loadingTimes={loadingStop}
                  setLoadingTimes={setLoadingStop}
                  messages={messages}
                  onLoad={() => StopView.preload()}
                  checkForUpdates={update.checkForUpdates}
                /> */}
              </>
            }
          />
          <Route path="/notifications" element={<NotificationsView />}></Route>
          {/* <Route path="/saved" element={<SavedStopsView />}></Route> */}
          <Route path="/settings" element={<SettingsView />}></Route>
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
      </ThemeProvider>
    </>
  );
};

export default App;
