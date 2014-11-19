'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.DownloadResource
 * @description
 * # DownloadResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketAppMock')
    .factory('DownloadResource', ['$q', 'sample', function ($q, sample) {

        function buildDownloadUrl(params) {
            return 'url';
        }

        function download(params, config) {
            var defer = $q.defer(), data = sample().sampleCode, successMethod = params.oKey === sample().metadataObjectKey;
                defer.resolve(data);

                var promise = defer.promise;
                promise.success = function(fct) {
                  if(successMethod) {
                      fct(data);
                  }
                  return this;
                };
                promise.error = function(fct) {
                  if(!successMethod) {
                      fct();
                  }
                  return this;
                };

                return promise;
        }

        return {
            download: download,
            getDownloadUrl: buildDownloadUrl
        };
    }]);