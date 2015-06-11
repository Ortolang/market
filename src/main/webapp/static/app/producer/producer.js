'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', 'icons', 'QueryBuilderFactory', 'JsonResultResource', 'ItemManager', 'FacetedFilterManager', function ($rootScope, $scope, $routeParams, icons, QueryBuilderFactory, JsonResultResource, ItemManager, FacetedFilterManager) {

        function loadItem(id) {

            var queryBuilder = QueryBuilderFactory.make(
                {
                    projection: '*',
                    source: 'Organization'
                }
            );

            queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.name', 'name');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.img', 'img');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.homepage', 'homepage');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.acronym', 'acronym');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.city', 'city');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.country', 'country');

            queryBuilder.equals('meta_ortolang-referentiel-json.id', id);

            console.log(queryBuilder.toString());
            JsonResultResource.get({query: queryBuilder.toString()}).$promise.then(function (jsonResults) {
                if(jsonResults.length===1) {

                    $scope.producer = angular.fromJson(jsonResults[0]);

                    if(!$scope.producer.img) {
                        $scope.imgtitle = '';
                        $scope.imgtheme = 'custom';
                        if($scope.producer.title) {
                            $scope.imgtitle = $scope.producer.title.substring(0,2);
                            $scope.imgtheme = $scope.producer.title.substring(0,1).toLowerCase();
                        }
                    }

                    if($scope.producer.fullname) {
                        loadResources($scope.producer.fullname);
                    }
                }
            }, function (reason) {
                console.error(reason);
            });
        }

        function loadResources(producer) {
            if(producer) {
                $scope.queryBuilder.and();
                $scope.queryBuilder.in('meta_ortolang-item-json.producers', [producer]);
                $scope.query = $scope.queryBuilder.toString();
            }
        }

        // Scope variables
        function initScopeVariables() {
            $scope.producer = undefined;

            $scope.query = '';
            $scope.queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate',
                    source: 'collection'
                });

            // TODO made based on availabled filters
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguages', 'corporaLanguages');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaType', 'corporaType');

            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaFormats', 'corporaFormats');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaFileEncodings', 'corporaFileEncodings');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaDataTypes', 'corporaDataTypes');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.corporaLanguageType', 'corporaLanguageType');

            $scope.queryBuilder.addProjection('meta_ortolang-item-json.annotationLevels', 'annotationLevels');

            $scope.queryBuilder.addProjection('meta_ortolang-item-json.toolLanguages', 'toolLanguages');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.toolFunctionalities', 'toolFunctionalities');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.toolInputData', 'toolInputData');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.toolOutputData', 'toolOutputData');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.toolFileEncodings', 'toolFileEncodings');

            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconInputType', 'lexiconInputType');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconDescriptionTypes', 'lexiconDescriptionTypes');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconInputLanguages', 'lexiconInputLanguages');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconDescriptionLanguages', 'lexiconDescriptionLanguages');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconFormats', 'lexiconFormats');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.lexiconLanguageType', 'lexiconLanguageType');

            $scope.queryBuilder.equals('status', 'published');

            $scope.items = ItemManager.make();

            $scope.filtersManager = FacetedFilterManager.make();
            
            var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            $scope.viewMode = viewModeGrid;
            $scope.orderDirection = true;
            var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            $scope.orderProp = orderPublicationDate;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.producerId);
        }

        init();

    }]);
