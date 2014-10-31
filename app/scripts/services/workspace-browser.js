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

        return {
            getId: function () { return 'WorkspaceBrowserService'; },
            getData: getData,
            buildChildDownloadUrl: buildChildDownloadUrl,
            buildChildBrowseUrl: buildChildBrowseUrl,
            canDelete: true,
            canAdd: true,
            canPreview: true,
            hasBreadcrumb: true,
            defaultViewMode: 'line',
            canSwitchViewMode: true,
            displayAsideInfo: true
        };
    }]);
