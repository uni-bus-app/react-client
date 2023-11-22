import { useEffect } from 'react';
import { useTimetable } from '../../hooks';
import { Stop } from '../../types';
import { Star } from '@mui/icons-material';
import { useSettings } from '../../components/SettingsProvider';
import NoTransfer from '@mui/icons-material/NoTransfer';
import dayjs from 'dayjs';
import './styles.scss';
import { Skeleton } from '@mui/material';

interface NextDeparturesCardProps {
  stops: Stop[] | undefined;
}

const NextDeparturesCard = (props: NextDeparturesCardProps) => {
  const { stops } = props;
  const settings = useSettings();
  const stop = stops?.find((stop) => stop.id === settings.favouriteStop);
  let { times, loadMore } = useTimetable(stop);

  useEffect(() => {
    if (times && (!times[0]?.time || !times[1]?.time)) {
      loadMore();
    }
  }, [times]);

  const isWeekend = () => {
    return !times && (dayjs().day() === 6 || dayjs().day() === 0);
  };

  return (
    <div className="routeCard">
      <div className="routeCard-nextBusTimeLogo">
        {stop ? (
          <>
            <Star fontSize="small" />
            <span>
              Next Departures from <b>{stop?.name}</b>{' '}
            </span>
          </>
        ) : (
          <Skeleton
            width={120}
            height={26}
            variant="rectangular"
            style={{ borderRadius: '0.25em' }}
          />
        )}
      </div>
      <>
        {!isWeekend() && times && times[0]?.time && (
          <div className="routeCard-nextTime">
            <div className="routeCard-nextTime-startLocation">
              {stop ? (
                stop?.name
              ) : (
                <Skeleton
                  width={120}
                  height={26}
                  variant="rectangular"
                  style={{ borderRadius: '0.25em' }}
                />
              )}
            </div>
            <div className="routeCard-nextTime-leavingTime">
              {times[0] ? (
                times[0]?.time
              ) : (
                <Skeleton
                  width={50}
                  height={26}
                  variant="rectangular"
                  style={{ borderRadius: '0.25em' }}
                />
              )}
            </div>
          </div>
        )}
        {!isWeekend() && times && times[1]?.time && (
          <div className="routeCard-nextTime">
            <div className="routeCard-nextTime-startLocation">
              {stop ? (
                stop?.name
              ) : (
                <Skeleton
                  width={120}
                  height={26}
                  variant="rectangular"
                  style={{ borderRadius: '0.25em' }}
                />
              )}
            </div>
            <div className="routeCard-nextTime-leavingTime">
              {times[1] ? (
                times[1]?.time
              ) : (
                <Skeleton
                  width={50}
                  height={26}
                  variant="rectangular"
                  style={{ borderRadius: '0.25em' }}
                />
              )}
            </div>
          </div>
        )}
        {times && !times[0]?.time && times && !times[1]?.time && (
          <div className="routeCard-nextTime-startLocation">
            No more departures today
          </div>
        )}
        {isWeekend() && (
          <div className="routeCard-noWeekendService">
            <NoTransfer fontSize="large" />
            Services are unavailable during weekends.
          </div>
        )}
      </>
    </div>
  );
};

export default NextDeparturesCard;
