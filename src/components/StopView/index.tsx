import { IconButton } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getTimes, updateServiceTimes } from '../../api/APIUtils';
import { Stop, Time } from '../../models';
import styles from './styles.module.css';
import NextTimeCard from '../NextTimeCard';
import StopInfoCard from '../StopInfoCard';

interface StopViewProps {
  stop: Stop;
  unSelectStop: () => void;
  darkMode: boolean;
}

const StopView = (props: StopViewProps) => {
  const { stop, unSelectStop, darkMode } = props;

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
        <IconButton className={styles.backButton} onClick={unSelectStop}>
          <KeyboardBackspace />
        </IconButton>
        <div className={styles.stopTitle}>{stop.name}</div>
      </div>
      {times?.[0] && <NextTimeCard time={times[0]} darkMode={darkMode} />}
      <StopInfoCard />
    </>
  );
};

export default StopView;
