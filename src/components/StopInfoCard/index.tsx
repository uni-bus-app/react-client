import Badge from '@mui/icons-material/Badge';
import Hail from '@mui/icons-material/Hail';
import NoTransfer from '@mui/icons-material/NoTransfer';
import Card from '@mui/material/Card';
import styles from './styles.module.css';

const StopInfoCard = () => {
  return (
    <Card className={styles.card} sx={{ boxShadow: 7 }}>
      <div className={styles.header}>
        <Hail fontSize="large" />
        Stop Info
      </div>
      <div className={styles.details}>
        <div className={styles.item}>
          <Badge className={styles.icon} />
          <p className={styles.bodyText}>
            You are required to show your student ID
          </p>
        </div>
        <div className={styles.item}>
          <NoTransfer className={styles.icon} />
          <p className={styles.bodyText}>
            This service does not run on the weekend and bank holidays
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StopInfoCard;
