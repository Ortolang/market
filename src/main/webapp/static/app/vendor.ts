declare var window: any;
if (process.env.NODE_ENV === 'test') {
    window.OrtolangConfig = require('../test/ortolang-config.json');
}

if (process.env.NODE_ENV === 'development') {
    window.OrtolangConfig = require('./ortolang-config.json');
}

/* piwik */
import './common/piwik/piwik';

import 'keycloak-js';
import 'jquery';

// AngularJS 1.x
import 'angular';
import 'angular-route';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-messages';
import 'angular-touch';
import 'angular-cookies';
import 'angular-animate';
import 'angular-i18n/angular-locale_fr';

// Dependencies
import 'angular-translate';
import 'angular-file-upload/dist/angular-file-upload';
import 'angular-strap';
import 'angular-hotkeys';
import 'api-check';
import 'angular-strap';
import 'angular-formly';
import 'angular-formly-templates-bootstrap';
import 'bootstrap';
import 'angular-bootstrap-toggle-switch';
import 'angular-xeditable';
import 'awesome-bootstrap-checkbox';
import 'atmosphere.js';
import 'angulartics';
import 'angulartics-piwik';
import 'moment';
import 'moment/locale/fr.js';
import 'angular-moment';
import 'angular-motion';
import 'angular-chart.js';
import 'angular-drag-and-drop-lists';
import 'angular-duration-format';
import 'angular-highlightjs';
import 'angular-xeditable';
import 'angular-hotkeys';
import 'ng-showdown';
import 'holderjs';
import 'CETEIcean';
import 'ng-tags-input';
import 'angular-zinfinitescroll';
import 'ng-wig';
import 'clipboard';
import 'ngclipboard';
import 'angular-xml-cjs2';
import 'rx';

// VueJS
// import 'vue/dist/vue'
// import Vue from 'vue';
import 'ngVue';
import 'ngVue/build/plugins.js'

// Angular 2
// import '@angular/platform-browser';
// import '@angular/platform-browser-dynamic';
// import '@angular/core';
// import '@angular/common';
// import '@angular/http';
// import '@angular/router';

// RxJS
// import 'rxjs';


// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

// LESS
import './styles/less/custom-bootstrap.less';
// CSS
import 'font-awesome/css/font-awesome.css';
// For version 10
import 'highlight.js/styles/solarized-light.css';
// For version 11
// import 'highlight.js/styles/intellij-light.css';
import 'angular-bootstrap-toggle-switch/style/bootstrap3/angular-toggle-switch-bootstrap-3.css';
import 'angular-hotkeys/src/hotkeys.css';
import 'angular-motion/dist/angular-motion.css';
import 'angular-xeditable/dist/css/xeditable.css';
import 'bootstrap-additions/dist/bootstrap-additions.css';
import 'ng-tags-input/build/ng-tags-input.css';
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import 'ng-wig/src/css/ng-wig.css';
// JS
import 'angular-strap/dist/angular-strap.tpl.js';
