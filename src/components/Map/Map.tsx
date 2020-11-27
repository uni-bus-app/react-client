import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import { mapStylesLight } from './mapstyles-light';
import { mapStylesDark } from './mapstyles-dark';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100vw',
  height: '50vh',
};
const mapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
};

const getRoutePath = async () => {
  const res = await fetch(
    'https://20200817t190317-dot-unibus-app.nw.r.appspot.com/u1routepath',
    {
      method: 'GET',
    }
  );
  return await res.json();
};

const getStops = async () => {
  const res = await fetch(
    'https://20200817t190317-dot-unibus-app.nw.r.appspot.com/stops',
    {
      method: 'GET',
    }
  );
  return await res.json();
};

export const Map = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [position, setPosition] = useState({ lat: 50.794236, lng: -1.075 });
  const [zoom, setZoom] = useState<number>(13);
  const [routeOverlay, setRouteOverlay] = useState<any>(null);
  const [stops, setStops] = useState<Array<any>>(null);
  useEffect(() => {
    getRoutePath().then((routePath) => {
      setRouteOverlay(routePath);
    });
    getStops().then((data: any) => {
      const result = [];
      console.log(data);
      data.forEach((item) => {
        // const parsedStop =
        console.log(item);
      });
      setStops(data);
      console.log(data);
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
          styles: darkMode ? mapStylesDark : mapStylesLight,
        }}
      >
        <Polyline
          path={routeOverlay}
          options={{ strokeColor: '#7B1FA2', strokeOpacity: 0.75 }}
        />
        {stops?.map((name, index) => {
          return <Marker position={name.location} />;
        })}
      </GoogleMap>
    </LoadScript>
  );
};
