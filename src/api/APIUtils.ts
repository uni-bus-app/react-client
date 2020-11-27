import { Stop } from '../models/stop';

const apiURL = 'https://20200817t190317-dot-unibus-app.nw.r.appspot.com';

export const getRoutePath: () => Promise<google.maps.LatLng[]> = async () => {
  const res = await fetch(`${apiURL}/u1routepath`);
  return await res.json();
};

export const getStops: () => Promise<any> = async () => {
  try {
    const res = await fetch(`${apiURL}/stops`);
    return parseStops(await res.json());
  } catch (error) {
    throw error;
  }
};

const parseStops: (data: any[]) => Stop[] = (data: any[]) => {
  const result: Stop[] = [];
  data.forEach((item) => {
    result.push({
      name: item.name,
      id: item.id,
      routeOrder: item.routeOrder,
      location: new google.maps.LatLng(
        item.location._latitude,
        item.location._longitude
      ),
    });
  });
  return result;
};

export const getTimes: (stopID: string) => Promise<any> = async (
  stopID: string
) => {
  const res = await fetch(`${apiURL}/times/${stopID}`);
  return await res.json();
};
