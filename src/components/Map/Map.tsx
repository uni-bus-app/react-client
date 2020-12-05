import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { mapStylesLight } from "./mapstyles-light";
import { mapStylesDark } from "./mapstyles-dark";
import { useEffect, useRef, useState } from "react";
import { getRoutePath, getStops } from "../../api/APIUtils";
import { Stop } from "../../models/stop";
import purpleStopMarker from "../../assets/stop-marker-icon-purple.svg";
import blueStopMarker from "../../assets/stop-marker-icon-blue.svg";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { config } from "../../config";

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  gestureHandling: "greedy",
  clickableIcons: false,
};

const getLocation: () => Promise<google.maps.LatLngLiteral> = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const position: google.maps.LatLngLiteral = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      resolve(position);
    });
  });
};

interface MapProps {
  style?: CSSProperties;
  position: google.maps.LatLngLiteral;
  padding?: google.maps.Padding;
  darkModeEnabled?: boolean;
  routeOverlayEnabled?: boolean;
  stopMarkersEnabled?: boolean;
  onMarkerSelect?: (stop: Stop) => void;
  logoPosition: MotionValue<number>;
  currentStop?: Stop;
}

export const Map = (props: MapProps) => {
  const {
    position,
    style,
    padding,
    darkModeEnabled,
    routeOverlayEnabled,
    stopMarkersEnabled,
    onMarkerSelect,
    logoPosition,
    currentStop,
  } = props;

  const [map, setMap] = useState<google.maps.Map>();
  const [routeOverlay, setRouteOverlay] = useState<google.maps.LatLng[]>();
  const [stops, setStops] = useState<Stop[]>();
  const [selectedStop, setSelectedStop] = useState<Stop>();
  const logoContainer = useRef() as any;

  const initialLogoPosition = useMotionValue(0);
  const logoPos = useTransform(
    logoPosition || initialLogoPosition,
    (value) => value - window.innerWidth
  );

  const getBounds = (
    value: google.maps.LatLngLiteral,
    r: number
  ): google.maps.LatLngBounds => {
    const dY = (360 * r) / 6371;
    const dX = dY * Math.cos(value.lng);
    const lat1 = value.lat - dX;
    const lng1 = value.lng - dY;
    const lat2 = value.lat + dX;
    const lng2 = value.lng + dY;
    return new google.maps.LatLngBounds(
      { lat: lat1, lng: lng1 },
      { lat: lat2, lng: lng2 }
    );
  };
  useEffect(() => {
    const getData = async () => {
      setRouteOverlay(await getRoutePath());
      setStops(await getStops());
    };
    getData();
  }, []);
  useEffect(() => {
    if (map) {
      const bounds = getBounds(position, 0.5);
      map.fitBounds(bounds, padding);
    }
  }, [position]);

  useEffect(() => {
    setSelectedStop(currentStop);
    if (map && currentStop) {
      const bounds = getBounds(
        { lat: currentStop.location.lat(), lng: currentStop.location.lng() },
        0.05
      );
      map.fitBounds(bounds, padding);
    }
  }, [currentStop]);

  const moveLogo = (map: any) => {
    let isCalled = false;
    const mapObserver = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          const logoElement = map.__gm.Ma.querySelector('[rel="noopener"]');
          if (logoElement) {
            if (!isCalled) {
              isCalled = true;
              observer.disconnect();
              const logoEl = logoElement.parentElement.removeChild(logoElement);
              if (logoEl && logoContainer) {
                logoContainer?.current?.append(logoEl);
              }
            }
          }
        }
      }
    });
    mapObserver.observe(map.__gm.Ma, { childList: true, subtree: true });
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.mapsApiKey,
  });

  const renderMap = () => {
    const onLoad = (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      const bounds = getBounds(position, 0.5);
      mapInstance.fitBounds(bounds, padding);
      moveLogo(mapInstance);
    };

    const onUnmount = () => {
      setMap(undefined);
    };

    return (
      <>
        <motion.div
          style={{
            position: "absolute",
            zIndex: 99999,
            bottom: "52vh",
            left: "4vw",
            x: logoPos,
          }}
          ref={logoContainer}
        ></motion.div>
        <GoogleMap
          mapContainerStyle={{
            ...(style || { width: "100vw", height: "100vh" }),
            zIndex: 10,
          }}
          options={{
            ...mapOptions,
            styles: darkModeEnabled ? mapStylesDark : mapStylesLight,
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {routeOverlayEnabled && (
            <Polyline
              path={routeOverlay}
              options={{
                strokeColor: darkModeEnabled ? "#03A9F4" : "#7B1FA2",
                strokeOpacity: 0.75,
              }}
            />
          )}
          {stopMarkersEnabled &&
            stops?.map((stop, index) => {
              return (
                <Marker
                  key={index}
                  position={stop.location}
                  options={{
                    icon: {
                      url:
                        (darkModeEnabled &&
                          selectedStop?.routeOrder !== index) ||
                        (!darkModeEnabled && selectedStop?.routeOrder === index)
                          ? blueStopMarker
                          : purpleStopMarker,
                      scaledSize: new google.maps.Size(35, 50),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(17.5, 50),
                    },
                  }}
                  onClick={() => {
                    setSelectedStop(stop);
                    const bounds = getBounds(
                      {
                        lat: stop.location.lat(),
                        lng: stop.location.lng(),
                      },
                      0.05
                    );
                    map?.fitBounds(bounds, padding);
                    onMarkerSelect && onMarkerSelect(stop);
                  }}
                />
              );
            })}
        </GoogleMap>
      </>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded :(</div>;
  }

  return isLoaded ? renderMap() : <div>loading...</div>;
};
