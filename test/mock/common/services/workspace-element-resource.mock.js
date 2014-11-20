'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.WorkspaceElementResource
 * @description
 * # WorkspaceElementResource
 * Factory in the ortolangMarketAppMock.
 */
 angular.module('ortolangMarketAppMock')
 .factory('WorkspaceElementResource', ['$q', 'sample',
    function ($q, sample) {
        
        function get (params) {
            var defer = $q.defer();

            if(params.metadata === 'Présentation') {
                defer.resolve(sample().workspaceElement);
            } else {
                defer.reject('unknow workspace element');
            }

            return {$promise: defer.promise};
        }
        
        function deleteMethod (params) {
            var defer = $q.defer();

            if(params.metadataname === 'Présentation') {
                defer.resolve();
            } else {
                defer.reject('unknow workspace element');
            }

            return {$promise: defer.promise};
        }

        return {
            get: get,
            'delete': deleteMethod
        };
    }]);
