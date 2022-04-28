import { Skeleton } from '@mui/material';
import { Eta } from '../../types';
import styles from './styles.module.css';

const BusEta = ({
  eta,
  flexGrow = true,
}: {
  eta?: Eta;
  flexGrow?: boolean;
}) => {
  return (
    <div
      className={styles.container}
      style={{ flexGrow: flexGrow ? 0.5 : undefined }}
    >
      {eta ? (
        <>
          {eta.show ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className={styles.time}>{eta?.value}</div>
              <div className={styles.unit}>{eta?.unit}</div>
            </div>
          ) : (
            <>
              <div className={`${styles.time} ${styles.arrivalTime}`}>
                {eta && eta?.arrivalTime}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            width={34}
            height={24}
            style={{
              borderRadius: '0.25em',
              marginTop: '4px',
              marginBottom: '2px',
            }}
          />
          <Skeleton
            variant="rectangular"
            width={34}
            height={13.2}
            style={{
              borderRadius: '0.25em',
              marginTop: '3px',
              marginBottom: '3px',
            }}
          />
        </>
      )}
    </div>
  );
};

export default BusEta;
