'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ReferentialResource
 * @description
 * # ReferentialResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ReferentialResource', ['$resource', 'url', function ($resource, url) {
        //noinspection JSUnusedGlobalSymbols
        return $resource(url.api + '/referential/:name', {}, {
            list: {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        if (data.entries) {
                            angular.forEach(data.entries, function (entry) {
                                if (entry.content) {
                                    entry.content = angular.fromJson(entry.content);
                                }
                            });
                        }
                    }
                    return data;
                }
            },
            get: {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        if (data.content) {
                            data.content = angular.fromJson(data.content);
                        }
                    }
                    return data;
                }
            },
            put: {
                method: 'PUT'
            },
            post: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }
        });
    }]);
