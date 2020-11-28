import { DirectionsBus } from '@material-ui/icons';
import styles from './Time.module.css';

interface TimeProps {
  destination: string;
  service: string;
  time: string;
  eta: string;
}

export function TimeComponent(props: TimeProps) {
  const { destination, service, time, eta } = props;

  return (
    <div className={styles.TimeContainer}>
      <div>
        <div className={styles.Title}>
          <DirectionsBus />
          <div>{service}</div>
          <div>{destination}</div>
        </div>

        <div>Scheduled Departure {time}</div>
      </div>

      <div>{eta}</div>
    </div>
  );
}
