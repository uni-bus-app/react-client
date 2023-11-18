import { useEffect, useState } from 'react';
import BusIcon from '../../assets/bus-icon.png';
import './styles.scss';
import { CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="LoadingScreen ">
      <img src={BusIcon} alt="Bus Icon" className="LoadingScreen-icon" />

      <CircularProgress className="LoadingScreen-loadingSpinner" />

      {showText && (
        <p className="LoadingScreen-delayedLoading">We're still here!</p>
      )}
    </div>
  );
};

export default LoadingScreen;
