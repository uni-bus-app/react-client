import { useEffect } from 'react';
import { useTimetable } from '../../hooks';
import { Time } from '../../types';
import './styles.scss';
import { StarBorder } from '@mui/icons-material';

const uniLibraryObject = {
  name: 'Camrbidge Road',
  id: '6TRxDIF8NDpofem64867',
  routeOrder: 1,
  location: {
    lat: 50.794438,
    lng: -1.097187,
  },
};

const NextDeparturesCard = () => {
  let { times } = useTimetable(uniLibraryObject, true);
  let time: Time | undefined;

  useEffect(() => {
    times !== undefined && (time = times[0]);
  }, [times]);

  return (
    <div className="routeCard">
      <div className="routeCard-nextBusTimeLogo">
        <StarBorder fontSize="small" />
        Next Departures
      </div>
      <>
        <div className="routeCard-nextTime">
          <div className="routeCard-nextTime-startLocation">
            University Library{' '}
            <span style={{ fontSize: '0.7rem' }}>departing at</span>
          </div>
          <div className="routeCard-nextTime-leavingTime">
            {times && times[0].time}
          </div>
        </div>
        <div className="routeCard-nextTime">
          <div className="routeCard-nextTime-startLocation">
            University Library{' '}
            <span style={{ fontSize: '0.7rem' }}>departing at</span>
          </div>
          <div className="routeCard-nextTime-leavingTime">
            {times && times[1].time}
          </div>
        </div>
      </>
    </div>
  );
};

export default NextDeparturesCard;
