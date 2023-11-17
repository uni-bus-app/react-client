import { Stop } from '../../types';
import BottomSheet from '../BottomSheet';
import TimesList from '../TimesList';
import { useTimetable } from '../../hooks';
import StopInfoCard from '../StopInfoCard';
import { Divider } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';

interface NextTimesSheetProps {
  openNextTimesSheet: boolean;
  setOpenNextTimesSheet: Dispatch<SetStateAction<boolean>>;
  stop?: Stop;
}

const NextTimesSheet = (props: NextTimesSheetProps) => {
  const { openNextTimesSheet, setOpenNextTimesSheet, stop } = props;

  const { times, loadMore } = useTimetable(stop);

  return (
    <BottomSheet open={openNextTimesSheet} setOpen={setOpenNextTimesSheet}>
      <div className={styles.container}>
        <div className={styles.header}>
          <StopInfoCard stop={stop} setOpen={setOpenNextTimesSheet} />
        </div>
        <Divider sx={{ marginBottom: '6px' }} />
        {times && <TimesList times={times} loadMoreTimes={loadMore} />}
      </div>
    </BottomSheet>
  );
};

export default NextTimesSheet;
