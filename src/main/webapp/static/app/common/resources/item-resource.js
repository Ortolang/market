'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ItemResource
 * @description
 * # ItemResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ItemResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/items', {}, {
        	list: {
                url: url.api + '/items',
                method: 'GET',
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
                isArray: true
            }
        });
    }]);
