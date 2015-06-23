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
        return $resource(url.api + '/runtime/', {}, {
            processes: {
                method: 'GET',
                url: url.api + '/runtime/processes/:pcKey'
            },
            tasks: {
                method: 'GET',
                url: url.api + '/runtime/tasks/:tId'
            },
            claimTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'claim';
                    return angular.toJson(data);
                },
                url: url.api + '/runtime/tasks/:tId'
            },
            completeTask: {
                method: 'POST',
                transformRequest: function (data) {
                    data.action = 'complete';
                    return angular.toJson(data);
                },
                url: url.api + '/runtime/tasks/:tId'
            },
            createProcess: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: url.api + '/runtime/processes/'
            },
            types: {
                method: 'GET',
                url: url.api + '/runtime/types/'
            },
            remoteProcesses: {
                method: 'GET',
                url: url.api + '/runtime/remote-processes/:rpKey'
            }
        });
    }]);
