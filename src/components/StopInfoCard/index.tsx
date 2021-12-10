import styles from './styles.module.css';
import Card from '@mui/material/Card';
import { Hail, Badge, Masks, NoTransfer } from '@mui/icons-material';

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
          <p>You are required to show your student ID</p>
        </div>
        <div className={styles.item}>
          <Masks className={styles.icon} />
          <p>You are required by law to wear a face covering (unless exempt)</p>
        </div>
        <div className={styles.item}>
          <NoTransfer className={styles.icon} />
          <p>This service does not run on the weekend and bank holidays</p>
        </div>
      </div>
    </Card>
  );
};

export default StopInfoCard;
