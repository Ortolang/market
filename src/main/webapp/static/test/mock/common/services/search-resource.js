'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.SearchResource
 * @description
 * # SearchResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('SearchResource', [ '$q', 'sample', function ($q, sample) {

        var conditions = [];

        function json(params) {
            var defer = $q.defer(), data;

            angular.forEach(conditions, function (condition) {
                if (angular.equals(params, condition.condition)) {
                    data = condition.responseValue;
                }
            });

            if (data) {
                defer.resolve(data);
            } else {
                defer.reject('when ' + angular.toJson(params) + ' is undefined for condition ' + angular.toJson(conditions));
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
            json: json,
            element: json,
            when: when,
            clear: clear
        };
    }]);
