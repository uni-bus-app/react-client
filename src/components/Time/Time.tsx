import { DirectionsBus } from '@mui/icons-material';
import styles from './Time.module.css';

interface TimeProps {
  destination: string;
  service: string;
  time: string;
  eta: string;
  etaUnit?: string;
}

export function TimeComponent(props: TimeProps) {
  const { destination, service, time, eta, etaUnit } = props;

  return (
    <div className={styles.TimeContainer}>
      <div>
        <div className={styles.Title}>
          <DirectionsBus />
          <div className={styles.ServiceIcon}>{service}</div>
          <div>{destination}</div>
        </div>

        <div className={styles.DepartureTime}>Scheduled Departure {time}</div>
      </div>

      <div className={styles.Eta}>
        <div>{eta}</div>
        {etaUnit && <div>{etaUnit}</div>}
      </div>
    </div>
  );
}
