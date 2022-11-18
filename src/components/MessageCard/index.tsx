import Badge from '@mui/icons-material/Badge';
import Hail from '@mui/icons-material/Hail';
import NoTransfer from '@mui/icons-material/NoTransfer';
import Card from '@mui/material/Card';
import styles from './styles.module.css';

const MessageCard = (props: any) => {
    const {title, icon, body} = props;
  return (
    <Card className={styles.card} sx={{ boxShadow: 7 }}>
      <div className={styles.header}>
        <NoTransfer fontSize="large" />
        {title}
      </div>
      <div className={styles.details}>
        <div className={styles.item}>
          <p className={styles.bodyText}>
            {body}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MessageCard;
