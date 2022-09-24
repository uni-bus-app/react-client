import { Button } from '@mui/material';
import React, { cloneElement, useEffect, useState } from 'react';
import { getLocation } from '../Map/utils';
import './styles.css';

export const CarouselItem = ({ children, width }: any) => {
  return <div className="carousel-item">{children}</div>;
};

export const Carousel = ({ children }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const updateIndex = (newIndex: any) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

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
        <Button
          className="button"
          variant="contained"
          size="large"
          onClick={() => {
            if (activeIndex === 0) {
              updateIndex(1);
            } else {
              getLocation();
            }
          }}
        >
          Continue
        </Button>
        {activeIndex === 1 && <p className="smallText">No Thanks</p>}
      </div>
    </div>
  );
};

export default Carousel;
