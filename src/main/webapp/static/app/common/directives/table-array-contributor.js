'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:tableArrayContributor
 * @description
 * # tableArrayContributor
 * Directive of the ortolangMarketApp
 */
angular.module('schemaForm')
    .directive('tableArrayContributor', function () {
        return {
            restrict: 'AE',
            scope: {
                add: '=addLabel',
                model: '='
            },
            templateUrl: 'common/directives/table-array-contributor.html',
            link: {
                pre : function (scope, element, attrs) {

                    scope.selectItem = function (item) {
                        scope.selectedItem = item;
                    };

                    scope.resetSelectedItem = function () {
                        scope.selectedItem = undefined;
                    };

                    scope.hasSelectedItem = function() {
                        return scope.selectedItem !== undefined;
                    };

                    scope.isItemSelected = function (item) {
                        return ( item !== undefined && scope.selectedItem !== undefined && scope.selectedItem.title === item.title );
                    };

                    scope.addSelectedItem = function () {
                        scope.data.push(scope.selectedItem);
                        scope.resetSelectedItem();
                    };

                    function init() {
                        console.log('tablearray directive '+scope.model);

                        scope.selectedItem = undefined;
                        scope.addLabel = 'Ajouter ...';
                        scope.data = [];

                        if(scope.model===undefined) {
                            scope.model = [];
                        }
                    }
                    init();
                }
            }
        };
    });
