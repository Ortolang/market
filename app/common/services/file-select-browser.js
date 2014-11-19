'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FileSelectBrowserService
 * @description
 * # FileSelectBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FileSelectBrowserService', ['WorkspaceElementResource', 'DownloadResource', function (WorkspaceElementResource, DownloadResource) {

        function getData(config) {
            if (config.path) {
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        function buildChildDownloadUrl(data, parent, root) {
            return DownloadResource.getDownloadUrl({wskey: parent.workspace, path: parent.path + '/' + data.name, root: root});
        }

        function buildChildBrowseUrl(child, parent, root) {
            return '/workspaces/' + parent.workspace + '/' + root + '/' +  parent.path + '/' + child.name + '/browse';
        }

        return {
            getId: function () { return 'FileSelectBrowserService'; },
            getData: getData,
            getDataResource: 'workspace',
            buildChildDownloadUrl: buildChildDownloadUrl,
            buildChildBrowseUrl: buildChildBrowseUrl,
            canDelete: false,
            canAdd: false,
            canDownload: false,
            canPreview: false,
            hasBreadcrumb: true,
            defaultViewMode: 'line',
            canSwitchViewMode: false,
            displayAsideInfo: false,
            displayAsideWorkspaceList: true,
            isFileSelect: true
        };
    }]);
