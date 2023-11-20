import { MarkerF } from '@react-google-maps/api';
import blueStopMarker from '../../../../assets/stop-marker-icon-blue.svg';
import purpleStopMarker from '../../../../assets/stop-marker-icon-purple.svg';
import { Stop } from '../../../../types';

interface StopMarkersProps {
  enabled?: boolean;
  stops?: Stop[];
  darkModeEnabled?: boolean;
  selectedStop?: Stop;
  onMarkerSelect?: (stop: Stop) => void;
}

const StopMarkers = (props: StopMarkersProps) => {
  const { enabled, stops, darkModeEnabled, selectedStop, onMarkerSelect } =
    props;
  if (!enabled) return <></>;
  return (
    <>
      {stops?.map((stop, index) => {
        return (
          <MarkerF
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
            zIndex={1}
            onClick={() => {
              onMarkerSelect?.(stop);
            }}
          />
        );
      })}
    </>
  );
};

export default StopMarkers;
