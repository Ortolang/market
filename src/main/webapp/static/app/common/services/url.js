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
<<<<<<< HEAD:src/main/webapp/static/app/common/services/url.js
            //urlBase = 'http://localhost:8080/api';
            urlBase = 'https://localhost:8443/api';
=======
            urlBase = 'http://localhost:8080/api';
            urlBaseTool = 'http://localhost:8080/tool-';
            //urlBase = 'https://localhost:8443/api';
>>>>>>> 22e78b03193b3a8fde7dad6ef577d41e67238aed:app/common/services/url.js
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
