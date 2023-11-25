import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import styles from './styles.module.css';
import { getBounds, getLocation, moveLogo } from './utils';
import NextTimeCard from '../NextTimeCard';
import BottomSheet from '../BottomSheet';
import locationMarkerIcon from '../../assets/locationmarkericon.png';
import CurrentLocation from './components/CurrentLocation';
import LiveVehicleLocation from './components/LiveVehicleLocation';

interface MapProps {
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  currentStop?: Stop;
  logoContainer?: RefObject<HTMLDivElement>;
  userLocation?: any;
  setTimesSheetOpen: Dispatch<SetStateAction<boolean>>;
  nextCardOpen: boolean; // ISSUE 65
  setNextCardOpen: Dispatch<SetStateAction<boolean>>; // ISSUE 65
  stops?: Stop[];
  routeOverlay?: LatLng[];
  persistActive: boolean; // ISSUE 74
  setPersistActive: Dispatch<SetStateAction<boolean>>; // ISSUE 74
  setWalkingTime: any; // ISSUE 74
  walkingTime: number; // ISSUE 74
}

const bounds = {
  north: 50.878276,
  south: 50.74024,
  west: -1.150673,
  east: -0.974604,
};

const mapRestriction: google.maps.MapRestriction = {
  latLngBounds: {
    north: bounds.north,
    south: bounds.south,
    west: bounds.west,
    east: bounds.east,
  },
  strictBounds: true,
};

const Map = (props: MapProps) => {
  const {
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    logoContainer,
    stops,
    routeOverlay,
    setTimesSheetOpen, // ISSUE 65
    nextCardOpen, // ISSUE 65
    setNextCardOpen, // ISSUE 65
    currentStop,

    // Location tracking
    persistActive,
    setPersistActive,

    // Walking distance
    setWalkingTime,
    walkingTime,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [prevStop, setPrevStop] = useState<Stop | undefined>(undefined);
  const [cachedWalkingValues, setCachedWalkingValues] = useState<any>({});
  const [previousMarkerPosition, setPreviousMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  });
  useEffect(() => {
    setPrevStop(currentStop);
  }, [currentStop]);
  const minHeightValue = walkingTime ? '265px' : '220px';

  /**
   * Animate map camera on marker tap
   */
  useEffect(() => {
    if (map && currentStop) {
      map.setOptions({
        center: {
          lat: currentStop.location.lat,
          lng: currentStop.location.lng,
        },
        zoom: 17,
        tilt: 45,
        restriction: mapRestriction,
      });
    }
  }, [currentStop]);

  // Find the center based on factors
  const center = () => {
    const center = map && map.getCenter();
    if (currentStop) {
      return {
        lat: currentStop.location.lat,
        lng: currentStop.location.lng,
      };
    }
    if (persistActive) {
      return {
        lat: markerPosition.lat,
        lng: markerPosition.lng,
      };
    }
    if (prevStop && !currentStop) {
      return {
        lat: 50.794236,
        lng: -1.075,
      };
    }
    return (
      center || {
        lat: 50.794236,
        lng: -1.075,
      }
    );
  };

  // Find the zoom based on factors
  const zoom = () => {
    let zoom = map && map.getZoom();
    if (currentStop) {
      return 17;
    }
    if (persistActive) {
      return zoom;
    }
    if (prevStop && !currentStop) {
      return 13;
    }

    return zoom || 13;
  };

  const tilt = () => {
    if (currentStop) {
      return 45;
    }
    return 0;
  };

  // Store users previous location
  const [prevLocation, setPrevLocation] = useState({ lat: 0, lng: 0 });

  // Calculate walking distance
  useEffect(() => {
    const currentStopId = currentStop?.id;

    const calculateWalkingDistance = () => {
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.DistanceMatrixService();
        if (currentStop) {
          service.getDistanceMatrix(
            {
              origins: [{ lat: markerPosition.lat, lng: markerPosition.lng }],
              destinations: [
                {
                  lat: currentStop.location.lat,
                  lng: currentStop.location.lng,
                },
              ],
              travelMode: window.google.maps.TravelMode.WALKING,
            },
            (response, status) => {
              if (status === 'OK' && response) {
                const value = response.rows[0].elements[0].duration.text;

                resolve(value);
              } else {
                console.error('Error calculating walking distance:', status);
                reject(status);
              }
            }
          );
        } else {
          reject('No current stop');
        }
      });
    };

    const calculate = (currentStopId: string) => {
      calculateWalkingDistance().then((value) => {
        setCachedWalkingValues({
          ...cachedWalkingValues,
          [currentStopId]: value,
        });
        setWalkingTime(value);
      });
    };

    if (window.google && window.google.maps && markerPosition && currentStop) {
      if (currentStopId) {
        if (cachedWalkingValues[currentStopId]) {
          const hasUserMoved = checkBoundary(
            markerPosition.lat,
            markerPosition.lng
          );
          if (hasUserMoved) {
            // If the user has moved
            console.log('User has moved');
            setPreviousMarkerPosition(markerPosition); // Update previous marker position
            calculate(currentStopId); // Recalculate walking time for the stop
          } else {
            console.log('User has not moved');
            // If the user hasn't moved and the stop hasn't changed, use cached values
            setWalkingTime(cachedWalkingValues[currentStopId]);
          }
        } else {
          console.log('No cached value');
          // If a new stop, add the users location to prevLocation and calculate walking time, add to cache
          setPrevLocation(markerPosition);
          calculate(currentStopId);
        }
      }
    }
  }, [currentStop]);

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    clickableIcons: false,
    zoom: zoom(),
    center: center(),
    tilt: tilt(),
    restriction: mapRestriction,
  };

  /**
   *
   * Get user location
   * Watch user location
   *
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error watching user location:', error);
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  /**
   *
   * Check if the user has moved outside of the designated boundary
   *
   * @param userLat number
   * @param userLng number
   *
   * @returns boolean
   */
  const checkBoundary = (userLat: number, userLng: number) => {
    // Center coordinates of the circle
    const centerLat = prevLocation.lat; // users initial lat
    const centerLng = prevLocation.lng; // users initial lng

    // User coordinates
    const userCoordinates = { latitude: userLat, longitude: userLng };
    const centerCoordinates = { latitude: centerLat, longitude: centerLng };

    // Function to calculate distance between two coordinates using the haversine formula
    function getDistance(
      coord1: { latitude: number; longitude: number },
      coord2: { latitude: number; longitude: number }
    ) {
      const earthRadius = 3958.8; // Earth's radius in miles
      const latDiff = toRadians(coord2.latitude - coord1.latitude);
      const lngDiff = toRadians(coord2.longitude - coord1.longitude);
      const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(toRadians(coord1.latitude)) *
          Math.cos(toRadians(coord2.latitude)) *
          Math.sin(lngDiff / 2) *
          Math.sin(lngDiff / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
      return distance;
    }

    // Function to convert degrees to radians
    function toRadians(degrees: number) {
      return degrees * (Math.PI / 180);
    }

    // Calculate distance between user and center coordinates
    const distance = getDistance(userCoordinates, centerCoordinates);

    // Define the boundary radius
    const boundaryRadius = 0.5; // in miles

    // Check if the user is within the boundary
    if (distance <= boundaryRadius) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * Map loading logic
   */
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
    mapIds: ['f9e34791c612c2be', '8d48c9186a06dab'],
  });

  const renderMap = () => {
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      moveLogo(mapInstance, logoContainer);
    };

    const onUnmount = () => {
      setMap(undefined);
    };

    return (
      <>
        <GoogleMap
          mapContainerStyle={{
            width: '100vw',
            position: 'absolute',
            borderRadius: '0',
          }}
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            mapId: darkModeEnabled ? '8d48c9186a06dab' : 'f9e34791c612c2be',
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onDrag={() => setPersistActive(false)}
        >
          {/* <CurrentLocation
            darkModeEnabled={darkModeEnabled}
            position={markerPosition}
            persistActive={persistActive}
          /> */}
          <LiveVehicleLocation
            darkModeEnabled={darkModeEnabled}
            routePath={routeOverlay}
          />
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
          <MarkerF
            position={markerPosition}
            options={{
              icon: {
                url: locationMarkerIcon,
                scaledSize: new google.maps.Size(17, 17),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 12.5),
              },
            }}
          />
        </GoogleMap>
        <BottomSheet
          open={nextCardOpen}
          setOpen={setNextCardOpen}
          disableBackdrop={true}
          zIndex={5000}
          minHeight={'calc(env(safe-area-inset-bottom, 0px) + 270px)'}
          borderRadius={50}
        >
          <NextTimeCard
            darkMode={true}
            currentStop={currentStop}
            setTimesSheetOpen={setTimesSheetOpen}
            setNextCardOpen={setNextCardOpen}
            walkingTime={walkingTime}
          />
        </BottomSheet>
      </>
    );
  };
  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};

export default Map;
