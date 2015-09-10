'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', 'icons', 'QueryBuilderFactory', 'JsonResultResource', 'ItemManager', 'FacetedFilterManager', 'ReferentielResource', function ($rootScope, $scope, $routeParams, icons, QueryBuilderFactory, JsonResultResource, ItemManager, FacetedFilterManager, ReferentielResource) {

        function loadItem(id) {

            ReferentielResource.get({refKey: id}).$promise.then(function (referentielEntity) {
                $scope.contributor = angular.fromJson(referentielEntity.content);
                
                $scope.ready = true;
                loadResources($scope.contributor.id);
            });
        }

        function loadResources(contributor) {
            if(contributor) {
                $scope.queryBuilder.and();
                $scope.queryBuilder.in('meta_ortolang-item-json.contributors[entity][id]', [contributor]);
                $scope.query = $scope.queryBuilder.toString();
            }
        }

        // Scope variables
        function initScopeVariables() {
            $scope.contributor = undefined;
            $scope.ready = false;

            $scope.query = '';
            $scope.queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate',
                    source: 'collection'
                });

            // TODO removes duplication with facted-filter-manager
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

            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.versionName', 'version');
            $scope.queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

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
            loadItem($routeParams.contributorId);
        }

        init();

    }]);
