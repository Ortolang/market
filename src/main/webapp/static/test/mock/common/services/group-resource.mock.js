'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.GroupResource
 * @description
 * # GroupResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('GroupResource', [ '$q', 'sample', function ($q, sample) {

        function get() {
            var defer = $q.defer();
            defer.resolve(sample.group);
            return {$promise: defer.promise};
        }

        return {
            get: get
        };
    }]);
