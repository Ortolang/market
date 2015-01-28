'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataFormMarketOrtolangCtrl', ['$scope', '$rootScope', '$modal', 'N3Serializer', 'ObjectResource', function ($scope, $rootScope, $modal, N3Serializer, ObjectResource) {
        $scope.selectTab = function(tabName) {
            $scope.selectedTab = tabName;
        };

        $scope.submitMetadata = function (form, md) {
            // $scope.$broadcast('show-errors-check-validity');

            if($scope.onlineTool===false) {
                delete md['http://www.ortolang.fr/ontology/toolHelp'];
                delete md['http://www.ortolang.fr/ontology/toolId'];
                delete md['http://www.ortolang.fr/ontology/toolUrl'];
            }

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
        var deregisterFolderSelectModal = $rootScope.$on('browserSelectedElements-folderSelectModal', function ($event, elements) {
            console.debug('metadata-form-market-ortolang caught event "browserSelectedElements-folderSelectModal" (selected elements: %o)', elements);
            if (!$scope.md) {
                $scope.md = {};
            }
            $scope.md['http://www.ortolang.fr/ontology/preview'] = elements[0].key;
            $scope.preview = elements[0];
            $scope.folderSelectModal.hide();
        });

        var deregisterFileImageSelectModal = $rootScope.$on('browserSelectedElements-fileImageSelectModal', function ($event, elements) {
            console.debug('metadata-form-market-ortolang caught event "browserSelectedElements-fileImageSelectModal" (selected elements: %o)', elements);
            if (!$scope.md) {
                $scope.md = {};
            }
            $scope.md['http://www.ortolang.fr/ontology/image'] = elements[0].key;
            $scope.image = elements[0];
            $scope.fileImageSelectModal.hide();
        });


        var deregistration = $rootScope.$on('metadata-form-submit', function () {
           $scope.submitMetadata($scope.metadataMarketform, $scope.md);
        });

        $scope.$on('$destroy', function () {
            deregistration();
            deregisterFolderSelectModal();
            deregisterFileImageSelectModal();
        });

        function init() {
            $scope.tabs = [
                {id:'info', label:'Renseignements'},
                {id: 'rights', label: 'Droits'},
                {id:'contributor', label: 'Contribution'},
                {id:'corpora', label: 'Corpus'},
                {id:'annotation', label: 'Enrichissement'},
                {id:'tool', label: 'Outil'},
                {id:'website', label: 'Site web'}
            ];
            $scope.selectedTab = 'info';

            $scope.sparqlCategories = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otl: <http://www.ortolang.fr/2014/09/market#> SELECT DISTINCT ?label WHERE { ?class rdf:type rdfs:Class ; rdfs:subClassOf <http://www.ortolang.fr/2014/09/market#Product> ; rdfs:label ?label . FILTER langMatches( lang(?label), "fr" ) }';
            $scope.sparqlConditionsOfUse = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX otl: <http://www.ortolang.fr/2014/09/market#> SELECT DISTINCT ?label WHERE { ?class rdf:type rdfs:Class ; rdfs:subClassOf <http://www.ortolang.fr/2014/09/market#ConditionsOfUse> ; rdfs:label ?label . FILTER langMatches( lang(?label), "fr" ) }';

            $scope.sparqlSpartial = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?geographicRegion ?label WHERE { ?geographicRegion rdf:type <lvont:GeographicRegion> ; rdfs:label ?label .FILTER (langMatches( lang(?label), "fr") && regex(?label, "^$searchText", "i")) }';
            $scope.sparqlLanguage = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?label WHERE { ?lang rdf:type <lvont:Language> ; rdfs:label ?label .FILTER (langMatches( lang(?label), "fr") && regex(?label, "^$searchText", "i")) }';

            var folderSelectModalScope = $rootScope.$new(true);
            folderSelectModalScope.acceptMultiple = false;
            folderSelectModalScope.forceMimeTypes = 'ortolang/collection';
            folderSelectModalScope.forceWorkspace = $scope.wskey;
            folderSelectModalScope.forceHead = true;
            folderSelectModalScope.fileSelectId = 'folderSelectModal';
            $scope.folderSelectModal = $modal({scope: folderSelectModalScope, title: 'Folder select', template: 'common/directives/file-select-modal-template.html', show: false});

            var fileImageSelectModalScope = $rootScope.$new(true);
            fileImageSelectModalScope.acceptMultiple = false;
            fileImageSelectModalScope.forceMimeTypes = 'image';
            fileImageSelectModalScope.forceWorkspace = $scope.wskey;
            fileImageSelectModalScope.forceHead = true;
            fileImageSelectModalScope.fileSelectId = 'fileImageSelectModal';
            $scope.fileImageSelectModal = $modal({scope: fileImageSelectModalScope, title: 'File select', template: 'common/directives/file-select-modal-template.html', show: false});

            if ($scope.selectedMetadataContent !== undefined) {
                var mdFromN3 = N3Serializer.fromN3($scope.selectedMetadataContent);
                mdFromN3.then(function (data) {
                    $scope.md = angular.copy(data);
                    ObjectResource.get({oKey: $scope.md['http://www.ortolang.fr/ontology/preview']}).$promise.then(function (data) {
                        $scope.preview = data.object;
                    });
                    ObjectResource.get({oKey: $scope.md['http://www.ortolang.fr/ontology/image']}).$promise.then(function (data) {
                        $scope.image = data.object;
                    });
                });
            }
        }

        init();
    }]);
