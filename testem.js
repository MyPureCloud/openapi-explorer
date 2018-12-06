const chromium = require('ember-chromium');

// any chromium flags you want
const chromiumArgs = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-gesture-requirement-for-media-playback',
  '--allow-file-access',
  '--use-fake-device-for-media-stream',
  '--use-fake-ui-for-media-stream'
];

const config = chromium.getTestemConfig(chromiumArgs);
module.export = config;