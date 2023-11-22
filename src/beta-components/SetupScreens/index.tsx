import Satellite from '../../assets/satellite.png';
import Bus from '../../assets/busStop.png';
import Notifications from '../../assets/notifications.png';
import styles from './styles.module.css';
import { CircularProgress, Input } from '@mui/material';
import { useSettings } from '../../components/SettingsProvider';

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
                Let's be real, who <i>really</i> wants to use a PDF to get their
                bus times?
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
                This update is pretty big, let's quickly cover some of the new
                stuff.
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

export const CaptureNameView = () => {
  const settings = useSettings();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    settings.setValue('usersName', toTitleCase(event.target.value));
  };

  const toTitleCase = (str: string): string => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
      return match.toUpperCase();
    });
  };

  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>First things first...</p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                <b>What's your name?</b>
              </p>
              <br />
              <Input
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  width: '300px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                type="text"
                placeholder="Enter your first name"
                onChange={handleNameChange}
              />
              <br />
              <br />
              <i className={styles.smallText}>
                Don't worry, we aren't harvesting any data, we just want to be
                able to greet you properly when you open the app! All data is
                stored locally on your device and is never sent to any servers.
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
                estimated walking distance and to determine whether you'll make
                the next bus.
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
              <br />
              <i className={styles.smallText}>
                Note: You'll need to enable this feature manually, jump over to
                the Settings section of the app for more help!
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FinalScreenView = () => {
  const settings = useSettings();
  return (
    <div className={styles.box}>
      <div className={styles.pageContainer}>
        <div className={styles.imageTextContainer}>
          <div className={styles.pageContainerTextContainer}>
            <p className={styles.pageContainerTitle}>
              You're all set{settings.usersName !== '' && ','}{' '}
              {settings.usersName}!
            </p>
            <div className={styles.pageContainerBody}>
              <p className={styles.pageContainerIntroduction}>
                We're just doing some final setup bits to prep the app for you,
                should only take a few...
              </p>
            </div>
          </div>
          <br />
          <br />
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};
