import { useEffect, useState } from 'react';
import { getTimes } from '../../api/APIUtils';
import { Time } from '../../models/time';
import { TimeComponent } from '../Time/Time';
import styles from './TimesList.module.css';

interface TimesListProps {
  stopID?: string | undefined;
  onNextStopUpdate?: (time: Time) => void;
}

export function TimesListComponent(props: TimesListProps) {
  const { stopID, onNextStopUpdate } = props;

  const [times, setTimes] = useState<Time[]>();
  const [intervalID, setIntervalID] = useState<number>();

  useEffect(() => {
    if (stopID) {
      // getTimes(stopID).then((data) => {
      //   window.clearInterval(intervalID);
      //   // if (onNextStopUpdate) {
      //   //   onNextStopUpdate(data[0]);
      //   // }
      //   setTimes(data);
      //   setIntervalID(
      //     window.setInterval(() => {
      //       const result: Time[] = [];
      //       data.forEach((time) => {
      //         const { eta, etaUnit } = updateServiceEta(time.timeValue);
      //         if (eta) {
      //           result.push({ ...time, eta, etaUnit });
      //         }
      //       });
      //       if (onNextStopUpdate) {
      //         // onNextStopUpdate(result[0]);
      //       }
      //       setTimes(result);
      //     }, 1000)
      //   );
      // });
    }

    return () => {
      window.clearInterval(intervalID);
    };
  }, [stopID]);

  return (
    <div className={styles.TimesList}>
      {/* {times?.map((time, index) => {
        return (
          // <TimeComponent
          //   key={index}
          //   destination={time.destination}
          //   service={time.service}
          //   time={time.time}
          //   eta={time.eta}
          //   etaUnit={time.etaUnit}
          // />
        );
      })} */}
    </div>
  );
}
