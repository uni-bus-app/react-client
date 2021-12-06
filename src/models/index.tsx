import { Dayjs } from 'dayjs';

export interface Stop {
  id: string;
  name: string;
  location: LatLng;
  routeOrder: number;
}

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

export interface Message {
  body: string;
  title: string;
  date?: any;
  icon: string;
  id: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}
