import dayjs from 'dayjs';
import { Stop, Eta, Time, LatLng, Message } from '../types';
// import idbService from './LocalDB';
import LocalDB from './NewLocalDB';
import config from '../config';

const db = new LocalDB();
if (process.env.NODE_ENV === 'development') {
  db.init();
}

const apiURL = config.apiURL;

export const getRoutePath = async (): Promise<LatLng[]> => {
  const res = await fetch(`${apiURL}/u1routepath`);
  return await res.json();
};

export const getMessages = async (): Promise<Message[]> => {
  const res = await fetch(`${apiURL}/messages`);
  return await res.json();
};

export const getStops = async (): Promise<any> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await db.init();
      const stops = await db.getStops();
      if (stops && stops?.length > 0) {
        return parseStops(stops);
      } else {
        const res = await fetch(`${apiURL}/stops`);
        return parseStops(await res.json());
      }
    } else {
      const res = await fetch(`${apiURL}/stops`);
      return parseStops(await res.json());
    }
  } catch (error) {
    throw error;
  }
};

const parseStops = (data: any[]): Stop[] => {
  const result: Stop[] = [];
  data.forEach((item) => {
    result.push({
      name: item.name,
      id: item.id,
      routeOrder: item.routeOrder,
      location: { lat: item.location._latitude, lng: item.location._longitude },
    });
  });
  return result;
};

export const getTimes = async (
  stopID: string,
  date?: string
): Promise<Time[]> => {
  if (process.env.NODE_ENV === 'development') {
    const localTimes = await db.getTimes(stopID, date);
    if (localTimes?.length) {
      return parseTimes(localTimes);
    } else {
      date = date ? `?date=${date}` : '';
      const res = await fetch(`${apiURL}/stops/${stopID}/times${date}`);
      return parseTimes(await res.json());
    }
  } else {
    date = date ? `?date=${date}` : '';
    const res = await fetch(`${apiURL}/stops/${stopID}/times${date}`);
    return parseTimes(await res.json());
  }
};

// const isWeekday = (date) => {
//   const day = date.getDay();
//   if (day === 0 || day === 6) {
//     day.add(1, 'day');
//     isWeekday(day);
//   } else {
//     return day;
//   }
// }

const parseTimes = (data: any[]): Time[] => {
  const result: Time[] = [];
  data.forEach((element) => {
    if (element) {
      const newServiceTime: Time | any = {};
      newServiceTime.destination = element.destination;
      newServiceTime.service = 'U1';
      newServiceTime.routeNumber = element.routeNumber;
      newServiceTime.timeValue = dayjs(element.scheduledDeparture);
      // newServiceTime.timeValue = dayjs()
      //   .set('hour', parseInt(element.scheduled.substring(0, 2)))
      //   .set('minute', element.scheduled.substring(2, 4))
      //   .set('second', 0);+
      // if (
      //   newServiceTime.timeValue.isBefore(
      //     dayjs().set('hour', 1).set('minute', 0)
      //   )
      // ) {
      //   newServiceTime.timeValue = newServiceTime.timeValue.add(1, 'day');
      //   newServiceTime.destination = 'Fratton Bridge';
      // }
      newServiceTime.time = newServiceTime.timeValue.format('HH:mm');
      newServiceTime.eta = updateServiceEta(newServiceTime);
      if (newServiceTime.eta) {
        result.push(newServiceTime);
      }
    }
  });
  return result;
};

export const updateServiceTimes = (times: Time[]) => {
  const updatedTimes = times.map((element) => {
    const res = { ...element };
    res.eta = updateServiceEta(element);
    return res;
  });
  if (!updatedTimes[0]?.eta) {
    updatedTimes.shift();
  }
  return updatedTimes;
};

/**
 * Calculates the eta of the service time and returns it
 * @param {BusTime} serviceTime
 */
const updateServiceEta = (serviceTime: Time): Eta | undefined => {
  const eta = serviceTime.timeValue.diff(dayjs());
  let value: string = '';
  let unit: string = '';
  let arrivalTime = dayjs(serviceTime.timeValue).format('HH:mm');
  let show = false;
  if (eta < 60000) {
    unit = 'Now';
    value = 'Now';
    arrivalTime = 'Now';
    show = false;
  } else if (eta < 3600000) {
    value = Math.ceil(eta / 60000).toString();
    unit = 'min';
    show = true;
  }
  if (eta > 3600000) {
    show = false;
  }
  if (isNaN(eta) || eta < 0) {
    return;
  }
  return { value, unit, arrivalTime, show };
};
