const mapStylesHalloween: Array<google.maps.MapTypeStyle> = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [
      {
        hue: '#ffa200',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        gamma: 0.01,
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        saturation: -31,
      },
      {
        lightness: -33,
      },
      {
        weight: 2,
      },
      {
        gamma: 0.8,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        lightness: 30,
      },
      {
        saturation: 30,
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#14aa3a',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        saturation: 20,
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        lightness: 20,
      },
      {
        saturation: -20,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        lightness: 10,
      },
      {
        saturation: -30,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        saturation: 25,
      },
      {
        lightness: 25,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        lightness: -20,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#56445d',
      },
    ],
  },
];

export default mapStylesHalloween;
