'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.RuntimeResource
 * @description
 * # RuntimeResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('RuntimeResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/runtime/', {}, {
            processes: {
                method: 'GET',
                url: Url.urlBase() + '/rest/runtime/processes/:pcKey'
            },
            tasks: {
                method: 'GET',
                url: Url.urlBase() + '/rest/runtime/tasks/:tId'
            },
            claimTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'claim';
                    return angular.toJson(data);
                },
                url: Url.urlBase() + '/rest/runtime/tasks/:tId'
            },
            completeTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'complete';
                    return angular.toJson(data);
                },
                url: Url.urlBase() + '/rest/runtime/tasks/:tId'
            },
            createProcess: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: Url.urlBase() + '/rest/runtime/processes/'
            },
            types: {
                method: 'GET',
                url: Url.urlBase() + '/rest/runtime/types/'
            }
        });
    }]);
