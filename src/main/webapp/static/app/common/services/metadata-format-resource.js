'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataFormatResource
 * @description
 * # MetadataFormatResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MetadataFormatResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/metadataformats', {}, {
        	download: {
                url: Url.urlBase() + '/rest/metadataformats/download',
                method: 'GET',
                isArray: false
            }
        });
    }]);
