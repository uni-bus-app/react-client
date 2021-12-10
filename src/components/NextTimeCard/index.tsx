import styles from './styles.module.css';
import { Time } from '../../models';
import Card from '@mui/material/Card';
import { DirectionsBus, NavigateNext } from '@mui/icons-material';

interface NextTimeCardProps {
  time: Time;
}

const NextTimeCard = (props: NextTimeCardProps) => {
  const { time } = props;
  const darkModeEnabled = false;
  return (
    <Card className={styles.card} sx={{ boxShadow: 7 }}>
      <div className={styles.details}>
        <div className={styles.icons}>
          <DirectionsBus />
          <div
            className={`${styles.u1ServiceIcon} ${
              darkModeEnabled ? styles.darkServiceIcon : styles.lightServiceIcon
            }`}
          >
            U1
          </div>
        </div>
        <div className={styles.destination}>{time.destination}</div>
      </div>
      <div className={styles.endContainer}>
        <div className={styles.time}>
          <div className={styles.eta}>
            {time.eta?.unit ? time.eta.value : time.time}
          </div>
          <div className={styles.etaUnit}>
            {time.eta?.unit !== 'Now' ? time.eta?.unit : ''}
          </div>
        </div>
        <NavigateNext />
      </div>
    </Card>
  );
};

export default NextTimeCard;
