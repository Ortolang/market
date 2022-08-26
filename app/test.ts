import './vendor';
import 'angular-mocks/ngMock';
import './main';

Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

var appContext = require.context('../test/mock', true, /.*\.(t|j)s$/);
appContext.keys().forEach(appContext);

appContext = require.context('../test/spec', true, /.*\.(t|j)s$/);
appContext.keys().forEach(appContext);

__karma__.start();

// var testing = require('@angular/core/testing');
// var browser = require('@angular/platform-browser-dynamic/testing');
//
// testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
