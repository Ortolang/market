'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.objects
 * @description
 * # objects
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
  .factory('Objects', ['$resource', 'Url',function ($resource, Url) {
   
            return $resource(Url.urlBase() + '/rest/objects/:oKey/keys', {}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });
  }]);
