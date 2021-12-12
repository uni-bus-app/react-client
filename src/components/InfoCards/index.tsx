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

interface InfoCardsProps {
  messages: Message[];
}

const InfoCards = (props: InfoCardsProps) => {
  const { messages } = props;
  return (
    <>
      {messages.map(({ title, body, icon }) => (
        <Card className={styles.infoCard} sx={{ boxShadow: 7 }}>
          <div className={styles.header}>
            <DynamicIcon iconName={icon} />
            <Typography>{title}</Typography>
          </div>
          <p className={styles.bodyText}>{body}</p>
        </Card>
      ))}
    </>
  );
};

export default InfoCards;