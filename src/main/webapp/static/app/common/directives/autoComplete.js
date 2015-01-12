'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:autoComplete
 * @description
 * # autoComplete
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('autoComplete', ['SemanticResultResource', function (SemanticResultResource) {
        return {
            restrict: 'AE',
            scope: {
                sparql: '=',
                selectedTags: '=model',
                placeholder: '=',
                required: '=',
                name: '='
            },
            templateUrl: 'common/directives/autocomplete-template.html',
            link: function (scope, elem, attrs) {

                scope.suggestions = [];

                if (scope.selectedTags === undefined) {
                    scope.selectedTags = [];
                }

                scope.selectedIndex = -1;

                scope.hasTag = function () {
                    return scope.selectedTags.length > 0;
                };

                scope.isValid = function () {
                    if (scope.required) {
                        return scope.hasTag();
                    }
                    return true;
                };

                scope.removeTag = function (index) {
                    scope.selectedTags.splice(index, 1);
                };

                scope.search = function () {
                    if (scope.searchText !== '' && scope.sparql !== undefined) {

                        var queryStr = scope.sparql.replace('$searchText', scope.searchText);
                        SemanticResultResource.get({query: queryStr}).$promise.then(function (sparqlResults) {
                            var labels = [];
                            if (sparqlResults.results) {

                                sparqlResults.results.bindings.forEach(function (result) {

                                    if (scope.searchText !== result.label.value && labels.indexOf(result.label.value) === -1) {
                                        labels.push(result.label.value);
                                    }
                                });

                                scope.suggestions = labels;
                                scope.selectedIndex = -1;
                            }
                        });
                    } else {
                        scope.suggestions = [];
                        scope.selectedIndex = -1;
                    }
                };

                scope.addToSelectedTags = function (index) {
                    if (index === -1) {
                        if (scope.selectedTags.indexOf(scope.searchText) === -1) {
                            scope.selectedTags.push(angular.copy(scope.searchText));
                            scope.searchText = '';
                            scope.suggestions = [];
                        }
                    } else if (scope.selectedTags.indexOf(scope.suggestions[index]) === -1) {
                        scope.selectedTags.push(scope.suggestions[index]);
                        scope.searchText = '';
                        scope.suggestions = [];
                    }
                };

                scope.checkKeyDown = function (event) {
                    if (event.keyCode === 40) {
                        event.preventDefault();
                        if (scope.selectedIndex + 1 !== scope.suggestions.length) {
                            scope.selectedIndex++;
                        }
                    } else if (event.keyCode === 38) {
                        event.preventDefault();
                        if (scope.selectedIndex - 1 !== -1) {
                            scope.selectedIndex--;
                        }
                    } else if (event.keyCode === 13) {
                        scope.addToSelectedTags(scope.selectedIndex);
                    }
                };

                scope.$watch('selectedIndex', function (val) {
                    if (val !== -1) {
                        scope.searchText = scope.suggestions[scope.selectedIndex];
                    }
                });
            }
        };
    }]);
