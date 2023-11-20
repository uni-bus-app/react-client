import { useTheme } from '@mui/material/styles';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
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
import { getBounds, getLocation, moveLogo } from './utils';
import NextTimeCard from '../NextTimeCard';
import BottomSheet from '../BottomSheet';
import LiveVehicleLocation from './components/LiveVehicleLocation';

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
}

const bounds = {
  north: 50.878276,
  south: 50.74024,
  west: -1.150673,
  east: -0.974604,
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
  } = props;

  const [map, setMap] = useState<google.maps.Map>();

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

    const mapOptions: google.maps.MapOptions = {
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: false,
      zoom: currentStop ? 17 : 13,
      center: currentStop
        ? {
            lat: currentStop.location.lat,
            lng: currentStop.location.lng,
          }
        : { lat: 50.794236, lng: -1.075 },
      tilt: 0,
      restriction: mapRestriction,
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
        >
          <LiveVehicleLocation darkModeEnabled={darkModeEnabled} />
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
