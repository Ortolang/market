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
        return $resource(url.api + '/threads', {}, {
            listThreads: {
                method: 'GET',
                url: url.api + '/threads'
            },
            createThread: {
                method: 'POST',
                url: url.api + '/threads'
            },
            readThread: {
                method: 'GET',
                url: url.api + '/threads/:tkey'
            },
            updateThread: {
                method: 'PUT',
                url: url.api + '/threads/:tkey'
            },
            listMessages: {
                method: 'GET',
                url: url.api + '/threads/:tkey/messages'
            },
            postMessage: {
                method: 'POST',
                url: url.api + '/threads/:tkey/messages'
            }
        });
    }]);
