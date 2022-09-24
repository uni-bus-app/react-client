import Satellite from '../../assets/satellite.png';
import Bus from '../../assets/busStop.png';
import styles from './styles.module.css';
import React, { cloneElement, useEffect, useState } from 'react';

export const InitialStartup = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Bus} />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Travel, simplified.</p>
            <p className={styles.pageContainerIntroduction}>
              Our aim is to simplify the University bus experience, providing
              you easy access to university travel resources.
            </p>
            <p></p>
            <i className={styles.smallText}>
              This app is and always will be provided completely free of charge,
              feel free to tell your friends about us!
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LocationPermissionView = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Satellite} />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Location Data</p>
            <p className={styles.pageContainerIntroduction}>
              In order to provide you with all the cool services we have built
              the app requires your location, but don't worry, the nerds have no
              access to your data! It is all stored on your device.
            </p>
            <p className={styles.pageContainerIntroduction}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionView;
