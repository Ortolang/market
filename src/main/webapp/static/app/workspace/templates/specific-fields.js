'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SpecificFieldsCtrl
 * @description
 * # SpecificFieldsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SpecificFieldsCtrl', ['$rootScope', '$scope', '$filter', 'Settings', 'QueryBuilderFactory', 'SearchResource',
        function ($rootScope, $scope, $filter, Settings, QueryBuilderFactory, SearchResource) {

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

            function loadAllCorporaType() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaType');

                var query = queryBuilder.toString();
                $scope.allCorporaType = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaType.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllCorporaLanguageType() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaLanguageType');

                var query = queryBuilder.toString();
                $scope.allCorporaLanguageType = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaLanguageType.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllLanguages() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'Language');

                var query = queryBuilder.toString();
                $scope.allLanguages = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLanguages.push({id: term['@rid'], label: term.label});
                    });

                    if(angular.isDefined($scope.metadata.corporaLanguages)) {

                        angular.forEach($scope.metadata.corporaLanguages, function(tag) {
                            var tagFound = $filter('filter')($scope.allLanguages, {id:tag});
                            if(tagFound.length>0) {
                                $scope.selectedCorporaLanguages.push(tagFound[0]);
                            } else {
                                $scope.selectedCorporaLanguages.push({id:tag,label:tag});
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

            function loadAllCorporaStyles() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaStyle');

                var query = queryBuilder.toString();
                $scope.allCorporaStyles = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaStyles.push({id: term['@rid'], label: term.label});
                    });

                });
            }

            function loadAllAnnotationLevels() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'AnnotationLevel');

                var query = queryBuilder.toString();
                $scope.allAnnotationLevels = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allAnnotationLevels.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllCorporaFormats() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaFormat');

                var query = queryBuilder.toString();
                $scope.allCorporaFormats = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaFormats.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllCorporaFileEncodings() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaFileEncoding');

                var query = queryBuilder.toString();
                $scope.allCorporaFileEncodings = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaFileEncodings.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllCorporaDataTypes() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'CorporaDataType');

                var query = queryBuilder.toString();
                $scope.allCorporaDataTypes = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allCorporaDataTypes.push({id: term['@rid'], label: term.label});
                    });
                });
            }


            function loadAllLexiconInputTypes() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'LexiconInputType');

                var query = queryBuilder.toString();
                $scope.allLexiconInputTypes = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLexiconInputTypes.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllLexiconDescriptionTypes() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'LexiconDescriptionType');

                var query = queryBuilder.toString();
                $scope.allLexiconDescriptionTypes = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLexiconDescriptionTypes.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllLexiconLanguageTypes() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'LexiconLanguageType');

                var query = queryBuilder.toString();
                $scope.allLexiconLanguageTypes = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLexiconLanguageTypes.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllLexiconFormats() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'LexiconFormat');

                var query = queryBuilder.toString();
                $scope.allLexiconFormats = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allLexiconFormats.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllOperatingSystems() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'OperatingSystem');

                var query = queryBuilder.toString();
                $scope.allOperatingSystems = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allOperatingSystems.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllProgrammingLanguages() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ProgrammingLanguage');

                var query = queryBuilder.toString();
                $scope.allProgrammingLanguages = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allProgrammingLanguages.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllToolSupports() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ToolSupport');

                var query = queryBuilder.toString();
                $scope.allToolSupports = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allToolSupports.push({id: term['@rid'], label: term.label});
                    });

                });
            }

            function loadAllToolFunctionalities() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ToolFunctionality');

                var query = queryBuilder.toString();
                $scope.allToolFunctionalities = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allToolFunctionalities.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllToolInputData() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ToolInputData');

                var query = queryBuilder.toString();
                $scope.allToolInputData = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allToolInputData.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllToolOutputData() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ToolOutputData');

                var query = queryBuilder.toString();
                $scope.allToolOutputData = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allToolOutputData.push({id: term['@rid'], label: term.label});
                    });
                });
            }

            function loadAllToolFileEncodings() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: '*',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'ToolFileEncoding');

                var query = queryBuilder.toString();
                $scope.allToolFileEncodings = [];
                SearchResource.json({query: query}).$promise.then(function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allToolFileEncodings.push({id: term['@rid'], label: term.label});
                    });
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

                loadAllCorporaLanguageType();
                loadAllCorporaType();
                loadAllLanguages();
                loadAllCorporaStyles();
                loadAllAnnotationLevels();
                loadAllCorporaFormats();
                loadAllCorporaFileEncodings();
                loadAllCorporaDataTypes();
                loadAllLexiconInputTypes();
                loadAllLexiconDescriptionTypes();
                loadAllLexiconLanguageTypes();
                loadAllLexiconFormats();
                loadAllOperatingSystems();
                loadAllProgrammingLanguages();
                loadAllToolSupports();
                loadAllToolFunctionalities();
                loadAllToolInputData();
                loadAllToolOutputData();
                loadAllToolFileEncodings();
            }
            init();
}]);