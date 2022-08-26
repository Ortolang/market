'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.MetadataFormatResource
 * @description
 * # MetadataFormatResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('MetadataFormatResource', [ '$q', 'sample', function ($q, sample) {

        var conditions = [], defaultValue = '';

        function get(params) {
            var defer = $q.defer(), data;

            if(conditions.length>0) {
                angular.forEach(conditions, function(condition) {
                    if(angular.equals(params, condition.condition)) {
                        data = condition.responseValue;
                    }
                });
            } else {
                data = defaultValue;
            }

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

        function setDefaultValue(value) {
            defaultValue = value;
        }

        return {
            get: get,
            element: get,
            when: when,
            clear: clear,
            setDefaultValue: setDefaultValue
        };
    }]);
