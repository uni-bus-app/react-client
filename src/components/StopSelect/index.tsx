import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Stop } from '../../types';
import styles from './styles.module.css';

interface StopSelectProps {
  stops: Stop[];
  value: Stop | undefined;
  onChange: (stop: Stop) => void;
}

const StopSelect = (props: StopSelectProps) => {
  const { stops, value, onChange } = props;
  const selectStop = (event: SelectChangeEvent<Stop>) => {
    const newStop = event.target.value as Stop;
    onChange(newStop);
  };
  return (
    <div className={styles.container}>
      <FormControl
        variant="standard"
        sx={{ m: 1 }}
        className={styles.stopSelector}
      >
        <InputLabel>Select a Stop</InputLabel>
        <Select
          className={styles.stopSelectorSelect}
          value={(value || '') as any}
          onChange={selectStop}
          onClose={() =>
            window.setTimeout(() => {
              (document.activeElement as any).blur();
            }, 0)
          }
          MenuProps={{
            sx: {
              transformStyle: 'preserve-3d',
            },
            className: styles.thing,
            PaperProps: {
              sx: {
                backgroundImage: 'none',
                maxHeight: '256px',
                transformStyle: 'preserve-3d',
              },
              className: styles.thing,
            },
          }}
        >
          {stops.map((stop, index) => {
            return (
              <MenuItem value={stop as any} key={index}>
                {stop.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default StopSelect;
