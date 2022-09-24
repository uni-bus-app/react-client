import Close from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import { Time } from '../../types';
import BottomSheet from '../BottomSheet';
import TimesList from '../TimesList';
import styles from './styles.module.css';

interface NextTimesSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  times: Time[];
  loadMoreTimes: () => Promise<void>;
}

const NextTimesSheet = (props: NextTimesSheetProps) => {
  const { open, setOpen, times, loadMoreTimes } = props;
  return (
    <BottomSheet open={open} setOpen={setOpen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>Upcoming Departures</p>
          <Close onClick={() => setOpen(false)} />
        </div>
        <TimesList times={times} loadMoreTimes={loadMoreTimes} />
      </div>
    </BottomSheet>
  );
};

export default NextTimesSheet;
