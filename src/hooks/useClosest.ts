import { useEffect } from 'react';

const useClosest = (stops: any, google: any) => {
  const myLocale = [{ lat: 50.8297216, lng: -1.097728 }];

  useEffect(() => {
    console.log();
    if (google === undefined || stops === undefined) {
      return;
    }
    var service = new google.maps.DistanceMatrixService();
    stops !== undefined &&
      service.getDistanceMatrix(
        {
          origins: myLocale,
          destinations: stops.map((a: any) => a.location),
          travelMode: google.maps.TravelMode.WALKING,
        },
        callback
      );

    function callback(response: any, status: any) {
      console.log(response, status);
      // See Parsing the Results for
      // the basics of a callback function.
    }
  }, []);
};

export default useClosest;
