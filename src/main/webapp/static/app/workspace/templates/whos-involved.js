'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$rootScope', '$scope', '$modal', '$filter', 'Settings', 'ReferentialEntityResource', 'Helper',
        function ($rootScope, $scope, $modal, $filter, Settings, ReferentialEntityResource, Helper) {

            $scope.deleteProducer = function (producer) {
                var index = $scope.producers.indexOf(producer);
                if (index > -1) {
                    $scope.metadata.producers.splice(index, 1);
                    $scope.producers.splice(index, 1);
                }
            };

            $scope.deleteContributor = function (contributor) {
                var index = $scope.contributors.indexOf(contributor);
                if (index > -1) {
                    $scope.metadata.contributors.splice(index, 1);
                    $scope.contributors.splice(index, 1);
                }
            };

            /**
             * Methods on person
             **/

            function prepareModalScopeForPerson() {
                var modalScope = $rootScope.$new(true);
                modalScope.models = {};
                modalScope.models.roleTag = [];
                modalScope.allRoles = $scope.models.allRoles;

                modalScope.allPersons = $scope.allPersons;

                modalScope.$on('tafirstname.select', function (v, i) {
                    modalScope.models.rid = i.rid;
                    modalScope.models.key = i.key;
                    modalScope.models.lastname = i.lastname;
                    modalScope.models.firstname = i.firstname;
                    modalScope.models.midname = i.midname;
                    if (angular.isDefined(i.org)) {
                        var orgFound = $filter('filter')($scope.allOrganizations, {key:Helper.extractKeyFromReferentialId(i.org)}, true);
                        if (orgFound.length > 0) {
                            modalScope.models.organizationFullname = orgFound[0].fullname;
                            // modalScope.models.originOrganizationFullname = orgFound[0].fullname;
                        }
                        modalScope.organization = i.org;
                    }
                    modalScope.models.fullname = i.fullname;

                    modalScope.$apply();
                });

                modalScope.models.organizationFullname = '';
                modalScope.allOrganizations = $scope.allOrganizations;

                modalScope.$on('taorg.select', function (v, i) {
                    modalScope.organization = "${" + i.key + "}";
                    // modalScope.organizationKey = i.key;
                    modalScope.models.organizationFullname = i.org.fullname;

                    modalScope.$apply();
                });


                modalScope.clearSearch = function () {
                    modalScope.models = {};
                };

                return modalScope;
            }

            function setPerson(contributor, modalScope) {
                contributor.entity.lastname = modalScope.models.lastname;
                contributor.entity.rid = modalScope.models.rid;
                contributor.entity.key = modalScope.models.key;
                contributor.entity.firstname = modalScope.models.firstname;
                contributor.entity.midname = modalScope.models.midname;

                // if (angular.isDefined(modalScope.organization) && modalScope.organization.originOrganizationFullname === modalScope.models.organizationFullname) {
                    // contributor.entity.organization = modalScope.organization;
                    // contributor.entity.organization = '${' + modalScope.organization.key + '}';
                    contributor.entity.organization = modalScope.organization;
                // }

                contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
            }

            function getFullnameOfPerson(person) {
                var fullname = person.firstname;
                fullname += angular.isDefined(person.midname) ? ' ' + person.midname : '';
                fullname += ' ' + person.lastname;
                return fullname;
            }

            function setRoles(contributor, myScope) {
                contributor.roles = [];
                angular.forEach(myScope.models.roleTag, function (tag) {
                    contributor.roles.push(tag);
                });
            }

            $scope.addPerson = function () {

                var modalScope = prepareModalScopeForPerson(),
                    addContributorModal;

                modalScope.newPerson = true;
                modalScope.createPerson = function () {
                    modalScope.newPerson = !modalScope.newPerson;
                };

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.submit = function (addContributorForm) {

                    if (!personExists(modalScope, $scope.contributors)) {
                        addContributorForm.fullname.$setValidity('exists', true);
                    } else {
                        addContributorForm.fullname.$setValidity('exists', false);
                    }

                    if (modalScope.models.roleTag.length > 0) {
                        addContributorForm.roleTag.$setValidity('role', true);
                    } else {
                        addContributorForm.roleTag.$setValidity('role', false);
                    }

                    if (addContributorForm.$valid) {
                        var contributor = {entity: {}, roles: []};

                        setPerson(contributor, modalScope);

                        setRoles(contributor, modalScope);

                        if ($scope.contributors === undefined) {
                            $scope.contributors = [];
                            $scope.metadata.contributors = [];
                        }

                        $scope.contributors.push(contributor);

                        var roles = [];
                        angular.forEach(contributor.roles, function (role) {
                            roles.push('${' + role.id + '}');
                        });
                        // if(angular.isDefined(contributor.entity.rid)) {
                        if (angular.isDefined(contributor.entity.key)) {
                            $scope.metadata.contributors.push({entity: '${' + contributor.entity.key + '}', roles: roles, organization: contributor.entity.organization});
                        } else {
                            $scope.metadata.contributors.push({entity: contributor.entity, roles: roles, organization: contributor.entity.organization});
                        }

                        addContributorModal.hide();
                    }
                };

                addContributorModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-person-modal.html'
                });
            };


            /**
             * Methods on Organizations
             **/

            function prepareModalScopeForOrganization() {
                var modalScope = $rootScope.$new(true);
                modalScope.models = {};

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

            function setOrganization(organization, modalScope) {
                // organization.type = modalScope.type;
                // organization.id = modalScope.id;
                organization.key = modalScope.models.key;
                organization.name = modalScope.models.name;
                organization.fullname = getFullnameOfOrganization(modalScope.models);
                organization.acronym = modalScope.models.acronym;
                organization.city = modalScope.models.city;
                organization.country = modalScope.models.country;
                organization.homepage = modalScope.models.homepage;
                organization.img = modalScope.models.img;
            }

            $scope.createProducer = function () {
                var modalScope = prepareModalScopeForOrganization(),
                    addOrganizationModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.submit = function (addOrganizationForm) {

                    if (angular.isUndefined(modalScope.models.name)) {
                        addOrganizationForm.name.$setValidity('undefined', false);
                    } else {
                        addOrganizationForm.name.$setValidity('undefined', true);
                    }

                    if (!producerExists(modalScope, $scope.metadata.producers)) {
                        addOrganizationForm.name.$setValidity('exists', true);
                    } else {
                        addOrganizationForm.name.$setValidity('exists', false);
                    }

                    if (addOrganizationForm.$valid) {
                        var organization = {};

                        setOrganization(organization, modalScope);

                        if ($scope.metadata.producers === undefined) {
                            $scope.metadata.producers = [];
                            $scope.producers = [];
                        }
                        $scope.metadata.producers.push(organization);
                        $scope.producers.push(organization);

                        addOrganizationModal.hide();
                    }
                };

                addOrganizationModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-organization-modal.html'
                });
            };


            /**
             * Utils
             **/
            function producerExists(producer, producers) {
                if (angular.isDefined(producer.name) && angular.isDefined(producers)) {
                    //TODO with $filter
                    var indexProducer;
                    for (indexProducer = 0; indexProducer < producers.length; indexProducer++) {
                        if (angular.isDefined(producers[indexProducer].id) && angular.isDefined(producer.id)) {
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
                if (angular.isDefined(contributor.fullname) && angular.isDefined(contributors)) {
                    var iContributor;
                    for (iContributor = 0; iContributor < contributors.length; iContributor++) {
                        if (angular.isDefined(contributors[iContributor].entity.id) && angular.isDefined(contributor.id)) {
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

                ReferentialEntityResource.get({type: 'PERSON'}, function(entities) {
                    $scope.allPersons = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);

                        $scope.allPersons.push({
                            key: entry.key,
                            value: content.fullname,
                            id: content.id,
                            fullname: content.fullname,
                            lastname: content.lastname,
                            firstname: content.firstname,
                            midname: content.midname,
                            org: content.organization,
                            type: content.type,
                            label: '<span>' + content.fullname + '</span>'
                        });
                    });

                    if (angular.isDefined($scope.metadata.contributors)) {
                        $scope.contributors = [];
                        angular.forEach($scope.metadata.contributors, function(contributor) {
                            var loadedContributor = null;

                            if (typeof contributor.entity  === 'string') {
                                var contributorFound = $filter('filter')($scope.allPersons, {key:Helper.extractKeyFromReferentialId(contributor.entity)}, true);
                                if (contributorFound.length > 0) {
                                    loadedContributor = {entity: contributorFound[0]};
                                } else {
                                    loadedContributor = {entity: contributor.entity};
                                }
                            } else {
                                loadedContributor = {entity: contributor.entity};
                            }


                            if (contributor.roles && contributor.roles.length > 0) {

                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function (role) {

                                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(role)}, function(roleEntities) {
                                        var content = angular.fromJson(roleEntities.content);
                                        content.label = Helper.getMultilingualValue(content.labels);
                                        loadedContributor.roles.push(content);
                                    });
                                });
                            }

                            if (contributor.organization) {

                                ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function(roleEntities) {
                                    var content = angular.fromJson(roleEntities.content);
                                    loadedContributor.organization = content;
                                });
                            }

                            if (loadedContributor !== null) {
                                $scope.contributors.push(loadedContributor);
                            }
                        });
                    }
                });
            }

            function loadAllOrganizations() {

                ReferentialEntityResource.get({type: 'ORGANIZATION'}, function(entities) {
                    $scope.allOrganizations = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);

                        if(angular.isUndefined(content.compatibilities)) {
                            $scope.allOrganizations.push({
                                key: entry.key,
                                value: content.fullname,
                                fullname: content.fullname,
                                name: content.name,
                                img: content.img,
                                org: content,
                                label: '<span>' + content.fullname + '</span>'
                            });
                        }
                    });

                    if (angular.isDefined($scope.metadata.producers)) {
                        $scope.producers = [];
                        angular.forEach($scope.metadata.producers, function(producer) {

                            if (typeof producer  === 'string') {
                                var producerFound = $filter('filter')($scope.allOrganizations, {key: Helper.extractKeyFromReferentialId(producer)}, true);
                                if (producerFound.length > 0) {
                                    $scope.producers.push(producerFound[0]);
                                } else {
                                    $scope.producers.push(producer);
                                }
                            } else {
                                $scope.producers.push(producer);
                            }
                        });
                    }
                });
            }

            function loadAllRoles() {

                ReferentialEntityResource.get({type: 'ROLE'}, function(entities) {
                    var allRoles = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);
                        var label = Helper.getMultilingualValue(content.labels);

                        allRoles.push({id: entry.key, label: label, labels: content.labels});
                    });
                    $scope.models.allRoles = $filter('orderBy')(allRoles, 'label');
                });
            }

            function clearSearchOrganization() {
                angular.element('#search-producer').val('');
            }

            /**
             * Initialize the scope
             **/

            function init() {
                $scope.models = {};
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

                    organization.key = i.key;

                    if ($scope.producers === undefined || ($scope.producers !== undefined && !producerExists(organization, $scope.producers))) {
                        if ($scope.producers === undefined) {
                            $scope.producers = [];
                            $scope.metadata.producers = [];
                        }
                        $scope.producers.push(organization);
                        $scope.metadata.producers.push('${' + organization.key + '}');
                    } else {
                        console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
                    }

                    clearSearchOrganization();

                    $scope.$apply();
                });
            }
            init();
        }]);
