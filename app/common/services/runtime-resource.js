'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.RuntimeResource
 * @description
 * # RuntimeResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('RuntimeResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/runtime/processes/:pcKey', {}, {
            create : {
                method : 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        });
    }]);
