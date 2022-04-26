import DepartureBoard from '@mui/icons-material/DepartureBoard';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { createRef, useEffect, useState } from 'react';
import { Time } from '../../types';
import BusEta from '../BusEta';
import ServiceIcon from '../ServiceIcon';
import styles from './styles.module.css';

const getDay = (value: Dayjs) => {
  const time = dayjs();
  if (time.isSame(value, 'date')) {
    return 'Today';
  } else if (time.add(1, 'day').isSame(value, 'date')) {
    return 'Tomorrow';
  } else {
    return value.format('dddd');
  }
};
const DateHeader = ({ time, prevTime }: { time: Time; prevTime: Time }) => {
  if (!prevTime) {
    if (time.timeValue.isSame(dayjs(), 'date')) {
      return <></>;
    } else {
      return (
        <div
          style={{
            fontSize: '0.75em',
            marginLeft: '2.75em',
            marginTop: '1em',
            fontWeight: 'bold',
          }}
        >
          {getDay(time.timeValue)}, {time.timeValue.format('DD MMM')}
        </div>
      );
    }
  } else if (prevTime.timeValue.day() !== time.timeValue.day()) {
    return (
      <div
        style={{
          fontSize: '0.75em',
          marginLeft: '2.75em',
          marginTop: '1em',
          fontWeight: 'bold',
        }}
      >
        {getDay(time.timeValue)}, {time.timeValue.format('DD MMM')}
      </div>
    );
  } else {
    return <></>;
  }
};

interface TimesListProps {
  times: Array<Time>;
  loadMoreTimes: () => Promise<void>;
}

const TimesList = (props: TimesListProps) => {
  const { times, loadMoreTimes } = props;
  const [timesLoading, setTimesLoading] = useState<boolean>(false);
  const theme = useTheme();
  const darkTheme = theme.palette.mode === 'dark';
  const ref = createRef<HTMLDivElement>();
  useEffect(() => {
    if (ref.current?.scrollHeight === ref.current?.clientHeight) {
      setTimesLoading(true);
      window.setTimeout(() => {
        loadMoreTimes().then(() => setTimesLoading(false));
      }, 1500);
    }
  }, []);
  return (
    <div
      className={styles.timesList}
      ref={ref}
      onScroll={(e) => {
        if (
          (e.target as any).scrollHeight - 60 <
            (e.target as any).scrollTop + (e.target as any).clientHeight &&
          !timesLoading
        ) {
          setTimesLoading(true);
          window.setTimeout(() => {
            loadMoreTimes().then(() => setTimesLoading(false));
          }, 1500);
        }
      }}
    >
      {times.map((time, index) => (
        <>
          <DateHeader time={time} prevTime={times[index - 1]} />
          <TimeItem time={time} darkTheme={darkTheme} index={index} />
          <Divider className={styles.divider} />
        </>
      ))}
      <div
        className={styles.row}
        style={{ paddingLeft: '32px', paddingRight: '28px' }}
      >
        <div className={styles.busInfoContainer}>
          <div className={styles.topInfo}>
            <div className={styles.iconContainer}>
              <Skeleton
                variant="rectangular"
                height={24}
                width={24}
                style={{
                  borderRadius: '0.5em',
                }}
              />
              <Skeleton
                variant="rectangular"
                height={26}
                width={26}
                style={{
                  borderRadius: '0.5em',
                  margin: '0.5em',
                  marginRight: '0.5625em',
                  marginLeft: '0.5em',
                }}
              />
            </div>
            <Skeleton
              variant="rectangular"
              height={26}
              width={140}
              style={{ borderRadius: '0.5em', margin: '0.5em', marginLeft: 0 }}
            />
          </div>
        </div>
        <Skeleton
          variant="rectangular"
          height={24}
          width={50}
          style={{
            borderRadius: '0.5em',
            margin: '0.5em',
            marginLeft: 0,
            marginRight: 0,
          }}
        />
      </div>
    </div>
  );
};

interface TimesItemProps {
  time: Time;
  darkTheme: boolean;
  index: number;
}

const TimeItem = (props: TimesItemProps) => {
  const { time, darkTheme, index } = props;
  return (
    <div className={styles.row}>
      <div className={styles.busInfoContainer}>
        <div className={styles.topInfo}>
          <div className={styles.iconContainer}>
            <DepartureBoard fontSize={'medium'} />
            <ServiceIcon darkTheme={darkTheme} />
          </div>
          <div className={styles.destination}>{time.destination}</div>
        </div>
        {time.eta?.value && (
          <div className={styles.scheduledDeparture}>
            This service departs at {time.time && time.time}
          </div>
        )}
      </div>
      <BusEta eta={time.eta} index={index} flexGrow={false} />
    </div>
  );
};

export default TimesList;
