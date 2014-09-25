'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ProfilDAO
 * @description
 * # ProfilDAO
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
      .factory('ProfilDAO', ['$resource', 'Url',
        function ($resource, Url) {
            return $resource(Url.urlBase() + '/rest/profiles/:userId/', {userId: '@id'}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
        }]);
