'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataFormatResource
 * @description
 * # MetadataFormatResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MetadataFormatResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/metadataformats', {}, {
            download: {
                url: url.api + '/metadataformats/download',
                method: 'GET',
                isArray: false
            }
        });
    }]);
