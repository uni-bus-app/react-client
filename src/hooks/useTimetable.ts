import { useEffect, useRef, useState } from 'react';
import { getTimes, updateServiceTimes } from '../api/APIUtils';
import { Stop, Time } from '../types';

const useTimetable = (stop?: Stop) => {
  const intervalID = useRef<number>();
  const allTimes = useRef<Time[]>();
  const [times, setTimes] = useState<Time[]>();
  const updateTimes = () => {
    intervalID.current = window.setInterval(() => {
      if (allTimes.current) {
        const updatedTimes = updateServiceTimes(allTimes.current);
        allTimes.current = updatedTimes;
        setTimes(updatedTimes);
      }
    }, 1000);
  };
  useEffect(() => {
    window.clearInterval(intervalID.current);
    if (stop?.id) {
      getTimes(stop.id).then((data) => {
        allTimes.current = data;
        setTimes(allTimes.current);
        updateTimes();
      });
    }
    return () => {
      window.clearInterval(intervalID.current);
    };
  }, [stop?.id]);
  const loadMore = async () => {
    window.clearInterval(intervalID.current);
    if (stop?.id && allTimes.current) {
      const res = await getTimes(
        stop?.id,
        allTimes.current[allTimes.current.length - 1].timeValue.toISOString()
      );
      allTimes.current = [...allTimes.current, ...res];
      setTimes(allTimes.current);
      updateTimes();
    }
  };
  return { times, loadMore };
};

export default useTimetable;
