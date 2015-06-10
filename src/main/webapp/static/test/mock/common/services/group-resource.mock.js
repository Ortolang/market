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
            return sample[params.key];
        }

        return {
            get: get
        };
    }]);
