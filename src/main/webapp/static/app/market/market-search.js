'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', '$rootScope', '$filter', 'icons', 'JsonResultResource', 'QueryBuilderService', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, $location, $routeParams, $rootScope, $filter, icons, JsonResultResource, QueryBuilderService, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        var viewModeLine, viewModeTile;

        $scope.search = function () {
            
            var filters = {}, params = {};
            angular.forEach($scope.filtersManager.getFilters(), function(filter) {

                if(filter.getType() === 'string') {
                    filters[filter.id] = filter.value;
                } else if(filter.getType() === 'array') {
                    var arrValue= [];
                    if(angular.isArray(filter.value)) {
                        angular.forEach(filter.value, function(val) {
                            arrValue.push(val);
                        });
                    } else {
                        arrValue.push(filter.value);
                    }
                    filters[filter.id] = arrValue;
                } else {
                    filters[filter.id] = filter.value;
                }
            });
            params.filters = angular.toJson(filters);
            if ($scope.content && $scope.content !== '') {
                params.content = $scope.content;
            }
            params.viewMode = $scope.viewMode.id;
            $location.search(params).path('/search');
            
        };

        $scope.setFilter = function (filter, value) {
            removeSubFilter(filter);
            addFilter(filter, value);
            $scope.search();
        };

        $scope.removeFilter = function (filter) {
            removeSubFilter(filter);
            $scope.filtersManager.removeFilter(filter);
            $scope.search();
        };

        function removeSubFilter (filter) {
            if(filter.getSelected()) {
                var opt = filter.getSelected();
                angular.forEach(opt.getSubFilters(), function(subFilter) {
                    removeSubFilter(subFilter);

                    $scope.filtersManager.removeFilter(subFilter);
                });
            }
        }

        $scope.searchContent = function (content, filters) {
            var queryBuilder = QueryBuilderService.make({
                projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl', 
                source: 'collection'
            });

            queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');
            queryBuilder.addProjection('meta_ortolang-item-json.primaryLanguage', 'primaryLanguage');
            queryBuilder.addProjection('meta_ortolang-item-json.typeOfCorpus', 'typeOfCorpus');

            queryBuilder.addProjection('meta_ortolang-item-json.textFormat', 'textFormat');
            queryBuilder.addProjection('meta_ortolang-item-json.textEncoding', 'textEncoding');

            queryBuilder.addProjection('meta_ortolang-item-json.annotationLevel', 'annotationLevel');
            queryBuilder.addProjection('meta_ortolang-item-json.transcriptionType', 'transcriptionType');
            queryBuilder.addProjection('meta_ortolang-item-json.transcriptionFormat', 'transcriptionFormat');
            queryBuilder.addProjection('meta_ortolang-item-json.typeOfSpeech', 'typeOfSpeech');
            queryBuilder.addProjection('meta_ortolang-item-json.transcriptionEncoding', 'transcriptionEncoding');
            queryBuilder.addProjection('meta_ortolang-item-json.signal', 'signal');

            queryBuilder.addProjection('meta_ortolang-item-json.toolFunctionality', 'toolFunctionality');
            queryBuilder.addProjection('meta_ortolang-item-json.toolInputData', 'toolInputData');

            queryBuilder.equals('status', 'published');
            
            var contentSplit = [];
            if (content && content !== '') {
                contentSplit = queryBuilder.tokenize(content);
            }
            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    queryBuilder.and();
                    queryBuilder.containsText('any()', contentPart);
                });
            }

            for(var filterName in filters) {
                queryBuilder.and();
                if(angular.isArray(filters[filterName])) {
                    queryBuilder.in(filterName, filters[filterName]);
                } else {
                    queryBuilder.equals(filterName, filters[filterName]);
                }
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                $scope.items = [];

                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);

                    if(jsEntry.title) {

                        $scope.items.push(jsEntry);

                        var i = 0;
                        for (i; i < $scope.facetedFilters.length; i++) {
                            if (jsEntry[$scope.facetedFilters[i].getAlias()]) {
                                addOptionFilter($scope.facetedFilters[i], jsEntry[$scope.facetedFilters[i].getAlias()]);
                            }
                        }

                        setVisibleFilters(filters);
                    }
                });
            }, function (reason) {
                console.error(reason);
            });
        };

        function addOptionFilter (filter, optionValue) {
            if(angular.isArray(optionValue)) {
                angular.forEach(optionValue, function(opt) {
                    filter.putOption(OptionFacetedFilter.make({
                        label: opt, 
                        value: opt,
                        length: 1
                    }));
                });
            } else {
                filter.putOption(OptionFacetedFilter.make({
                    label: optionValue, 
                    value: optionValue,
                    length: 1
                }));
            }
        }

        function setSelectedOptionFilter(filter, value) {
            var opt,
                iFacetedOption = 0;
            for (iFacetedOption; iFacetedOption < filter.options.length; iFacetedOption++) {
                var facetedOption = filter.options[iFacetedOption];

                if(angular.isArray(value)) {
                    var iValue = 0;
                    for (iValue; iValue < value.length; iValue++) {
                        if (facetedOption.getValue() === value[iValue]) {
                            opt = facetedOption; //TODO opt may be an array
                            break;
                        }
                    }
                } else {

                    if(facetedOption.getValue() === value) {
                        opt = facetedOption;
                        break;
                    }
                }
            }

            if(opt !== undefined) {
                filter.selected = opt;
            }
        }

        function setVisibleFilters(model) {

            angular.forEach($scope.filtersManager.getFilters(), function(filter) {
                $scope.visibleFacetedFilters.addFilter(filter);

                if(model[filter.getId()]) {
                    setSelectedOptionFilter(filter, model[filter.getId()]);
                }

                if(filter.selected) {

                    angular.forEach(filter.selected.getSubFilters(), function(subFilter) {
                        $scope.visibleFacetedFilters.addFilter(subFilter);
                    });
                }
            });
        }

        function addFilter (filter, value) {

            filter.value = value;

            $scope.filtersManager.addFilter(filter);
        }

        function applyFilters () {
            var filters = {};

            angular.forEach($scope.filtersManager.getFilters(), function(filter) {
                filters[filter.id] = filter.value;
            });

            if (filters) {
                $scope.searchContent($scope.content, filters);
            }
        }

        $scope.toggleOrderBy = function(orderProp){
            if($scope.orderProp !== orderProp) {
                $scope.orderDirection = false;
                $scope.orderProp = orderProp;
            } else {
                $scope.orderDirection = !$scope.orderDirection;
            }
        };

        $scope.switchViewMode = function() {
            $scope.viewMode = ($scope.viewMode.id === viewModeLine.id) ? viewModeTile : viewModeLine;
        };

        function setViewMode(id) {
            if(id === viewModeLine.id) {
                $scope.viewMode = viewModeLine;
            } else if(id === viewModeTile.id) {
                $scope.viewMode = viewModeTile;
            }
        }

        function initLocalVariables() {
            viewModeLine = {id: 'line', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'};
            viewModeTile = {id: 'tile', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'};
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.facetedFilters = [];
            $scope.visibleFacetedFilters = FacetedFilterManager.make();

            var annotationLevelFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.annotationLevel',
                alias: 'annotationLevel',
                type: 'array',
                label: 'MARKET.CORPORA.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.CORPORA.ANNOTATION_LEVEL'
            });
            $scope.facetedFilters.push(annotationLevelFilter);

            var textFormatFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.textFormat',
                alias: 'textFormat',
                type: 'array',
                label: 'MARKET.CORPORA.TEXT_FORMAT',
                resetLabel: 'MARKET.CORPORA.TEXT_FORMAT'
            });
            $scope.facetedFilters.push(textFormatFilter);

            var textEncodingFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.textEncoding',
                alias: 'textEncoding',
                type: 'array',
                label: 'MARKET.CORPORA.TEXT_ENCODING',
                resetLabel: 'MARKET.CORPORA.TEXT_ENCODING'
            });
            $scope.facetedFilters.push(textEncodingFilter);

            var transcriptionTypeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.transcriptionType',
                alias: 'transcriptionType',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TRANSCRIPTION_TYPE',
                resetLabel: 'MARKET.CORPORA.ALL_TRANSCRIPTION_TYPE'
            });
            $scope.facetedFilters.push(transcriptionTypeFilter);

            var transcriptionFormatFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.transcriptionFormat',
                alias: 'transcriptionFormat',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TRANSCRIPTION_FORMAT',
                resetLabel: 'MARKET.CORPORA.ALL_TRANSCRIPTION_FORMAT'
            });
            $scope.facetedFilters.push(transcriptionFormatFilter);

            var typeOfSpeechFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.typeOfSpeech',
                alias: 'typeOfSpeech',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TYPE_OF_SPEECH',
                resetLabel: 'MARKET.CORPORA.ALL_TYPE_OF_SPEECH'
            });
            $scope.facetedFilters.push(typeOfSpeechFilter);

            var transcriptionEncodingFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.transcriptionEncoding',
                alias: 'transcriptionEncoding',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TRANSCRIPTION_ENCODING',
                resetLabel: 'MARKET.CORPORA.ALL_TRANSCRIPTION_ENCODING'
            });
            $scope.facetedFilters.push(transcriptionEncodingFilter);

            var signalFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.signal',
                alias: 'signal',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_SIGNAL',
                resetLabel: 'MARKET.CORPORA.ALL_SIGNAL'
            });
            $scope.facetedFilters.push(signalFilter);


            var primaryLanguage = FacetedFilter.make({
                id: 'meta_ortolang-item-json.primaryLanguage', 
                alias: 'primaryLanguage',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_LANG',
                resetLabel: 'MARKET.CORPORA.ALL_LANG'
            });
            $scope.facetedFilters.push(primaryLanguage);

            var corpusTypeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.typeOfCorpus',
                alias: 'typeOfCorpus',
                label: 'MARKET.CORPORA.CORPORA_TYPE',
                resetLabel: 'MARKET.CORPORA.CORPORA_TYPE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Écrit', 
                        value: 'Écrit',
                        length: 1,
                        subFilters: [annotationLevelFilter, textFormatFilter, textEncodingFilter, primaryLanguage]
                    }),
                    OptionFacetedFilter.make({
                        label: 'Oral', 
                        value: 'Oral',
                        length: 1,
                        subFilters: [transcriptionTypeFilter, transcriptionFormatFilter, typeOfSpeechFilter, transcriptionEncodingFilter, signalFilter]
                    }),
                    OptionFacetedFilter.make({
                        label: 'Multimodal', 
                        value: 'Multimodal',
                        length: 1
                    })
                ]
            });
            $scope.facetedFilters.push(corpusTypeFilter);

            var toolFunctionalityFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolFunctionality',
                alias: 'toolFunctionality',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.CORPORA.ALL_TOOL_FUNCTIONALITY'
            });
            $scope.facetedFilters.push(toolFunctionalityFilter);

            var toolInputDataFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolInputData',
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.CORPORA.ALL_TOOL_INPUTDATA',
                resetLabel: 'MARKET.CORPORA.ALL_TOOL_INPUTDATA'
            });
            $scope.facetedFilters.push(toolInputDataFilter);

            var typeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.type', 
                alias: 'type',
                label: 'MARKET.ALL_RESOURCE',  
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Corpus', 
                        value: 'Corpus',
                        length: 1,
                        subFilters: [corpusTypeFilter]
                    }),
                    OptionFacetedFilter.make({
                        label: 'Lexique', 
                        value: 'Lexique',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Outil', 
                        value: 'Outil',
                        length: 1,
                        subFilters: [toolFunctionalityFilter, toolInputDataFilter]
                    }),
                    OptionFacetedFilter.make({
                        label: 'Projet intégré', 
                        value: 'Application',
                        length: 1
                    })
                ]
                
            });
            $scope.facetedFilters.push(typeFilter);
            $scope.visibleFacetedFilters.addFilter(typeFilter);
            
            var statusOfUse = FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse', 
                alias: 'statusOfUse',
                label: 'MARKET.CORPORA.ALL_STATUSOFUSE',
                resetLabel: 'MARKET.CORPORA.ALL_STATUSOFUSE'
            });
            $scope.facetedFilters.push(statusOfUse);
            $scope.visibleFacetedFilters.addFilter(statusOfUse);

            $scope.content = '';
            $scope.orderProp = 'title';
            $scope.orderDirection = false;
            $scope.viewMode = viewModeLine;
        }

        function init() {
            initLocalVariables();
            initScopeVariables();

            $scope.content = $routeParams.content;

            if($routeParams.viewMode) {
                setViewMode($routeParams.viewMode);
            }

            var filters = $routeParams.filters;

            if(filters) {
                var filtersO = angular.fromJson(filters);

                if(filtersO['meta_ortolang-item-json.type']) {
                    // if(filtersO['meta_ortolang-item-json.type'] === 'Corpus') {
                    //     $rootScope.selectCorpora();
                    // } else if(filtersO['meta_ortolang-item-json.type'] === 'Lexique') {
                    //     $rootScope.selectLexicons();
                    // } else if(filtersO['meta_ortolang-item-json.type'] === 'Outil') {
                    //     $rootScope.selectTools();
                    // } else if(filtersO['meta_ortolang-item-json.type'] === 'Application') {
                    //     $rootScope.selectIntegratedProjects();
                    // }
                }

                for(var paramName in filtersO) {
                    var i = 0;
                    for (i; i < $scope.facetedFilters.length; i++) {
                        if ($scope.facetedFilters[i].id === paramName) {
                            addFilter($scope.facetedFilters[i], filtersO[paramName]);
                        }
                    }
                }
            }
            applyFilters();
        }
        init();

    }]);
