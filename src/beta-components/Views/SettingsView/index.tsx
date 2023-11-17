import Reece from '../../../assets/reece.jpg';
import Button from '@mui/material/Button';
import Jools from '../../../assets/jools.jpg';
import './styles.scss';
import {
  FormGroup,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useSettings } from '../../../components/SettingsProvider';
import { SettingsItemsNames } from '../../../components/SettingsProvider/types';
import { Stop } from '../../../types';

interface SettingsViewProps {
  stops: Stop[] | undefined;
}

const SettingsView = (props: SettingsViewProps) => {
  const { stops } = props;
  const settings = useSettings();

  const handleSendEmailClick = (subject: string) => {
    const subjectEncoded = encodeURIComponent(subject);
    const link = 'mailto:admin@unib.us?subject=' + subjectEncoded;
    window.open(link, 'emailWin');
  };

  const handleFavouriteStopChange = (event: SelectChangeEvent<string>) => {
    settings.setValue(SettingsItemsNames.favouriteStop, event.target.value);
  };

  return (
    <div className="page">
      <main className="pageStructure">
        <Paper className="card">
          <h3>Set your favourite stop</h3>
          <Select
            value={settings?.favouriteStop || ''}
            onChange={handleFavouriteStopChange}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            {stops &&
              stops.map((stop) => (
                <MenuItem value={stop?.id}>{stop?.name}</MenuItem>
              ))}
          </Select>
          <p className="Settings-settingInfo italics">
            Selecting a favourite stop will display the stops times on your
            dashboard for quicker viewing.
          </p>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">
            Got a feature in mind or want to get involved?
          </p>
          <p className="quote">
            Let us know what you're thinking or if you've stumbled across a bug,
            or, if you just want to help us make this app even better!
          </p>
          <Button
            variant="contained"
            onClick={() => handleSendEmailClick('Hey, I have a request!')}
          >
            Get in touch
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
