'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Settings
 * @description
 * # Settings
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Settings', [function () {

        this.WorkspaceBrowserService = {
            hideInfo: false,
            hideWorkspaceList: false,
            hideWorkspaceListMdScreen: false
        };

        this.MarketBrowserService  = {
            hideInfo: false
        };

        this.FileSelectBrowserService  = {};

        this.language = undefined;

        this.store = function () {
            if (localStorage !== undefined) {
                localStorage.setItem('ortolang.settings', JSON.stringify(this));
            }
        };

        this.init = function () {
            //console.log('Initialize settings');
            if (localStorage !== undefined) {
                var savedSettings = localStorage.getItem('ortolang.settings'),
                    that = this;
                if (savedSettings && savedSettings !== 'undefined') {
                    angular.forEach(JSON.parse(savedSettings), function (value, key) {
                        if (angular.isObject(value)) {
                            angular.extend(that[key], value);
                        } else {
                            that[key] = value;
                        }
                    });
                }
            }
            //console.log('Settings initialized %o', this);
        };

        this.init();

        return this;
    }]);
