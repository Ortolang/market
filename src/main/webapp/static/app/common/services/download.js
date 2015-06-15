'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Download
 * @description
 * # Download
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Download', ['$window', 'Content', function ($window, Content) {

        this.getDownloadUrl = function (element) {
            return Content.getContentUrlWithKey(element) + '?download';
        };

        this.download = function (element) {
            $window.location = this.getDownloadUrl(element);
        };

        return this;
    }]);
