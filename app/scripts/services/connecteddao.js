'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ConnectedDAO
 * @description
 * # ConnectedDAO
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ConnectedDAO', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/profiles/connected/', {}, {
            query: {
                method: 'GET'
            }
        });
    }]);