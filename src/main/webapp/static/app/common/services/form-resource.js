'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FormResource
 * @description
 * # FormResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FormResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/rest/forms/:formKey', {}, {
        });
    }]);
