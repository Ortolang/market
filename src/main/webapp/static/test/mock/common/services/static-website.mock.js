'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.StaticWebsite
 * @description
 * # StaticWebsite
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('StaticWebsite', [function () {

        return {
            getInformationContent: function () { return undefined; },
            getInformationPageTitle: function () { return undefined; },
            getNews: function () { return undefined; },
            getHomePage: function () { return undefined; }
        };
    }]);
