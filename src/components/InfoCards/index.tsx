import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styles from './styles.module.css';
import * as icons from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Message } from '../../models';
import config from '../../config';

const upperFirst = (value: string): string => {
  return value.slice(0, 1).toUpperCase() + value.slice(1, value.length);
};

const DynamicIcon = (props: { iconName: string }) => {
  const { iconName } = props;
  const IconComponent = (icons as any)[
    iconName.split('_').map(upperFirst).join('')
  ];
  return <IconComponent />;
};

const InfoCards = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    fetch(`${config.apiUrl}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, []);
  return (
    <>
      {messages.map(({ title, body, icon }) => (
        <Card className={styles.infoCard}>
          <div className={styles.header}>
            <DynamicIcon iconName={icon} />
            <Typography>{title}</Typography>
          </div>
          <p>{body}</p>
        </Card>
      ))}
    </>
  );
};

export default InfoCards;
