'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FileSelectBrowserService
 * @description
 * # FileSelectBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FileSelectBrowserService', ['WorkspaceElementResource', function (WorkspaceElementResource) {

        function getData(config) {
            if (config.path) {
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        return {
            getId: function () { return 'FileSelectBrowserService'; },
            getData: getData,
            getDataResource: 'workspace',
            canDelete: false,
            canAdd: false,
            canDownload: false,
            canPreview: false,
            canChangeRoot: true,
            hasBreadcrumb: true,
            defaultViewMode: 'line',
            canSwitchViewMode: false,
            displayAsideInfo: false,
            displayAsideWorkspaceList: true,
            isFileSelect: true
        };
    }]);
