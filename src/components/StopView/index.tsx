import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTimetable } from '../../hooks';
import { Stop } from '../../types';
import NextTimeCard from '../NextTimeCard';
import NextTimesSheet from '../NextTimesSheet';
import StopInfoCard from '../StopInfoCard';
import styles from './styles.module.css';

interface StopViewProps {
  stop?: Stop;
  unSelectStop: () => void;
  darkMode: boolean;
}

const StopView = (props: StopViewProps) => {
  const { stop, unSelectStop, darkMode } = props;
  const { times, loadMore } = useTimetable(stop);
  const [timesSheetOpen, setTimesSheetOpen] = useState<boolean>(false);
  return (
    <>
      <div className={styles.header}>
        <IconButton className={styles.backButton} onClick={unSelectStop}>
          <KeyboardBackspace />
        </IconButton>
        <div className={styles.stopTitle}>{stop?.name}</div>
      </div>
      <div className={styles.content}>
        <NextTimeCard
          time={times?.[0]}
          darkMode={darkMode}
          onClick={() => setTimesSheetOpen(true)}
        />
        <StopInfoCard />
        {times?.[0] && (
          <NextTimesSheet
            open={timesSheetOpen}
            setOpen={setTimesSheetOpen}
            times={times}
            loadMoreTimes={loadMore}
          />
        )}
      </div>
    </>
  );
};

export default StopView;
