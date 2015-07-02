'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Content
 * @description
 * # Content
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Content', ['url', '$http', '$window', function (url, $http, $window) {

        var forceDownloadQueryParam = '?fd=true',
            previewQueryParam = '?preview=';

        this.getContentUrlWithKey = function (key, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/key/' + key;
        };

        this.getContentUrlWithPath = function (path, alias, root, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/' + alias + '/' + (root || 'head') + '/' + path;
        };

        this.getPreviewUrlWithKey = function (key, large) {
            return this.getContentUrlWithKey(key) + previewQueryParam + (large ? 'large' : 'small');
        };

        this.getPreviewUrlWithPath = function (path, alias, root, large, noSSL) {
            return this.getContentUrlWithPath(path, alias, root, noSSL) + previewQueryParam + (large ? 'large' : 'small');
        };

        this.getDownloadUrlWithKey = function (key, noSSL) {
            return this.getContentUrlWithKey(key, noSSL) + forceDownloadQueryParam;
        };

        this.getDownloadUrlWithPath = function (path, alias, root, noSSL) {
            return this.getContentUrlWithPath(path, alias, root, noSSL) + forceDownloadQueryParam;
        };

        this.downloadWithKeyInWindow = function (key, config, noSSL) {
            $window.location = this.getDownloadUrlWithKey(key, config, noSSL);
        };

        this.downloadWithKey = function (key, config, noSSL) {
            if (!config) {
                config = {};
            }
            if (!config.transformResponse) {
                config.transformResponse = [];
            }
            return $http.get(this.getContentUrlWithKey(key, noSSL), config);
        };

        return this;
    }]);
