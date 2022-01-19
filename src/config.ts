const isProd = false;
const mapsApiKey = '';
const prodFirebaseConfig = '{}';
const devFirebaseConfig = '{}';

export default {
  mapsApiKey,
  apiURL: 'https://20210404t132447-dot-unibus-app.nw.r.appspot.com',
  // apiUrl: 'http://localhost:8080',
  firebase: isProd ? prodFirebaseConfig : devFirebaseConfig,
};
