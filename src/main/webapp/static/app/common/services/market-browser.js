'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MarketBrowserService
 * @description
 * # MarketBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('MarketBrowserService', ['ObjectResource', function (ObjectResource) {

        function getData(config) {
            if (config.key) {
                return ObjectResource.get({key: config.key});
            }
            console.error('Key must be provided', config);
            return undefined;
        }

        this.id = 'MarketBrowserService';
        this.getData = getData;
        this.dataResource = 'object';
        this.canDelete = false;
        this.canAdd = false;
        this.canDownload = true;
        this.canPreview = true;
        this.canChangeRoot = false;
        this.hasBreadcrumb = false;
        this.defaultViewMode = 'tile';
        this.canSwitchViewMode = true;
        this.displayAsideInfo = false;
        this.displayAsideWorkspaceList = false;
        this.isFileSelect = false;
        this.workspace = {};

        return this;
    }]);
