'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.DownloadResource
 * @description
 * # DownloadResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('DownloadResource', ['$http', 'Url', function ($http, Url) {

        function buildDownloadUrl(params) {
            var url;
            if (params.wsName) {
                url = Url.urlBase() + '/rest/workspaces/' + params.wsName + '/download?';
                if (params.path) {
                    url += 'path=' + params.path + '&';
                }
                if (params.root) {
                    url += 'root=' + params.root + '&';
                }
                if (params.metadata) {
                    url += 'metadata=' + params.metadata;
                }
            } else if (params.oKey) {
                url = Url.urlBase() + '/rest/objects/' + params.oKey + '/download';
            }
            return url;
        }

        function download(params, config) {
            return $http.get(buildDownloadUrl(params), config);
        }

        return {
            download: download,
            getDownloadUrl: buildDownloadUrl
        };
    }]);