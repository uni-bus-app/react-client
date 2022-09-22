import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  createRef,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import lazy from 'react-lazy-with-preload';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getMessages, getStops } from './api/APIUtils';
import styles from './App.module.css';
import Home from './components/Home';
import StaticMap from './components/Map/static';
import Settings from './components/Settings';
import { useScreenTracking, useUpdate } from './hooks';
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

const App = (props: any) => {
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
    getStops().then((value) => {
      setStops(value);
      setCurrentStop(value[0]);
    });
    getMessages().then(setMessages);
  }, []);

  useEffect(() => {
    if (currentStop) {
      window.setTimeout(() => {
        logEvent(getAnalytics(), 'stop_view', {
          stop_id: currentStop.id,
          stop_name: currentStop.name,
        });
      }, 501);
    }
  }, [currentStop]);

  const start = useRef<number>(0);
  const cardRef = createRef<HTMLDivElement>();
  const [style, setStyles] = useState<any>({});

  const pos = useRef<number>(0);

  // useEffect(() => {
  //   if ((cardRef as any)?.current?.style as any) {
  //     const thing = () => {
  //       (cardRef as any).current.style.transform = `translateY(${
  //         (pos?.current as any) || 0
  //       }px)`;
  //       requestAnimationFrame(thing);
  //     };
  //     requestAnimationFrame(thing);
  //   }
  // }, [cardRef]);

  const [map, setMap] = useState<google.maps.Map>();
  const [tween, setTween] = useState<any>();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UpdateSnackBar
          updateAvailable={update.updateAvailable}
          restarting={update.restarting}
          restart={update.restart}
        />
        <Suspense fallback={<StaticMap />}>
          <Map
            map={map}
            setMap={setMap}
            setTween={setTween}
            stopMarkersEnabled={true}
            routeOverlayEnabled={true}
            darkModeEnabled={darkMode}
            stops={stops}
            currentStop={currentStop}
            onMarkerSelect={onMarkerSelect}
            logoContainer={logoContainer}
            openSettings={() => setSettingsOpen(true)}
          />
        </Suspense>
        <div className={styles.logoContainer} ref={logoContainer} />
        <Suspense fallback={<div>Loading...</div>}>
          <StopView
            map={map}
            tween={tween}
            stop={currentStop}
            setStop={setCurrentStop}
            stops={stops}
            unSelectStop={unSelectStop}
            nextStop={() => {
              if (currentStop) {
                const stopIndex = stops.findIndex(
                  (x: any) => x.id === currentStop.id
                );
                if (stopIndex < stops.length - 1) {
                  setCurrentStop(stops[stopIndex + 1]);
                } else {
                  setCurrentStop(stops[0]);
                }
              }
            }}
            darkMode={darkMode}
          />
        </Suspense>
        <Settings open={settingsOpen} setOpen={setSettingsOpen} />
        {/* <Card
          ref={cardRef}
          className={styles.mainCard}
          elevation={24}
          // style={style}
          // onTouchStart={(e) => {
          //   start.current = e.touches[0].clientY;
          // }}
          // onTouchMove={(e) => {
          //   console.log(e);
          //   // pos.current = e.touches[0].clientY - start.current;
          //   cardRef.current?.animate(
          //     {
          //       transform: `translateY(${
          //         e.touches[0].clientY - start.current
          //       }px)`,
          //     },
          //     { duration: 1, fill: 'forwards' }
          //   );
          // }}
        >
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
                      nextStop={() => {
                        if (currentStop) {
                          const stopIndex = stops.findIndex(
                            (x: any) => x.id === currentStop.id
                          );
                          if (stopIndex < stops.length - 1) {
                            setCurrentStop(stops[stopIndex + 1]);
                          } else {
                            setCurrentStop(stops[0]);
                          }
                        }
                      }}
                      darkMode={darkMode}
                    />
                  </Suspense>
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
          </Routes>
        </Card> */}
      </ThemeProvider>
    </>
  );
};

export default App;
