'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:browserUploader
 * @description
 * # browserUploader
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('browserUploader', {
        controller: 'BrowserUploaderCtrl',
        bindings: {
            workspace: '<',
            parent: '<'
        },
        templateUrl: 'browser/browser-uploader.component.html'
    });
