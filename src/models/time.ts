import { Dayjs } from 'dayjs';

export interface Eta {
  value: string;
  unit?: string;
  arrivalTime: string;
}

export interface Time {
  destination: string;
  service: string;
  time: string;
  eta?: Eta;
  timeValue: Dayjs;
  routeNumber: number;
}
