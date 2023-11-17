import { Stop } from '../../types';
import BottomSheet from '../BottomSheet';
import TimesList from '../TimesList';
import styles from './styles.module.css';
import { useTimetable } from '../../hooks';
import StopInfoCard from '../StopInfoCard';
import { Divider } from '@mui/material';

interface NextTimesSheetProps {
  open: any;
  setOpen: any;
  stop?: Stop;
}

const NextTimesSheet = (props: NextTimesSheetProps) => {
  const { open, setOpen, stop } = props;

  const { times, loadMore } = useTimetable(stop);

  return (
    <BottomSheet open={open} setOpen={setOpen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <StopInfoCard stop={stop} setOpen={setOpen} />
        </div>
        <Divider sx={{ marginBottom: '6px' }} />
        {times && <TimesList times={times} loadMoreTimes={loadMore} />}
      </div>
    </BottomSheet>
  );
};

export default NextTimesSheet;
