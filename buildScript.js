const replace = require('replace-in-file');

const value = process.env.ANALYTICS === 'enabled';

const options = {
  files: './src/config.ts',
  from: /isProd = false/g,
  to: 'isProd = ' + value.toString(),
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw (
      "Please make sure that file '" + options.files + "' has \"isProd = ''\""
    );
  }
  console.log('Production analytics enabled: ', value.toString());
} catch (error) {
  console.error('Error occurred:', error);
  throw error;
}
