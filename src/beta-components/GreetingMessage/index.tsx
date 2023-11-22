import { useSettings } from '../../components/SettingsProvider';
import dayjs from 'dayjs';
import './styles.scss';

const GreetingMessage = () => {
  const settings = useSettings();
  const userName = settings.usersName;
  const currentTime = dayjs();
  let greeting;

  const hour = currentTime.hour();

  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  return (
    <div className="GreetingMessage">
      <p className="GreetingMessage-message">
        {`${greeting}${userName !== '' ? ', ' : ''}${userName}!`}
      </p>
      <p className="GreetingMessage-disruptions">
        There doesn't appear to be any disruptions to the service today.
      </p>
    </div>
  );
};

export default GreetingMessage;
