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
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>(null);
  const [stops, setStops] = useState<Stop[]>(null);

  const getBounds = (
    value: google.maps.LatLngLiteral,
    r: number
  ): google.maps.LatLngBounds => {
    const dY = (360 * r) / 6371;
    const dX = dY * Math.cos(value.lng);
    const lat1 = value.lat - dX;
    const lng1 = value.lng - dY;
    const lat2 = value.lat + dX;
    const lng2 = value.lng + dY;
    return new google.maps.LatLngBounds(
      { lat: lat1, lng: lng1 },
      { lat: lat2, lng: lng2 }
    );
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    const bounds = getBounds(position, 0.5);
    map.fitBounds(bounds, {
      bottom: window.innerHeight / 2,
    });
  }, []);
  const onUnmount = useCallback(() => {
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
    const bounds = getBounds(position, 0.5);
    map?.fitBounds(bounds, {
      bottom: window.innerHeight / 2,
    });
  }, [position]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI">
      <GoogleMap
        mapContainerStyle={{
          ...(style || { width: '100vw', height: '100vh' }),
          zIndex: 10,
        }}
        options={{
          ...mapOptions,
          styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
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
                  const bounds = getBounds(
                    {
                      lat: stop.location.lat(),
                      lng: stop.location.lng(),
                    },
                    0.05
                  );
                  map.fitBounds(bounds, { bottom: window.innerHeight / 2 });
                  onMarkerSelect && onMarkerSelect(stop);
                }}
              />
            );
          })}
      </GoogleMap>
    </LoadScript>
  );
};
