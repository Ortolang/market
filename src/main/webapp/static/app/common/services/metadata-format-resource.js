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
        return $resource(Url.urlBase() + '/rest/metadataformats/:mdfKey', {}, {
        	download: {
                url: Url.urlBase() + '/rest/metadataformats/:mdfKey/download',
                method: 'GET',
                isArray: false
            }
        });
    }]);
