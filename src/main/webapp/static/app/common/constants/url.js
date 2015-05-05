'use strict';

var baseUrl = window.location.hostname === 'localhost' ? 'https://localhost:8443' : '';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.url
 * @description
 * # url
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('url', {
        base: baseUrl,
        api: baseUrl + '/api',
        content: baseUrl + '/content'
    });
