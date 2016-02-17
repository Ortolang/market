'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataResource
 * @description
 * # MetadataResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MetadataResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/metadata', {}, {
        	listCollections: {
                url: url.api + '/metadata/collections',
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                },
                isArray: true
            },
            listProfiles: {
                url: url.api + '/metadata/profiles',
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                },
                isArray: true
            },
            getCollection: {
                url: url.api + '/metadata/collections/:key',
                method: 'GET'
            },
            getWorkspace: {
                url: url.api + '/metadata/workspaces/:alias',
                method: 'GET'
            }
        });
    }]);
