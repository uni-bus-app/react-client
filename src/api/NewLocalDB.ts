import dayjs, { Dayjs } from 'dayjs';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { get, set } from 'idb-keyval';
import config from '../config';
import { Time } from '../types';
import { getRoutePath } from './APIUtils';

const getServiceTime = (scheduled: string, currentTime: Dayjs): string => {
  return currentTime
    .startOf('day')
    .set('hour', Number(scheduled.substring(0, 2)))
    .set('minute', Number(scheduled.substring(2, 4)))
    .toISOString();
};

const formatTimes = (times: any[], currentTime: Dayjs): Time[] => {
  const result: Time[] = [];
  times.forEach((item) => {
    if (item.scheduled === '....') {
      return;
    }
    const scheduledDeparture = getServiceTime(item.scheduled, currentTime);
    result.push({ ...item, scheduledDeparture });
  });
  return result;
};

const isBankHoliday = async (date: Dayjs) => {
  const res = await fetch('https://www.gov.uk/bank-holidays.json');
  const data = await res.json();
  return data['england-and-wales'].events.some(
    (item: any) => item.date === date.format('YYYY-MM-DD')
  );
};

const nextWorkingDay = async (date: Dayjs): Promise<Dayjs> => {
  const day = date.day();
  if (day === 6 || day === 0) {
    return await nextWorkingDay(date.add(1, 'day'));
  } else if (await isBankHoliday(date)) {
    return await nextWorkingDay(date.add(1, 'day'));
  } else {
    return date;
  }
};

const getNextWorkingDay = async (date: Dayjs): Promise<Dayjs> => {
  date = date.startOf('day');
  return await nextWorkingDay(date.add(1, 'day'));
};

interface UniBusDB extends DBSchema {
  times: {
    value: {
      id: string;
      stopID: string;
      rollover: boolean;
      days: number[];
      service: string;
      times: { scheduled: string; routeNumber: number }[];
    };
    key: string;
    indexes: { stopID: string };
  };
  stops: {
    value: {
      id: string;
      name: string;
    };
    key: string;
    indexes: { routeOrder: number };
  };
}

class LocalDB {
  private _db?: IDBPDatabase<UniBusDB>;

  private get db(): IDBPDatabase<UniBusDB> {
    if (this._db) {
      return this._db;
    }
    throw new Error();
  }
  private set db(value: IDBPDatabase<UniBusDB>) {
    this._db = value;
  }

  constructor() {}

  async init(): Promise<boolean> {
    if (this._db) {
      return;
    }
    this.db = await openDB<UniBusDB>('unibus-db', 3, {
      upgrade(db, oldVersion, newVersion, trasaction) {
        if (oldVersion && oldVersion < 3) {
          [...(db.objectStoreNames as any)].forEach((item) => {
            db.deleteObjectStore(item);
          });
        }
        const stopsStore = db.createObjectStore('stops', { keyPath: 'id' });
        stopsStore.createIndex('routeOrder', 'routeOrder');
        const timesStore = db.createObjectStore('times', { keyPath: 'id' });
        timesStore.createIndex('stopID', 'stopID');
      },
    });
    try {
      return await this.sync();
    } catch (error) {}
  }

  async generateChecksums() {
    const timesVersion = await get('timesVersion');
    const stopsVersion = await get('stopsVersion');
    return { stopsVersion, timesVersion };
  }

  async sync(): Promise<boolean> {
    const checksums = await this.generateChecksums();
    const res = await fetch(`${config.apiURL}/sync?new_format=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checksums),
    });
    const data = await res.json();
    if (data.updates) {
      await set('stopsVersion', data.versions.stopsVersion);
      await set('timesVersion', data.versions.timesVersion);
      await this.db.clear('times');
      data.stops.forEach((item: any) => {
        this.db.put('stops', item);
      });
      data.times.forEach((item: any) => {
        this.db.put('times', item);
      });
    }
    const routePath = await getRoutePath();
    await set('u1RoutePath', routePath);
    return data.updates;
  }

  async getStops() {
    return await this.db.getAllFromIndex('stops', 'routeOrder');
  }

  async getAllTimes() {
    return await this.db.getAll('times');
  }

  async queryTimes(
    stopID: string,
    day?: number,
    rollover?: boolean
  ): Promise<any[]> {
    let res = await this.db.getAllFromIndex('times', 'stopID', stopID);
    const result: any = [];
    if (rollover === true) {
      res = res?.filter((item) => item.rollover);
    } else if (rollover === false) {
      res = res?.filter((item) => !item.rollover);
    }
    if (day !== undefined) {
      res = res?.filter((item) => item.days.includes(day));
    }
    res = res?.sort((a, b) => {
      return Number(b.rollover) - Number(a.rollover);
    });
    res?.forEach((item) => {
      result.push(...item.times);
    });
    return result;
  }

  async getRolloverTimes(stopID: string, currentTime: Dayjs): Promise<any[]> {
    const res = await this.queryTimes(
      stopID,
      currentTime.add(1, 'day').day(),
      true
    );
    return formatTimes(res, currentTime.add(1, 'day'));
  }

  async getTimes2(stopID: string, currentTime: Dayjs): Promise<Time[]> {
    const value = await isBankHoliday(currentTime);
    const times = formatTimes(
      await this.queryTimes(stopID, currentTime.day(), value),
      currentTime
    ).filter((item) => dayjs(item.scheduledDeparture).isAfter(currentTime));
    const rolloverTimes = (
      await this.getRolloverTimes(stopID, currentTime)
    ).filter((item) => dayjs(item.scheduledDeparture).isAfter(currentTime));
    return [...times, ...rolloverTimes];
  }

  async getTimes(stopID: string, date?: string | null): Promise<Time[]> {
    const currentTime = date ? dayjs(date) : dayjs();
    let times: any;
    times = await this.getTimes2(stopID, currentTime);
    if (!times?.length) {
      let thing = await getNextWorkingDay(currentTime);
      const res = await this.getTimes2(stopID, thing);
      return res;
    } else {
      return times;
    }
  }
}

export default LocalDB;
