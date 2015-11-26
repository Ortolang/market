'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$rootScope', '$scope', '$modal', 'Settings', 'QueryBuilderFactory', 'SearchResource',
        function ($rootScope, $scope, $modal, Settings, QueryBuilderFactory, SearchResource) {

            $scope.deleteProducer = function (producer) {
                var index = $scope.metadata.producers.indexOf(producer);
                if (index > -1) {
                    $scope.metadata.producers.splice(index, 1);
                }
            };


	        $scope.deleteContributor = function (contributor) {
	            var index = $scope.metadata.contributors.indexOf(contributor);
	            if (index > -1) {
	                $scope.metadata.contributors.splice(index, 1);
	            }
	        };


            /**
             * Methods on person
             **/

            function prepareModalScopeForPerson() {
                var modalScope = $rootScope.$new(true);
                modalScope.type = 'Person';
                modalScope.roleTag = [];
                modalScope.allRoles = $scope.allRoles;

                modalScope.searchPerson = '';
                modalScope.allPersons = $scope.allPersons;

                modalScope.$on('tafirstname.select', function (v, i) {
                    modalScope.type = i.type;
                    modalScope.id = i.id;
                    modalScope.lastname = i.lastname;
                    modalScope.firstname = i.firstname;
                    modalScope.midname = i.midname;
                    if (angular.isDefined(i.org)) {
                        modalScope.organizationFullname = i.org.fullname;
                        modalScope.organization = i.org;
                    }
                    modalScope.fullname = i.fullname;

                    modalScope.$apply();
                });

                modalScope.organizationFullname = '';
                modalScope.allOrganizations = $scope.allOrganizations;

                modalScope.$on('taorg.select', function (v, i) {
                    modalScope.organization = i.org;

                    modalScope.$apply();
                });


                modalScope.clearSearch = clearSearchPerson;

                return modalScope;
            }

            function setPerson(contributor, myScope) {
                contributor.entity.type = myScope.type;
                contributor.entity.id = myScope.id;
                contributor.entity.lastname = myScope.lastname;
                contributor.entity.firstname = myScope.firstname;
                contributor.entity.midname = myScope.midname;

                if (angular.isDefined(myScope.organization) && myScope.organization.fullname === myScope.organizationFullname) {
                    contributor.entity.organization = myScope.organization;
                }

                contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
            }

            function clearModalScopeForPerson(modalScope) {
                delete modalScope.id;
                delete modalScope.lastname;
                delete modalScope.firstname;
                delete modalScope.midname;
                delete modalScope.organization;
                delete modalScope.organizationFullname;
                delete modalScope.fullname;
            }

            function clearSearchPerson(modalScope) {
                // angular.element('#add-contributor-searchPerson').val('');

                clearModalScopeForPerson(modalScope);
            }

            function getFullnameOfPerson(person) {
                var fullname = person.firstname;
                fullname += angular.isDefined(person.midname) ? ' ' + person.midname : '';
                fullname += ' ' + person.lastname;
                return fullname;
            }

            function setRoles(contributor, myScope) {
                contributor.roles = [];
                angular.forEach(myScope.roleTag, function(tag) {
                        contributor.roles.push(tag);
                });
            }

            $scope.addPerson = function () {

                var modalScope = prepareModalScopeForPerson(),
                    addContributorModal;

                modalScope.newPerson = true;
                modalScope.createPerson = function() {
                    modalScope.newPerson = !modalScope.newPerson;
                    clearSearchPerson(modalScope);
                };

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.submit = function (addContributorForm) {

                    if(!personExists(modalScope, $scope.metadata.contributors)) {
                        addContributorForm.fullname.$setValidity('exists', true);
                    } else {
                        addContributorForm.fullname.$setValidity('exists', false);
                    }

                    if(modalScope.roleTag.length>0) {
                        addContributorForm.roleTag.$setValidity('role', true);
                    } else {
                        addContributorForm.roleTag.$setValidity('role', false);
                    }

                    if (addContributorForm.$valid) {
                        var contributor = {entity:{},roles:[]};

                        setPerson(contributor, modalScope);

                        setRoles(contributor, modalScope);

                        if($scope.metadata.contributors===undefined) {
                            $scope.metadata.contributors = [];
                        }
                        
                        $scope.metadata.contributors.push(contributor);
                        addContributorModal.hide();
                    }
                };

                addContributorModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/add-person-modal.html'
                });
            };


            /**
             * Methods on Organizations
             **/

            function prepareModalScopeForOrganization() {
                var modalScope = $rootScope.$new(true);
                modalScope.type = 'organization';

                return modalScope;
            }

            function getFullnameOfOrganization(org) {
                var fullname = org.name,
                    details = '';
                details += angular.isDefined(org.acronym) ? org.acronym : '';
                details += (angular.isDefined(org.acronym) && (angular.isDefined(org.city) || angular.isDefined(org.country))) ? ', ' : '';
                details += angular.isDefined(org.city) ? org.city : '';
                details += angular.isDefined(org.country) ? ' ' + org.country : '';
                if (details !== '') {
                    fullname += ' (' + details + ')';
                }
                return fullname;
            }

            function setOrganization(organization, myScope) {
                organization.type = myScope.type;
                organization.id = myScope.id;
                organization.name = myScope.name;
                organization.fullname = getFullnameOfOrganization(myScope);
                organization.acronym = myScope.acronym;
                organization.city = myScope.city;
                organization.country = myScope.country;
                organization.homepage = myScope.homepage;
                organization.img = myScope.img;
            }

            $scope.createProducer = function () {
                var modalScope = prepareModalScopeForOrganization(),
                    addOrganizationModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.submit = function (addOrganizationForm) {

                    if(angular.isUndefined(modalScope.name)) {
                        addOrganizationForm.name.$setValidity('undefined', false);
                    } else {
                        addOrganizationForm.name.$setValidity('undefined', true);
                    }

                    if(!producerExists(modalScope, $scope.metadata.contributors)) {
                        addOrganizationForm.name.$setValidity('exists', true);
                    } else {
                        addOrganizationForm.name.$setValidity('exists', false);
                    }

                    if (addOrganizationForm.$valid) {
                        var organization = {};

                        setOrganization(organization, modalScope);

                        if($scope.metadata.producers===undefined) {
                            $scope.metadata.producers = [];
                        }
                        $scope.metadata.producers.push(organization);
                        addOrganizationModal.hide();
                    }
                };

                addOrganizationModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/add-organization-modal.html'
                });
            };


            /**
             * Utils
             **/
            function producerExists(producer, producers) {
                if(angular.isDefined(producer.name) && angular.isDefined(producers)) {
                    //TODO with $filter
                    var indexProducer;
                    for (indexProducer = 0; indexProducer < producers.length; indexProducer++) {
                        if(angular.isDefined(producers[indexProducer].id) && angular.isDefined(producer.id)) {
                            if (producers[indexProducer].id === producer.id) {
                                return true;
                            }
                        } else {
                            if (producers[indexProducer].name === producer.name) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function personExists(contributor, contributors) {
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

                queryBuilder.addProjection('meta_ortolang-referentiel-json.type', 'type');
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
                            type: person.type,
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

            /**
             * Initialize the scope
             **/

        	function init() {
                loadAllPersons();
                loadAllOrganizations();
        		loadAllRoles();

        		$scope.searchOrganization = '';
        		$scope.$on('taorg.select', function (v, i) {
        			var organization = {};
                    organization.type = 'Organization';
                    organization.id = i.org.id;
                    organization.name = i.org.name;
                    organization.acronym = i.org.acronym;
                    organization.city = i.org.city;
                    organization.country = i.org.country;
                    organization.homepage = i.org.homepage;
                    organization.img = i.org.img;
                    organization.fullname = i.org.fullname;

                    if($scope.metadata.producers===undefined || ($scope.metadata.producers!==undefined && !producerExists(organization, $scope.metadata.producers))) {
                        if($scope.metadata.producers===undefined) {
                            $scope.metadata.producers = [];
                        }
                    	$scope.metadata.producers.push(organization);
                    } else {
                        console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
                    }

                    clearSearchOrganization();

                    $scope.$apply();
                });
        	}
        	init();
}]);