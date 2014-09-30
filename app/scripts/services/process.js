'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.process
 * @description
 * # process
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
  .factory('Process', ['$resource', 'Url', function ($resource, Url) {

          var factory = {};

          factory.createProcess = function (data) {
              return $resource(Url.urlBase() + '/rest/processes/', data, {
                  query: {
                      method: 'POST'
                  }
              });
            };

            return factory;
        }
  ]);
