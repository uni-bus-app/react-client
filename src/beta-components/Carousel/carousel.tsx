import { Button } from '@mui/material';
import React, { cloneElement, useState } from 'react';
import { useSettings } from '../../components/SettingsProvider';
import { SettingsItemsNames } from '../../components/SettingsProvider/types';
import './styles.css';

export const CarouselItem = ({ children, width }: any) => {
  return <div className="carousel-item">{children}</div>;
};

export const Carousel = ({ children, setSplashScreen }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const settings = useSettings();

  const updateIndex = (newIndex: any) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        settings.setValue(SettingsItemsNames.UseLocation, true);
        updateIndex(activeIndex + 1);
        console.log(navigator.geolocation.getCurrentPosition);
      },
      (e) => {
        settings.setValue(SettingsItemsNames.UseLocation, false);
      }
    );
  };

  const settingsObjectSetup = (allow: boolean) => {
    // First page, move on
    if (allow === false || activeIndex === 0) {
      updateIndex(activeIndex + 1);
    }

    // Second page, get location
    if (activeIndex === 1) {
      allow === true
        ? getLocation()
        : settings.setValue(SettingsItemsNames.UseLocation, false);
    }
    // Second page, if they don't allow location, don't let them continue
    if (activeIndex === 1 && allow === false) {
      alert('You will not be able to use the app without location data');
      updateIndex(activeIndex);
    }

    // Final stage, close splash screen
    if (activeIndex === React.Children.count(children) - 1) {
      setSplashScreen(false);
    }
  };

  return (
    <div className="Carousel">
      <header>
        <span
          className="Carousel-header"
          onClick={() => updateIndex(React.Children.count(children))}
        >
          {/* {activeIndex !== React.Children.count(children) - 1 && 'SKIP SETUP'} */}
        </span>
      </header>
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child, index) => {
          return cloneElement(child, { width: '100%' });
        })}
      </div>

      <div className="Carousel-footer">
        <Button
          className="button"
          variant="contained"
          size="large"
          onClick={() => settingsObjectSetup(true)}
        >
          {activeIndex === 0 ||
          activeIndex === React.Children.count(children) - 1
            ? 'Continue'
            : 'Enable'}
        </Button>
        {activeIndex !== 0 &&
          activeIndex !== React.Children.count(children) - 1 && (
            <Button
              variant="text"
              className="smallText"
              sx={{ color: 'grey', fontStyle: 'none' }}
              onClick={() => {
                settingsObjectSetup(false);
              }}
            >
              No Thanks
            </Button>
          )}
      </div>
    </div>
  );
};

export default Carousel;
