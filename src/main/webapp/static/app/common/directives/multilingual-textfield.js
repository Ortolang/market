'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multilingualTextfield
 * @description
 * # multilingualTextfield
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multilingualTextfield', ['$translate', function ($translate) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/multilingual-textfield.html',
            scope: {
                label: '=',
                name: '=',
                model: '=',
                type: '=',
                required: '='
            },
            link: {
                pre : function (scope, elem, attrs) {
                    // scope.values = [];
                    scope.type = scope.type || 'default';
                    scope.languages = [
                        {key:'fr',value: $translate.instant('LANGUAGES.FR')}, 
                        {key:'en', value: $translate.instant('LANGUAGES.EN')}, 
                        {key:'es', value: $translate.instant('LANGUAGES.ES')},
                        {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                    ];

                    scope.addTextfield = function() {
                        scope.model.push({lang:'', value: ''});
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
                    }
                    init();
                }
            }
        };
    }]);
