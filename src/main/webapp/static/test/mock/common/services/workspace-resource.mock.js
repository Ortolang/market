'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.WorkspaceResource
 * @description
 * # WorkspaceResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('WorkspaceResource', ['$q', 'sample',
        function ($q, sample) {

            function get() {
                var defer = $q.defer();

                defer.resolve(sample().workspaceList);

                return {$promise: defer.promise};
            }

            return {
                get: get
            };
        }]);
