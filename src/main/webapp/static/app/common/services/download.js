'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Download
 * @description
 * # Download
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Download', ['$window', '$q', 'Url', 'ObjectResource', function ($window, $q, Url, ObjectResource) {

        function getDownloadUrl(element) {
            var deferred = $q.defer();
            ObjectResource.downloadTicket({oKey: element.key, hash: element.stream}, function(data) {
                var content = window.btoa(element.name + ':' + element.size + ':' + element.mimeType);
                var url = Url.urlBase() + '/download/' + element.stream + '?t=' + data.t + '&c=' + content;
                deferred.resolve(url);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function downloadInNewWindow(element) {
            getDownloadUrl(element).then(function (url) {
                $window.open(url);
            });
        }

        return {
            getDownloadUrl: getDownloadUrl,
            downloadInNewWindow: downloadInNewWindow
        };
    }]);
