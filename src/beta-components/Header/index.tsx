import { IconButton, InputBase } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as Filter } from '../../assets/SVGs/filter.svg';
import { ReactComponent as Search } from '../../assets/SVGs/search.svg';
import BottomSheet from '../../components/BottomSheet';
import classNames from 'classnames';
import './styles.scss';

interface HeaderProps {
  showHeader: boolean;
}

const Header = (props: HeaderProps) => {
  const { showHeader } = props;
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(false);

  return (
    <div className="Header">
      <div
        className={classNames(
          'search',
          test === true && 'expandSearch',
          showHeader !== true ? 'animateSearchBar' : 'animateSearchBarBack'
        )}
      >
        <IconButton>
          <Search className="icon" style={{ color: 'black' }} />
        </IconButton>
        <InputBase
          onClick={() => setTest(!test)}
          sx={{ ml: 1, flex: 1, fontSize: '0.9em', color: 'black' }}
          placeholder="Search"
        />
      </div>

      <div
        className={classNames(
          'filter',
          showHeader !== true || test === true
            ? 'animateFilter'
            : 'animateFilterBack'
        )}
      >
        <IconButton onClick={() => setOpen(!open)}>
          <Filter className="icon" />
        </IconButton>
      </div>

      <BottomSheet open={open} setOpen={setOpen}>
        <div className="header">
          <p className="title">Map Options</p>
        </div>
        <div className="body">
          <div></div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Header;
