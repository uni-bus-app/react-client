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

  const theme = useTheme();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['63b6f095713871bd'],
  });

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
   * Renders the map
   *
   * @returns Map Component
   */
  const renderMap = () => {
    const webglOverlayView = new google.maps.WebGLOverlayView();
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      webglOverlayView.setMap(mapInstance);
      moveLogo(mapInstance, logoContainer);
    };

    const onUnmount = () => {
      setUserMarker(null);
      setMap(undefined);
    };

    return (
      <>
        <GoogleMap
          mapContainerStyle={{
            width: width,
            height: height,
            position: 'absolute',
            top: '0',
            left: '0',
            borderRadius: '12px',
          }}
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
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

        <div className={styles.logoContainer} ref={logoContainer} />
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
