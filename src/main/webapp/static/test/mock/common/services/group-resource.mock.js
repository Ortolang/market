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

        function get(params) {
            var defer = $q.defer();
            defer.resolve(sample()[params.key]);
            return {$promise: defer.promise};
        }

        return {
            get: get
        };
    }]);
