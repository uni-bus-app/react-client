import DirectionsBus from '@mui/icons-material/DirectionsBus';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NoTransfer from '@mui/icons-material/NoTransfer';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { Time } from '../../types';
import BusEta from '../BusEta';
import ServiceIcon from '../ServiceIcon';
import styles from './styles.module.css';
import { useTimetable } from '../../hooks';
import { Close, DirectionsWalk, Star, StarOutline } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useSettings } from '../SettingsProvider';

const NoServiceCard = ({
  onClick,
  currentStop,
  setNextCardOpen,
  issue,
}: {
  onClick: MouseEventHandler<HTMLDivElement>;
  currentStop: any;
  setNextCardOpen: Dispatch<SetStateAction<boolean>>;
  issue: 'bankholiday' | 'outofterm';
}) => {
  return (
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
          <Close className={styles.icon} />
        </IconButton>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClick}
      >
        <NoTransfer fontSize="large" />
        <Box>
          {issue === 'bankholiday' ? (
            <Typography style={{ paddingTop: '0.25em', fontWeight: 'bold' }}>
              This service does not run on bank holidays
            </Typography>
          ) : (
            <Typography style={{ paddingTop: '0.25em', fontWeight: 'bold' }}>
              This service is not available out of term time
            </Typography>
          )}
          <Typography style={{ fontStyle: 'italic' }}>
            Tap to see future departures
          </Typography>
        </Box>
      </div>
    </>
  );
};

const getDay = (value: Dayjs | undefined) => {
  const time = dayjs();
  if (time.isSame(value, 'date')) {
    return 'Today';
  } else if (time.add(1, 'day').isSame(value, 'date')) {
    return 'Tomorrow';
  } else {
    return value?.format('dddd');
  }
};
interface NextTimeCardProps {
  currentStop: any;
  darkMode: boolean;
  setTimesSheetOpen: Dispatch<SetStateAction<boolean>>;
  setNextCardOpen: Dispatch<SetStateAction<boolean>>;
  walkingTime: number;
  userLocation: google.maps.LatLng | google.maps.LatLngLiteral;
}

const NextTimeCard = (props: NextTimeCardProps) => {
  let {
    currentStop,
    darkMode,
    setTimesSheetOpen,
    setNextCardOpen,
    walkingTime,
  } = props;
  const { times } = useTimetable(currentStop);
  const settings = useSettings();

  let time: Time | undefined = times?.[0];

  const openMapsApp = () => {
    const destination = `${currentStop.location.lat},${currentStop.location.lng}`;
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isiOS) {
      window.open(`https://maps.apple.com/?daddr=${destination}`);
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`
      );
    }
  };

  return (
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
          <Close className={styles.icon} />
        </IconButton>
      </div>
      <div className={styles.card} onClick={() => setTimesSheetOpen(true)}>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '6px',
              }}
            >
              <div className={styles.destination}>{time?.destination}</div>
              {time && !dayjs(time?.timeValue).isSame(dayjs(), 'day') && (
                <div className={styles.dateOfDeparture}>
                  {getDay(time?.timeValue)}, {time?.timeValue.format('DD MMM')}
                </div>
              )}
            </div>
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

      <div className={styles.actions}>
        {!!walkingTime && (
          <div className={styles.actionButton} onClick={() => openMapsApp()}>
            <DirectionsWalk fontSize="small" />
            <span className={styles.actionButtonLabel}>{walkingTime}</span>
          </div>
        )}
        <div
          className={styles.actionButton}
          onClick={() => {
            settings.favouriteStop !== currentStop?.id &&
              settings.setValue('favouriteStop', currentStop?.id);
          }}
        >
          {settings.favouriteStop === currentStop?.id ? (
            <Star fontSize="small" />
          ) : (
            <StarOutline fontSize="small" />
          )}
          <span className={styles.actionButtonLabel}>
            {settings.favouriteStop === currentStop?.id
              ? 'Favourited'
              : 'Favourite this stop'}
          </span>
        </div>
      </div>
    </>
  );
};

export default NextTimeCard;
