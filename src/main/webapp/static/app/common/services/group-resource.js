'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.GroupResource
 * @description
 * # GroupResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('GroupResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/groups/:key', {key: '@key'}, {
            addMember: {
                method: 'PUT'
            }
        });
    }]);
