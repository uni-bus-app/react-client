import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';
import {
  GoogleMap,
  Marker,
  MarkerF,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import { mapStylesDark, mapStylesLight } from './styles';
import styles from './styles.module.css';
import { getBounds, getLocation, moveLogo } from './utils';
import locationMarkerIcon from '../../assets/locationmarkericon.png';
import CustomMapMarker from '../../beta-components/MapMarker';
import { buildings as customMapLocations } from '../../assets/data/buildingLocations';

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
    console.log(userLocation, 'update');
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

  useEffect(() => {
    if (map && currentStop) {
      const pos = new google.maps.LatLng(
        currentStop.location.lat,
        currentStop.location.lng
      );
      map.setZoom(13);
      window.setTimeout(() => {
        map.fitBounds(getBounds(pos), {
          top:
            Number(
              getComputedStyle(document.documentElement)
                .getPropertyValue('--sat')
                .replace('px', '')
            ) + 5,
          left: 5,
          right: 5,
          bottom: 5,
        });
      }, 100);
    }
  }, [currentStop]);
  // map.panToBounds()

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['63b6f095713871bd'],
  });
  const theme = useTheme();
  const renderMap = () => {
    const webglOverlayView = new google.maps.WebGLOverlayView();
    const onLoad = (mapInstance: google.maps.Map) => {
      // setMap(mapInstance);
      webglOverlayView.setMap(mapInstance);
      // moveLogo(mapInstance, logoContainer);
    };

    const onUnmount = () => {
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
          {/* <CustomMapMarker
            enabled={stopMarkersEnabled}
            locations={customMapLocations}
          /> */}
        </GoogleMap>
        {userLocation && (
          <Marker
            position={userLocation}
            options={{
              icon: {
                url: locationMarkerIcon,
                scaledSize: new google.maps.Size(35, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17.5, 50),
              },
            }}
          />
        )}
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

        {/* <Fab
          size="small"
          style={{
            position: 'absolute',
            bottom: 'calc(env(safe-area-inset-bottom) + 10px)',
            right: '1em',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          className={styles.locationButton}
          onClick={getCurrentLocation}
        >
          <NearMeOutlined />
        </Fab> */}
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
