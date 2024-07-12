import { BusAlert } from '@mui/icons-material';
import './styles.scss';

const NoService = () => {
  return (
    <div className="NoServiceCard">
      <div className="NoServiceCard-top">
        <div className="NoServiceCard-nextBusTimeLogo">
          <BusAlert fontSize="large" />
        </div>
        <b>The service has been suspended</b>
      </div>
      <p className="NoServiceCard-restarts">
        The service will start again on September 18th
      </p>
    </div>
  );
};

export default NoService;
