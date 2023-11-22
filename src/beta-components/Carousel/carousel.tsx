import { Button } from '@mui/material';
import React, { cloneElement, useEffect, useState } from 'react';
import { useSettings } from '../../components/SettingsProvider';
import './styles.css';

export const CarouselItem = ({ children, width }: any) => {
  return <div className="carousel-item">{children}</div>;
};

export const Carousel = ({ children }: any) => {
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

  // Create a fake loader for the final step
  useEffect(() => {
    if (activeIndex === React.Children.count(children) - 1) {
      setTimeout(() => {
        settings.setValue('initialSetup', false);
      }, 3000);
    }
  }, [activeIndex]);

  return (
    <div className="Carousel">
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child, index) => {
          return cloneElement(child, { width: '100%' });
        })}
      </div>

      <div className="Carousel-footer">
        {activeIndex !== React.Children.count(children) - 1 && (
          <Button
            className="button"
            variant="contained"
            size="large"
            disabled={activeIndex === 1 && !settings.usersName}
            onClick={() => updateIndex(activeIndex + 1)}
          >
            Continue
          </Button>
        )}
        {activeIndex === 1 && (
          <Button
            className="button noBackground"
            variant="text"
            size="large"
            onClick={() => updateIndex(activeIndex + 1)}
          >
            No thanks
          </Button>
        )}
      </div>
    </div>
  );
};

export default Carousel;
