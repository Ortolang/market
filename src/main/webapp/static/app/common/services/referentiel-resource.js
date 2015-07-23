'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ReferentielResource
 * @description
 * # ReferentielResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ReferentielResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/referentiels/:refKey', {}, {
        });
    }]);
