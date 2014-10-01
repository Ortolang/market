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
    return $resource(Url.urlBase() + '/rest/processes/:pcKey', {}, {
        create : {
            method : 'POST',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}
]);
