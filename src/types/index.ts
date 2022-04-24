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
  scheduledDeparture: string;
}

interface MessageAction {
  label: string;
  url: string;
}

export interface Message {
  body: string;
  title: string;
  date?: any;
  icon: string;
  id: string;
  actions?: MessageAction[];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export enum SWBroadcastMessage {
  UpdateAvailable = 'UPDATE_AVAILABLE',
  UpdateActivated = 'b',
  SkipWaiting = 'SKIP_WAITING',
}
