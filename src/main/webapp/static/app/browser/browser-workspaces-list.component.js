'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:browserWorkspacesList
 * @description
 * # browserWorkspacesList
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('browserWorkspacesList', {
        bindings: {
            workspaces: '<',
            active: '<',
            onChange: '&'
        },
        templateUrl: 'browser/browser-workspaces-list.component.html'
    });
