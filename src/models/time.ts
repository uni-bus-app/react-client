import { Dayjs } from 'dayjs';

export interface Time {
  destination: string;
  service: string;
  time: string;
  eta: string;
  timeValue: Dayjs;
  routeNumber: number;
}
