'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MarketBrowserService
 * @description
 * # MarketBrowserService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MarketBrowserService', ['ObjectResource', function (ObjectResource) {

        function getData(config) {
            if (config.oKey) {
                return ObjectResource.get({oKey: config.oKey});
            }
            console.error('oKey must be provided', config);
            return undefined;
        }

        return {
            getId: function () { return 'MarketBrowserService'; },
            getData: getData,
            getDataResource: 'object',
            canDelete: false,
            canAdd: false,
            canDownload: true,
            canPreview: true,
            canChangeRoot: false,
            hasBreadcrumb: false,
            defaultViewMode: 'tile',
            canSwitchViewMode: true,
            displayAsideInfo: false,
            displayAsideWorkspaceList: false,
            isFileSelect: false
        };
    }]);
