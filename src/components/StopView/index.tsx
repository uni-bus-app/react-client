import { Button, IconButton, SwipeableDrawer } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getTimes, updateServiceTimes } from '../../api/APIUtils';
import { Stop, Time } from '../../models';
import styles from './styles.module.css';
import NextTimeCard from '../NextTimeCard';
import StopInfoCard from '../StopInfoCard';
import TimesList from '../TimesList';
import CloseIcon from '@mui/icons-material/Close';

interface StopViewProps {
  stop: Stop;
  unSelectStop: () => void;
  darkMode: boolean;
}

type Anchor = 'bottom';

const StopView = (props: StopViewProps) => {
  const { stop, unSelectStop, darkMode } = props;

  const [times, setTimes] = useState<Time[]>();

  const [state, setState] = useState({
    bottom: false,
  });

  const anchor = 'bottom';

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      console.log(false, true);
      setState({ ...state, [anchor]: open });
    };

  useEffect(() => {
    let intervalID = 0;
    if (stop.id) {
      getTimes(stop.id).then((data) => {
        window.clearInterval(intervalID);
        setTimes(data);
        intervalID = window.setInterval(() => {
          setTimes(updateServiceTimes(data));
        }, 1000);
      });
    }

    return () => {
      window.clearInterval(intervalID);
    };
  }, [stop.id]);

  return (
    <>
      <div className={styles.header}>
        <IconButton className={styles.backButton} onClick={unSelectStop}>
          <KeyboardBackspace />
        </IconButton>
        <div className={styles.stopTitle}>{stop.name}</div>
      </div>
      <div>
        {times?.[0] && (
          <div onClick={toggleDrawer(anchor, true)}>
            <NextTimeCard time={times[0]} darkMode={darkMode} />
          </div>
        )}
        <StopInfoCard />
        <div>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <div className={styles.header}>
              <p className={styles.title}>Upcoming Departures</p>
              <CloseIcon onClick={toggleDrawer(anchor, false)} />
            </div>
            {times?.[0] && <TimesList times={times} />};
          </SwipeableDrawer>
        </div>
      </div>
    </>
  );
};

export default StopView;
