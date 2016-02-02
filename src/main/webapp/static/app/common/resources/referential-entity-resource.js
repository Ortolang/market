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
        return $resource(url.api + '/referentialentities/:name', {name: '@name'});
    }]);
