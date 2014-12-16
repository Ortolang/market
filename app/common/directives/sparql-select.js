'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:fileSelectBrowser
 * @description
 * # fileSelectBrowser
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('sparqlSelect', ['SemanticResultResource', function (SemanticResultResource) {
        return {
            restrict: 'E',
            scope: {
                sparql: '=',
                model: '=',
                label: '=',
                required: '=',
                defaultValue: '=',
                name:'='
            },
            templateUrl: 'common/directives/sparql-select.html',
            link: {
                pre : function (scope, element, attrs) {
                    scope.categories = [];
                    
                    if(scope.required) {
                        element.find('select').attr('required', 'required');
                        scope.requiredLabel = '*';
                    }

                    var queryStr = scope.sparql;
                    SemanticResultResource.get({query: queryStr}).$promise.then(function(sparqlResults) {
                        sparqlResults.results.bindings.forEach(function(result) {
                            scope.categories.push(result.label.value);
                        });
                    });
                }
            }
        };
    }]);
