import Reece from '../../../assets/reece.jpg';
import Button from '@mui/material/Button';
import Jools from '../../../assets/jools.jpg';
import './styles.scss';
import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSettings } from '../../../components/SettingsProvider';
import { SettingsItemsNames } from '../../../components/SettingsProvider/types';

const SettingsView = () => {
  const settings = useSettings();

  const [userSettings, setUserSettings] = useState<any>({
    darkMode: false,
    openingPage: '/map',
    lowData: false,
    location: false,
    favouriteStop: '',
  }); // BETA - Users settings

  // Set user settings on page load (visual purposes)
  useEffect(() => {
    setUserSettings({
      ...userSettings,
      lowData: settings.lowDataMode,
    });
  }, [settings]);

  const handleSendEmailClick = (subject: string) => {
    const subjectEncoded = encodeURIComponent(subject);
    const link = 'mailto:admin@unib.us?subject=' + subjectEncoded;
    window.open(link, 'emailWin');
  };

  const handleLowDataToggle = (event: any) => {
    settings.setValue(SettingsItemsNames.lowDataMode, event.target.checked);
  };

  const handleFavouriteStopChange = (event: SelectChangeEvent<string>) => {
    settings.setValue(SettingsItemsNames.favouriteStop, event.target.value);
  };

  return (
    <div className="page">
      <main className="pageStructure">
        <Paper className="card">
          <FormGroup>
            <p className="Settings-helpText">Not got much data?</p>
            <FormControlLabel
              label={
                <Box component="div" fontSize={14}>
                  Low Data Mode
                </Box>
              }
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
                  checked={settings.lowDataMode || false}
                  onChange={handleLowDataToggle}
                  name="lowData"
                  color="primary"
                />
              }
            />
            <p className="Settings-settingInfo italics">
              Enabling this will turn off the map/location tracking and present
              you with cached times.
            </p>
            <Divider />
            <p className="Settings-helpText">Which stop do you use the most?</p>
            <Select
              value={settings?.favouriteStop || ''}
              onChange={handleFavouriteStopChange}
              displayEmpty
              fullWidth
              variant="outlined"
            >
              <MenuItem value="/home">University Library</MenuItem>
              <MenuItem value="/map">Cambridge Road</MenuItem>
            </Select>
            <p className="Settings-settingInfo italics">
              Selecting a favourite stop will display the stops times on your
              dashboard for quicker viewing.
            </p>
          </FormGroup>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">Got a feature in mind?</p>
          <p className="quote">
            Let us know what you're thinking or if you've stumbled across a bug.
          </p>
          <Button
            variant="contained"
            onClick={() =>
              handleSendEmailClick('Hey, I have a bug/feature request!')
            }
          >
            Let Us Know
          </Button>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">Help Develop This App</p>
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

        <Paper className="card">
          <p className="pageHeader">About Us</p>
          <p className="quote">
            This has been a long running (since 2019) passion project for us, it
            was originally created as a way to help me get from home to my 9am
            lectures, I never imagined it would take off in the way it has.
          </p>
          <p className="quote">
            Run by (now) graduates for students, we are programmers set on
            making the web a better place.
          </p>
          <p className="name">Reece</p>
          <img src={Reece} className="profile--image" alt="Reece"></img>
          <p className="profession">Front End Developer / UI Designer</p>
          <p className="name">Jools</p>
          <img src={Jools} className="profile--image" alt="Jools"></img>
          <p className="profession">Full Stack Developer</p>
        </Paper>
      </main>
    </div>
  );
};

export default SettingsView;
