'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:eventFeedFilter
 * @function
 * @description
 * # eventFeedFilter filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('eventFeedFilter', function () {
        return function (events) {
            var filteredEvents = [];
            angular.forEach(events, function (event) {
                if (event.throwedBy == null || event.type === 'core.workspace.snapshot' || event.type === 'membership.group.create') {
                    return;
                }
                if (event.type === 'membership.group.add-member' && event.throwedBy === event.arguments.member) {
                    return;
                }
                if (event.type === 'core.collection.create' && event.arguments.path === '/') {
                    return;
                }
                if (event.type === 'membership.group.change-owner') {
                    return;
                }
                if (/^core\.metadata\./.test(event.type) && event.arguments.name === 'ortolang-workspace-json') {
                    return;
                }
                filteredEvents.push(event);
            });

            return filteredEvents;
        };
    });
