import { PolylineF } from '@react-google-maps/api';

interface RoutePathProps {
  enabled?: boolean;
  path: any;
  darkModeEnabled?: boolean;
}

const RoutePath = (props: RoutePathProps) => {
  const { enabled, path, darkModeEnabled } = props;
  if (!enabled) return <></>;
  return (
    <PolylineF
      path={path}
      options={{
        strokeColor: darkModeEnabled ? '#03A9F4' : '#7B1FA2',
        strokeOpacity: 0.75,
      }}
    />
  );
};

export default RoutePath;
