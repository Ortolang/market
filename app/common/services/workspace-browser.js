'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceBrowserService
 * @description
 * # WorkspaceBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceBrowserService', ['WorkspaceElementResource', 'DownloadResource', function (WorkspaceElementResource, DownloadResource) {

        function getData(config) {
            if (config.path) {
                return WorkspaceElementResource.get(config);
            }
            console.error('path must be provided', config);
            return undefined;
        }

        function buildChildDownloadUrl(data, parent, root) {
            return DownloadResource.getDownloadUrl({wsName: parent.workspace, path: parent.path + '/' + data.name, root: root});
        }

        function buildChildBrowseUrl(child, parent, root) {
            return '/workspaces/' + parent.workspace + '/' + root + '/' +  parent.path + '/' + child.name + '/browse';
        }

        function buildBrowseUrlFromPath(wsName, path, root) {
            return '/workspaces/' + wsName + '/' + root + '/' + path + '/browse';
        }

        return {
            getId: function () { return 'WorkspaceBrowserService'; },
            getData: getData,
            getDataResource: 'workspace',
            buildChildDownloadUrl: buildChildDownloadUrl,
            buildChildBrowseUrl: buildChildBrowseUrl,
            buildBrowseUrlFromPath: buildBrowseUrlFromPath,
            canDelete: true,
            canAdd: true,
            canDownload: true,
            canPreview: true,
            hasBreadcrumb: true,
            defaultViewMode: 'line',
            canSwitchViewMode: true,
            displayAsideInfo: true,
            displayAsideWorkspaceList: true,
            isFileSelect: false
        };
    }]);
