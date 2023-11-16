import Reece from '../../../assets/reece.jpg';
import Button from '@mui/material/Button';
import Jools from '../../../assets/jools.jpg';
import './styles.scss';
import {
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';

const SettingsView = () => {
  const handleSendEmailClick = (subject: string) => {
    const subjectEncoded = encodeURIComponent(subject);
    const link = 'mailto:admin@unib.us?subject=' + subjectEncoded;
    window.open(link, 'emailWin');
  };

  /**
   * Settings to include
   *
   * Dark mode  override
   *
   * Opening page override
   *
   * Clear all cache
   *
   * Low Data Use Mode (no map, no images, no animations)
   *
   * Enable Location
   *
   *
   *
   */

  const initialUserSettings = {
    darkMode: false,
    openingPage: '/home',
    lowData: false,
    location: false,
  };
  const [userSettings, setUserSettings] = useState(initialUserSettings);

  const handleLowDataToggle = (event: any) => {
    const updatedSettings = {
      ...userSettings,
      lowData: event.target.checked,
    };
    setUserSettings(updatedSettings);
  };

  const handleOpeningPageChange = (event: SelectChangeEvent<string>) => {
    const updatedSettings = {
      ...userSettings,
      openingPage: event.target.value,
    };
    setUserSettings(updatedSettings);
  };

  return (
    <div className="page">
      <main className="pageStructure">
        <p className="pageHeader">Settings</p>

        <Paper className="card">
          <p className="quote">Don't need all the fancy extras?</p>
          <FormGroup>
            <FormControlLabel
              label="Low Data Mode"
              labelPlacement="start"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                margin: 0,
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
              }}
              control={
                <Switch
                  checked={userSettings.lowData}
                  onChange={handleLowDataToggle}
                  name="lowData"
                />
              }
            />
          </FormGroup>
        </Paper>

        <Paper className="card">
          <Select
            value={userSettings.openingPage}
            onChange={handleOpeningPageChange}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="/home">Dashboard</MenuItem>
            <MenuItem value="/map">Map</MenuItem>
          </Select>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">Help Section</p>
          <p className="quote">Need a bit of help with the site?</p>
          <Button
            variant="contained"
            onClick={() => handleSendEmailClick('Hey, I need some help!')}
          >
            Email Us
          </Button>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">About Us</p>
          <p className="quote">
            This has been a long running (since 2019) passion project for us, it
            was originally created as a way to help me get from home to my 9am
            lectures, I never imagined it would take off in the way it has.
          </p>
          <p className="quote">
            Run by (now) graduates for students, we are both aspiring computing
            department students set on making the web a better place.
          </p>
          <p className="name">Reece Birchmore</p>
          <img src={Reece} className="profile--image" alt="Reece"></img>
          <p className="profession">Front End Developer/ UI Designer</p>
          <p className="name">Jools Hattey</p>
          <img src={Jools} className="profile--image" alt="Jools"></img>
          <p className="profession">Full Stack Developer</p>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">How To Join</p>
          <p className="quote">
            Want to help us build and make this app even better?
          </p>
          <Button
            variant="contained"
            onClick={() =>
              handleSendEmailClick("Hey, I'd like to join the team!")
            }
          >
            Contact Us
          </Button>
        </Paper>
      </main>
    </div>
  );
};

export default SettingsView;

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('userSettingsDB', 1);

    request.onerror = (event) => {
      console.error('IndexedDB failed to open');
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db as IDBDatabase);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db) {
        const transaction = db.transaction(['settings'], 'readwrite');
        transaction.objectStore('settings');
      }
    };
  });
};
