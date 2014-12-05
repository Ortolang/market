'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:fileSelectBrowser
 * @description
 * # fileSelectBrowser
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('autoComplete', ['SemanticResultResource', function (SemanticResultResource) {
        return {
            restrict: 'AE',
            scope: {
                sparql:'=',
                selectedTags:'=model',
                placeholder:'='
            },
            templateUrl: 'common/directives/autocomplete-template.html',
            link:function(scope,elem,attrs){

            scope.suggestions=[];

            scope.selectedTags=[];

            scope.selectedIndex=-1;

            scope.removeTag=function(index){
                scope.selectedTags.splice(index,1);
            }

            scope.search=function(){
                if(scope.searchText !== '') {
                    
                    var queryStr = scope.sparql.replace('$searchText',scope.searchText);
                    SemanticResultResource.get({query: queryStr}).$promise.then(function(sparqlResults) {
                        var labels = [];
                        if(sparqlResults.results) {
                            
                            sparqlResults.results.bindings.forEach(function(result) {

                                if(scope.searchText !== result.label.value) {
                                    labels.push(result.label.value);    
                                }
                            });

                            // if(data.indexOf(scope.searchText)===-1){
                            //     data.unshift(scope.searchText);
                            // }
                            scope.suggestions=labels;
                            scope.selectedIndex=-1;
                        }
                    });
                } else {
                    scope.suggestions=[];
                    scope.selectedIndex=-1;
                }
            }

            scope.addToSelectedTags=function(index){
                if(index===-1) {
                    if(scope.selectedTags.indexOf(scope.searchText)===-1){
                        scope.selectedTags.push(angular.copy(scope.searchText));
                        scope.searchText='';
                        scope.suggestions=[];
                    }
                } else if(scope.selectedTags.indexOf(scope.suggestions[index])===-1){
                    scope.selectedTags.push(scope.suggestions[index]);
                    scope.searchText='';
                    scope.suggestions=[];
                }
            }

            scope.checkKeyDown=function(event){
                if(event.keyCode===40){
                    event.preventDefault();
                    if(scope.selectedIndex+1 !== scope.suggestions.length){
                        scope.selectedIndex++;
                    }
                }
                else if(event.keyCode===38){
                    event.preventDefault();
                    if(scope.selectedIndex-1 !== -1){
                        scope.selectedIndex--;
                    }
                }
                else if(event.keyCode===13){
                    scope.addToSelectedTags(scope.selectedIndex);
                }
            }

            scope.$watch('selectedIndex',function(val){
                if(val!==-1) {
                    scope.searchText = scope.suggestions[scope.selectedIndex];
                }
            });
        }
        };
    }]);
