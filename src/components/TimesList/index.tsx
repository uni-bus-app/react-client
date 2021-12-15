import { Card, Typography } from '@mui/material';
import DepartureBoard from '@mui/icons-material/DepartureBoard';
import styles from './styles.module.css';
import { Time } from '../../models';

interface TimesListProps {
  times: Array<Time>;
}

const TimesList = (props: TimesListProps) => {
  const { times } = props;

  return (
    <div className={styles.timesList}>
      {times.map((time) => (
        <TimeItem time={time} />
      ))}
    </div>
  );
};

interface TimesItemProps {
  time: Time;
}

const TimeItem = (props: TimesItemProps) => {
  const { time } = props;

  return (
    <>
      <Card className={styles.card} elevation={4}>
        <div className={styles.busInfoContainer}>
          <div className={styles.topInfo}>
            <div className={styles.iconContainer}>
              <DepartureBoard fontSize={'medium'} />
              <div className={styles.u1icon}>
                <Typography>U1</Typography>
              </div>
            </div>
            <div className={styles.destination}>University Library</div>
          </div>

          <div className={styles.scheduledDeparture}>
            This service departs at {time.time && time.time}
          </div>
        </div>
        <div className={styles.etaContainer}>
          {time.eta?.value !== '' && time.eta?.value !== 'Now' ? (
            <>
              <div className={styles.time}>{time.eta && time.eta.value}</div>
              <div className={styles.unit}>{time.eta && time.eta.unit}</div>
            </>
          ) : (
            <>
              <div className={styles.time}>
                {time.eta && time.eta.arrivalTime}
              </div>
              <div className={styles.time}>{time.eta && time.eta.unit}</div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default TimesList;
