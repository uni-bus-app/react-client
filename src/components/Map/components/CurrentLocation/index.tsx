import { OverlayView } from '@react-google-maps/api';
import './index.scss';
import { getPixelPositionOffset } from '../../utils';
import classNames from 'classnames';

interface CurrentLocationProps {
  darkModeEnabled?: boolean;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  persistActive: boolean;
}

const CurrentLocation = (props: CurrentLocationProps) => {
  const { darkModeEnabled, position, persistActive } = props;

  const CustomMarker = () => (
    <div className="location-marker">
      <div
        className={classNames(
          persistActive && 'location-maker__pulse',
          'location-marker__circle'
        )}
      />
    </div>
  );

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
