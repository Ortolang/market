'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.RuntimeResource
 * @description
 * # RuntimeResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('RuntimeResource', [ '$q', 'sample', function ($q, sample) {

        function processes(params) {
            var defer = $q.defer();
            defer.resolve({entries: []});

            return {$promise: defer.promise};
        }

        function tasks(params) {
            var defer = $q.defer();
            defer.resolve({entries: []});

            return {$promise: defer.promise};
        }

        function createProcess(params) {
            var defer = $q.defer();
            defer.resolve(sample()[params]);

            return {$promise: defer.promise};
        }

        function remoteProcesses(params) {
            var defer = $q.defer();
            defer.resolve({entries: []});

            return {$promise: defer.promise};
        }

        return {
            processes: processes,
            tasks: tasks,
            createProcess: createProcess,
            remoteProcesses: remoteProcesses
        };
    }]);
