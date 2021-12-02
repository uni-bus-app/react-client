import hash from 'object-hash';
import { get, set } from 'idb-keyval';
import config from '../config';
import { Stop } from '../models/stop';

class IdbService {
  constructor() {}

  async generateChecksums() {
    const stops = await this.getStops();
    const times = stops ? await this.getAllTimes(stops) : {};
    const stopsVersion = hash(stops || {}, { respectType: false });
    const timesVersion = hash(times, { unorderedArrays: true });
    return { stopsVersion, timesVersion };
  }

  sync(): Promise<boolean> {
    return new Promise((resolve) => {
      this.generateChecksums().then((checksums) => {
        fetch(`${config.apiUrl}/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checksums),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              if (data.updates) {
                this.setStops(data.stops);
                this.setTimes(data.times);
              }
            } else {
              resolve(false);
            }
          });
      });
    });
  }

  async getNumberOfLaunches(): Promise<number> {
    return (await get('numLaunches')) || 0;
  }
  async incrementNumberOfLaunches(): Promise<void> {
    let res = ((await get('numLaunches')) as number) || 0;
    res++;
    await set('numLaunches', res);
  }

  async getU1RoutePath(): Promise<any[]> {
    return (await get('u1RoutePath')) as any[];
  }
  async setRoutePath(value: any[]): Promise<void> {
    await set('u1RoutePath', value);
  }

  getStops(): Promise<Stop[] | undefined> {
    return get('stops');
  }
  async setStops(data: any[]): Promise<void> {
    await set('stops', data);
  }

  getTimes(stopID: string): Promise<any> {
    return get(`times${stopID}`);
  }
  async getAllTimes(stops: any[]): Promise<any[]> {
    const res = [];
    for (let i = 0; i < stops.length; i++) {
      res.push(await get(`times${stops[i].id}`));
    }
    return res;
  }
  async setTimes(data: any[]): Promise<void> {
    for (let i = 0; i < data.length; i++) {
      await set(`times${data[i].stopID}`, data[i]);
    }
  }
}

export default new IdbService();
