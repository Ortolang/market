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
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            },
            readThread: {
                method: 'GET'
            },
            updateThread: {
                method: 'PUT'
            },
            deleteThread: {
                method: 'DELETE'
            },
            listMessages: {
                method: 'GET',
                isArray: true,
                url: url.api + '/threads/:tkey/messages'
            },
            postMessage: {
                method: 'POST',
                url: url.api + '/threads/:tkey/messages',
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            },
            updateMessage: {
                method: 'PUT',
                url: url.api + '/threads/:tkey/messages/:mkey',
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            },
            deleteMessage: {
                method: 'DELETE',
                url: url.api + '/threads/:tkey/messages/:mkey'
            }
        });
    }]);
