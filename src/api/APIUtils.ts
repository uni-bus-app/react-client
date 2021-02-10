import dayjs, { Dayjs } from 'dayjs';
import { Stop } from '../models/stop';
import { Time } from '../models/time';

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

export const getTimes: (stopID: string) => Promise<Time[]> = async (
  stopID: string
) => {
  const res = await fetch(`${apiURL}/stops/${stopID}/times`);
  return parseTimes(await res.json());
};

const parseTimes: (data: any[]) => Time[] = (data: any[]) => {
  const result: Time[] = [];
  data.forEach((item) => {
    const timeValue = dayjs()
      .set('hour', Number(item.scheduled.substring(0, 2)))
      .set('minute', item.scheduled.substring(2, 4))
      .set('second', 0);
    const res = updateServiceEta(timeValue);
    const time: Time = {
      destination: 'University Library',
      service: 'U1',
      time: timeValue.format('HH:mm'),
      eta: res.eta,
      etaUnit: res.etaUnit,
      timeValue,
      routeNumber: item.routeNumber,
    };
    if (res.eta > 0) {
      result.push(time);
    }
  });
  return result;
};

export const updateServiceEta: (timeValue: Dayjs) => any = (
  timeValue: Dayjs
) => {
  const etaValue = timeValue.diff(dayjs());
  let eta: string;
  let etaUnit: string = '';
  if (etaValue > 3600000) {
    eta = (etaValue / 3600000).toFixed(1);
    if (eta === '1.0') {
      eta = '1';
    }
    etaUnit = 'hours';
  } else if (etaValue > 120000) {
    eta = (etaValue / 60000).toFixed(0);
    etaUnit = 'min';
  } else {
    eta = 'Now';
  }
  return { eta, etaUnit };
};
