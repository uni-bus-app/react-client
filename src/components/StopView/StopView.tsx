import { Stop } from '../../models/stop';
import { Time } from '../../models/time';
import styles from './StopView.module.css';

interface StopViewProps {
  stop: Stop;
  nextTime: Time | undefined;
}

const StopView = (props: StopViewProps) => {
  const { stop, nextTime } = props;
  return (
    <>
      <div className={styles.stopTitle}>{stop.name}</div>
      {nextTime && (
        <div>
          Next bus in {nextTime.eta} {nextTime.etaUnit}
        </div>
      )}
    </>
  );
};

export default StopView;
