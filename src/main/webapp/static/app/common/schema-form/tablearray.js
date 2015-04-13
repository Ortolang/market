'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:tablearray
 * @description
 * # tablearray
 * Directive of the ortolangMarketApp
 */
angular.module('schemaForm')
    .directive('tablearray', function () {
        return {
            restrict: 'AE',
            scope: {
                add: '=addLabel',
                items: '='
            },
            templateUrl: 'common/schema-form/tablearray-template.html',
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
                    }

                    scope.isItemSelected = function (item) {
                        return ( item !== undefined && scope.selectedItem !== undefined && scope.selectedItem.title === item.title );
                    };

                    scope.addSelectedItem = function () {
                        scope.data.push(scope.selectedItem);
                        scope.resetSelectedItem();
                    };

                    function init() {
                        console.log('tablearray directive '+scope.items);

                        scope.selectedItem = undefined;
                        scope.addLabel = 'Ajouter ...';
                        scope.data = [];

                        if(scope.items===undefined) {
                            scope.items = [];
                        }
                    }
                    init();
                }
            }
        };
    });
