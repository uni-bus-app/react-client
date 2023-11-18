import Satellite from '../../assets/satellite.png';
import Bus from '../../assets/busStop.png';
import Notifications from '../../assets/notifications.png';
import styles from './styles.module.css';
import { CircularProgress } from '@mui/material';

export const WelcomeView = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <img src={Bus} alt="Bus" />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Travel, simplified.</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                Our aim is to simplify the University bus experience, providing
                you easy access to university travel resources.
              </p>
              <p className={styles.pageContainerIntroduction}>
                Because, let's be real, who <i>really</i> wants to use a PDF to
                get their bus times?
              </p>
              <br />
              <i className={styles.smallText}>
                This app is and always will be provided completely free of
                charge, feel free to tell your friends about us!
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatsNewInThisUpdate = () => {
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>What's new?</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                It's been a while since we updated, some of you are long time
                users and we'd like to thank you.
              </p>
              <p className={styles.pageContainerIntroduction}>
                This update is huge, let's quickly cover some of the new stuff.
              </p>
              <br />
              <i className={styles.smallText}>
                Don't worry, if you don't care you can press the skip button at
                the top to get straight to the app!
              </i>
            </div>
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
          <img src={Satellite} alt="Location" />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Location Services</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                We use your location to provide you with the closest bus stops,
                estimated walking distance and some cool algorithmic maths to
                determine whether you'll make the next bus, but we can offer so
                much more in the future!
              </p>
              <i className={styles.smallText}>
                In order to provide you with all the cool services we have built
                the app needs your location - but don't worry - we have no
                access to your data, that's all stored locally on your device!
              </i>
            </div>
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
          <img src={Notifications} alt="Notifications" />

          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>Notifications</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                Get notified of any changes to your bus route, we'll let you
                know in advance if there are any disruptions or cancellations.
              </p>
              <p className={styles.pageContainerIntroduction}>
                Note: For iOS users, we <b>must</b> be added to your homescreen
                for this to work!
              </p>
              <br />
              <i className={styles.smallText}>
                Figuring out how to enable the notifications may be a bit
                tricky, jump over to the Settings section of the app for more
                help!
              </i>
            </div>
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
          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>You're all set!</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                We're just doing some final setup bits, should only take a
                few...
              </p>
            </div>
          </div>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};
