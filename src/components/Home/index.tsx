import { Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message, Stop, Time } from '../../types';
import InfoCards from '../InfoCards';
import StopSelect from '../StopSelect';
import MessageCard from '../MessageCard';

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
      <MessageCard title={'Site Issues'} body={'We are aware of issues surrounding the app not loading for some, and are working to fix them. We apologize for the inconvenience.'} />
    </>
  );
};

export default Home;
