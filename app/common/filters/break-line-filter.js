'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:breakLineFilter
 * @function
 * @description
 * # breakLineFilter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('breakLineFilter', function () {
        return function (text) {
            if (text !== undefined) {
                var str = text.replace(/\n/g, '<br />');
                str = '<pre>' + str + '</pre>';
                return str;
            }
        };
  });
