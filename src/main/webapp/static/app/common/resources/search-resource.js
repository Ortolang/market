'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.SearchResource
 * @description
 * # SearchResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('SearchResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/search', {}, {
            json: {
                url: url.api + '/search/json',
                transformRequest: function (data) {
                    return $.param(data);
                },
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (data) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                method: 'POST',
                isArray: true
            },
            findCollections: {
                url: url.api + '/search/collections',
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
            findProfiles: {
                url: url.api + '/search/profiles',
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
            findCollection: {
                url: url.api + '/search/collections/:key',
                method: 'GET'
            },
            findWorkspace: {
                url: url.api + '/search/workspaces/:alias',
                method: 'GET'
            },

            index: {
                url: url.api + '/search/index',
                method: 'GET',
                isArray: true
            }
        });
    }]);
