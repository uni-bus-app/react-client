import DirectionsBus from '@mui/icons-material/DirectionsBus';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NoTransfer from '@mui/icons-material/NoTransfer';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { Time } from '../../types';
import BusEta from '../BusEta';
import ServiceIcon from '../ServiceIcon';
import styles from './styles.module.css';
import { useTimetable } from '../../hooks';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const NoServiceCard = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <Card
      className={styles.card}
      style={{ flexDirection: 'column', alignItems: 'center' }}
      sx={{ boxShadow: 7 }}
      onClick={onClick}
    >
      <NoTransfer />
      <Typography style={{ paddingTop: '0.25em' }}>
        No services today
      </Typography>
      <Typography>Click to see later departures</Typography>
    </Card>
  );
};

interface NextTimeCardProps {
  currentStop: any;
  darkMode: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  setNextCardOpen: Dispatch<SetStateAction<boolean>>;
}

const NextTimeCard = (props: NextTimeCardProps) => {
  let { currentStop, darkMode, onClick, setNextCardOpen } = props;
  const { times } = useTimetable(currentStop);

  let time: Time | undefined = times?.[0];

  return (time?.timeValue?.diff(dayjs(), 'minutes') || 0) < 60 ||
    time?.timeValue?.day() === dayjs().day() ? (
    <>
      <div className={styles.top}>
        <span className={styles.pill} />
      </div>
      <div className={styles.header}>
        <p>{currentStop?.name}</p>
        <IconButton
          onClick={() => setNextCardOpen(false)}
          className={styles.closeButton}
        >
          <Close className="icon" />
        </IconButton>
      </div>
      <div className={styles.card} onClick={onClick}>
        <div className={styles.details}>
          <div className={styles.icons}>
            {time ? (
              <DirectionsBus />
            ) : (
              <Skeleton
                width={24}
                height={24}
                variant="rectangular"
                style={{ borderRadius: '0.25em' }}
              />
            )}
            {time ? (
              <ServiceIcon darkTheme={darkMode} />
            ) : (
              <Skeleton
                width={26}
                height={26}
                variant="rectangular"
                style={{ borderRadius: '0.25em', margin: '5px' }}
              />
            )}
          </div>
          {time ? (
            <div className={styles.destination}>{time?.destination}</div>
          ) : (
            <Skeleton
              variant="text"
              width={133}
              style={{ marginLeft: '6px' }}
            />
          )}
        </div>
        <div className={styles.endContainer}>
          <BusEta eta={time?.eta} />
          {time ? <NavigateNext /> : <Skeleton width={24} height={24} />}
        </div>
      </div>
    </>
  ) : (
    <NoServiceCard onClick={onClick} />
  );
};

export default NextTimeCard;
