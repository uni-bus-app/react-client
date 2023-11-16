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
import { useState } from 'react';

interface SettingsViewProps {
  setUserSettings: any;
  userSettings: any;
}

const SettingsView = (props: SettingsViewProps) => {
  const { setUserSettings, userSettings } = props;
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
        <Paper className="card">
          <p className="pageHeader">Settings</p>
          <p className="quote italics">
            Customise the look and feel of the app
          </p>
        </Paper>
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
                  checked={userSettings.lowData}
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
            <p className="Settings-helpText">
              Which page should load when you open this app?
            </p>
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
