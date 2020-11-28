import { useEffect, useState } from 'react';
import { getTimes, updateServiceEta } from '../../api/APIUtils';
import { Time } from '../../models/time';
import { TimeComponent } from '../Time/Time';

interface TimesListProps {
  stopID: string;
}

export function TimesListComponent(props: TimesListProps) {
  const { stopID } = props;

  const [times, setTimes] = useState<Time[]>(null);
  const [intervalID, setIntervalID] = useState<number>();

  useEffect(() => {
    getTimes(stopID).then((data) => {
      window.clearInterval(intervalID);
      setTimes(data);
      setIntervalID(
        window.setInterval(() => {
          const result = [];
          data.forEach((time) => {
            const { eta, etaUnit } = updateServiceEta(time.timeValue);
            if (eta) {
              result.push({ ...time, eta, etaUnit });
            }
          });
          setTimes(result);
        }, 1000)
      );
    });

    return () => {
      window.clearInterval(intervalID);
    };
  }, [stopID]);

  return (
    <div>
      {times?.map((time, index) => {
        return (
          <TimeComponent
            key={index}
            destination={time.destination}
            service={time.service}
            time={time.time}
            eta={time.eta}
            etaUnit={time.etaUnit}
          />
        );
      })}
    </div>
  );
}
