'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.JsonResultResource
 * @description
 * # JsonResultResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('JsonResultResource', [ '$q', 'sample', function ($q, sample) {

        var conditions = [];

        function get(params) {
            var defer = $q.defer(), data;

            angular.forEach(conditions, function(condition) {
                if(angular.equals(params, condition.condition)) {
                    data = condition.responseValue;
                }
            });

            if(data) {
                defer.resolve(data);
            } else {
                defer.reject('when '+angular.toJson(params)+' is undefined for condition '+angular.toJson(conditions));
            }

            return {$promise: defer.promise};
        }

        function when(_condition_, _responseValue_) {
            conditions.push({condition: _condition_, responseValue: _responseValue_});
        }

        function clear() {
            conditions = [];
        }

        return {
            get: get,
            element: get,
            when: when,
            clear: clear
        };
    }]);
