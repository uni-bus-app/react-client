import { Easing, Tween, update } from '@tweenjs/tween.js';
import { useRef, useState } from 'react';
import { useTimetable } from '../../hooks';
import { Stop } from '../../types';
import Carousel from '../Carousel';
import NextTimeCard from '../NextTimeCard';
import NextTimesSheet from '../NextTimesSheet';
import styles from './styles.module.css';

const animateCamera = (
  map: google.maps.Map,
  camera: google.maps.CameraOptions,
  center: any,
  onComplete: (camera: google.maps.CameraOptions) => void
) => {
  new Tween(camera)
    .to({ center }, 600)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      map.moveCamera(camera);
    })
    .start()
    .onComplete(onComplete);
  const animate = (time: number) => {
    requestAnimationFrame(animate);
    update(time);
  };
  requestAnimationFrame(animate);
};

interface StopViewProps {
  map: any;
  tween: any;
  stop?: Stop;
  setStop: any;
  stops?: Stop[];
  unSelectStop: () => void;
  nextStop: () => void;
  darkMode: boolean;
}

const StopView = (props: StopViewProps) => {
  const { map, tween, stop, setStop, stops, unSelectStop, nextStop, darkMode } =
    props;
  const { times, loadMore } = useTimetable(stop);
  const [timesSheetOpen, setTimesSheetOpen] = useState<boolean>(false);
  const cameraRef = useRef<any>();
  const nextStop1 = useRef<any>();
  const latDiff = useRef<number>(0);
  const lngDiff = useRef<number>(0);
  const prevStop1 = useRef<any>();
  const latDiff1 = useRef<number>(0);
  const lngDiff1 = useRef<number>(0);
  const startIndex = useRef<number>(0);
  return (
    <>
      {stops?.length && (
        <Carousel
          items={stops.map((item) => (
            <>
              <div className={styles.header}>
                <div className={styles.stopTitle}>{item?.name}</div>
              </div>
              <div className={styles.content}>
                <NextTimeCard
                  time={times?.[0]}
                  darkMode={darkMode}
                  onClick={() => setTimesSheetOpen(true)}
                />
              </div>
            </>
          ))}
          onStart={(index) => {
            if (tween) {
              tween.stop();
            }
            console.log(index);
            startIndex.current = index;
            nextStop1.current =
              stops[index === stops.length - 1 ? 0 : index + 1];
            latDiff.current =
              (nextStop1?.current?.location?.lat -
                stops[index]?.location?.lat) /
              5;
            lngDiff.current =
              (nextStop1?.current?.location?.lng -
                stops[index]?.location?.lng) /
              5;
            prevStop1.current =
              stops[index === 0 ? stops.length - 1 : index - 1];
            latDiff1.current =
              (prevStop1?.current?.location?.lat -
                stops[index]?.location?.lat) /
              5;
            lngDiff1.current =
              (prevStop1?.current?.location?.lng -
                stops[index]?.location?.lng) /
              5;
            console.log(prevStop1.current, index);
          }}
          onMove={(index, value) => {
            // console.log(startIndex.current, value);
            const center = {
              lat: stops[index].location.lat + value * latDiff.current,
              lng: stops[index].location.lng + value * lngDiff.current,
            };
            cameraRef.current = { center };
            map.moveCamera({ center });
          }}
          onEnd={(index, back) => {
            if (!(stops && stop)) {
              return;
            }
            setStop(stops[index]);
            animateCamera(
              map,
              { ...cameraRef.current, zoom: 16 },
              back !== undefined
                ? back === true
                  ? prevStop1.current.location
                  : nextStop1.current.location
                : stop.location,
              (res) => {
                cameraRef.current = res;
              }
            );
          }}
        />
      )}
      {times && (
        <NextTimesSheet
          open={timesSheetOpen}
          setOpen={setTimesSheetOpen}
          times={times}
          loadMoreTimes={loadMore}
        />
      )}
    </>
  );
};

export default StopView;
