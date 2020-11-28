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

const containerStyle = {
  width: '100vw',
  height: '50vh',
};
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

export const Map = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(null);
  const [zoom, setZoom] = useState<number>(13);
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>(null);
  const [stops, setStops] = useState<Stop[]>(null);
  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
    setPosition({ lat: 50.794236, lng: -1.075 });
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={zoom}
        options={{
          ...mapOptions,
          styles: darkMode ? mapStylesDark : mapStylesLight,
        }}
      >
        <Polyline
          path={routeOverlay}
          options={{ strokeColor: '#7B1FA2', strokeOpacity: 0.75 }}
        />
        {stops?.map((name, index) => {
          return <Marker key={index} position={name.location} />;
        })}
      </GoogleMap>
    </LoadScript>
  );
};
