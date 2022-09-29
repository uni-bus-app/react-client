import styles from './styles.module.css';
import { MarkerF } from '@react-google-maps/api';
import blueDot from '../../assets/locationmarkericon.png';
import Anglesea from '../../assets/SVGs/test.svg';

const CustomMapMarker = (props: any) => {
  const { enabled, locations, selectedStop, onMarkerSelect } = props;
  if (!enabled) return <></>;
  return (
    <>
      {locations?.map((building: any, index: any) => {
        return (
          <MarkerF
            key={index}
            position={building.location}
            options={{
              icon: {
                url: Anglesea,
                scaledSize: new google.maps.Size(200, 200),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17.5, 50),
              },
            }}
            // onClick={() => {
            //   onMarkerSelect?.(stop);
            // }}
          />
        );
      })}
    </>
  );
};

export default CustomMapMarker;
