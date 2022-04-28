const isProd = false;
const mapsApiKey = 'AIzaSyDkT81ky0Yn3JYuk6bFCsq4PVmjXawppFI';
const prodFirebaseConfig = {
  apiKey: 'AIzaSyBOuEBXI6j7fEujpcrV6GDATAPnwGOxeD0',
  authDomain: 'unibus-app.firebaseapp.com',
  databaseURL: 'https://unibus-app.firebaseio.com',
  projectId: 'unibus-app',
  storageBucket: 'unibus-app.appspot.com',
  messagingSenderId: '878954295159',
  appId: '1:878954295159:web:643a9648c171c35158fb72',
  measurementId: 'G-L0ZKMV89X7',
};
const devFirebaseConfig = {
  apiKey: 'AIzaSyCRi3l5iMppXSdpoyTGNXQqFGixalv1c8E',
  authDomain: 'uni-bus-dev.firebaseapp.com',
  databaseURL: 'https://uni-bus-dev.firebaseio.com',
  projectId: 'uni-bus-dev',
  storageBucket: 'uni-bus-dev.appspot.com',
  messagingSenderId: '263162834816',
  appId: '1:263162834816:web:80b857ba3827d89bc2db65',
  measurementId: 'G-5GKQ9NPPG8',
};

export default {
  mapsApiKey,
  apiURL: 'https://20220427t182541-dot-unibus-app.nw.r.appspot.com',
  // apiURL: 'http://localhost:8080',
  firebase: isProd ? prodFirebaseConfig : devFirebaseConfig,
};
