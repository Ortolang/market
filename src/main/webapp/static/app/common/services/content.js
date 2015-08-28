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

        var forceDownloadQueryParam = '?fd=true';

        this.getContentUrlWithKey = function (key, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/key/' + key;
        };

        this.getContentUrlWithPath = function (path, alias, root, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/' + alias + '/' + (root || 'head') + (path.charAt(0) === '/' ? '' : '/') + path;
        };

        this.getPreviewUrlWithKey = function (key, size, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/thumb/' + key + (size ? '?size=' + size : '');
        };

        this.getDownloadUrlWithKey = function (key, noSSL) {
            return this.getContentUrlWithKey(key, noSSL) + forceDownloadQueryParam;
        };

        this.getDownloadUrlWithPath = function (path, alias, root, noSSL) {
            return this.getContentUrlWithPath(path, alias, root, noSSL) + forceDownloadQueryParam;
        };

        this.downloadWithKeyInWindow = function (key, noSSL) {
            $window.location = this.getDownloadUrlWithKey(key, noSSL);
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

        this.getExportUrl = function (paths, filename, format, followsymlink, noSSL) {
            var exportUrl = (noSSL ? url.contentNoSSL : url.content) + '/export?';
            angular.forEach(paths, function (path) {
                exportUrl += '&path=/' + path;
            });
            if (filename) {
                exportUrl += '&filename=' + filename;
            }
            if (format) {
                exportUrl += '&format=' + format;
            }
            if (followsymlink) {
                exportUrl += '&followsymlink=' + followsymlink;
            }
            return exportUrl;
        };

        this.export = function (paths, filename, format, followsymlink, noSSL) {
            $window.location = this.getExportUrl(paths, filename, format, followsymlink, noSSL);
        };

        this.getExportSingleUrl = function (alias, root, path, filename, format, followsymlink, noSSL) {
            return this.getExportUrl([alias + '/' + (root || 'head') + (path || '/')], filename, format, followsymlink, noSSL);
        };

        this.exportSingle = function (alias, root, path, filename, format, followsymlink, noSSL) {
            $window.location = this.getExportSingleUrl(alias, root, path, filename, format, followsymlink, noSSL);
        };

        return this;
    }]);
