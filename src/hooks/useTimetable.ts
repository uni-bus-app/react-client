import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { getTimes, updateServiceTimes } from '../api/APIUtils';
import { useServiceWorker } from '../components/ServiceWorkerProvider';
import { Stop, Time } from '../types';

const useTimetable = (stop?: Stop) => {
  const { wb } = useServiceWorker();
  const intervalID = useRef<number>();
  const allTimes = useRef<Time[]>();
  const [times, setTimes] = useState<Time[]>();
  // const loadMore = () => {};
  // useEffect(() => {
  //   wb?.addEventListener('message', (event) => {
  //     if (event.data?.type === 'TIMES' && event.data.times) {
  //       // console.log(event.data);
  //       setTimes(
  //         event.data.times.map((item: any) => ({
  //           ...item,
  //           timeValue: dayjs(item.timeValue),
  //         }))
  //       );
  //     }
  //   });
  // }, [wb]);
  // useEffect(() => {
  //   if (stop && wb) {
  //     // console.log(stop, wb);
  //     wb.messageSW({ type: 'GET_TIMES', stopID: stop.id });
  //   }
  // }, [stop, wb]);
  // useEffect(() => {});
  const updateTimes = () => {
    intervalID.current = window.setInterval(() => {
      if (allTimes.current) {
        let time = performance.now();
        const updatedTimes = updateServiceTimes(allTimes.current);
        allTimes.current = updatedTimes;
        setTimes(updatedTimes);
        const newTime = performance.now();
        // console.log(performance.now() - time);
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
