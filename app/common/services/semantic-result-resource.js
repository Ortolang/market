'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.SemanticResultResource
 * @description
 * # SemanticResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('SemanticResultResource', ['$resource', 'Url', function ($resource, Url) {

        return $resource(Url.urlBase() + '/rest/objects/semantic', {}, {
            get: {
                method: 'GET',
                isArray: false
            }
        });
    }]);
