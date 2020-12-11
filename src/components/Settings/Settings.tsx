import { Switch } from '@material-ui/core';
import { ChangeEvent } from 'react';
import styles from './Settings.module.css';

interface SettingsProps {
  darkMode: boolean;
  onDarkModeChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  autoDarkMode: boolean;
  onAutoDarkModeChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

const Settings = (props: SettingsProps) => {
  const {
    darkMode,
    onDarkModeChange,
    autoDarkMode,
    onAutoDarkModeChange: onAutoDarkMode,
  } = props;
  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Settings</div>
      </div>
      Dark Mode
      <Switch
        checked={darkMode}
        onChange={onDarkModeChange}
        disabled={autoDarkMode}
      />
      Auto Dark Mode
      <Switch checked={autoDarkMode} onChange={onAutoDarkMode} />
    </>
  );
};

export default Settings;
