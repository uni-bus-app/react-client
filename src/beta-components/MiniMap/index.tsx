import { BusAlert } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import Map from '../../components/Map';
import './styles.scss';

const MiniMap = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }}>
      <div
        className="mapCard"
        onClick={() => navigate('/map', { replace: true })}
      >
        <span className="mapCard-cover" />
        <Map
          stopMarkersEnabled={true}
          routeOverlayEnabled={true}
          width={'100%'}
          height={'100%'}
          userLocation={true}
        />
        <div className="mapCard-routeNumberOverlay">U1 Route</div>
        <div className="mapCard-actions">
          <div className="mapCard-actions-busesAvailable">
            <BusAlert />2 Buses available
          </div>
          <button className="button" onClick={() => console.log(true)}>
            Tap to Track
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
