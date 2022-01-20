const replace = require('replace-in-file');
require('dotenv').config();

const isProd = process.env.ANALYTICS === 'enabled';
const mapsAPIKey = process.env.MAPS_API_KEY;
const prodFirebaseConfig = process.env.PROD_FIREBASE_CONFIG;
const devFirebaseConfig = process.env.DEV_FIREBASE_CONFIG;

const options = {
  files: './src/config.ts',
  from: [
    /isProd = false/g,
    /mapsApiKey = ''/g,
    /prodFirebaseConfig = '{}'/g,
    /devFirebaseConfig = '{}'/g,
  ],
  to: [
    `isProd = ${isProd.toString()}`,
    `mapsApiKey = '${mapsAPIKey}'`,
    `prodFirebaseConfig = ${prodFirebaseConfig}`,
    `devFirebaseConfig = ${devFirebaseConfig}`,
  ],
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw (
      "Please make sure that file '" + options.files + "' has \"isProd = ''\""
    );
  }
  console.log('Production analytics enabled: ', isProd.toString());
} catch (error) {
  console.error('Error occurred:', error);
  throw error;
}
