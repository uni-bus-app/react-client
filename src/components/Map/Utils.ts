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
  let isCalled = false;
  const mapObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
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
  // mapObserver.observe(map.__gm.Ma, { childList: true, subtree: true });
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
