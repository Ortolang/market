'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'QueryBuilderFactory', 'SearchResource', 'Settings', '$q', 'Helper', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, QueryBuilderFactory, SearchResource, Settings, $q, Helper) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.type',
                alias: 'type',
                label: 'MARKET.RESOURCE_TYPE',
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Corpus',
                        value: 'Corpus',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Lexique',
                        value: 'Lexique',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Outil',
                        value: 'Outil',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Projet intégré',
                        value: 'Application',
                        length: 1
                    })
                ],
                lockOptions: true,
                lock: true
            });
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            addAvailableFilter({
                id: 'meta_ortolang-item-json.annotationLevels',
                alias: 'annotationLevels',
                type: 'array',
                label: 'MARKET.FACET.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.FACET.ALL_ANNOTATION_LEVEL'
            }, 'AnnotationLevel');
            
            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaFormats',
                alias: 'corporaFormats',
                type: 'array',
                label: 'MARKET.FACET.TEXT_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT'
            }, 'CorporaFormat');
            

            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaDataTypes',
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            }, 'CorporaDataType');

            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaLanguageType',
                alias: 'corporaLanguageType',
                label: 'MARKET.FACET.CORPORA_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE'
            }, 'CorporaLanguageType');
            
            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaFileEncodings',
                alias: 'corporaFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TEXT_ENCODING',
                resetLabel: 'MARKET.FACET.ALL_TEXT_ENCODING'
            }, 'CorporaFileEncoding');

            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaType',
                alias: 'corporaType',
                label: 'MARKET.FACET.CORPORA_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }, 'CorporaType');

            addAvailableFilter({
                id: 'meta_ortolang-item-json.corporaLanguages',
                alias: 'corporaLanguages',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_LANG',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }, 'Language', 1);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            listStatusOfUses().then(function (entities) {
                angular.forEach(entities, function(entity) {
                    statusOfUseFilter.putOption(OptionFacetedFilter.make({
                        label: entity.label,
                        value: entity.id,
                        length: 1
                    }));
                });
            });
            $scope.filtersManager.addAvailableFilter(statusOfUseFilter);
            
        }

        function addAvailableFilter(filterConfig, refType, rank) {
            var filter = FacetedFilter.make(filterConfig);
            listReferentialEntities(refType, rank).then(function (entities) {
                angular.forEach(entities, function(entity) {
                    filter.putOption(OptionFacetedFilter.make({
                        label: entity.label,
                        value: entity.id,
                        length: 1
                    }));
                });
            });
            $scope.filtersManager.addAvailableFilter(filter);
        }

        function listReferentialEntities(entityType, rank) {
            var deferred = $q.defer();

            var queryBuilder = QueryBuilderFactory.make({
                projection: '*',
                source: 'term'
            });

            queryBuilder.addProjection('meta_ortolang-referentiel-json.labels', 'labels');

            // queryBuilder.equals('meta_ortolang-referentiel-json.type', entityType);
            queryBuilder.in('meta_ortolang-referentiel-json.compatibilities', ['"'+entityType+'"']);
            if(rank) {
                queryBuilder.addProjection('meta_ortolang-referentiel-json.rank', 'rank');
                queryBuilder.and().equals('meta_ortolang-referentiel-json.rank', rank);
            }

            var query = queryBuilder.toString();
            var allReferentialEntities = [];
            SearchResource.json({query: query}, function (jsonResults) {
                angular.forEach(jsonResults, function (result) {
                    var term = angular.fromJson(result);

                    if(term.labels) {
                        var entity = {id: term['@rid'], label: Helper.getMultilingualValue(term.labels)};
                        if(term.rank) {
                            entity.rank = term.rank;
                        }
                        allReferentialEntities.push(entity);
                    }
                });
                deferred.resolve(allReferentialEntities);
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        function listStatusOfUses() {
            var deferred = $q.defer();

            var queryBuilder = QueryBuilderFactory.make({
                projection: '*',
                source: 'statusofuse'
            });

            queryBuilder.addProjection('meta_ortolang-referentiel-json.labels', 'labels');

            var query = queryBuilder.toString();
            var allStatusOfUses = [];
            SearchResource.json({query: query}, function (jsonResults) {
                angular.forEach(jsonResults, function (result) {
                    var term = angular.fromJson(result);

                    if(term.labels) {
                        var entity = {id: term['@rid'], label: Helper.getMultilingualValue(term.labels)};
                        if(term.rank) {
                            entity.rank = term.rank;
                        }
                        allStatusOfUses.push(entity);
                    }
                });
                deferred.resolve(allStatusOfUses);
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        function addCustomProjections() {
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaLanguages', 'corporaLanguages');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaType', 'corporaType');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaFormats', 'corporaFormats');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaFileEncodings', 'corporaFileEncodings');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaDataTypes', 'corporaDataTypes');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaLanguageType', 'corporaLanguageType');
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            addCustomProjections();
        }

        init();

    }]);
