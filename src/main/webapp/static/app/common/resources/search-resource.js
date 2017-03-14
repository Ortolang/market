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
            items: {
                url: url.api + '/search/items',
                method: 'GET'
            },
            getItem: {
                url: url.api + '/search/items/:id',
                method: 'GET'
            },
            getWorkspace: {
                url: url.api + '/search/workspaces/:alias',
                method: 'GET'
            },
            entities: {
                url: url.api + '/search/entities',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            getEntity: {
                url: url.api + '/search/entities/:id',
                method: 'GET'
            },
            persons: {
                url: url.api + '/search/persons',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            getPerson: {
                url: url.api + '/search/persons/:key',
                method: 'GET'
            },
            organizations: {
                url: url.api + '/search/organizations',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            getOrganization: {
                url: url.api + '/search/organizations/:key',
                method: 'GET'
            },
            roles: {
                url: url.api + '/search/roles',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            getRole: {
                url: url.api + '/search/roles/:key',
                method: 'GET'
            },
            languages: {
                url: url.api + '/search/languages',
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                }
            },
            profiles: {
                url: url.api + '/search/profiles',
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data = data.hits;
                    if (angular.isArray(data)) {
                        var i = 0;
                        for (i; i < data.length; i++) {
                            data[i] = angular.fromJson(data[i]);
                        }
                    }
                    return data;
                },
                isArray: true
            }
        });
    }]);
