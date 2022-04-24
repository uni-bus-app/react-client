import { useEffect, useState } from 'react';
import { getTimes, updateServiceTimes } from '../api/APIUtils';
import { Stop, Time } from '../types';

const useTimetable = (stop?: Stop) => {
  const [times, setTimes] = useState<Time[]>();
  useEffect(() => {
    if (stop?.id) {
      let intervalID: any;
      setTimes(undefined);
      getTimes(stop.id).then((data) => {
        setTimes(data);
        window.clearInterval(intervalID);
        intervalID = window.setInterval(() => {
          if (times) {
            const updatedTimes = updateServiceTimes(times);
            setTimes(updatedTimes);
          }
        }, 1000);
        return () => {
          window.clearInterval(intervalID);
        };
      });
    }
  }, [stop?.id]);
  const loadMore = async () => {
    if (stop?.id && times) {
      const res = await getTimes(
        stop?.id,
        times[times.length - 1].timeValue.toISOString()
      );
      setTimes((value: any) => [...value, ...res]);
    }
  };
  return { times, loadMore };
};

export default useTimetable;
