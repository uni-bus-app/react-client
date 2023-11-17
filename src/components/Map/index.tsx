import { useTheme } from '@mui/material/styles';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { RefObject, useEffect, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import { mapStylesDark, mapStylesLight } from './styles';
import styles from './styles.module.css';
import { getBounds, moveLogo } from './utils';
import locationMarkerIcon from '../../assets/locationmarkericon.png';

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
  zoom: 13,
  center: { lat: 50.794236, lng: -1.075 },
};

interface MapProps {
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  currentStop?: Stop;
  logoContainer?: RefObject<HTMLDivElement>;
  userLocation?: any;
  width: string;
  height: string;
}

const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    currentStop,
    logoContainer,
    userLocation,
    width,
    height,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();
  const [stops, setStops] = useState<Stop[]>();

  useEffect(() => {
    if (map) {
      map?.fitBounds(getBounds(userLocation), 20);
    }
  }, [userLocation]);

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  /**
   * Creates a marker for the users location
   */
  const [userMarker, setUserMarker] = useState<any>(null);
  useEffect(() => {
    if (map && userLocation) {
      const icon = {
        url: locationMarkerIcon,
        scaledSize: new google.maps.Size(15, 15),
        size: new google.maps.Size(15, 15),
        origin: new google.maps.Point(0, 0),
      };
      if (!userMarker) {
        console.log('creating marker');
        const marker = new google.maps.Marker({
          position: {
            lat: userLocation.lat,
            lng: userLocation.lng,
          },
          icon,
          map: map,
        });
        setUserMarker(marker);
      }

      if (userMarker) {
        userMarker.setPosition({
          lat: userLocation.lat,
          lng: userLocation.lng,
        });
        console.log(userMarker);
        setUserMarker(userMarker);
      }
    }
  }, [map, userLocation, userMarker]);

  /**
   * Map loading logic
   */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['f9e34791c612c2be', '8d48c9186a06dab'],
  });
  const theme = useTheme();
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
            // height: 'calc(40vh + env(safe-area-inset-top))',
            position: 'absolute',
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            // height: '3em',
            width: '100%',
          }}
          className={styles.statusBarContainer}
        >
          <div
            style={{
              // position: 'absolute',
              // top: 0,
              opacity: theme.palette.mode === 'dark' ? 0 : undefined,
            }}
            className={styles.statusBar}
          />
          <div className={styles.statusBarBlur} />
        </div>
      </>
    );
  };
  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
