import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClosestStop } from '../../api/APIUtils';
import { Message, Stop, Time } from '../../types';
import ClosestStop from '../ClosestStop';
import InfoCards from '../InfoCards';
import StopSelect from '../StopSelect';

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
  const [closestStop, setClosestStop] = useState<any>();
  const selectStop = (stop: Stop) => {
    setCurrentStop(stop);
    navigate('/stopview');
  };
  useEffect(() => {
    setCurrentStop(undefined);
    onLoad();
    navigator.geolocation.getCurrentPosition((pos) => {
      getClosestStop(pos.coords).then((data: any) => {
        setClosestStop(data);
      });
    });
  }, []);
  return (
    <>
      <StopSelect stops={stops} value={currentStop} onChange={selectStop} />
      <ClosestStop
        value={closestStop}
        onSelect={(stop) =>
          selectStop(stops.find((x) => x.id === stop.id) as any)
        }
      />
      <InfoCards messages={messages} />
    </>
  );
};

export default Home;
