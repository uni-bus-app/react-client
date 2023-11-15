import { Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message, Stop, Time } from '../../types';
import InfoCards from '../InfoCards';
import StopSelect from '../StopSelect';
import MessageCard from '../MessageCard';
import SplashScreen from '../SplashScreen';

export interface HomeProps {
  stops: Stop[];
  currentStop: Stop | undefined;
  setCurrentStop: Dispatch<SetStateAction<Stop | undefined>>;
  loadingTimes: Promise<Time[]> | undefined;
  setLoadingTimes: Dispatch<SetStateAction<Promise<Time[]> | undefined>>;
  messages: Message[];
  onLoad: () => void;
  checkForUpdates: any;
}

const Home = (props: HomeProps) => {
  const { stops, currentStop, setCurrentStop, messages, onLoad } = props;
  const navigate = useNavigate();
  const selectStop = (stop: Stop) => {
    setCurrentStop(stop);
    navigate('/stopview');
  };
  useEffect(() => {
    setCurrentStop(undefined);
    onLoad();
  }, []);
  return (
    <>
      <StopSelect stops={stops} value={currentStop} onChange={selectStop} />
      {/* <InfoCards messages={messages} /> */}
      <MessageCard
        title={'iOS 16.4 Issues'}
        body={
          'Those of you on iOS 16.4+ may not be able to interact with the dropdown, please use the markers to open the desired stop.'
        }
      />
    </>
  );
};

export default Home;
