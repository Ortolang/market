'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MessageResource
 * @description
 * # MessageResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('MessageResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/threads/:tkey', {tkey: '@tkey'}, {
            listThreads: {
                method: 'GET',
                isArray: true
            },
            createThread: {
                method: 'POST',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            },
            readThread: {
                method: 'GET'
            },
            updateThread: {
                method: 'PUT'
            },
            listMessages: {
                method: 'GET',
                isArray: true,
                url: url.api + '/threads/:tkey/messages'
            },
            postMessage: {
                method: 'POST',
                url: url.api + '/threads/:tkey/messages',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }
        });
    }]);
