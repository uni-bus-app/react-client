import { useTheme } from '@mui/material/styles';
import {
  GoogleMap,
  Marker,
  MarkerF,
  useJsApiLoader,
} from '@react-google-maps/api';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import styles from './styles.module.css';
import { moveLogo } from './utils';
import NextTimeCard from '../NextTimeCard';
import BottomSheet from '../BottomSheet';
import locationMarkerIcon from '../../assets/locationmarkericon.png';

interface MapProps {
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  currentStop?: Stop;
  logoContainer?: RefObject<HTMLDivElement>;
  userLocation?: any;
  setTimesSheetOpen: Dispatch<SetStateAction<boolean>>;
  nextCardOpen: boolean; // ISSUE 65
  setNextCardOpen: Dispatch<SetStateAction<boolean>>; // ISSUE 65
  stops?: Stop[];
  routeOverlay?: LatLng[];
  persistActive: boolean;
  setPersistActive: Dispatch<SetStateAction<boolean>>;
}

const bounds = {
  north: 50.878276,
  south: 50.74024,
  west: -1.150673,
  east: -0.974604,
};

const generateRandomCoords = (bounds: any) => {
  const { north, south, west, east } = bounds;
  const randomLatitude = south + Math.random() * (north - south);
  const randomLongitude = west + Math.random() * (east - west);
  return { lat: randomLatitude, lng: randomLongitude };
};

const mapRestriction: google.maps.MapRestriction = {
  latLngBounds: {
    north: bounds.north,
    south: bounds.south,
    west: bounds.west,
    east: bounds.east,
  },
  strictBounds: true,
};

const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    currentStop,
    logoContainer,
    setTimesSheetOpen, // ISSUE 65
    nextCardOpen, // ISSUE 65
    setNextCardOpen, // ISSUE 65
    stops,
    routeOverlay,
    persistActive,
    setPersistActive,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  /**
   * Animate map camera on marker tap
   */
  useEffect(() => {
    if (map && currentStop) {
      map.setOptions({
        center: {
          lat: currentStop.location.lat,
          lng: currentStop.location.lng,
        },
        zoom: 17,
        tilt: 45,
        restriction: mapRestriction,
      });
    }
  }, [currentStop]);

  // TODO: DELETE FUNCTIOIN
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const randomCoords = generateRandomCoords(bounds);
  //     setMarkerPosition(randomCoords);
  //   }, 2000);
  //   return () => clearInterval(intervalId);
  // }, []);

  const [prevStop, setPrevStop] = useState<Stop | undefined>(undefined);
  useEffect(() => {
    setPrevStop(currentStop);
  }, [currentStop]);

  const center = () => {
    const center = map && map.getCenter();
    if (currentStop) {
      return {
        lat: currentStop.location.lat,
        lng: currentStop.location.lng,
      };
    }
    if (persistActive) {
      return {
        lat: markerPosition.lat,
        lng: markerPosition.lng,
      };
    }
    if (prevStop && !currentStop) {
      return {
        lat: 50.794236,
        lng: -1.075,
      };
    }
    return (
      center || {
        lat: 50.794236,
        lng: -1.075,
      }
    );
  };

  const zoom = () => {
    let zoom = map && map.getZoom();
    if (currentStop) {
      return 17;
    }
    if (persistActive) {
      return zoom;
    }
    if (prevStop && !currentStop) {
      return 13;
    }

    return zoom || 13;
  };

  const tilt = () => {
    if (currentStop) {
      return 45;
    }
    return 0;
  };

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    clickableIcons: false,
    zoom: zoom(),
    center: center(),
    tilt: tilt(),
    restriction: mapRestriction,
  };

  /**
   * ISSUE 74
   *
   * Get user location
   * Watch user location
   *
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
          console.log('User location:', latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error watching user location:', error);
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  /**
   * Map loading logic
   */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['f9e34791c612c2be', '8d48c9186a06dab'],
  });
  const renderMap = () => {
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      moveLogo(mapInstance, logoContainer);
    };

    const onUnmount = () => {
      setMap(undefined);
    };

    return (
      <>
        <GoogleMap
          mapContainerStyle={{
            width: '100vw',
            position: 'absolute',
            borderRadius: '0',
          }}
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            mapId: darkModeEnabled ? '8d48c9186a06dab' : 'f9e34791c612c2be',
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onDragStart={() => setPersistActive(false)}
        >
          <RoutePath
            enabled={routeOverlayEnabled}
            path={routeOverlay}
            darkModeEnabled={darkModeEnabled}
          />
          <StopMarkers
            enabled={stopMarkersEnabled}
            stops={stops}
            darkModeEnabled={darkModeEnabled}
            selectedStop={currentStop}
            onMarkerSelect={onMarkerSelect}
          />
          <MarkerF
            position={markerPosition}
            options={{
              icon: {
                url: locationMarkerIcon,
                scaledSize: new google.maps.Size(15, 15),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 12.5),
              },
            }}
          />
        </GoogleMap>
        <BottomSheet
          open={nextCardOpen}
          setOpen={setNextCardOpen}
          disableBackdrop={true}
          zIndex={5000}
          minHeight={'calc(env(safe-area-inset-bottom, 0px) + 220px)'}
          borderRadius={50}
        >
          <NextTimeCard
            darkMode={true}
            currentStop={currentStop}
            setTimesSheetOpen={setTimesSheetOpen}
            setNextCardOpen={setNextCardOpen}
          />
        </BottomSheet>
      </>
    );
  };
  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
