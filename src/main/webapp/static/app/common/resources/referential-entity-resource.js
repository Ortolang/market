'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ReferentialEntityResource
 * @description
 * # ReferentialEntityResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ReferentialEntityResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/referentialentities/:name', {}, {
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
