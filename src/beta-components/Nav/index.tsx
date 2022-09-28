import { IconButton } from '@mui/material';
import { ReactComponent as Map } from '../../assets/SVGs/map.svg';
import { ReactComponent as Saved } from '../../assets/SVGs/bookmark.svg';
import { ReactComponent as Menu } from '../../assets/SVGs/menu.svg';
import { ReactComponent as Notification } from '../../assets/SVGs/notification.svg';
import { ReactComponent as Locate } from '../../assets/SVGs/locate.svg';
import classNames from 'classnames';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface NavProps {
  getLocation: () => void;
  showHeader: boolean;
}

const Nav = (props: NavProps) => {
  const { getLocation, showHeader } = props;
  const navigate = useNavigate();

  const [selected, setSelected] = useState('home');
  const [translate, setTranslate] = useState(0);
  const [moving, setMovement] = useState(false);

  const handleClick = (e: any) => {
    if (e.target.id) {
      setSelected(e.target.id);
      navigate(`/${e.target.id}`);
    }
    if (e.target.parentElement.id) {
      setSelected(e.target.parentElement.id);
      navigate(`/${e.target.parentElement.id}`);
    }
  };

  useEffect(() => {
    selected === 'home' && setTranslate(19);
    selected === 'saved' && setTranslate(140);
    selected === 'notifications' && setTranslate(260);
    selected === 'menu' && setTranslate(379);
    setMovement(true);
  }, [selected]);

  return (
    <div className={styles.Nav}>
      <div className={styles.location}>
        <IconButton
          sx={{ height: '100%' }}
          onClick={() => {
            if (showHeader !== true) {
              navigate('/home');
              setSelected('home');
            }
            setTimeout(() => {
              getLocation();
            }, 700);
          }}
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
            moving == true && styles.animatedPill
          )}
          style={{ transform: `translateX(${translate}%)` }}
          onAnimationEnd={() => setMovement(false)}
        />

        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Map
            className={classNames(
              styles.icon,
              selected === 'home' && styles.iconActive
            )}
            id={'home'}
          />
        </IconButton>
        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Saved
            id={'saved'}
            className={classNames(
              styles.icon,
              selected === 'saved' && styles.iconActive
            )}
          />
        </IconButton>
        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Notification
            className={classNames(
              styles.icon,
              selected === 'notifications' && styles.iconActive
            )}
            id={'notifications'}
          />
        </IconButton>

        <IconButton sx={{ height: '100%' }} onClick={(e) => handleClick(e)}>
          <Menu
            className={classNames(
              styles.icon,
              selected === 'menu' && styles.iconActive
            )}
            id={'menu'}
            style={{}}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default Nav;
