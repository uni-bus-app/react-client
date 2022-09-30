import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ReactComponent as Shop } from '../../assets/SVGs/shopping.svg';
import { useTimetable } from '../../hooks';
import BusAlert from '@mui/icons-material/BusAlert';
import RouteSwitchView from '../RouteSwitchView';
import Map from '../../components/Map';
import './styles.scss';

const uniLibraryObject = {
  name: 'Camrbidge Road',
  id: '6TRxDIF8NDpofem64867',
  routeOrder: 1,
  location: {
    lat: 50.794438,
    lng: -1.097187,
  },
};

const dummyToDeleteArray = [
  'Lidl',
  'Crown Place',
  'Tesco',
  'Lidl',
  'Crown Place',
  'Tesco',
];

const Favourites = (props: any) => {
  return (
    <div className="Favourites-item">
      <div className="Favourites-item-icon">
        <Shop className="icon" />
      </div>
      <div className="Favourites-item-destination">{props.name}</div>
    </div>
  );
};

const HomepageView = () => {
  const [showRouteSelector, setRouteSelectorVisibility] = useState(false);
  const navigate = useNavigate();
  let { times, loadMore } = useTimetable(uniLibraryObject);

  return (
    <>
      {showRouteSelector && (
        <RouteSwitchView
          setRouteSelectorVisibility={setRouteSelectorVisibility}
          showRouteSelector={showRouteSelector}
        />
      )}
      <div className="HomePageView">
        <div className="pageStructure">
          <div className="routeCard">
            <div className="routeCard-nextBusTimeLogo">Next Departures</div>
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
          </div>

          <div style={{ width: '100%' }}>
            <div
              className="mapCard"
              onClick={() => navigate('/map', { replace: true })}
            >
              <span className="mapCard-cover" />
              <Map
                stopMarkersEnabled={true}
                routeOverlayEnabled={true}
                width={'100%'}
                height={'100%'}
              />
              <div className="mapCard-routeNumberOverlay">U1 Route</div>
              <div className="mapCard-actions">
                <div className="mapCard-actions-busesAvailable">
                  <BusAlert />2 Buses available
                </div>
                <button
                  className="white button"
                  onClick={() => console.log(true)}
                >
                  Tap to Track
                </button>
              </div>
            </div>
            <Button
              variant="contained"
              className="indigo button"
              onClick={() => {
                console.log(false);
                setRouteSelectorVisibility(true);
              }}
            >
              Switch Route
            </Button>
          </div>
          <div className="Favourites">
            {dummyToDeleteArray.map((fav) => (
              <Favourites name={fav} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageView;
