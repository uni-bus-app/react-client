import BottomSheet from '../../components/BottomSheet';
import Satellite from '../../assets/satellite.png';
import React from 'react';
import styles from './styles.module.css';

const HowToLocation = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Satellite} />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Location Data</p>
            <p className={styles.pageContainerIntroduction}>
              Hey now, we all reject things from time to time! We won't get too
              upset you rejected us before - but just so you know, theres a
              small step or two involved in getting the location features
              working again!
            </p>
            <p className={styles.pageContainerIntroduction}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CallSheet = (props: any) => {
  const { open, setOpen } = props;

  return (
    <BottomSheet open={open} setOpen={setOpen}>
      <HowToLocation />
    </BottomSheet>
  );
};
