import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import { mapStylesLight } from './mapstyles-light';
import { mapStylesDark } from './mapstyles-dark';
import { useCallback, useEffect, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import { Stop } from '../../models/stop';
import purpleStopMarker from '../../assets/stop-marker-icon-purple.svg';
import blueStopMarker from '../../assets/stop-marker-icon-blue.svg';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
};

const getLocation: () => Promise<google.maps.LatLngLiteral> = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const position: google.maps.LatLngLiteral = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      resolve(position);
    });
  });
};

interface MapProps {
  style?: CSSProperties;
  position: google.maps.LatLngLiteral;
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
}

export const Map = (props: MapProps) => {
  const {
    position,
    style,
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [zoom, setZoom] = useState<number>(13);
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>(null);
  const [stops, setStops] = useState<Stop[]>(null);
  const [pos, setPos] = useState<google.maps.LatLngLiteral>();

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);
  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);
  useEffect(() => {
    setPos(position);
  }, [position]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI">
      <GoogleMap
        mapContainerStyle={{
          ...(style || { width: '100vw', height: '100vh' }),
          zIndex: 10,
        }}
        center={pos}
        zoom={zoom}
        options={{
          ...mapOptions,
          styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
        }}
        onZoomChanged={() => {
          if (map) {
            setZoom(map.zoom);
          }
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {routeOverlayEnabled && (
          <Polyline
            path={routeOverlay}
            options={{
              strokeColor: darkModeEnabled ? '#03A9F4' : '#7B1FA2',
              strokeOpacity: 0.75,
            }}
          />
        )}
        {stopMarkersEnabled &&
          stops?.map((stop, index) => {
            return (
              <Marker
                key={index}
                position={stop.location}
                options={{
                  icon: {
                    url: darkModeEnabled ? blueStopMarker : purpleStopMarker,
                    scaledSize: new google.maps.Size(35, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17.5, 50),
                  },
                }}
                onClick={() => {
                  setZoom(16);
                  setPos({
                    lat: stop.location.lat(),
                    lng: stop.location.lng(),
                  });
                  onMarkerSelect(stop);
                }}
              />
            );
          })}
      </GoogleMap>
    </LoadScript>
  );
};
