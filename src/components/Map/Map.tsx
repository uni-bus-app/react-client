import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import { mapStylesLight } from './mapstyles-light';
import { mapStylesDark } from './mapstyles-dark';
import { useEffect, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import { Stop } from '../../models/stop';

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
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  position?: google.maps.LatLngLiteral;
  width?: string;
  height?: string;
}

export const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    position,
    width,
    height,
  } = props;

  const [zoom, setZoom] = useState<number>(13);
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>(null);
  const [stops, setStops] = useState<Stop[]>(null);

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI">
      <GoogleMap
        mapContainerStyle={{ width, height }}
        center={position}
        zoom={zoom}
        options={{
          ...mapOptions,
          styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
        }}
      >
        {routeOverlayEnabled && (
          <Polyline
            path={routeOverlay}
            options={{ strokeColor: '#7B1FA2', strokeOpacity: 0.75 }}
          />
        )}
        {stopMarkersEnabled &&
          stops?.map((name, index) => {
            return <Marker key={index} position={name.location} />;
          })}
      </GoogleMap>
    </LoadScript>
  );
};
