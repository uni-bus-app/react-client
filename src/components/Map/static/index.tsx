import config from '../../../config';
import CircularProgress from '@mui/material/CircularProgress';

const StaticMap = ({ thing }: any) => {
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  const mapId = matches ? '8d48c9186a06dab' : 'f9e34791c612c2be';
  //   console.log(window.innerHeight, window.innerWidth);
  return (
    <>
      <img
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          zIndex: 10,
          transition: '0.2s',
          opacity: thing ? 0 : 1,
        }}
        src={`https://maps.googleapis.com/maps/api/staticmap?center=50.794236,-1.075&zoom=12&size=${Math.round(
          window.innerWidth / 2
        )}x${Math.round(window.innerHeight / 2)}&map_id=${mapId}&key=${
          config.mapsApiKey
        }&scale=2`}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          zIndex: 11,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    </>
  );
};

export default StaticMap;
