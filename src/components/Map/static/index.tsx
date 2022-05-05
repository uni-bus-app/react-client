import config from '../../../config';

interface StaticMapProps {
  visible: boolean;
  children?: JSX.Element;
}

const StaticMap = (props: StaticMapProps) => {
  const { visible, children } = props;
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  const mapId = matches ? '8d48c9186a06dab' : 'f9e34791c612c2be';
  return (
    <>
      <img
        style={{
          position: 'absolute',
          width: '100%',
          height: '43%',
          top: 0,
          zIndex: 10,
          transition: '0.2s',
          opacity: visible ? 1 : 0,
        }}
        src={`https://maps.googleapis.com/maps/api/staticmap?center=50.794236,-1.075&zoom=12&size=${Math.round(
          window.innerWidth / 2
        )}x${Math.round((window.innerHeight * 0.43) / 2)}&map_id=${mapId}&key=${
          config.mapsApiKey
        }&scale=2`}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '43%',
          top: 0,
          zIndex: 11,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: '0.2s',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default StaticMap;
