'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Content
 * @description
 * # Content
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Content', ['url', function (url) {

        this.getContentUrlWithKey = function (element, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/key/' + element.key;
        };

        this.getContentUrlWithPath = function (element, workspace, root, noSSL) {
            return (noSSL ? url.contentNoSSL : url.content) + '/all/' + workspace.alias + '/' + (root || 'head') + element.path;
        };

        this.getPreviewUrlWithKey = function (element, large) {
            return this.getContentUrlWithKey(element) + '?preview=' + (large ? 'large' : 'small');
        };

        return this;
    }]);
