import { useEffect } from 'react';
import { useTimetable } from '../../hooks';
import { Stop, Time } from '../../types';
import './styles.scss';
import { StarBorder } from '@mui/icons-material';
import { useSettings } from '../../components/SettingsProvider';
import { Divider } from '@mui/material';

const uniLibraryObject = {
  name: 'Camrbidge Road',
  id: '6TRxDIF8NDpofem64867',
  routeOrder: 1,
  location: {
    lat: 50.794438,
    lng: -1.097187,
  },
};

interface NextDeparturesCardProps {
  stops: Stop[] | undefined;
}

const NextDeparturesCard = (props: NextDeparturesCardProps) => {
  const { stops } = props;
  const settings = useSettings();
  const stop =
    stops?.find((stop) => stop.id === settings.favouriteStop) ||
    uniLibraryObject;
  let { times, loadMore } = useTimetable(stop);

  useEffect(() => {
    if (times && (!times[0]?.time || !times[1]?.time)) {
      loadMore();
      console.log(times);
    }
  }, [times]);

  return (
    <div className="routeCard">
      <div className="routeCard-nextBusTimeLogo">
        <StarBorder fontSize="small" />
        Next Departures
      </div>
      <>
        {times && times[0]?.time && (
          <div className="routeCard-nextTime">
            <div className="routeCard-nextTime-startLocation">
              {stop?.name}{' '}
            </div>
            <div className="routeCard-nextTime-leavingTime">
              {times[0]?.time}
            </div>
          </div>
        )}
        {times && times[1]?.time && (
          <div className="routeCard-nextTime">
            <div className="routeCard-nextTime-startLocation">
              {stop?.name}{' '}
            </div>
            <div className="routeCard-nextTime-leavingTime">
              {times[1]?.time}
            </div>
          </div>
        )}
        {times && !times[0]?.time && times && !times[1]?.time && (
          <div className="routeCard-nextTime-startLocation">
            No more departures today
          </div>
        )}
      </>
    </div>
  );
};

export default NextDeparturesCard;
