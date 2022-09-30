import { PolylineF } from '@react-google-maps/api';
import styles from './styles.module.css';
import Universty from '../../../../assets/SVGs/university.svg';

interface RoutePathProps {
  enabled?: boolean;
  path: any;
  darkModeEnabled?: boolean;
}

const RoutePath = (props: RoutePathProps) => {
  const { enabled, path, darkModeEnabled } = props;

  if (!enabled) return <></>;

  return (
    <PolylineF
      path={path}
      options={{
        strokeColor: darkModeEnabled ? '#03A9F4' : '#7B1FA2',
        strokeOpacity: 0.75,
        clickable: true,
      }}
      onClick={(e) => console.log(e)}
    />
  );
};

export default RoutePath;
