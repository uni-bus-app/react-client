import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getTimes, updateServiceTimes } from '../../api/APIUtils';
import { Stop, Time } from '../../models';
import styles from './StopView.module.css';
import NextTimeCard from '../NextTimeCard';
import StopInfoCard from '../StopInfoCard';

interface StopViewProps {
  stop: Stop;
  nextTime: Time | undefined;
  unSelectStop: () => void;
}

const StopView = (props: StopViewProps) => {
  const { stop, unSelectStop } = props;

  const [times, setTimes] = useState<Time[]>();

  useEffect(() => {
    let intervalID = 0;
    if (stop.id) {
      getTimes(stop.id).then((data) => {
        window.clearInterval(intervalID);
        setTimes(data);
        intervalID = window.setInterval(() => {
          setTimes(updateServiceTimes(data));
        }, 1000);
      });
    }

    return () => {
      window.clearInterval(intervalID);
    };
  }, [stop.id]);

  return (
    <>
      <div className={styles.header}>
        <IconButton className={styles.floatLeft} onClick={unSelectStop}>
          <ArrowBack />
        </IconButton>
        <div className={styles.stopTitle}>{stop.name}</div>
      </div>
      {times?.[0] && <NextTimeCard time={times[0]} />}
      <StopInfoCard />
    </>
  );
};

export default StopView;
