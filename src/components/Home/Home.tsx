import { Dispatch, SetStateAction } from 'react';
import styles from './Home.module.css';
import { Stop } from '../../models/stop';

export interface HomeProps {
  onStopSelected: Dispatch<SetStateAction<Stop | undefined>>;
  currentStop: Stop | undefined;
}

const Home = (props: HomeProps) => {
  return <></>;
};

export default Home;
