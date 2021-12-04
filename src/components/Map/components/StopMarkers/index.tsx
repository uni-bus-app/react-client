import { Marker } from '@react-google-maps/api';
import purpleStopMarker from '../../../../assets/stop-marker-icon-purple.svg';
import blueStopMarker from '../../../../assets/stop-marker-icon-blue.svg';
import { getBounds } from '../../Utils';
import { Stop } from '../../../../models/stop';

interface StopMarkersProps {
  enabled?: boolean;
  stops?: Stop[];
  darkModeEnabled?: boolean;
  selectedStop?: Stop;
  setSelectedStop: any;
  map: any;
  onMarkerSelect: any;
}

const StopMarkers = (props: StopMarkersProps) => {
  const {
    enabled,
    stops,
    darkModeEnabled,
    selectedStop,
    setSelectedStop,
    map,
    onMarkerSelect,
  } = props;
  if (!enabled) return <></>;
  return (
    <>
      {stops?.map((stop, index) => {
        return (
          <Marker
            key={index}
            position={stop.location}
            options={{
              icon: {
                url:
                  (darkModeEnabled && selectedStop?.routeOrder !== index) ||
                  (!darkModeEnabled && selectedStop?.routeOrder === index)
                    ? blueStopMarker
                    : purpleStopMarker,
                scaledSize: new google.maps.Size(35, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17.5, 50),
              },
            }}
            onClick={() => {
              setSelectedStop(stop);
              const bounds = getBounds(
                {
                  lat: stop.location.lat(),
                  lng: stop.location.lng(),
                },
                0.05
              );
              map?.fitBounds(bounds);
              onMarkerSelect && onMarkerSelect(stop);
            }}
          />
        );
      })}
    </>
  );
};

export default StopMarkers;
