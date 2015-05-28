'use strict';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.url
 * @description
 * # url
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('url', {
        base: OrtolangConfig.serverUrl,
        api: OrtolangConfig.serverUrl + 'api',
        content: OrtolangConfig.serverUrl + 'content'
    });
