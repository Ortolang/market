'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.RuntimeResource
 * @description
 * # RuntimeResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('RuntimeResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/rest/runtime/', {}, {
            processes: {
                method: 'GET',
                url: url.api + '/rest/runtime/processes/:pcKey'
            },
            tasks: {
                method: 'GET',
                url: url.api + '/rest/runtime/tasks/:tId'
            },
            claimTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'claim';
                    return angular.toJson(data);
                },
                url: url.api + '/rest/runtime/tasks/:tId'
            },
            completeTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'complete';
                    return angular.toJson(data);
                },
                url: url.api + '/rest/runtime/tasks/:tId'
            },
            createProcess: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: url.api + '/rest/runtime/processes/'
            },
            types: {
                method: 'GET',
                url: url.api + '/rest/runtime/types/'
            }
        });
    }]);
