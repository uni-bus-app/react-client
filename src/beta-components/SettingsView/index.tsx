import Reece from '../../assets/reece.jpg';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Jools from '../../assets/jools.jpg';
import './styles.scss';
import { Paper } from '@mui/material';

const SettingsView = () => {
  const handleSendEmailClick = (subject: string) => {
    const subjectEncoded = encodeURIComponent(subject);
    const link = 'mailto:admin@unib.us?subject=' + subjectEncoded;
    window.open(link, 'emailWin');
  };

  return (
    <div className="page">
      <main className="pageStructure">
        <p className="pageHeader">Settings</p>

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
          <p className="pageHeader">Our Mission</p>
          <p className="quote">
            Transforming travel for Portsmouth University, helping the students
            connect and travel in a safer, more modern manner.
          </p>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">About Us</p>
          <p className="quote">
            Run by students for students, we are both aspiring computing
            department students set on making the web a better place.
          </p>
          <p className="name">Reece Birchmore</p>
          <img src={Reece} className="profile--image"></img>
          <p className="profession">Front End Developer</p>
          <p className="name">Jools Hattey</p>
          <img src={Jools} className="profile--image"></img>
          <p className="profession">Front End Developer</p>
        </Paper>

        <Paper className="card">
          <p className="pageHeader">How To Join</p>
          <p className="quote">Fancy looking to get your face put on here?</p>
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
