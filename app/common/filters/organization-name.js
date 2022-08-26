'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:organizationName
 * @function
 * @description
 * # organizationName
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('organizationName', function () {
        return function (organization) {
            if (organization) {
                var name = '';
                if (organization.acronym) {
                    name += organization.acronym + ' - ';
                }
                name += organization.name;
                if (organization.city) {
                    name += ' (' + organization.city + ', ' + organization.country + ')';
                }
                return name;
            }
        };
    });
