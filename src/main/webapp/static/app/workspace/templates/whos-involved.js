'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$scope', 'Settings', 'QueryBuilderFactory', 'SearchResource',
        function ($scope, Settings, QueryBuilderFactory, SearchResource) {

	        $scope.deleteContributor = function (contributor) {
	            var index = $scope.metadata.contributors.indexOf(contributor);
	            if (index > -1) {
	                $scope.metadata.contributors.splice(index, 1);
	            }
	        };


            /**
             * Utils
             **/

            function contributorExists(contributor, contributors) {
                if(angular.isDefined(contributor.fullname) && angular.isDefined(contributors)) {
                    var iContributor;
                    for (iContributor = 0; iContributor < contributors.length; iContributor++) {
                        if(angular.isDefined(contributors[iContributor].entity.id) && angular.isDefined(contributor.id)) {
                            if (contributors[iContributor].entity.id === contributor.id) {
                                return true;
                            }
                        } else {
                            if (contributors[iContributor].entity.fullname === contributor.fullname) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function loadAllPersons() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key',
                    source: 'ReferentielEntity'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.lastname', 'lastname');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.firstname', 'firstname');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.midname', 'midname');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.organization', 'organization');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'Person');

                var query = queryBuilder.toString();
                $scope.allPersons = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var person = angular.fromJson(result);

                        $scope.allPersons.push({
                            value: person.fullname,
                            id: person.id,
                            fullname: person.fullname,
                            lastname: person.lastname,
                            firstname: person.firstname,
                            midname: person.midname,
                            org: person.organization,
                            label: '<span>' + person.fullname + '</span>'
                        });

                    });
                });
            }

            function loadAllOrganizations() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-referentiel-json',
                    source: 'ReferentielEntity'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'Organization');

                var query = queryBuilder.toString();
                $scope.allOrganizations = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var organization = angular.fromJson(result);

                        // Load organization document
                        var queryOrganizationgMeta = 'select from ' + organization['meta_ortolang-referentiel-json'];
                        SearchResource.json({query: queryOrganizationgMeta}, function (jsonObject) {
                            var org = angular.fromJson(jsonObject[0]);

                            cleanJsonDocument(org);

                            $scope.allOrganizations.push({
                                value: organization.fullname,
                                fullname: organization.fullname,
                                org: org,
                                label: '<span>' + organization.fullname + '</span>'
                            });
                        });


                    });
                });
            }

            function cleanJsonDocument(doc) {
                for (var propertyName in doc) {
                    if(propertyName.substring(0,1)==='@') {
                        delete doc[propertyName];
                    }
                }
            }

            function loadAllRoles() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-referentiel-json',
                    source: 'ReferentielEntity'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=' + Settings.language + '].value', 'label');

                queryBuilder.equals('meta_ortolang-referentiel-json.type', 'Role');

                var query = queryBuilder.toString();
                $scope.allRoles = [];
                SearchResource.json({query: query}, function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var role = angular.fromJson(result);

                        $scope.allRoles.push({id: role.id, label: role.label});
                    });
                });
            }

            function clearSearchOrganization() {
                angular.element('#search-producer').val('');
            }

            function clearSearchPerson() {
                angular.element('#search-person').val('');
            }

            /**
             * Initialize the scope
             **/

        	function init() {
                loadAllPersons();
                loadAllOrganizations();
        		loadAllRoles();

        		$scope.searchOrganization = '';
        		$scope.$on('taorg.select', function (v, i) {
        			var organization = {entity: {}, role: []};
                    organization.entity.type = 'organization';
                    organization.entity.id = i.org.id;
                    organization.entity.name = i.org.name;
                    organization.entity.acronym = i.org.acronym;
                    organization.entity.city = i.org.city;
                    organization.entity.country = i.org.country;
                    organization.entity.homepage = i.org.homepage;
                    organization.entity.img = i.org.img;
                    organization.entity.fullname = i.org.fullname;
                    organization.role.push('producer');

                    if(!contributorExists(organization.entity, $scope.metadata.contributors)) {
                    	$scope.metadata.contributors.push(organization);
                    } else {
                        console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
                    }

                    clearSearchOrganization();

                    $scope.$apply();
                });

        		$scope.searchPerson = '';
        		$scope.$on('tapers.select', function (v, i) {
        			var organization = {entity: {}, role: []};
                    organization.entity.type = 'person';
                    organization.entity.id = i.id;
                    organization.entity.lastname = i.lastname;
                    organization.entity.firstname = i.firstname;
                    organization.entity.midname = i.midname;
                    if (angular.isDefined(i.org)) {
                        // organization.entity.organizationFullname = i.org.fullname;
                        organization.entity.organization = i.org;
                    }
                    organization.entity.fullname = i.fullname;
                    // organization.role.push('producer');

                    // if(!contributorExists(organization.entity, $scope.metadata.contributors)) {
                    // 	$scope.metadata.contributors.push(organization);
                    // } else {
                    //     console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
                    // }

                    clearSearchPerson();

                    $scope.$apply();
                });
        	}
        	init();
}]);