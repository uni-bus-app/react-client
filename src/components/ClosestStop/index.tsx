import DirectionsWalk from '@mui/icons-material/DirectionsWalk';
import NearMe from '@mui/icons-material/NearMe';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import { useEffect, useState } from 'react';
import { getClosestStop } from '../../api/APIUtils';
import { Stop } from '../../types';
import styles from './styles.module.css';

interface ClosestStopProps {
  value: any;
  onSelect: (value: Stop) => void;
}

const ClosestStop = (props: ClosestStopProps) => {
  const { onSelect } = props;
  const [value, setValue] = useState<any>();
  useEffect(() => {
    fetchAndActivate(getRemoteConfig()).then(() => {
      const enabled = getBoolean(getRemoteConfig(), 'closest_stop_enabled');
      console.log(enabled);
      if (enabled) {
        navigator.geolocation.getCurrentPosition((pos) => {
          getClosestStop(pos.coords).then((data: any) => {
            setValue(data);
          });
        });
      }
    });
  }, []);
  return (
    value?.stop && (
      <Card
        className={styles.container}
        sx={{ boxShadow: 7 }}
        onClick={() => onSelect(value.stop)}
      >
        <CardContent className={styles.content}>
          <NearMe className={styles.icon} />
          <div className={styles.info}>
            <div>{value.stop.name}</div>
            <div className={styles.distance}>
              {value.distance.distance.text}
              <DirectionsWalk />
              {value.distance.duration.text}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default ClosestStop;
