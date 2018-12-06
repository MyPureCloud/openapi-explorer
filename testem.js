const chromium = require('ember-chromium');

// any chromium flags you want
const chromiumArgs = [
  '--disable-gpu',
  '--no-sandbox'];

const config = chromium.getTestemConfig(chromiumArgs);
module.export = config;