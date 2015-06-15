'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceBrowserService
 * @description
 * # WorkspaceBrowserService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('WorkspaceBrowserService', ['WorkspaceElementResource', function (WorkspaceElementResource) {

        function getData(config) {
            if (config.path) {
                delete config.key;
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        this.id = 'WorkspaceBrowserService';
        this.getData = getData;
        this.dataResource = 'workspace';
        this.canDelete = true;
        this.canAdd = true;
        this.canDownload = true;
        this.canPreview = true;
        this.canChangeRoot = true;
        this.hasBreadcrumb = true;
        this.defaultViewMode = 'line';
        this.canSwitchViewMode = true;
        this.canExecuteTool = true;
        this.displayAsideInfo = true;
        this.displayAsideWorkspaceList = true;
        this.isFileSelect = false;
        this.workspace = {};

        return this;
    }]);
