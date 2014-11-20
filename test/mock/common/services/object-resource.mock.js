'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.ObjectResource
 * @description
 * # ObjectResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('ObjectResource', [ '$q', 'sample', function ($q, sample) {

        var conditions = [];

        function get(params) {
            var defer = $q.defer(), data;
            
            angular.forEach(conditions, function(condition) {

                if(angular.equals(params, condition.condition)) {
                    data = condition.responseValue;
                    return;
                }
            });

            if(data) {
                defer.resolve(data);
            } else {
                defer.reject('unknow object key');
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
            when: when,
            clear: clear
        };
    }]);
