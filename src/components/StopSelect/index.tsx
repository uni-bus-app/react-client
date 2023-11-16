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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
          MenuProps={MenuProps}
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
