export const getBounds = (
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

export const moveLogo = (map: any, logoContainer: any) => {
  let logo: any, tc1: any, tc2: any;
  let isCalled = false;
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      const onFinished = () => {
        if (logo && tc1 && tc2) {
          if (!isCalled) {
            isCalled = true;
            observer.disconnect();
            logoContainer.current.append(logo);
            logoContainer.current.append(tc1);
            logoContainer.current.append(tc2);
          }
        }
      };
      if (
        Array.from((mutation.target as any).classList)?.includes('gmnoprint')
      ) {
        if (!tc1) {
          tc1 = mutation.target;
        } else if (!tc2 && mutation.target !== tc1) {
          tc2 = mutation.target;
        } else {
          onFinished();
        }
      } else if ((mutation.target as any).getAttribute('rel')) {
        if (!logo) {
          logo = mutation.target;
        } else {
          onFinished();
        }
      }
    });
  });
  observer.observe(map.getDiv(), {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

export const getLocation: () => Promise<google.maps.LatLngLiteral> = () => {
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
