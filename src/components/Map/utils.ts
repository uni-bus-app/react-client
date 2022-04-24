export const getBounds = (
  value: google.maps.LatLng
): google.maps.LatLngBounds => {
  const swBounds = google.maps.geometry.spherical.computeOffset(
    value,
    300,
    225
  );
  const neBounds = google.maps.geometry.spherical.computeOffset(value, 300, 45);
  return new google.maps.LatLngBounds(swBounds, neBounds);
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
          if (mutation.target.textContent === 'Keyboard shortcuts') {
            (mutation.target as any).remove();
          }
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

export const getLocation: () => Promise<google.maps.LatLng> = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const position1: google.maps.LatLngLiteral = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      const position = new google.maps.LatLng(position1);
      resolve(position);
    });
  });
};
