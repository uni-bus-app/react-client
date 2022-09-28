import { Card, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import styles from './styles.module.css';

const NotificationsView = () => {
  const messages = [
    {
      title: 'Timetable Update 2022',
      body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
      icon: 'BusAlert',
      actions: '',
    },
  ];
  return (
    <section className={styles.notificationsPage}>
      <>
        {messages.map(({ title, body, icon, actions }) => (
          <Card className={styles.infoCard} sx={{ boxShadow: 7 }}>
            <div className={styles.header}>
              <BusAlertIcon style={{ marginBottom: '10px' }} />
              <Typography sx={{ fontSize: '0.8rem' }}>{title}</Typography>
            </div>
            <p className={styles.bodyText}>{body}</p>
            {/* {actions?.map(({ label, url }) => (
              <Link href={url} target="_blank">
                {label}
              </Link>
            ))} */}
          </Card>
        ))}
      </>
    </section>
  );
};

export default NotificationsView;
