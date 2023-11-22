import { Button } from '@mui/material';
import { useState } from 'react';
import RouteSwitchView from '../RouteSwitchView';
import NextDeparturesCard from '../../NextDeparturesCard';
import MiniMap from '../../MiniMap';
import './styles.scss';
import WhatsNewCard from '../../WhatsNewCard';
import { Stop } from '../../../types';
import GreetingMessage from '../../GreetingMessage';

interface HomepageViewProps {
  stops: Stop[] | undefined;
}

const HomepageView = (props: HomepageViewProps) => {
  const { stops } = props;
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
        <main className="pageStructure">
          <GreetingMessage />
          <NextDeparturesCard stops={stops} />
          <MiniMap />
          <WhatsNewCard />
          {/* <Button
            variant="contained"
            className="indigo button"
            onClick={() => {
              console.log(false);
              setRouteSelectorVisibility(true);
            }}
          >
            Switch Route
          </Button> */}
        </main>
      </div>
    </>
  );
};

export default HomepageView;
