import { Loader } from '@googlemaps/js-api-loader';
import NearMeOutlined from '@mui/icons-material/NearMeOutlined';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';
import { GoogleMap } from '@react-google-maps/api';
import { Easing, Tween, update } from '@tweenjs/tween.js';
import { RefObject, useEffect, useRef, useState } from 'react';
import { wrapPromise } from '../..';
import { getRoutePath } from '../../api/APIUtils';
import config from '../../config';
import { LatLng, Stop } from '../../types';
import RoutePath from './components/RoutePath';
import StopMarkers from './components/StopMarkers';
import StaticMap from './static';
import styles from './styles.module.css';
import { getBounds, getLocation, moveLogo } from './utils';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Settings } from '@mui/icons-material';
import dayjs from 'dayjs';
import path1 from './path';

const getPathPoint = (origin: any, destination: LatLng, position: number) => {
  return {
    altitude: 15,
    lat: origin.lat - (origin.lat - destination.lat) * position,
    lng: origin.lng - (origin.lng - destination.lng) * position,
    y: origin.y,
  };
};

const initMap = async () => {
  const loader = new Loader({ apiKey: config.mapsApiKey, version: 'beta' });
  // console.log(loader.createUrl());
  return await loader.load();
};

const loadPromise = wrapPromise(initMap());

const start = Date.now();

const cameraOptions: google.maps.CameraOptions = {
  zoom: 13,
  center: { lat: 50.794236, lng: -1.075 },
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  clickableIcons: false,
  ...cameraOptions,
};

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

path1.forEach((item, index) => {
  if (index < path1.length - 1) {
    console.log(
      'distance',
      distance(item.lat, item.lng, path1[index + 1].lat, path1[index + 1].lng)
    );
  }
});

const getRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

interface MapProps {
  map: any;
  setMap: any;
  setTween: any;
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  stops: Stop[];
  currentStop?: Stop;
  logoContainer: RefObject<HTMLDivElement>;
  openSettings: () => void;
}

const Map = (props: MapProps) => {
  const {
    map,
    setMap,
    setTween,
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    stops,
    currentStop,
    logoContainer,
    openSettings,
  } = props;

  // const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<LatLng[]>();

  const thing = useRef<any>();

  const getCurrentLocation = async () => {
    const position = await getLocation();
    if (map) {
      map?.fitBounds(getBounds(position), 20);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
    };
    getData();
  }, []);
  const [tilesLoaded, setTilesLoaded] = useState<boolean>(false);
  const thing12 = useRef<boolean>(false);
  useEffect(() => {
    if (map && currentStop && tilesLoaded && !thing12.current) {
      thing12.current = true;
      const pos = new google.maps.LatLng(
        currentStop.location.lat,
        currentStop.location.lng
      );
      console.log('oof');
      // map.setZoom(13);
      window.setTimeout(() => {
        // map.fitBounds(getBounds(pos), {
        //   top:
        //     Number(
        //       getComputedStyle(document.documentElement)
        //         .getPropertyValue('--sat')
        //         .replace('px', '')
        //     ) + 5,
        //   left: 5,
        //   right: 5,
        //   bottom: 5,
        // });
        const tween = new Tween(thing.current || cameraOptions)
          .to(
            {
              zoom: 16,
              center: {
                lat: currentStop.location.lat,
                lng: currentStop.location.lng,
              },
            },
            1500
          )
          .easing(Easing.Quadratic.Out)
          .onUpdate(() => {
            map.moveCamera(thing.current || cameraOptions);
          })
          .start()
          .onComplete((res) => {
            thing.current = res;
          });
        setTween(tween);
        const animate = (time: number) => {
          requestAnimationFrame(animate);
          update(time);
        };
        requestAnimationFrame(animate);
      }, 100);
    }
  }, [currentStop, tilesLoaded]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const loadError = null;

  const loadedScript = loadPromise.read();
  useEffect(() => {
    setIsLoaded(true);
  }, [loadedScript]);

  const theme = useTheme();

  const [thing1, setTilesLoaded1] = useState<boolean>(false);
  useEffect(() => {
    if (tilesLoaded) {
    }
  }, [tilesLoaded]);
  const busPosition = useRef<any>({
    lat: 50.794438,
    lng: -1.097187,
    altitude: 15,
  });
  const busRotation = useRef<number>(120);
  const renderMap = (routeOverlay?: LatLng[]) => {
    const onLoad = async (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      moveLogo(mapInstance, logoContainer);
      // console.log(Date.now() - start);
      // mapInstance.setOptions;
      // console.log(mapInstance);

      const webGLOverlayView = new google.maps.WebGLOverlayView();
      let renderer: THREE.WebGLRenderer;
      let scene: THREE.Scene;
      let camera: THREE.Camera;
      let loader: OBJLoader;
      webGLOverlayView.onAdd = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
        directionalLight.position.set(0.5, -1, 0.5);
        scene.add(directionalLight);

        loader = new OBJLoader();
        const source = '/XRO23UXUOD374TBDSR4IXBVP9.obj';
        loader.load(source, (obj) => {
          obj.name = 'bus';
          obj.scale.set(25, 25, 25);
          obj.rotation.set(getRadians(90), getRadians(120), 0);
          scene.add(obj);
        });
      };
      webGLOverlayView.onContextRestored = ({ gl }) => {
        renderer = new THREE.WebGLRenderer({
          canvas: gl.canvas,
          context: gl,
          ...gl.getContextAttributes(),
        });
        renderer.autoClear = false;
      };
      webGLOverlayView.onDraw = ({ transformer }) => {
        const bus = scene.getObjectByName('bus');
        if (bus) {
          bus.rotation.set(
            getRadians(90),
            getRadians(busPosition.current.y),
            0
          );
        }
        const matrix = transformer.fromLatLngAltitude(busPosition.current);
        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
        webGLOverlayView.requestRedraw();
        renderer.render(scene, camera);
        renderer.resetState();
      };
      webGLOverlayView.setMap(mapInstance);
      const path = await getRoutePath();
      console.log(path);
      console.log(
        path.findIndex((value) => {
          return value.lat === 50.794438 && value.lng === -1.097187;
        })
      );
      let routeDistance = 0;
      path.forEach((item, index) => {
        if (index <= 28) {
          routeDistance += distance(
            (path[index - 1] || item).lat,
            (path[index - 1] || item).lng,
            item.lat,
            item.lng
          );
        }
      });
      console.log(routeDistance);
      // let i = 0;
      // let index = 0;
      let start1 = Date.now();
      let end = start1 + 240 * 1000;
      let speed = routeDistance / 240000;
      console.log(speed);
      const stops = [
        {
          id: '6TRxDIF8NDpofem64867',
          time: dayjs().set('hour', 2).set('minute', 21).startOf('second'),
          location: { lat: 50.79446, lng: -1.09721 },
          pathIndex: 0,
        },
        {
          id: 'BfxlIpLFJri0ES2sgld',
          time: dayjs().set('hour', 2).set('minute', 25).startOf('second'),
          location: { lat: 50.78963, lng: -1.08497 },
          pathIndex: 28,
        },
        {
          id: 'ZOQR1mVtCtn2mex1fMxZ',
          time: dayjs().set('hour', 2).set('minute', 29).startOf('second'),
          location: { lng: -1.0806600000000002, lat: 50.7871 },
          pathIndex: 44,
        },
      ];
      const getCurrentPosition = () => {
        let pos;
        let i = 0;
        let p = 0;
        stops.forEach((item, index) => {
          if (
            item.time.isBefore(dayjs()) &&
            stops[index + 1].time.isAfter(dayjs())
          ) {
            console.log(item.id);
            let routeDistance = 0;
            let start = item.time;
            let end = stops[index + 1].time;
            path
              .slice(item.pathIndex, stops[index + 1]?.pathIndex)
              .forEach((item1, index1) => {
                if (path[index1 + 1]) {
                  routeDistance += distance(
                    item1.lat,
                    item1.lng,
                    (path[index1 + 1] || item1).lat,
                    (path[index1 + 1] || item1).lng
                  );
                }
              });
            let speed = routeDistance / end.diff(start, 'seconds');
            console.log(speed, routeDistance);
            let currentDistance =
              dayjs().diff(start, 'seconds') * speed * routeDistance;
            console.log('distance', currentDistance);
            const list = path.slice(item.pathIndex);
            list.some((item, index) => {
              const res = distance(
                item.lat,
                item.lng,
                (list[index + 1] || item).lat,
                (list[index + 1] || item).lng
              );
              console.log(res, currentDistance);
              if (currentDistance > res) {
                currentDistance = currentDistance - res;
              } else {
                const value = currentDistance / res;
                const value2 = value * res;
                pos = {
                  lat:
                    item.lat -
                    value2 * Math.abs(item.lat - list[index + 1].lat),
                  lng:
                    item.lng -
                    value2 * Math.abs(item.lng - list[index + 1].lng),
                };
                i = index;
                p = value2;
                return true;
                // pos = {
                //   lat:
                //     item.lat -
                //     (item.lat - (list[index + 1] || item).lat) * value2,
                //   lng:
                //     item. lng -
                //     (item.lng - (list[index + 1] || item).lng) * value2,
                // };
              }
            });
          }
        });
        return { pos, i, p };
      };

      // console.log(pos);
      // window.setInterval(() => {
      //   const { pos } = getCurrentPosition() as any;
      //   if (pos) {
      //     busPosition.current = { lat: pos.lat, lng: pos.lng, altitude: 20 };
      //   }
      // }, 1000);

      const animateBus1 = (i: number, p: number) => {
        const speed1 = 0.000000056740600894377696;
        let startTime = document.timeline.currentTime || 0;
        let segmentIndex = i;
        let pos = p;
        let distanceToNextPoint = distance(
          path1[segmentIndex].lat,
          path1[segmentIndex].lng,
          path1[segmentIndex + 1].lat,
          path1[segmentIndex + 1].lng
        );
        const animateBus = (currentTime: number) => {
          const segment = path1[segmentIndex];
          // console.log(segment);
          // distanceToNextPoint=
          // const distance = segment.distanceToNextPoint || 1;
          pos = currentTime - startTime;
          // console.log(pos);
          // console.log(pos * speed1);
          const segmentProgress = (pos * speed) / distanceToNextPoint;
          console.log(segmentProgress);
          if (segmentProgress < 1) {
            const nextSegment = path1[segmentIndex + 1];
            busPosition.current = getPathPoint(
              segment,
              nextSegment,
              segmentProgress
            );
            busRotation.current = segment.y;
            console.log(busPosition.current);
          } else {
            pos = 0;
            segmentIndex++;
            const segment = path1[segmentIndex];
            const nextSegment = path1[segmentIndex + 1];
            distanceToNextPoint = distance(
              segment.lat,
              segment.lng,
              nextSegment.lat,
              nextSegment.lng
            );
            const segmentProgress = (pos * speed) / distanceToNextPoint;
            busPosition.current = segment;
            // busPosition.current = getPathPoint(
            //   segment,
            //   nextSegment,
            //   0
            //   // segmentProgress
            // );
            startTime = currentTime;
          }
          // console.log(segmentProgress);
          requestAnimationFrame(animateBus);
        };
        requestAnimationFrame(animateBus);
      };
      const { pos, i, p } = getCurrentPosition() as any;
      if (pos) {
        // busPosition.current = { lat: pos.lat, lng: pos.lng, altitude: 20 };
        animateBus1(i, p);
      }
    };

    const onUnmount = () => {
      setMap(undefined);
    };

    const onTilesLoaded = () => {
      // console.log('tiles loaded');
      // console.log(map);
      window.setTimeout(() => setTilesLoaded1(true), 200);
      window.setTimeout(() => setTilesLoaded(true), 400);
    };

    return (
      <>
        {!tilesLoaded && <StaticMap thing={thing1} />}
        <GoogleMap
          mapContainerStyle={{
            width: '100vw',
            position: 'absolute',
          }}
          mapContainerClassName={styles.mapContainer}
          options={{
            ...mapOptions,
            // styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
            mapId: darkModeEnabled ? '8d48c9186a06dab' : 'f9e34791c612c2be',
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onTilesLoaded={onTilesLoaded}
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
        </GoogleMap>
        {/* {thing && (
          <Marker
            position={map.getCenter()}
            options={{
              icon: {
                url: locationMarkerIcon,
                // scaledSize: new google.maps.Size(35, 50),
                // origin: new google.maps.Point(0, 0),
                // anchor: new google.maps.Point(17.5, 50),
              },
            }}
          />
        )} */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
          className={styles.statusBarContainer}
        >
          <div
            style={{
              opacity: theme.palette.mode === 'dark' ? 0 : undefined,
            }}
            className={styles.statusBar}
          />
          <div className={styles.statusBarBlur} />
        </div>
        <div className={styles.fabContainer}>
          <Fab
            size="small"
            style={{
              // position: 'absolute',
              // right: '1em',
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
            className={styles.fabButton}
            onClick={openSettings}
          >
            <Settings />
          </Fab>
          <Fab
            size="small"
            style={{
              // position: 'absolute',
              // right: '1em',
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
            className={styles.fabButton}
            onClick={getCurrentLocation}
          >
            <NearMeOutlined />
          </Fab>
        </div>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap(routeOverlay) : <StaticMap />;
};

export default Map;
