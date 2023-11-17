import Badge from '@mui/icons-material/Badge';
import NoTransfer from '@mui/icons-material/NoTransfer';
import styles from './styles.module.css';
import { Stop } from '../../types';
import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { DirectionsWalk, NoDrinks } from '@mui/icons-material';

interface StopInfoCardProps {
  stop?: Stop;
  setOpen: any;
}

const StopInfoCard = (props: StopInfoCardProps) => {
  const { stop, setOpen } = props;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>{stop?.name}</div>
        <IconButton onClick={() => setOpen(false)}>
          <Close className="icon" style={{ color: 'black' }} />
        </IconButton>
      </div>
      <div className={styles.details}>
        <div className={styles.item}>
          <Badge className={styles.icon} />
          <p className={styles.bodyText}>
            You are required to show your student ID
          </p>
        </div>
        <div className={styles.item}>
          <NoDrinks className={styles.icon} />
          <p className={styles.bodyText}>No alcohol allowed on this service</p>
        </div>
        <div className={styles.item}>
          <NoTransfer className={styles.icon} />
          <p className={styles.bodyText}>
            This service does not run on the weekend and bank holidays
          </p>
        </div>
      </div>
    </div>
  );
};

export default StopInfoCard;
