import { Switch, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';

interface SettingsProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Settings = (props: SettingsProps) => {
  const { open, setOpen } = props;
  return (
    <SwipeableDrawer
      anchor="bottom"
      disableSwipeToOpen
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      PaperProps={{ className: styles.container }}
    >
      <Typography>Settings</Typography>
      <div className={styles.settingsItem}>
        <div>Use System Theme</div>
        <Switch />
      </div>
    </SwipeableDrawer>
  );
};

export default Settings;
