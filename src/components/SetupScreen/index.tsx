import Satellite from '../../assets/satellite.png';
import Bus from '../../assets/busStop.png';
import Notifications from '../../assets/notifications.png';
import styles from './styles.module.css';

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
            <br />
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
              the app needs your location, but don't worry, the nerds have no
              access to your data! It is all stored on your device.
            </p>
            <p className={styles.pageContainerIntroduction}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationPermissionView = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Notifications} />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Notifications</p>
            <p className={styles.pageContainerIntroduction}>
              Android users get a cool extra bonus, notifications! You can set a
              bus you like to get and we can remind you when you need to start
              making a move.
            </p>
            <p className={styles.pageContainerIntroduction}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FinalScreenView = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Notifications} />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>You're all set!</p>
            <p className={styles.pageContainerIntroduction}></p>
            <p className={styles.pageContainerIntroduction}></p>
          </div>
        </div>
      </div>
    </div>
  );
};
