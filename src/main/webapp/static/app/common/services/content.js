'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Content
 * @description
 * # Content
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Content', ['url', '$http', '$window', '$q', function (url, $http, $window, $q) {

        var forceDownloadQueryParam = '?fd=true';

        this.getContentUrlWithKey = function (key, login, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/key/' + key + (login ? '?login=false' : '');
        };

        this.getContentUrlWithPath = function (path, alias, root, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/' + alias + '/' + (root || 'head') + (path.charAt(0) === '/' ? '' : '/') + path;
        };

        this.getPreviewUrlWithKey = function (key, size, noSSL) {
            return (noSSL ? url.apiNoSSL : url.api) + '/thumb/' + key + (size ? '?size=' + size : '');
        };

        this.getDownloadUrlWithKey = function (key, noSSL) {
            return this.getContentUrlWithKey(key, null, noSSL) + forceDownloadQueryParam;
        };

        this.getDownloadUrlWithPath = function (path, alias, root, noSSL) {
            return this.getContentUrlWithPath(path, alias, root, noSSL) + forceDownloadQueryParam;
        };

        this.downloadWithKeyInWindow = function (key, newWindow, noSSL) {
            if (newWindow) {
                $window.open(this.getDownloadUrlWithKey(key, noSSL));
            } else {
                $window.location = this.getDownloadUrlWithKey(key, noSSL);
            }
        };

        function downloadWith(url, config) {
            var timeout = $q.defer(),
                defaultConfig = {timeout: timeout.promise},
                forceDefault = config === 'default';
            if (!config || forceDefault) {
                config = defaultConfig;
            } else {
                angular.extend(config, defaultConfig);
            }
            if (!forceDefault && !config.transformResponse) {
                config.transformResponse = [];
            }
            return {promise: $http.get(url, config), timeout: timeout};
        }

        this.downloadWithPath = function (path, alias, root, config, noSSL) {
            return downloadWith(this.getContentUrlWithPath(path, alias, root, noSSL), config);
        };

        this.downloadWithKey = function (key, config, noSSL) {
            return downloadWith(this.getContentUrlWithKey(key, null, noSSL), config);
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
