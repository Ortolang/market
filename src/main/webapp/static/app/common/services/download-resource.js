'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.DownloadResource
 * @description
 * # DownloadResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('DownloadResource', ['$http', 'url', function ($http, url) {

        function buildDownloadUrl(params) {
            var downloadUrl;
            if (params.wskey) {
                downloadUrl = url.api + '/rest/workspaces/' + params.wskey + '/download?';
                if (params.path) {
                    downloadUrl += 'path=' + params.path + '&';
                }
                if (params.root) {
                    downloadUrl += 'root=' + params.root + '&';
                }
                if (params.metadata) {
                    downloadUrl += 'metadata=' + params.metadata;
                }
            } else if (params.oKey) {
                downloadUrl = url.api + '/rest/objects/' + params.oKey + '/download';
            }
            return downloadUrl;
        }

        function download(params, config) {
            if (!config) {
                config = {};
            }
            if (!config.transformResponse) {
                config.transformResponse = [];
            }
            return $http.get(buildDownloadUrl(params), config);
        }

        return {
            download: download,
            getDownloadUrl: buildDownloadUrl
        };
    }]);
