import { Card, Divider, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import styles from './styles.module.css';
import classNames from 'classnames';

const messages = [
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
  {
    title: 'Timetable Update 2022',
    body: 'This is a demonstration of a notification that the user can read, it can provide updates to the timetable or route',
    icon: 'BusAlert',
    actions: '',
  },
];

interface NotificationCardProps {
  body: string;
  title: string;
}

const Notifications = (props: NotificationCardProps) => {
  const { body, title } = props;
  return (
    <div className={styles.animate}>
      <div className={styles.infoCard}>
        <div className={styles.icon}>
          <BusAlertIcon style={{ color: 'black' }} />
        </div>
        <div className={styles.notificationContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.body}>{body}</div>
        </div>
      </div>
      <Divider variant="middle" sx={{ backgroundColor: 'black' }} />
    </div>
  );
};

const NotificationsView = () => {
  return (
    <section className={styles.notificationsPage}>
      <p className={styles.title}>Notifications</p>
      <div className={styles.notificationList}>
        {messages.map((message) => (
          <Notifications body={message.body} title={message.title} />
        ))}
      </div>
    </section>
  );
};

export default NotificationsView;
