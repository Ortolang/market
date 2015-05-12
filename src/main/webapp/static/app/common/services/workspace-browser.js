'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceBrowserService
 * @description
 * # WorkspaceBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceBrowserService', ['WorkspaceElementResource', function (WorkspaceElementResource) {

        function getData(config) {
            if (config.path) {
                delete config.oKey;
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        return {
            getId: function () { return 'WorkspaceBrowserService'; },
            getData: getData,
            getDataResource: 'workspace',
            canDelete: true,
            canAdd: true,
            canDownload: true,
            canPreview: true,
            canChangeRoot: true,
            hasBreadcrumb: true,
            defaultViewMode: 'line',
            canSwitchViewMode: true,
            canExecuteTool: true,
            displayAsideInfo: true,
            displayAsideWorkspaceList: true,
            isFileSelect: false
        };
    }]);
