// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
//import { AppModule } from './app.module';

// if (process.env.ENV === 'production') {
//     enableProdMode();
// }

declare var window: any;
if (process.env.ENV === 'test') {
    window.OrtolangConfig = require('json!../test/ortolang-config.json');
}

if (process.env.ENV === 'dev') {
    window.OrtolangConfig = require('json!./ortolang-config.json');
}

// platformBrowserDynamic().bootstrapModule(AppModule);
import './app.module';

// BROWSER
import './browser/browser.component';
import './browser/browser.controller';
import './browser/browser-aside-information.component';
import './browser/browser-config.constant';
import './browser/browser-file-select.component';
import './browser/browser-uploader.controller';
import './browser/browser-uploader.component';
import './browser/browser-workspaces-list.component';
import './browser/i18n/browser.fr';
import './browser/i18n/browser.en';
// COMMON
/* constants */
import './common/constants/url';
import './common/constants/icons';
import './common/constants/ortolang-type';
import './common/constants/process-states';
/* auth */
import './common/auth/auth-ctrl';
import './common/auth/auth-init';
import './common/auth/interceptors';
import './common/auth/user';
/* atmosphere */
import './common/atmosphere/atmosphere-service';
import './common/atmosphere/atmosphere-listener';
/* filters */
import './common/filters/bytes';
import './common/filters/hz';
import './common/filters/content-type';
import './common/filters/ortolang-element-icon-css';
import './common/filters/mime-type-icon-css';
import './common/filters/split';
import './common/filters/diacritics';
import './common/filters/remove-accents';
import './common/filters/event-feed-filter';
import './common/filters/event-feed-description';
import './common/filters/diff-icon-css';
import './common/filters/diff-description';
import './common/filters/organization-name';
import './common/filters/numbers';
/* components */
import './common/components/avatar.component';
import './common/components/hal-publications.component';
import './common/components/order-indicator.component';
import './common/components/organization-card.component';
import './common/components/profile-card.component';
/* directives */
import './common/directives/description';
import './common/directives/parts';
import './common/directives/multilingual-editor';
import './common/directives/ng-right-click';
import './common/directives/ortolang-item-json';
import './common/directives/ortolang-item-json-ctrl';
import './common/directives/holder';
import './common/directives/holder-editor';
import './common/directives/google-auto-complete';
import './common/directives/xeditable-address';
import './common/directives/profile-data-field';
import './common/directives/toggle-visibility';
import './common/directives/thumb';
import './common/directives/on-finish-render';
import './common/directives/target-blank';
import './common/directives/cart-content';
import './common/directives/cookies-consent';
import './common/directives/files-model';
import './common/directives/cetei-cean';
/* formly */
import './common/formly/formly-file-select';
import './common/formly/config';
/* resources */
import './common/resources/workspace-resource';
import './common/resources/profile-resource';
import './common/resources/group-resource';
import './common/resources/form-resource';
import './common/resources/metadata-format-resource';
import './common/resources/object-resource';
import './common/resources/workspace-element-resource';
import './common/resources/search-resource';
import './common/resources/referential-resource';
import './common/resources/statistics-resource';
import './common/resources/runtime-resource';
import './common/resources/event-feed-resource';
import './common/resources/message-resource';
/* services */
import './common/services/helper';
import './common/services/content';
import './common/services/metadata-format';
import './common/services/metadata-manager';
import './common/services/profile';
import './common/services/settings';
import './common/services/cart';
import './common/services/runtime';
/* static-website */
import './common/static-website/static-website';
import './common/static-website/information';
import './common/static-website/i18n/static-website.fr';
import './common/static-website/i18n/static-website.en';
/* nav */
import './common/nav/side-nav-elements';
import './common/nav/side-nav';
import './common/nav/mobile-nav';
import './common/nav/top-nav';
import './common/nav/footer';
import './common/nav/i18n/nav.fr';
import './common/nav/i18n/nav.en';
/* i18n */
import './common/i18n/common.fr';
import './common/i18n/common.en';
import './common/i18n/config.fr';
import './common/i18n/config.en';
import './common/i18n/item.fr';
import './common/i18n/item.en';
/* forms */
import './common/forms/i18n/forms.fr';
import './common/forms/i18n/forms.en';
/* piwik */
import './common/piwik/piwik';
// METADATA EDITOR
import './metadata-editor/metadata-editor.controller';
import './metadata-editor/metadata-editor-view.controller';
import './metadata-editor/oai_dc/oai_dc-metadata-editor.controller';
import './metadata-editor/olac/olac-metadata-editor.controller';
// VISUALIZERS
import './visualizers/visualizer.component';
import './visualizers/visualizer.service';
import './visualizers/audio/audio-visualizer';
import './visualizers/image/image-visualizer';
import './visualizers/video/video-visualizer';
import './visualizers/text/text-visualizer';
import './visualizers/text/markdown-visualizer';
import './visualizers/text/pdf-visualizer';
import './visualizers/i18n/visualizers.fr';
import './visualizers/i18n/visualizers.en';
// WORKSPACE
import './workspace/workspaces';
import './workspace/workspace-dashboard';
import './workspace/workspace-dashboard-members';
import './workspace/workspace-dashboard-metadata';
import './workspace/workspace-dashboard-permissions';
import './workspace/workspace-dashboard-threads';
import './workspace/workspace-service';
import './workspace/services/workspace-metadata-service';
import './workspace/i18n/workspace.fr';
import './workspace/i18n/workspace.en';
import './workspace/templates/add-member-modal';
import './workspace/templates/basic-info';
import './workspace/templates/whos-involved';
import './workspace/templates/add-person-modal';
import './workspace/templates/add-organization-modal';
import './workspace/templates/additional-info';
import './workspace/templates/specific-fields';
import './workspace/templates/add-language-modal';
import './workspace/templates/licence';
import './workspace/templates/import-metadata';
import './workspace/templates/workspace-metadata-parts-ctrl';
import './workspace/directives/contributors-editor';
import './workspace/services/ortolang-item-json-migration';
// PROCESSES
import './processes/i18n/processes.fr';
import './processes/i18n/processes.en';
// MARKET
import './market/directives/item';
import './market/directives/market-toolbar';
import './market/directives/items';
import './market/directives/home-news';
import './market/directives/preview-line';
import './market/directives/preview-list';
import './market/directives/preview-slideshow';
import './market/directives/preview-url';
import './market/directives/preview-box';
import './market/item-ctrl';
import './market/templates/ortolang-item-json-13';
import './market/templates/ortolang-item-json-14';
import './market/templates/ortolang-item-json-15';
import './market/templates/ortolang-item-json-16';
import './market/home';
import './market/services/query-builder-service';
import './market/services/option-faceted-filter';
import './market/services/faceted-filter';
import './market/services/faceted-filter-manager';
import './market/services/search-provider';
import './market/corpora';
import './market/lexicons';
import './market/applications';
import './market/tools';
import './market/terminologies';
import './market/search';
import './market/news';
import './market/i18n/market.fr';
import './market/i18n/market.en';
// PRODUCER
import './producer/i18n/producer.fr';
import './producer/i18n/producer.en';
import './producer/producers';
import './producer/producer';
// CONTRIBUTOR
import './contributor/i18n/contributor.fr';
import './contributor/i18n/contributor.en';
import './contributor/contributor';
// PROFILE
import './profile/i18n/profile.fr';
import './profile/i18n/profile.en';
import './profile/profile-ctrl';
import './profile/productions';
import './profile/friends';
import './profile/tasks';

// STYLE
import './styles/less/app.less';

import './robots.txt';
if (process.env.ENV === 'dev') {
    require('./keycloak.json');
}

import './manifest.json';
import './browserconfig.xml';
import './BingSiteAuth.xml';
import './favicon.ico';
//@require "./assets/icons/*"
