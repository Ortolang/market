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
        api: OrtolangConfig.apiServerUrlDefault,
        apiNoSSL: OrtolangConfig.apiServerUrlNoSSL,
        sub: OrtolangConfig.apiServerUrlDefault + OrtolangConfig.apiSubPath,
        content: OrtolangConfig.apiServerUrlDefault + OrtolangConfig.apiContentPath,
        contentNoSSL: OrtolangConfig.apiServerUrlNoSSL + OrtolangConfig.apiContentPath,
        handlePrefix: OrtolangConfig.handlePrefix
    });
