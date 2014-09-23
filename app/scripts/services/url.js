'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Url
 * @description
 * # Url
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Url', function () {

        var urlBase = 'http://localhost:8080/api';

        return {
            urlBase: function () {
                return urlBase;
            }
        };
    });
