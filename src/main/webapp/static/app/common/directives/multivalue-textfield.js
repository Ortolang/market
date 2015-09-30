'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multivalueTextfield
 * @description
 * # multivalueTextfield
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multivalueTextfield', function () {
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
                pre : function (scope) {
                    // scope.values = [];

                    scope.addTextfield = function() {
                        scope.model.push({value:''});
                    };

                    function init() {
                        // if(scope.model) {
                        //     angular.forEach(scope.model, function(val) {
                        //         scope.values.push(val);
                        //     });
                        // }
                        // if(!scope.required) {
                        //     scope.required = false;
                        // }
                        if(scope.model===undefined) {
                        //     scope.model = {values:[]};
                            console.error('Model of multivalue-textfield must be defined.');
                        } else {
                            if(scope.model.length===0) {
                                scope.addTextfield();
                            }
                        }
                    }
                    init();
                }
            }
        };
    });
