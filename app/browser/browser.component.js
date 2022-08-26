'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:browser
 * @description
 * # browser
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('browser', {
        controller: 'BrowserCtrl',
        bindings: {
            options: '<?',
            workspaces: '<?',
            workspace: '<',
            license: '<',
            root: '<?'
        },
        templateUrl: 'browser/browser.component.html'
    });
