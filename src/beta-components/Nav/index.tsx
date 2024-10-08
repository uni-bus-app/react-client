import { IconButton, useMediaQuery } from '@mui/material';
import { ReactComponent as Map } from '../../assets/SVGs/map.svg';
import { ReactComponent as Menu } from '../../assets/SVGs/menu.svg';
import { ReactComponent as Locate } from '../../assets/SVGs/locate.svg';
import { ReactComponent as Home } from '../../assets/SVGs/home.svg';
import classNames from 'classnames';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tune } from '@mui/icons-material';

import styles from './styles.module.css';
import { useSettings } from '../../components/SettingsProvider';

interface NavProps {
  pathName: string;
  getLocation: () => void;
  setNextCardOpen: Dispatch<SetStateAction<boolean>>;
  setPersistActive: Dispatch<SetStateAction<boolean>>;
  persistActive: boolean;
}
const Nav = (props: NavProps) => {
  const {
    pathName,
    getLocation,
    persistActive,
    setNextCardOpen,
    setPersistActive,
  } = props;

  const [showLocationButton, setShowLocationButton] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [moving, setMovement] = useState(false);
  const navigate = useNavigate();
  const settings = useSettings();

  const handleClick = (e: any) => {
    if (e.target.id) {
      navigate(`/${e.target.id}`, { replace: true });
    }
    if (e.target.parentElement.id) {
      navigate(`/${e.target.parentElement.id}`, { replace: true });
    }
  };

  useEffect(() => {
    if (pathName !== '/map') {
      setPersistActive(false); // Turn off location persistence if moving around the app
      setNextCardOpen(false); // Make sure the cards are closed if we move away from the map
    }
    pathName === '/home' && setTranslate(25);
    pathName === '/map' && setTranslate(150);
    pathName === '/settings' && setTranslate(275);
    setMovement(true);
  }, [pathName]);

  const buttonClasses = `${styles.icon} ${persistActive ? styles.pulse : ''}`;

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          setShowLocationButton(true);
        }
      });
    }
  }, []);
  const isBigDisplay = useMediaQuery('(min-width:600px)');

  return (
    <div className={styles.Nav}>
      {/* {pathName === '/map' && (
        <div className={styles.filter}>
          <IconButton onClick={() => console.log('filters')}>
            <Tune className={styles.icon} />
          </IconButton>
        </div>
      )} */}

      {!isBigDisplay && (
        <div className={styles.menuItems}>
          <div
            className={classNames(
              styles.selectedPill,
              settings.rainbowNav && pathName === '/map' && styles.bluePill,
              settings.rainbowNav &&
                pathName === '/settings' &&
                styles.greenPill,
              moving === true && styles.animatedPill
            )}
            style={{
              transform: `translateX(${translate}%)`,
            }}
            onAnimationEnd={() => setMovement(false)}
          />

          {/**
           * Sites navigation
           *
           */}
          <IconButton onClick={(e) => handleClick(e)} id={'home'}>
            <Home
              className={classNames(
                styles.icon,
                pathName === '/home' && styles.iconActive
              )}
              id={'home'}
            />
          </IconButton>

          <IconButton
            sx={{ height: '100%' }}
            onClick={(e) => handleClick(e)}
            id={'map'}
          >
            <Map
              className={classNames(
                styles.icon,
                pathName === '/map' && styles.iconActive
              )}
              id={'map'}
            />
          </IconButton>

          <IconButton
            sx={{ height: '100%' }}
            onClick={(e) => handleClick(e)}
            id={'settings'}
          >
            <Menu
              className={classNames(
                styles.icon,
                pathName === '/settings' && styles.iconActive
              )}
              id={'settings'}
            />
          </IconButton>
        </div>
      )}

      {showLocationButton && pathName === '/map' && (
        <div className={styles.location}>
          <IconButton
            sx={{ height: '100%' }}
            onClick={(e) => {
              if (!persistActive) {
                navigate('/map', { replace: true });
                handleClick(e);
                setPersistActive(true);
                setNextCardOpen(false);
                setTimeout(() => {
                  getLocation();
                }, 700);
              } else {
                setPersistActive(false);
              }
            }}
            id={'map'}
          >
            <Locate
              className={buttonClasses}
              style={{
                color: persistActive
                  ? 'rgba(255,255,255,0.87)'
                  : 'rgba(255,255,255,0.2)',
              }}
            />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Nav;
