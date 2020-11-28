import { Dayjs } from 'dayjs';

export interface Time {
  destination: string;
  service: string;
  time: string;
  eta: string;
  etaUnit?: string;
  timeValue: Dayjs;
  routeNumber: number;
}
