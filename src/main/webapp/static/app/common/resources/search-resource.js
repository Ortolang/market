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
            findCollections: {
                url: url.api + '/search/collections',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            findWorkspaces: {
                url: url.api + '/search/workspaces',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            findWorkspace: {
                url: url.api + '/search/workspaces/:alias',
                method: 'GET'
            },
            getProfile: {
                url: url.api + '/search/profiles/:key',
                method: 'GET',
                transformResponse: function (data) {
                    return angular.fromJson(data);
                }
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
            items: {
                url: url.api + '/search/items',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            getItem: {
                url: url.api + '/search/items/:id',
                method: 'GET'
            },
            getWorkspace: {
                url: url.api + '/search/workspaces/:alias',
                method: 'GET'
            },
            countWorkspaces: {
                url: url.api + '/search/count/workspaces',
                method: 'GET'
            },
            getEntity: {
                url: url.api + '/search/entities/:id',
                method: 'GET'
            },
            getPerson: {
                url: url.api + '/search/persons/:key',
                method: 'GET'
            },
            index: {
                url: url.api + '/search/index',
                method: 'GET',
                isArray: true
            }
        });
    }]);
