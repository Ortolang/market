'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Content
 * @description
 * # Content
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Content', ['url', '$http', '$window', '$q', 'AuthService', function (url, $http, $window, $q, AuthService) {

        var forceDownloadQueryParam = '?fd=true';

        this.getContentUrlWithKey = function (key, login, noSSL) {
            if (login === false && AuthService.isAuthenticated()) {
                login = true;
            }
            return (noSSL ? url.contentNoSSL : url.content) + '/key/' + key + (angular.isDefined(login) ? '?l=' + login : '');
        };

        this.getContentUrlWithPath = function (path, alias, root, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/' + alias + '/' + (root || 'head') + '/' + encodeURIComponent(path.charAt(0) === '/' ? path.substr(1) : path);
        };

        this.getThumbUrlWithKey = function (key, size, min, noSSL) {
            return (noSSL ? url.apiNoSSL : url.api) + '/thumbs/' + key + (angular.isDefined(size) ? '?size=' + size : '') + (angular.isDefined(min) ? '&min=' + min : '');
        };

        this.getThumbUrlWithPath = function (path, alias, root, size, min, noSSL) {
            return (noSSL ? url.apiNoSSL : url.api) + '/thumbs/' + alias + '/' + (root || 'head') + '/' + encodeURIComponent(path.charAt(0) === '/' ? path.substr(1) : path) + (angular.isDefined(size) ? '?size=' + size : '') + (angular.isDefined(min) ? '&min=' + min : '');
        };

        this.getDownloadUrlWithKey = function (key, noSSL) {
            return this.getContentUrlWithKey(key, undefined, noSSL) + forceDownloadQueryParam;
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
            return downloadWith(this.getContentUrlWithKey(key, undefined, noSSL), config);
        };

        this.getExportUrl = function (paths, filename, format, followsymlink, noSSL) {
            var exportUrl = (noSSL ? url.contentNoSSL : url.content) + '/export?',
                scope = AuthService.getScope();
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
            if (scope) {
                exportUrl += '&scope=' + scope;
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
