import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { mapStylesLight, mapStylesDark } from './styles';
import { RefObject, useEffect, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import { Stop } from '../../models/stop';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import config from '../../config';
import StopMarkers from './components/StopMarkers';
import { getBounds, moveLogo } from './Utils';
import RoutePath from './components/RoutePath';

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
  zoom: 13,
};

interface MapProps {
  style?: CSSProperties;
  position: google.maps.LatLngLiteral;
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  currentStop?: Stop;
  logoContainer: RefObject<HTMLDivElement>;
}

export const Map = (props: MapProps) => {
  const {
    position,
    style,
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    currentStop,
    logoContainer,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>();
  const [stops, setStops] = useState<Stop[]>();
  const [selectedStop, setSelectedStop] = useState<Stop>();

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  useEffect(() => {
    if (map) {
      const bounds = getBounds(position, 0.5);
      map.fitBounds(bounds);
    }
  }, [position]);

  useEffect(() => {
    setSelectedStop(currentStop);
    if (map && currentStop) {
      const bounds = getBounds(
        { lat: currentStop.location.lat(), lng: currentStop.location.lng() },
        0.05
      );
      map.fitBounds(bounds);
    }
  }, [currentStop]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
  });

  const renderMap = () => {
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      const bounds = getBounds(position, 0.5);
      mapInstance.fitBounds(bounds);
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
            height: '40vh',
            position: 'absolute',
          }}
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
            selectedStop={selectedStop}
            setSelectedStop={setSelectedStop}
            map={map}
            onMarkerSelect={onMarkerSelect}
          />
        </GoogleMap>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};
