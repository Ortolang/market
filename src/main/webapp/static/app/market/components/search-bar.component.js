'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:searchBar
 * @description
 * # searchBar
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('searchBar', {
        bindings: {
            type: '@?',
            corporatype: '@?',
        },
        controller: ['$scope', 'Suggester', 
            function ($scope, Suggester) {
                var ctrl = this;

                ctrl.suggest = Suggester.suggest;
                ctrl.goToSearch = function () {
                    return Suggester.goToSearch(ctrl.content, ctrl.type, ctrl.corporatype);
                };

                ctrl.applySuggestion = function () {
                    ctrl.goToSearch();
                    $scope.$apply();
                };
            }
        ],
        templateUrl: 'market/components/search-bar.component.html'
    });