'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ReferentialResource
 * @description
 * # ReferentialResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ReferentialResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/referential/:name', {}, {
            put: {
                method: 'PUT'
            },
            post: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }
        });
    }]);
