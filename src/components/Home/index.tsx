import { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';
import { Stop } from '../../models';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router';
import InfoCards from '../InfoCards';

export interface HomeProps {
  stops: Stop[];
  currentStop: Stop | undefined;
  setCurrentStop: Dispatch<SetStateAction<Stop | undefined>>;
}

const Home = (props: HomeProps) => {
  const { stops, currentStop, setCurrentStop } = props;
  const navigate = useNavigate();
  const selectStop = (event: SelectChangeEvent<Stop>) => {
    navigate('/stopview');
    setCurrentStop(event.target.value as Stop);
  };
  return (
    <>
      <FormControl variant="standard" className={styles.stopSelector}>
        <InputLabel>Select a stop</InputLabel>
        <Select
          className={styles.stopSelectorSelect}
          value={currentStop}
          onChange={selectStop}
          label="Select a stop"
        >
          {stops.map((stop: Stop) => {
            return <MenuItem value={stop as any}>{stop.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <InfoCards />
    </>
  );
};

export default Home;
