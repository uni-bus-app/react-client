import { Button } from '@mui/material';
import { useState } from 'react';
import RouteSwitchView from '../RouteSwitchView';
import NextDeparturesCard from '../../NextDeparturesCard';
import MiniMap from '../../MiniMap';
import './styles.scss';

const HomepageView = () => {
  const [showRouteSelector, setRouteSelectorVisibility] = useState(false);

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
          <NextDeparturesCard />
          <MiniMap />
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
      </div>
    </>
  );
};

export default HomepageView;
