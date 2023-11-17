import { useTheme } from '@mui/material/styles';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import styles from './styles.module.css';
import { moveLogo } from './utils';
import NextTimeCard from '../NextTimeCard';
import BottomSheet from '../BottomSheet';

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
}

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
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();
  const [stops, setStops] = useState<Stop[]>();

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    clickableIcons: false,
    zoom: currentStop ? 17 : 13,
    center: currentStop
      ? { lat: currentStop.location.lat, lng: currentStop.location.lng }
      : { lat: 50.794236, lng: -1.075 },
  };

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  useEffect(() => {
    if (map && currentStop) {
      const pos = new google.maps.LatLng(
        currentStop.location.lat,
        currentStop.location.lng
      );
      map.setOptions({
        center: pos,
        zoom: 17,
        tilt: 45,
      });
    }
    if (map && !currentStop) {
      map.setOptions({
        center: { lat: 50.794236, lng: -1.075 },
        zoom: 13,
        tilt: 0,
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
          minHeight={220}
          borderRadius={50}
        >
          <NextTimeCard
            darkMode={true}
            currentStop={currentStop}
            onClick={() => setTimesSheetOpen(true)}
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
