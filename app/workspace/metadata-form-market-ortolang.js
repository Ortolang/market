'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataFormMarketOrtolangCtrl', ['$scope', '$rootScope', '$modal', 'N3Serializer', 'ObjectResource', 'SemanticResultResource', function ($scope, $rootScope, $modal, N3Serializer, ObjectResource, SemanticResultResource) {

        $scope.selectTab = function(tabName) {
            $scope.selectedTab = tabName;
        }

        $scope.submitMetadata = function (form, md) {
            $scope.$broadcast('show-errors-check-validity');
            
            if (form.$invalid) {
                console.debug('not ready');
                return;
            }

            var content = N3Serializer.toN3(md),
                contentType = 'text/n3';

            $rootScope.$broadcast('metadata-editor-create', content, contentType);
        };

        /*************
         * Listeners
         *************/
        $rootScope.$on('browserSelectedElements', function ($event, elements) {
            if (!$scope.md) {
                $scope.md = {};
            }
            $scope.md['http://www.ortolang.fr/ontology/preview'] = elements[0].key;
            $scope.preview = elements[0];
            $scope.fileSelectModal.hide();
        });

        $rootScope.$on('metadata-form-submit', function ($event) {
           $scope.submitMetadata($scope.metadataMarketform, $scope.md);
        });

        function init() {
            $scope.tabs = [
                {id:'info', label:'Renseignements'}, 
                {id: 'rights', label: 'Droits'}, 
                {id:'contributor', label: 'Contribution'}, 
                {id:'corpora', label: 'Corpus'}, 
                {id:'annotation', label: 'Enrichissement'}, 
                {id:'tool', label: 'Outil'}
            ];
            $scope.selectedTab = 'info';

            $scope.sparqlCategories = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otl: <http://www.ortolang.fr/2014/09/market#> SELECT DISTINCT ?label WHERE { ?class rdf:type rdfs:Class ; rdfs:subClassOf <http://www.ortolang.fr/2014/09/market#Product> ; rdfs:label ?label . FILTER langMatches( lang(?label), "fr" ) }';
            $scope.sparqlConditionsOfUse = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otl: <http://www.ortolang.fr/2014/09/market#> SELECT DISTINCT ?label WHERE { ?class rdf:type rdfs:Class ; rdfs:subClassOf <http://www.ortolang.fr/2014/09/market#ConditionsOfUse> ; rdfs:label ?label . FILTER langMatches( lang(?label), "fr" ) }';
            // $scope.useConditions = [{id: 'free', label: 'Libre'}, {id: 'free-nc', label: 'Libre sans usage commercial'}, {id: 'restricted', label: 'Négociation nécessaire'}];

            $scope.keywordsSuggestion = ['Sociologie', 'Linguistique'];
            // $scope.keyword = ['Linguistique'];

            var fileSelectModalScope = $rootScope.$new(true);
            fileSelectModalScope.acceptMultiple = false;
            fileSelectModalScope.forceMimeTypes = 'ortolang/collection';
            fileSelectModalScope.forceWorkspace = $scope.wskey;
            fileSelectModalScope.forceHead = true;
            $scope.fileSelectModal = $modal({scope: fileSelectModalScope, title: 'File select test', template: 'common/directives/file-select-modal-template.html', show: false});

            if ($scope.selectedMetadataContent !== undefined) {
                var mdFromN3 = N3Serializer.fromN3($scope.selectedMetadataContent);
                mdFromN3.then(function (data) {
                    $scope.md = angular.copy(data);
                    ObjectResource.get({oKey: $scope.md.preview}).$promise.then(function (data) {
                        $scope.preview = data.object;
                    });
                });
            }
        }

        init();
    }]);
