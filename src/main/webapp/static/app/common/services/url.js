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
            //urlBase = 'http://localhost:8080/api';
            urlBase = 'https://localhost:8443/api';
            urlBaseTool = 'http://localhost:8080/tool-';
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
