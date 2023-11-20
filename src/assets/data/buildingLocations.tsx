interface BuildingsInterface {
  buildingName: string;
  location: { lat: number; lng: number };
  description?: string;
  link?: string;
}

export const buildings: Array<BuildingsInterface> = [
  {
    buildingName: 'Anglesea Building',
    location: {
      lat: 50.79790806758514,
      lng: -1.0959255555419878,
    },
  },
];
