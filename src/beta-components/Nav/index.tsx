import { IconButton } from '@mui/material';
import { ReactComponent as Map } from '../../assets/SVGs/map.svg';
import { ReactComponent as Menu } from '../../assets/SVGs/menu.svg';
import { ReactComponent as Locate } from '../../assets/SVGs/locate.svg';
import { ReactComponent as Home } from '../../assets/SVGs/home.svg';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Tune } from '@mui/icons-material';

import styles from './styles.module.css';

interface NavProps {
  pathName: string;
  getLocation: () => void;
}
const Nav = (props: NavProps) => {
  const { pathName, getLocation } = props;

  const [translate, setTranslate] = useState(0);
  const [moving, setMovement] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    console.log(e);
    if (e.target.id) {
      navigate(`/${e.target.id}`, { replace: true });
    }
    if (e.target.parentElement.id) {
      navigate(`/${e.target.parentElement.id}`, { replace: true });
    }
  };

  useEffect(() => {
    // Turn off location persistence if moving around the app
    if (pathName !== '/map') {
      setLocationActive(false);
    }
    pathName === '/home' && setTranslate(25);
    pathName === '/map' && setTranslate(150);
    pathName === '/notifications' && setTranslate(260);
    pathName === '/settings' && setTranslate(275);
    setMovement(true);
  }, [pathName]);

  const buttonClasses = `${styles.icon} ${locationActive ? styles.pulse : ''}`;

  return (
    <div className={styles.Nav}>
      {pathName === '/map' && (
        <div className={styles.filter}>
          <IconButton onClick={() => console.log('filters')}>
            <Tune className={styles.icon} />
          </IconButton>
        </div>
      )}

      <div className={styles.menuItems}>
        <div
          className={classNames(
            styles.selectedPill,
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

      {pathName === '/map' && (
        <div className={styles.location}>
          <IconButton
            sx={{ height: '100%' }}
            onClick={(e) => {
              if (!locationActive) {
                navigate('/map', { replace: true });
                handleClick(e);
                setLocationActive(true);
                setTimeout(() => {
                  getLocation();
                }, 700);
              } else {
                setLocationActive(false);
              }
            }}
            id={'map'}
          >
            <Locate
              className={buttonClasses}
              style={{
                color: locationActive
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
