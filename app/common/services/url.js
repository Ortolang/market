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
            // TODO: remove hack for local development
            urlBase = 'http://localhost:8080/api';
        } else {
            urlBase = '/api';
        }

        return {
            urlBase: function () {
                return urlBase;
            }
        };
    });
