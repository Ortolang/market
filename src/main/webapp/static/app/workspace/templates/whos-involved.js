'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$rootScope', '$scope', '$modal', '$filter', 'Settings', 'ReferentialEntityResource', 'Helper', 'Workspace',
        function ($rootScope, $scope, $modal, $filter, Settings, ReferentialEntityResource, Helper, Workspace) {

            $scope.deleteContributor = function (contributor) {
                var index = $scope.contributors.indexOf(contributor);
                if (index > -1) {
                    $scope.metadata.contributors.splice(index, 1);
                    $scope.contributors.splice(index, 1);
                }
            };

            $scope.addPerson = function () {
                if (Workspace.active.workspace.readOnly) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                    addContributorModal;
                modalScope.allRoles = $scope.models.allRoles;
                // modalScope.allPersons = $scope.allPersons;
                modalScope.allOrganizations = $scope.allOrganizations;
                modalScope.metadata = $scope.metadata;
                modalScope.contributors = $scope.contributors;

                addContributorModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-person-modal.html',
                    show: true
                });
            };

            /**
             * Methods on Organizations
             **/

            $scope.deleteProducer = function (producer) {
                var index = $scope.producers.indexOf(producer);
                if (index > -1) {
                    $scope.metadata.producers.splice(index, 1);
                    $scope.producers.splice(index, 1);
                }
            };

            $scope.deleteSponsor = function (sponsor) {
                var index = $scope.sponsors.indexOf(sponsor);
                if (index > -1) {
                    $scope.metadata.sponsors.splice(index, 1);
                    $scope.sponsors.splice(index, 1);
                }
            };

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

            $scope.createOrganization = function (sponsor) {
                if (Workspace.active.workspace.readOnly) {
                    return;
                }
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

                        if(sponsor) {
                            if ($scope.metadata.sponsors === undefined) {
                                $scope.metadata.sponsors = [];
                                $scope.sponsors = [];
                            }
                            $scope.metadata.sponsors.push(organization);
                            $scope.sponsors.push(organization);
                        } else {
                            if ($scope.metadata.producers === undefined) {
                                $scope.metadata.producers = [];
                                $scope.producers = [];
                            }
                            $scope.metadata.producers.push(organization);
                            $scope.producers.push(organization);
                        }

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

            function sponsorExists(sponsor, sponsors) {
                if (angular.isDefined(sponsor.name) && angular.isDefined(sponsors)) {
                    //TODO with $filter
                    var indexSponsor;
                    for (indexSponsor = 0; indexSponsor < sponsors.length; indexSponsor++) {
                        if (angular.isDefined(sponsors[indexSponsor].id) && angular.isDefined(sponsor.id)) {
                            if (sponsors[indexSponsor].id === sponsor.id) {
                                return true;
                            }
                        } else {
                            if (sponsors[indexSponsor].name === sponsor.name) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function loadContributor(contributor) {
                var loadedContributor = {};
                if (typeof contributor.entity  === 'string') {
                    // var contributorFound = $filter('filter')($scope.allPersons, {key:Helper.extractKeyFromReferentialId(contributor.entity)}, true);
                    // if (contributorFound.length > 0) {
                        // loadedContributor = {entity: contributorFound[0]};
                        ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.entity)}, function(entity) {
                            var content = angular.fromJson(entity.content);
                            loadedContributor.entity = {
                                key: entity.key,
                                value: content.fullname,
                                id: content.id,
                                fullname: content.fullname,
                                lastname: content.lastname,
                                firstname: content.firstname,
                                midname: content.midname,
                                org: content.organization,
                                type: content.type,
                                label: '<span>' + content.fullname + '</span>'
                            };
                        });
                    // } else {
                    //     loadedContributor = {entity: contributor.entity};
                    // }
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

                // if (loadedContributor !== null) {
                    $scope.contributors.push(loadedContributor);
                // }
            }

            function loadAllContributors () {
                if (angular.isDefined($scope.metadata.contributors)) {
                    $scope.contributors = [];
                    angular.forEach($scope.metadata.contributors, function(contributor) {
                        loadContributor(contributor);
                    });
                }
            }

            function loadAllOrganizations() {
                ReferentialEntityResource.get({type: 'ORGANIZATION'}, function(entities) {
                    $scope.allOrganizations = [];
                    $scope.allSponsors = [];
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
                        $scope.allSponsors.push({
                            key: entry.key,
                            value: content.fullname,
                            fullname: content.fullname,
                            name: content.name,
                            img: content.img,
                            org: content,
                            label: '<span>' + content.fullname + '</span>'
                        });
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
                    if (angular.isDefined($scope.metadata.sponsors)) {
                        $scope.sponsors = [];
                        angular.forEach($scope.metadata.sponsors, function(sponsor) {

                            if (typeof sponsor  === 'string') {
                                var sponsorFound = $filter('filter')($scope.allSponsors, {key: Helper.extractKeyFromReferentialId(sponsor)}, true);
                                if (sponsorFound.length > 0) {
                                    $scope.sponsors.push(sponsorFound[0]);
                                } else {
                                    $scope.sponsors.push(sponsor);
                                }
                            } else {
                                $scope.sponsors.push(sponsor);
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

            function clearSearchProducer() {
                angular.element('#search-producer').val('');
            }

            function clearSearchSponsor() {
                angular.element('#search-sponsors').val('');
            }

            /**
             * Initialize the scope
             **/

            function init() {
                $scope.models = {};
                // loadAllPersons();
                loadAllContributors();
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

                    clearSearchProducer();

                    $scope.$apply();
                });
                $scope.searchSponsor = '';
                $scope.$on('tasponsor.select', function (v, i) {
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
                    organization.compatibilities = ['Sponsor'];

                    organization.key = i.key;

                    if ($scope.sponsors === undefined || ($scope.sponsors !== undefined && !sponsorExists(organization, $scope.sponsors))) {
                        if ($scope.sponsors === undefined) {
                            $scope.sponsors = [];
                            $scope.metadata.sponsors = [];
                        }
                        $scope.sponsors.push(organization);
                        $scope.metadata.sponsors.push('${' + organization.key + '}');
                    } else {
                        console.log('Le sponsor est déjà présent dans la liste des sponsors de la ressource.');
                    }

                    clearSearchSponsor();

                    $scope.$apply();
                });
            }
            init();
        }]);
