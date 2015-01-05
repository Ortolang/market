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

        var urlBase, urlBaseTool;
        if (window.location.hostname === 'localhost') {
            // TODO: remove hack for local development
            urlBase = 'https://localhost:8443/api';
            urlBaseTool = 'https://localhost:8443/tool-';
        } else {
            urlBase = '/api';
            urlBaseTool = '/tool-';
        }

        return {
            urlBase: function () {
                return urlBase;
            },
            urlBaseTool: function () {
                return urlBaseTool;
            }
        };
    });
