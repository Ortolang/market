'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.EventFeedResource
 * @description
 * # EventFeedResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('EventFeedResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/feeds/:key', {key: '@key'}, {
        });
    }]);
