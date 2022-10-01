import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';
import {
  GoogleMap,
  LoadScriptProps,
  Marker,
  MarkerF,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { getRoutePath, getStops } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import { mapStylesDark, mapStylesLight } from './styles';
import styles from './styles.module.css';
import { getBounds, getLocation, moveLogo } from './utils';
import locationMarkerIcon from '../../assets/locationmarkericon.png';
import CustomMapMarker from '../../beta-components/MapMarker';
import { buildings as customMapLocations } from '../../assets/data/buildingLocations';

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
  zoom: 13,
  center: { lat: 50.794236, lng: -1.075 },
};

interface MapProps {
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  currentStop?: Stop;
  logoContainer?: RefObject<HTMLDivElement>;
  userLocation?: any;
  width: string;
  height: string;
  stopDistanceData?: any;
  setStopDistanceData?: any;
}

const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    currentStop,
    logoContainer,
    userLocation,
    width,
    height,
    stopDistanceData,
    setStopDistanceData,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();
  const [stops, setStops] = useState<Stop[]>();

  useEffect(() => {
    console.log(userLocation, 'update');
    if (map) {
      map?.fitBounds(getBounds(userLocation), 20);
    }
  }, [userLocation]);

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);

  useEffect(() => {
    if (map && currentStop) {
      const pos = new google.maps.LatLng(
        currentStop.location.lat,
        currentStop.location.lng
      );
      map.setZoom(13);
      window.setTimeout(() => {
        map.fitBounds(getBounds(pos), {
          top:
            Number(
              getComputedStyle(document.documentElement)
                .getPropertyValue('--sat')
                .replace('px', '')
            ) + 5,
          left: 5,
          right: 5,
          bottom: 5,
        });
      }, 100);
    }
  }, [currentStop]);
  // map.panToBounds()

  const myLocale = [{ lat: 50.8297216, lng: -1.097728 }];

  const googleMapsLibraries: LoadScriptProps['libraries'] = ['places'];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['63b6f095713871bd'],
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    console.log('LOADED');
  }, [isLoaded]);

  const theme = useTheme();
  const renderMap = () => {
    const webglOverlayView = new google.maps.WebGLOverlayView();
    const onLoad = (mapInstance: google.maps.Map) => {
      // setMap(mapInstance);
      webglOverlayView.setMap(mapInstance);
      places(mapInstance);
      // moveLogo(mapInstance, logoContainer);
    };

    // Other closest stop work
    const getLocationData = () => {
      if (stopDistanceData !== null) {
        return;
      }
      console.log(true);
      var service = new google.maps.DistanceMatrixService();
      stops !== undefined &&
        service.getDistanceMatrix(
          {
            origins: myLocale,
            destinations: stops.map((a) => a.location),
            travelMode: google.maps.TravelMode.WALKING,
          },
          callback
        );

      function callback(response: any, status: any) {
        console.log(response);
        setStopDistanceData(response);
      }
    };
    getLocationData();
    console.log(stopDistanceData);

    // Places
    const places = (map: any) => {
      var request = {
        query: 'Museum of Contemporary Art Australia',
        fields: ['name', 'geometry'],
      };

      var service = new google.maps.places.PlacesService(map);

      service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
        }
      });
    };

    // End places

    // End other closest stop work

    // // Closest stop work
    // const findClosestStop = () => {
    //   var distances = [];
    //   for (let i = 0; i < markers.length; i++) {
    //     var d = google.maps.geometry.spherical.computeDistanceBetween(
    //       markers[i],
    //       myLocale
    //     );
    //     distances[i] = {
    //       distance: d,
    //       lat: markers[i].lat,
    //       lng: markers[i].lng,
    //     };
    //   }

    //   const closestStop = distances.reduce(function (prev, curr) {
    //     return prev.distance < curr.distance ? prev : curr;
    //   });
    //   console.log(closestStop);
    // };
    // // End closest stop work

    const onUnmount = () => {
      setMap(undefined);
    };

    return (
      <>
        <GoogleMap
          mapContainerStyle={{
            width: width,
            height: height,
            position: 'absolute',
            top: '0',
            left: '0',
            borderRadius: '12px',
          }}
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <RoutePath
            enabled={routeOverlayEnabled}
            path={routeOverlay}
            darkModeEnabled={darkModeEnabled}
          />
          <StopMarkers
            enabled={stopMarkersEnabled}
            stops={stops}
            darkModeEnabled={darkModeEnabled}
            selectedStop={currentStop}
            onMarkerSelect={onMarkerSelect}
          />
          {/* <CustomMapMarker
            enabled={stopMarkersEnabled}
            locations={customMapLocations}
          /> */}
        </GoogleMap>
        {userLocation && (
          <Marker
            position={userLocation}
            options={{
              icon: {
                url: locationMarkerIcon,
                scaledSize: new google.maps.Size(35, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17.5, 50),
              },
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            // height: '3em',
            width: '100%',
          }}
          className={styles.statusBarContainer}
        >
          <div
            style={{
              // position: 'absolute',
              // top: 0,
              opacity: theme.palette.mode === 'dark' ? 0 : undefined,
            }}
            className={styles.statusBar}
          />
          <div className={styles.statusBarBlur} />
        </div>

        {/* <Fab
          size="small"
          style={{
            position: 'absolute',
            right: '1em',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          className={styles.locationButton}
          onClick={getLocationData}
        >
          <NearMeOutlined />
        </Fab> */}
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
