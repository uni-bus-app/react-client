import { Card, Paper } from '@mui/material';
import './style.scss';

const WhatsNewCard = () => {
  return (
    <>
      <Paper className="WhatsNew-card">
        <p className="WhatsNew-title">Whats New?</p>
        <p className="WhatsNew-body">
          This has been a pretty major update, aside from the usual timetable
          updates we've been quietly performing over the years, we now have a
          new major redesign, here's a list of the biggest changes:
        </p>
        <ul className="WhatsNew-list">
          <li>
            Major redesign across the board, we wanted to make the app feel more
            official and fluid
          </li>
          <li>
            Live tracking for the buses - you can now see them moving around
            portsmouth and get more accurate times
          </li>
          <li>
            Set a favourite stop, see that stops info at the top of this
            dashboard
          </li>
          <li>Toggle for low data mode</li>
          <li>
            Automatic downloading of times, if you run out of data while and out
            about, the app will still work
          </li>
          <li>
            We're officially opening the doors for student developers, jump over
            to the settings tab and shoot us an email - it would look great on
            your CV
          </li>
        </ul>
      </Paper>
    </>
  );
};

export default WhatsNewCard;
