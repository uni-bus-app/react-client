import { BusAlert } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import Map from '../../assets/map.png';
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
        <img src={Map} alt="Southsea map" className="mapCard-map" />
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
