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

        var urlBase;
        if (window.location.hostname === 'localhost') {
            urlBase = 'https://localhost:8443/api';
        } else {
            urlBase = '/api';
        }

        return {
            urlBase: function () {
                return urlBase;
            }
        };
    });
