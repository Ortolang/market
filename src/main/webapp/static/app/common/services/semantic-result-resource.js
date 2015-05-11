'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.SemanticResultResource
 * @description
 * # SemanticResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('SemanticResultResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/rest/objects/semantic', {}, {
            get: {
                method: 'GET',
                isArray: false
            }
        });
    }]);
