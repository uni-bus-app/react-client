import { MarkerF, OverlayView } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { getRoutePath, getVehicles } from '../../../../api/APIUtils';
import { ReactComponent as VehicleIcon } from '../../../../assets/Asset 2.svg';
import dayjs from 'dayjs';
import './index.scss';

const getClosestPoint = (inputLat: any, inputLng: any, points: any): any => {
  let closestPoint = null;
  let closestDistance = Number.MAX_VALUE;

  points.forEach((point: any) => {
    const distance = getDistance(inputLat, inputLng, point.lat, point.lng);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
};

// Haversine formula to calculate distance between two points
const getDistance = (lat1: any, lng1: any, lat2: any, lng2: any) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Convert degrees to radians
const deg2rad = (deg: any) => deg * (Math.PI / 180);

const getPosition = (
  {
    Latitude,
    Longitude,
  }: {
    Latitude: string;
    Longitude: string;
  },
  points: any
) => {
  console.log(getClosestPoint(Latitude, Longitude, points));
  const closest = getClosestPoint(Latitude, Longitude, points);
  return new google.maps.LatLng({
    lat: Number(closest?.lat),
    lng: Number(closest?.lng),
  });
};

interface LiveVehicleLocationProps {
  darkModeEnabled?: boolean;
  routePath?: google.maps.LatLng[] | google.maps.LatLngLiteral[];
}

const getPixelPositionOffset = (width: number, height: number) => ({
  x: -(width / 2),
  y: -(height / 2),
});

const CustomMarker = ({ bearing }: any) => (
  <div className="vehicle-location-marker">
    <div
      className="vehicle-location-marker__circle-with-arrow"
      style={{ transform: `rotate(${Number(bearing)}deg)` }}
    >
      <div className="vehicle-location-marker__circle" />
      {!!bearing && <div className="vehicle-location-marker__arrow" />}
    </div>
    <VehicleIcon />
  </div>
);

const LiveVehicleLocation = (props: LiveVehicleLocationProps) => {
  const { darkModeEnabled, routePath } = props;
  const [vehicles, setVehicles] = useState<any[]>([]);
  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      console.log(data);
      setVehicles(data);
    };

    fetchVehicles();

    const intervalId = setInterval(fetchVehicles, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {vehicles?.map((stop, index) => {
        if (
          dayjs(stop.MonitoredVehicleJourney.OriginAimedDepartureTime).isAfter(
            dayjs()
          )
        )
          return;
        return (
          <OverlayView
            position={getPosition(
              stop.MonitoredVehicleJourney.VehicleLocation,
              routePath
            )}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <CustomMarker bearing={stop.MonitoredVehicleJourney.Bearing} />
          </OverlayView>
        );
      })}
    </>
  );
};

export default LiveVehicleLocation;
