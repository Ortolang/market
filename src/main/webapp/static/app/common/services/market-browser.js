'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MarketBrowserService
 * @description
 * # MarketBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('MarketBrowserService', ['WorkspaceElementResource', function (WorkspaceElementResource) {

        function getData(config) {
            if (config.path) {
                delete config.key;
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        this.id = 'MarketBrowserService';
        this.getData = getData;
        this.dataResource = 'workspace';
        this.canEdit = false;
        this.canDownload = true;
        this.canPreview = true;
        this.canChangeRoot = false;
        this.hasBreadcrumb = true;
        this.defaultViewMode = 'tile';
        this.canSwitchViewMode = true;
        this.canExecuteTool = false;
        this.displayAsideInfo = false;
        this.displayAsideWorkspaceList = false;
        this.workspace = {};

        return this;
    }]);
