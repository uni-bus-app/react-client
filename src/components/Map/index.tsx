import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import { CircularProgress } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { RefObject, useEffect, useState } from 'react';
import { getRoutePath } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import StaticMap from './static';
import { mapStylesDark, mapStylesLight } from './styles';
import styles from './styles.module.css';
import { getBounds, getLocation, moveLogo } from './utils';

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
  stops: Stop[];
  currentStop?: Stop;
  logoContainer: RefObject<HTMLDivElement>;
}

const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    stops,
    currentStop,
    logoContainer,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();

  const [thing, setThing] = useState<any>();

  const getCurrentLocation = async () => {
    const position = await getLocation();
    setThing(position);
    if (map) {
      map?.fitBounds(getBounds(position), 20);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
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
  const [tilesLoaded, setTilesLoaded] = useState<boolean>(false);
  const [mapVisbile, setMapVisible] = useState<boolean>(false);
  const renderMap = () => {
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      moveLogo(mapInstance, logoContainer);
    };

    const onUnmount = () => {
      setMap(undefined);
    };

    const onTilesLoaded = () => {
      setTilesLoaded(true);
      window.setTimeout(() => setMapVisible(true), 400);
    };

    return (
      <>
        {!mapVisbile && (
          <StaticMap visible={!tilesLoaded}>
            <CircularProgress />
          </StaticMap>
        )}
        <GoogleMap
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
          }}
          onLoad={onLoad}
          onTilesLoaded={onTilesLoaded}
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
        {/* {thing && (
          <Marker
            position={map.getCenter()}
            options={{
              icon: {
                url: locationMarkerIcon,
                // scaledSize: new google.maps.Size(35, 50),
                // origin: new google.maps.Point(0, 0),
                // anchor: new google.maps.Point(17.5, 50),
              },
            }}
          />
        )} */}
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

        <Fab
          size="small"
          style={{
            position: 'absolute',
            // bottom: '63.5%',
            right: '1em',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          className={styles.locationButton}
          onClick={getCurrentLocation}
        >
          <NearMeOutlined />
        </Fab>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? (
    renderMap()
  ) : (
    <StaticMap visible={true}>
      <CircularProgress />
    </StaticMap>
  );
};

export default Map;
