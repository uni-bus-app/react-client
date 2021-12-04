import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getTimes, updateServiceEta } from '../../api/APIUtils';
import { Stop } from '../../models/stop';
import { Time } from '../../models/time';
import styles from './StopView.module.css';

interface StopViewProps {
  stop: Stop;
  nextTime: Time | undefined;
  unSelectStop: () => void;
}

const StopView = (props: StopViewProps) => {
  const { stop, nextTime, unSelectStop } = props;
  // const { stopID, onNextStopUpdate } = props;

  const [times, setTimes] = useState<Time[]>();
  const [intervalID, setIntervalID] = useState<number>();

  useEffect(() => {
    if (stop.id) {
      getTimes(stop.id).then((data) => {
        window.clearInterval(intervalID);
        // if (onNextStopUpdate) {
        //   onNextStopUpdate(data[0]);
        // }
        setTimes(data);
        setIntervalID(
          window.setInterval(() => {
            const result: Time[] = [];
            data.forEach((time) => {
              const { eta, etaUnit } = updateServiceEta(time.timeValue);
              if (eta) {
                result.push({ ...time, eta, etaUnit });
              }
            });
            // if (onNextStopUpdate) {
            //   // onNextStopUpdate(result[0]);
            // }
            setTimes(result);
            console.log(result);
          }, 1000)
        );
      });
    }

    return () => {
      window.clearInterval(intervalID);
    };
  }, [stop.id]);
  return (
    <>
      <IconButton onClick={unSelectStop}>
        <ArrowBack />
      </IconButton>
      <div className={styles.stopTitle}>{stop.name}</div>
      {times?.[0] && (
        <div>
          Next bus in {times[0].eta} {times[0].etaUnit}
        </div>
      )}
    </>
  );
};

export default StopView;
