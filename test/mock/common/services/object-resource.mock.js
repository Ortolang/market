'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ObjectResource
 * @description
 * # ObjectResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketAppMock')
    .factory('ObjectResource', [ '$q', 'sample', function ($q, sample) {

        var get = function(params) {
            var defer = $q.defer();

            if(params.oKey) {
                if(params.oKey === sample().rootCollectionKey) {
                    defer.resolve(sample().oobjectSample);
                } else if(params.oKey === sample().collectionKey) {
                    defer.resolve(sample().oobjectNotRootSample);
                } else if(params.oKey === sample().rootCollectionWithoutMetaKey) {
                    defer.resolve(sample().oobjectWithoutMetaSample);
                } else if(params.oKey === sample().rootCollectionWithOtherMetaKey) {
                    defer.resolve(sample().oobjectWithOtherMetaSample);
                } else {
                    defer.reject('unknow object key');
                }
            } else {
                defer.resolve(sample().list);
            }

            return {$promise: defer.promise};
        };

        return {
            get: get
        };
    }]);
