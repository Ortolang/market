'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SpecificFieldsCtrl
 * @description
 * # SpecificFieldsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SpecificFieldsCtrl', ['$rootScope', '$scope', '$filter', 'Settings', 'QueryBuilderFactory', 'SearchResource', 'Helper', '$q',
        function ($rootScope, $scope, $filter, Settings, QueryBuilderFactory, SearchResource, Helper, $q) {

            $scope.suggestLanguages = function (query) {
                var result = $filter('filter')($scope.allLanguages, {label:query});
                return result;
            };

            $scope.addCorporaLanguage = function(tag) {
            	if(angular.isUndefined($scope.metadata.corporaLanguages)) {
            		$scope.metadata.corporaLanguages = [];
            	}
                if(angular.isDefined(tag.id)) {
            	   $scope.metadata.corporaLanguages.push(tag.id);
                } else {
                    $scope.metadata.corporaLanguages.push(tag.label);
                }
            };

            $scope.removeCorporaLanguage = function(tag) {
                var value = tag.id ? tag.id : tag.label;
            	var index = $scope.metadata.corporaLanguages.indexOf(value);
	            if (index > -1) {
	                $scope.metadata.corporaLanguages.splice(index, 1);
	            }
            };

            $scope.addLexiconInputLanguage = function(tag) {
            	if(angular.isUndefined($scope.metadata.lexiconInputLanguages)) {
            		$scope.metadata.lexiconInputLanguages = [];
            	}
            	// $scope.metadata.lexiconInputLanguages.push(tag.label);
                if(angular.isDefined(tag.id)) {
                   $scope.metadata.lexiconInputLanguages.push(tag.id);
                } else {
                    $scope.metadata.lexiconInputLanguages.push(tag.label);
                }
            };

            $scope.removeLexiconInputLanguage = function(tag) {
            	// var index = $scope.metadata.lexiconInputLanguages.indexOf(tag.label);
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata.lexiconInputLanguages.indexOf(value);
	            if (index > -1) {
	                $scope.metadata.lexiconInputLanguages.splice(index, 1);
	            }
            };

            $scope.addLexiconDescriptionLanguage = function(tag) {
            	if(angular.isUndefined($scope.metadata.lexiconDescriptionLanguages)) {
            		$scope.metadata.lexiconDescriptionLanguages = [];
            	}
            	// $scope.metadata.lexiconDescriptionLanguages.push(tag.label);
                if(angular.isDefined(tag.id)) {
                   $scope.metadata.lexiconDescriptionLanguages.push(tag.id);
                } else {
                    $scope.metadata.lexiconDescriptionLanguages.push(tag.label);
                }
            };

            $scope.removeLexiconDescriptionLanguage = function(tag) {
            	// var index = $scope.metadata.lexiconDescriptionLanguages.indexOf(tag.label);
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata.lexiconDescriptionLanguages.indexOf(value);
	            if (index > -1) {
	                $scope.metadata.lexiconDescriptionLanguages.splice(index, 1);
	            }
            };

            $scope.addToolLanguage = function(tag) {
            	if(angular.isUndefined($scope.metadata.toolLanguages)) {
            		$scope.metadata.toolLanguages = [];
            	}
            	// $scope.metadata.toolLanguages.push(tag.label);
                if(angular.isDefined(tag.id)) {
                   $scope.metadata.toolLanguages.push(tag.id);
                } else {
                    $scope.metadata.toolLanguages.push(tag.label);
                }
            };

            $scope.removeToolLanguage = function(tag) {
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata.toolLanguages.indexOf(value);
            	// var index = $scope.metadata.toolLanguages.indexOf(tag.label);
	            if (index > -1) {
	                $scope.metadata.toolLanguages.splice(index, 1);
	            }
            };

            $scope.addNavigationLanguage = function(tag) {
            	if(angular.isUndefined($scope.metadata.navigationLanguages)) {
            		$scope.metadata.navigationLanguages = [];
            	}
            	// $scope.metadata.navigationLanguages.push(tag.label);
                if(angular.isDefined(tag.id)) {
                   $scope.metadata.navigationLanguages.push(tag.id);
                } else {
                    $scope.metadata.navigationLanguages.push(tag.label);
                }
            };

            $scope.removeNavigationLanguage = function(tag) {
            	// var index = $scope.metadata.navigationLanguages.indexOf(tag.label);
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata.navigationLanguages.indexOf(value);
	            if (index > -1) {
	                $scope.metadata.navigationLanguages.splice(index, 1);
	            }
            };

            /**
             * Methods to load referential entities
             **/

            function loadAllLanguages() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'term'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels', 'labels');

                queryBuilder.in('meta_ortolang-referentiel-json.compatibilities', ['"Language"']);

                var query = queryBuilder.toString();
                $scope.allLanguages = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLanguages.push({id: '${' + term.key + '}', label: Helper.getMultilingualValue(term.labels)});
                    });

                    if(angular.isDefined($scope.metadata.corporaLanguages)) {

                        angular.forEach($scope.metadata.corporaLanguages, function(lang) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:lang});
                            if(tagFound.length>0) {
                                angular.forEach(tagFound, function(tag) {
                                    if(tag.id === lang) {
                                        $scope.selectedCorporaLanguages.push(tag);
                                        return;
                                    }
                                });
                            } else {
                                $scope.selectedCorporaLanguages.push({id:lang,label:lang});
                            }
                        });
                    }

                    if(angular.isDefined($scope.metadata.lexiconInputLanguages)) {

                        angular.forEach($scope.metadata.lexiconInputLanguages, function(tag) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:tag});
                            if(tagFound.length>0) {
                                $scope.selectedLexiconInputLanguages.push(tagFound[0]);
                            } else {
                                $scope.selectedLexiconInputLanguages.push({id:tag,label:tag});
                            }
                        });
                    }

                    if(angular.isDefined($scope.metadata.lexiconDescriptionLanguages)) {

                        angular.forEach($scope.metadata.lexiconDescriptionLanguages, function(tag) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:tag});
                            if(tagFound.length>0) {
                                $scope.selectedLexiconDescriptionLanguages.push(tagFound[0]);
                            } else {
                                $scope.selectedLexiconDescriptionLanguages.push({id:tag,label:tag});
                            }
                        });
                    }

                    if(angular.isDefined($scope.metadata.toolLanguages)) {

                        angular.forEach($scope.metadata.toolLanguages, function(tag) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:tag});
                            if(tagFound.length>0) {
                                $scope.selectedToolLanguages.push(tagFound[0]);
                            } else {
                                $scope.selectedToolLanguages.push({id:tag,label:tag});
                            }
                        });
                    }

                    if(angular.isDefined($scope.metadata.navigationLanguages)) {

                        angular.forEach($scope.metadata.navigationLanguages, function(tag) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:tag});
                            if(tagFound.length>0) {
                                $scope.selectedNavigationLanguages.push(tagFound[0]);
                            } else {
                                $scope.selectedNavigationLanguages.push({id:tag,label:tag});
                            }
                        });
                    }
                });
            }

            function listTerms() {
                var deferred = $q.defer();

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'term'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels', 'labels');

                queryBuilder.addProjection('meta_ortolang-referentiel-json.compatibilities', 'compatibilities');

                queryBuilder.addProjection('meta_ortolang-referentiel-json.rank', 'rank');
                queryBuilder.equals('meta_ortolang-referentiel-json.rank', 1);

                var query = queryBuilder.toString();
                var terms = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        if(term.labels) {
                            var entity = {id: '${' + term.key + '}', label: Helper.getMultilingualValue(term.labels)};
                            if(term.rank) {
                                entity.rank = term.rank;
                            }
                            if(term.compatibilities) {
                                entity.compatibilities = term.compatibilities;
                            }
                            terms.push(entity);
                        }
                    });
                    deferred.resolve(terms);
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            }

            function addTerms(compatibility, arrayName, terms) {

                $scope[arrayName] = [];
                angular.forEach(terms, function (term) {
                    if(angular.isDefined(term.compatibilities) && term.compatibilities.indexOf(compatibility)>-1) {
                        $scope[arrayName].push(term);
                    }
                });
            }

            /**
             * Initialize the scope
             **/

        	function init() {
                $scope.selectedCorporaLanguages = [];
                $scope.selectedLexiconInputLanguages = [];
                $scope.selectedLexiconDescriptionLanguages = [];
                $scope.selectedToolLanguages = [];
                $scope.selectedNavigationLanguages = [];

                listTerms().then(function (terms) {
                    addTerms('CorporaLanguageType', 'allCorporaLanguageType', terms);
                    addTerms('CorporaType', 'allCorporaType', terms);
                    addTerms('CorporaStyle', 'allCorporaStyles', terms);
                    addTerms('AnnotationLevel', 'allAnnotationLevels', terms);
                    addTerms('CorporaFormat', 'allCorporaFormats', terms);
                    addTerms('CorporaFileEncoding', 'allCorporaFileEncodings', terms);
                    addTerms('CorporaDataType', 'allCorporaDataTypes', terms);
                    addTerms('LexiconInputType', 'allLexiconInputTypes', terms);
                    addTerms('LexiconDescriptionType', 'allLexiconDescriptionTypes', terms);
                    addTerms('LexiconLanguageType', 'allLexiconLanguageTypes', terms);
                    addTerms('LexiconFormat', 'allLexiconFormats', terms);
                    addTerms('OperatingSystem', 'allOperatingSystems', terms);
                    addTerms('ProgrammingLanguage', 'allProgrammingLanguages', terms);
                    addTerms('ToolSupport', 'allToolSupports', terms);
                    addTerms('ToolFunctionality', 'allToolFunctionalities', terms);
                    addTerms('ToolInputData', 'allToolInputData', terms);
                    addTerms('ToolOutputData', 'allToolOutputData', terms);
                    addTerms('ToolFileEncoding', 'allToolFileEncodings', terms);
                });

                loadAllLanguages();
            }
            init();
}]);