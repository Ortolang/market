'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.StaticWebsiteMock
 * @description
 * # StaticWebsite
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('StaticWebsiteMock', [function () {

        return {
            getInformationContent: function () { return undefined; },
            getInformationPageTitle: function () { return undefined; },
            getNews: function () { return undefined; },
            getHomePage: function () { return undefined; }
        };
    }]);
