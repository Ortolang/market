'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LicenceCtrl
 * @description
 * # LicenceCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LicenceCtrl', ['$rootScope', '$scope', '$modal', 'Settings', 'QueryBuilderFactory', 'SearchResource',
        function ($rootScope, $scope, $modal, Settings, QueryBuilderFactory, SearchResource) {


            /**
             * Methods on person
             **/

            function prepareModalScopeNewLicence() {
                var modalScope = $rootScope.$new(true);
                modalScope.type = 'Licence';
                modalScope.allStatusOfUse = $scope.allStatusOfUse;

                return modalScope;
            }

            $scope.addLicence = function () {

                var modalScope = prepareModalScopeNewLicence(),
                    addLicenceModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.submit = function (addLicenceForm) {

                    // if(!personExists(modalScope, $scope.metadata.contributors)) {
                    //     addLicenceForm.fullname.$setValidity('exists', true);
                    // } else {
                    //     addLicenceForm.fullname.$setValidity('exists', false);
                    // }

                    if (addLicenceForm.$valid) {
                    	$scope.metadata.statusOfUse = modalScope.statusOfUse;
                    	$scope.metadata.conditionsOfUse = modalScope.conditionsOfUse;
                    	$scope.metadata.license = modalScope.license;
                    	$scope.metadata.licenseWebsite = modalScope.licenseWebsite;

                        addLicenceModal.hide();
                    }
                };

                addLicenceModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/add-licence-modal.html'
                });
            };


            function loadAllStatusOfUse() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-referentiel-json',
                    source: 'ReferentielEntity'
                });

                // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'StatusOfUse');

                var query = queryBuilder.toString();
                $scope.allStatusOfUse = [];
                SearchResource.json({query: query}).$promise.then(function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allStatusOfUse.push({id: term.id, label: term.label});
                    });
                });
            }

        	function init() {
        		$scope.allLicences = [
        			{
        				id:'cc0', 
        				label:'Creative Commons Zero : Cette licence permet d\'utiliser, redistribuer et modifier sans contrainte'
        			},
        			{
        				id:'cc-by', 
        				label:'Creative Commons B.. Y.. : Cette licence permet d\'utiliser, redistribuer et modifier en citant la personne responsable de la ressource'
        			}
        		];

        		loadAllStatusOfUse();
        	}
        	init();
}]);