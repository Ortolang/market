'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.Content
 * @description
 * # Content
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('Content', ['$q', 'sample', function ($q, sample) {

        function getDownloadUrlWithKey(key, noSSL) {
            return 'url';
        }

        function getContentUrlWithPath() {
            return 'url';
        }

        function downloadWithKey (key, noSSL, config) {
            var defer = $q.defer(), data = sample().sampleCode, success;

            if(key === sample().metadataObjectKey) {
                defer.resolve(data);
                success = true;
            } else {
                defer.reject('Enable to download cause key not found');
                success = false;
            }

            var promise = defer.promise;
            promise.success = function (fct) {
                if (success) {
                    fct(data);
                }

                return this;
            };
            promise.error = function (fct) {
                if (!success) {
                    fct('Enable to download cause key not found');
                }

                return this;
            };

            return promise;
        }

        return {
            getDownloadUrlWithKey: getDownloadUrlWithKey,
            getContentUrlWithPath: getContentUrlWithPath,
            downloadWithKey: downloadWithKey
        };
    }]);
