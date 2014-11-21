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

        var processes, tasks;

        processes = function (params) {
            var defer = $q.defer();
            defer.resolve(sample().list);

            return {$promise: defer.promise};
        };

        tasks = function (params) {
            var defer = $q.defer();
            defer.resolve(sample().list);

            return {$promise: defer.promise};
        };

        return {
            processes: processes,
            tasks: tasks
        };
    }]);
