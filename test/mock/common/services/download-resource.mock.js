'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.DownloadResource
 * @description
 * # DownloadResource
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('DownloadResource', ['$q', 'sample', function ($q, sample) {

        function buildDownloadUrl (params) {
            return 'url';
        }

        function download (params, config) {
            var defer = $q.defer(), data = sample().sampleCode, success;
                
                if(params.oKey === sample().metadataObjectKey) {
                  defer.resolve(data);
                  success = true;
                } else {
                  defer.reject('Enable to download cause key not found');
                  success = false;
                }

                var promise = defer.promise;
                promise.success = function(fct) {
                  if (success) {
                    fct(data);
                  }
                  
                  return this;
                };
                promise.error = function(fct) {
                  if (!success) {
                    fct('Enable to download cause key not found');
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