'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FormResource
 * @description
 * # FormResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FormResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/forms/:formKey', {}, {
        });
    }]);
