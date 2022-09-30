import { Button } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import { ReactComponent as Close } from '../../assets/SVGs/close.svg';
import Paper from '@mui/material/Paper';
import BusIcon from '../../assets/bus-icon.png';
import './styles.scss';

const RouteSwitchView = (props: any) => {
  const { showRouteSelector, setRouteSelectorVisibility } = props;
  const [selectedRoute, setSelectedRoute] = useState('u1');

  const handleSwitchRoutes = (route: any) => {
    setSelectedRoute(route);
  };

  const handleConfirm = () => {
    setRouteSelectorVisibility(!showRouteSelector);
  };

  return (
    <div className="RouteSwitchViewPage">
      <div className="pageStructure">
        <div className="header">
          <Close className="icon" onClick={() => console.log(true)} />
        </div>
        <div className="Title">
          <div className="Title-header">Select Your Route</div>
          <p className="Title-description">
            Selecting the route will change the stops you can see and access,
          </p>
          <p className="Title-description" style={{ fontSize: '0.7rem' }}>
            Note: You can change this at any time
          </p>
        </div>

        <div className="Routes">
          <div className="Routes-list">
            <div className="Routes-option">
              <div
                className={classNames(
                  'Routes-option-iconBackground',
                  selectedRoute !== 'u1' && 'inactive',
                  selectedRoute !== 'u1' && 'inactive-iconBackground'
                )}
              >
                <img
                  src={BusIcon}
                  className={classNames(
                    'Routes-option-iconBackground-img',
                    selectedRoute !== 'u1' && 'inactive',
                    selectedRoute !== 'u1' && 'inactive-iconBackground'
                  )}
                  onClick={() => handleSwitchRoutes('u1')}
                />
              </div>
              <p className="Routes-option-name">U1 Route</p>
            </div>
            <div className="Routes-option">
              <div
                className={classNames(
                  'Routes-option-iconBackground',
                  selectedRoute !== 'u2' && 'inactive',
                  selectedRoute !== 'u2' && 'inactive-iconBackground'
                )}
              >
                <img
                  src={BusIcon}
                  className={classNames(
                    'Routes-option-iconBackground-img',
                    selectedRoute !== 'u2' && 'inactive',
                    selectedRoute !== 'u2' && 'inactive-iconBackground'
                  )}
                  onClick={() => handleSwitchRoutes('u2')}
                />
              </div>
              <p className="Routes-option-name">U2 Route</p>
            </div>
          </div>
          <div className="Routes-description">
            {selectedRoute === 'u2'
              ? 'Typically used for sports events, only accessible for people travelling to and from Langstone.'
              : 'The all encompassing U1 bus, runs a ring around Southsea, available for any students to use.'}
          </div>
        </div>
        <br />
        <Button
          variant="contained"
          className="indigo button"
          onClick={() => {
            handleConfirm();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RouteSwitchView;
