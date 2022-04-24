import Close from '@mui/icons-material/Close';
import { Switch } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Time } from '../../types';
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
    <SwipeableDrawer
      anchor={'bottom'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>Upcoming Departures</p>
          <Close onClick={() => setOpen(false)} />
        </div>
        <TimesList times={times} loadMoreTimes={loadMoreTimes} />
      </div>
    </SwipeableDrawer>
  );
};

export default NextTimesSheet;
