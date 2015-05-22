'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Download
 * @description
 * # Download
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Download', ['$window', 'url', function ($window, url) {

        this.getDownloadUrl = function (element) {
            return url.content + '/key/' + element.key;
        };

        this.getPreviewUrl = function (element, large) {
            return this.getDownloadUrl(element) + '?preview=' + (large ? 'large' : 'small');
        };

        this.download = function (element) {
            $window.location = this.getDownloadUrl(element);
        };

        return this;
    }]);
