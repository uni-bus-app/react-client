import NoTransfer from '@mui/icons-material/NoTransfer';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Message } from '../../types';
import styles from './styles.module.css';

const icons = { NoTransfer };

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
      {messages.map(({ title, body, icon, actions }) => (
        <Card className={styles.infoCard} sx={{ boxShadow: 7 }}>
          <div className={styles.header}>
            <DynamicIcon iconName={icon} />
            <Typography>{title}</Typography>
          </div>
          <p className={styles.bodyText}>{body}</p>
          {actions?.map(({ label, url }) => (
            <Link href={url} target="_blank">
              {label}
            </Link>
          ))}
        </Card>
      ))}
    </>
  );
};

export default InfoCards;
