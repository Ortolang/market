'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:eventFeedDescription
 * @function
 * @description
 * # eventFeedDescription filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('eventFeedDescription', function () {
        return function (event) {
            if (/^core\.metadata\./.test(event.type)) {
                if (event.arguments.name === 'ortolang-item-json') {
                    return 'WORKSPACE.EVENTS.' + event.type.toUpperCase() + '_ITEM';
                } else if (event.arguments.name === 'ortolang-acl-json') {
                    return 'WORKSPACE.EVENTS.' + event.type.toUpperCase() + '_ACL';
                }
            }
            return 'WORKSPACE.EVENTS.' + event.type.toUpperCase();
        };
    });
