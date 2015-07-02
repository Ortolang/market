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
            getInformationMenu: function () { return undefined; }
        };
    }]);
