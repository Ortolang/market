'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multivalueTextfield
 * @description
 * # multivalueTextfield
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multivalueTextfield', ['$translate', function ($translate) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/multivalue-textfield.html',
            scope: {
                label: '=',
                model: '=',
                description: '=',
                required: '=',
                type: '='
            },
            link: {
                pre : function (scope, elem, attrs) {
                    // scope.values = [];

                    scope.addTextfield = function() {
                        scope.model.push('');
                    };

                    function init() {
                        // if(scope.model) {
                        //     angular.forEach(scope.model, function(val) {
                        //         scope.values.push(val);
                        //     });
                        // }
                        if(!scope.required) {
                            scope.required = false;
                        }
                        if(scope.model===undefined) {
                            scope.model = [];
                        }
                        if(scope.model.length===0) {
                            scope.addTextfield();
                        }
                        // scope.model.push({lang:'en',value:'tt'});
                    }
                    init();
                }
            }
        };
    }]);
