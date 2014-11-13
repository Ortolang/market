'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ProcessResource
 * @description
 * # ProcessResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ProcessResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/processes/:pcKey', {}, {
            create : {
                method : 'POST',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        });
    }
    ]);
