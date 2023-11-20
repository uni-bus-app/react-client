import { OverlayView } from '@react-google-maps/api';
import './index.scss';
import { getPixelPositionOffset } from '../../utils';

interface CurrentLocationProps {
  darkModeEnabled?: boolean;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
}

const CustomMarker = () => (
  <div className="location-marker">
    <div className="location-marker__circle" />
  </div>
);

const CurrentLocation = (props: CurrentLocationProps) => {
  const { darkModeEnabled, position } = props;

  return (
    <>
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={getPixelPositionOffset}
      >
        <CustomMarker />
      </OverlayView>
    </>
  );
};

export default CurrentLocation;
