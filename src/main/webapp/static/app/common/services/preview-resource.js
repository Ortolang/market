'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PreviewResource
 * @description
 * # PreviewResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('PreviewResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/previews/:key', {key: '@key'}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
