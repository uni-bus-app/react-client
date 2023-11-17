import { MarkerF } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { getVehicles } from '../../../../api/APIUtils';

const getPosition = ({
  Latitude,
  Longitude,
}: {
  Latitude: string;
  Longitude: string;
}) => {
  return new google.maps.LatLng({
    lat: Number(Latitude),
    lng: Number(Longitude),
  });
};

interface LiveVehicleLocationProps {
  darkModeEnabled?: boolean;
}

const LiveVehicleLocation = (props: LiveVehicleLocationProps) => {
  const { darkModeEnabled } = props;
  const [vehicles, setVehicles] = useState<any[]>([]);
  useEffect(() => {
    const fetchVehicles = () => {
      getVehicles().then((data) => {
        console.log(data);
        setVehicles(data);
      });
    };

    fetchVehicles();

    const intervalId = setInterval(fetchVehicles, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {vehicles?.map((stop, index) => {
        return (
          <MarkerF
            key={index}
            position={getPosition(stop.MonitoredVehicleJourney.VehicleLocation)}
            zIndex={10}
          />
        );
      })}
    </>
  );
};

export default LiveVehicleLocation;
