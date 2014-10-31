'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MarketBrowserService
 * @description
 * # MarketBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MarketBrowserService', ['ObjectResource', 'DownloadResource', function (ObjectResource, DownloadResource) {

        function getData(config) {
            if (config.oKey) {
                return ObjectResource.get({oKey: config.oKey});
            }
            console.error('oKey must be provided', config);
            return undefined;
        }

        function buildChildDownloadUrl(data, parent, root) {
            return DownloadResource.getDownloadUrl({oKey: data.key});
        }

        function buildChildBrowseUrl(child, parent, root) {
            return '/market/' + child.key;
        }

        return {
            getData: getData,
            buildChildDownloadUrl: buildChildDownloadUrl,
            buildChildBrowseUrl: buildChildBrowseUrl,
            canDelete: false,
            canAdd: false,
            canPreview: true,
            hasBreadcrumb: false,
            defaultViewMode: 'tile',
            canSwitchViewMode: true,
            displayAsideInfo: false
        };
    }]);
