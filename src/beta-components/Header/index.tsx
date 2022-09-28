import { IconButton, InputBase, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ReactComponent as Filter } from '../../assets/SVGs/filter.svg';
import { ReactComponent as Search } from '../../assets/SVGs/search.svg';
import BottomSheet from '../../components/BottomSheet';
import classNames from 'classnames';
import styles from './styles.module.css';

interface HeaderProps {
  showHeader: boolean;
}

const Header = (props: HeaderProps) => {
  const { showHeader } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.Header}>
      <div
        className={classNames(
          styles.filter,
          showHeader !== true ? styles.animateFilter : styles.animateFilterBack
        )}
      >
        <IconButton onClick={() => setOpen(!open)}>
          <Filter className={styles.icon} />
        </IconButton>
      </div>

      <div
        className={classNames(
          styles.search,
          showHeader !== true
            ? styles.animateSearchBar
            : styles.animateSearchBarBack
        )}
      >
        <IconButton>
          <Search className={styles.icon} style={{ color: 'black' }} />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '0.9em', color: 'black' }}
          placeholder="Search"
        />
      </div>

      <BottomSheet open={open} setOpen={setOpen}>
        <div className={styles.header}>
          <p className={styles.title}>Map Options</p>
        </div>
        <div className={styles.body}>
          <div></div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Header;
