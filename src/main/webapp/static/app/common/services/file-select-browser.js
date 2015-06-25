'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FileSelectBrowserService
 * @description
 * # FileSelectBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('FileSelectBrowserService', ['WorkspaceElementResource', function (WorkspaceElementResource) {

        function getData(config) {
            if (config.path) {
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        this.id = 'FileSelectBrowserService';
        this.getData = getData;
        this.dataResource = 'workspace';
        this.canDelete = false;
        this.canAdd = false;
        this.canDownload = false;
        this.canPreview = false;
        this.canChangeRoot = true;
        this.hasBreadcrumb = true;
        this.defaultViewMode = 'line';
        this.canSwitchViewMode = false;
        this.displayAsideInfo = false;
        this.displayAsideWorkspaceList = true;
        this.workspace = {};

        return this;
    }]);
