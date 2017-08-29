/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'openapi-explorer',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    authHeader: process.env.AUTH_HEADER,
    defaultOpenApiUrl: process.env.DEFAULT_OPENAPI_URL || "/swagger.json",
    permissionsKeyName: process.env.PERMISSIONS_KEY_NAME || "x-inin-requires-permissions",

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.baseURL = '/openapi-explorer/';

    if (process.env.CDN_URL) {
        ENV.APP.urlprefix = process.env.CDN_URL;
    }
  }

  return ENV;
};
