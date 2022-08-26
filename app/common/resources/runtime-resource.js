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
            readProcess: {
                method: 'GET',
                url: url.api + '/runtime/processes/:key'
            },
            listProcesses: {
                method: 'GET',
                url: url.api + '/runtime/processes'
            },
            listTasks: {
                method: 'GET',
                url: url.api + '/runtime/tasks'
            },
            performTaskAction: {
                method: 'POST',
                url: url.api + '/runtime/tasks/:id'
            },
            createProcess: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
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
