'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:categorySelect
 * @description
 * # categorySelect
 */
angular.module('ortolangMarketApp')
  .directive('categorySelect', function () {
    return {
      templateUrl: 'views/category-select.html',
      restrict: 'E'
    };
  });
