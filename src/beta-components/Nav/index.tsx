import { IconButton } from '@mui/material';
import { ReactComponent as Map } from '../../assets/SVGs/map.svg';
import { ReactComponent as Saved } from '../../assets/SVGs/bookmark.svg';
import { ReactComponent as Menu } from '../../assets/SVGs/menu.svg';
import { ReactComponent as Notification } from '../../assets/SVGs/notification.svg';
import { ReactComponent as Locate } from '../../assets/SVGs/locate.svg';
import { ReactComponent as Home } from '../../assets/SVGs/home.svg';
import classNames from 'classnames';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface NavProps {
  pathName: string;
  getLocation: () => void;
  showHeader: boolean;
}
const Nav = (props: NavProps) => {
  const { pathName, getLocation, showHeader } = props;

  const [translate, setTranslate] = useState(0);
  const [moving, setMovement] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    if (e.target.id) {
      navigate(`/${e.target.id}`, { replace: true });
    }
    if (e.target.parentElement.id) {
      navigate(`/${e.target.parentElement.id}`, { replace: true });
    }
  };

  useEffect(() => {
    pathName === '/home' && setTranslate(20);
    pathName === '/map' && setTranslate(140);
    pathName === '/notifications' && setTranslate(260);
    pathName === '/settings' && setTranslate(380);
    setMovement(true);
  }, [pathName]);

  return (
    <div className={styles.Nav}>
      <div className={styles.location}>
        <IconButton
          sx={{ height: '100%' }}
          onClick={(e) => {
            if (showHeader !== true) {
              navigate('/home', { replace: true });
              handleClick(e);
            }
            setTimeout(() => {
              getLocation();
            }, 700);
          }}
          id={'map'}
        >
          <Locate
            className={styles.icon}
            style={{ color: 'rgb(183, 183, 183)' }}
          />
        </IconButton>
      </div>

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
        <IconButton onClick={(e) => handleClick(e)}>
          <Home
            className={classNames(
              styles.icon,
              pathName === '/home' && styles.iconActive
            )}
            id={'home'}
          />
        </IconButton>

        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Map
            className={classNames(
              styles.icon,
              pathName === '/map' && styles.iconActive
            )}
            id={'map'}
          />
        </IconButton>

        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Notification
            className={classNames(
              styles.icon,
              pathName === '/notifications' && styles.iconActive
            )}
            id={'notifications'}
          />
        </IconButton>

        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Menu
            className={classNames(
              styles.icon,
              pathName === '/settings' && styles.iconActive
            )}
            id={'settings'}
            style={{}}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default Nav;
