'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.SubscriptionResource
 * @description
 * # SubscriptionResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('SubscriptionResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/subscription', {}, {
            addDefaultFilters: {
                method: 'GET'
            },
            refreshWorkspacesFilters: {
                method: 'GET',
                url: url.api + '/subscription/workspaces'
            }
        });
    }]);
