'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$scope', '$modal', '$filter', 'ReferentialResource', 'Helper', 'WorkspaceMetadataService', '$q',
        function ($scope, $modal, $filter, ReferentialResource, Helper, WorkspaceMetadataService, $q) {

            /**
             * Utils
             * TODO : move this to WorkspaceMetadataService or Helper
             **/

            function personExists(contributor, contributors) {
                if (angular.isDefined(contributor.fullname) && angular.isDefined(contributors)) {
                    var iContributor;
                    for (iContributor = 0; iContributor < contributors.length; iContributor++) {
                        if (angular.isDefined(contributors[iContributor].entity.key) && angular.isDefined(contributor.key)) {
                            if (contributors[iContributor].entity.key === contributor.key) {
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

            /**
             * Methods for cleaning DOM element
             **/

            function clearSearchProducer() {
                angular.element('#search-producer').val('');
            }

            function clearSearchSponsor() {
                angular.element('#search-sponsors').val('');
            }

            $scope.clearSearchContributor = function () {
                angular.element('#search-contributor').val('');
            };

            /**
             * Methods on contributor
             **/

            $scope.deleteContributor = function (contributor) {
                var index = $scope.metadata.contributors.indexOf(contributor);
                if (index > -1) {
                    $scope.metadata.contributors.splice(index, 1);
                }
            };

            $scope.suggestPerson = function (term) {
                if (term.length < 2 || angular.isObject(term)) {
                    return [];
                }
                var deferred = $q.defer();
                ReferentialResource.get({type: 'PERSON', lang: 'FR', term: term}, function (results) {
                    var suggestedPersons = [];
                    angular.forEach(results.entries, function (refentity) {
                        //TODO convert to JSON in ReferentialResource
                        suggestedPersons.push(angular.fromJson(refentity.content));
                    });
                    deferred.resolve(suggestedPersons);
                }, function () {
                    deferred.reject([]);
                });

                return deferred.promise;
            };

            /**
             * Adds contributor listener.
             */
            $scope.$on('tacontributor.select', function (v, i) {
                $scope.person = {};
                $scope.person.id = i.id;
                $scope.person.lastname = i.lastname;
                $scope.person.firstname = i.firstname;
                if (i.midname) {
                    $scope.person.midname = i.midname;
                }
                if (angular.isDefined(i.organization)) {
                    ReferentialResource.get({name: Helper.extractNameFromReferentialId(i.organization)}, function (entity) {
                        $scope.person.organizationEntity = entity.content;
                    });
                    $scope.person.organization = i.organization;
                }
                $scope.person.fullname = i.fullname;

                $scope.$apply();
            });

            $scope.addContributor = function () {
                if ($scope.selectedRoles.length === 0) {
                    console.log('Select a role');
                    return;
                }
                if (personExists($scope.person, $scope.contributors)) {
                    console.log('Person already exists');
                    return;
                }

                var contributor = {};
                contributor.roles = [];
                angular.forEach($scope.selectedRoles, function (role) {
                    contributor.roles.push(Helper.createKeyFromReferentialName(role.id));
                });
                contributor.rolesEntity = $scope.selectedRoles;

                contributor.entity = Helper.createKeyFromReferentialName($scope.person.id);
                contributor.entityContent = $scope.person;

                if (contributor.entityContent.organization) {
                    contributor.organization = contributor.entityContent.organization;
                    contributor.organizationEntity = contributor.entityContent.organizationEntity;
                }
                if ($scope.metadata.contributors === undefined) {
                    $scope.metadata.contributors = [];
                }
                $scope.metadata.contributors.push(contributor);
                $scope.searchContributor = '';
                $scope.selectedRoles = [];
            };

            $scope.showAddPersonModal = function (person) {
                if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true);
                modalScope.allRoles = $scope.allRoles;
                modalScope.metadata = $scope.metadata;
                if (person) {
                    modalScope.contributor = person;
                }

                $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-person-modal.html',
                    show: true
                });
            };

            function loadContributor(contributor) {
                if (typeof contributor.entity === 'string') {
                    ReferentialResource.get({name: Helper.extractNameFromReferentialId(contributor.entity)}, function (entity) {
                        contributor.entityContent = entity.content;
                    });
                } else {
                    contributor.entityContent = angular.copy(contributor.entity);
                }

                if (contributor.roles && contributor.roles.length > 0) {
                    contributor.rolesEntity = [];
                    angular.forEach(contributor.roles, function (role) {
                        ReferentialResource.get({name: Helper.extractNameFromReferentialId(role)}, function (roleEntities) {
                            var content = roleEntities.content;
                            content.label = Helper.getMultilingualValue(content.labels);
                            contributor.rolesEntity.push(content);
                        });
                    });
                }

                if (contributor.organization) {
                    ReferentialResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function (entity) {
                        contributor.organizationEntity = entity.content;
                    });
                }
            }

            function loadContributors() {
                if (angular.isDefined($scope.metadata.contributors)) {
                    angular.forEach($scope.metadata.contributors, function (contributor) {
                        loadContributor(contributor);
                    });
                }
            }

            /**
             * Methods on organizations (producers and sponsors)
             **/

            $scope.deleteProducer = function (producer) {
                var index = $scope.metadata.producersEntity.indexOf(producer);
                if (index > -1) {
                    $scope.metadata.producers.splice(index, 1);
                    $scope.metadata.producersEntity.splice(index, 1);
                }
            };

            $scope.deleteSponsor = function (sponsor) {
                var index = $scope.metadata.sponsorsEntity.indexOf(sponsor);
                if (index > -1) {
                    $scope.metadata.sponsors.splice(index, 1);
                    $scope.metadata.sponsorsEntity.splice(index, 1);
                }
            };

            $scope.suggestOrganization = function (term, sponsor) {
                if (term.length < 2 || angular.isObject(term)) {
                    return [];
                }
                var deferred = $q.defer();
                ReferentialResource.get({type: 'ORGANIZATION', lang: 'FR', term: term}, function (results) {
                    var suggestedOrganizations = [];
                    angular.forEach(results.entries, function (entity) {
                        var content = entity.content;
                        if (angular.isUndefined(sponsor)) {
                            if (angular.isUndefined(content.compatibilities)) {
                                suggestedOrganizations.push(content);
                            }
                        } else {
                            suggestedOrganizations.push(content);
                        }
                    });
                    deferred.resolve(suggestedOrganizations);
                }, function () {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.showAddOrganizationModal = function (organization) {
                if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true);
                modalScope.metadata = $scope.metadata;
                modalScope.sponsors = $scope.sponsors;
                if (organization) {
                    modalScope.organization = organization;
                }
                $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-organization-modal.html'
                });
            };

            $scope.showAddSponsorModal = function (organization) {
                if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true);
                modalScope.isSponsor = true;
                modalScope.metadata = $scope.metadata;
                modalScope.sponsors = $scope.sponsors;
                if (organization) {
                    modalScope.organization = organization;
                }
                $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-organization-modal.html'
                });
            };

            /**
             * Adds sponsor listener.
             **/
            $scope.$on('taorg.select', function (v, i) {
                WorkspaceMetadataService.addProducer(i);

                clearSearchProducer();

                $scope.$apply();
            });

            /**
             * Adds sponsor listener.
             **/
            $scope.$on('tasponsor.select', function (v, i) {
                // var organization = {};
                // organization.type = 'Organization';
                // organization.id = i.org.id;
                // organization.name = i.org.name;
                // organization.acronym = i.org.acronym;
                // organization.city = i.org.city;
                // organization.country = i.org.country;
                // organization.homepage = i.org.homepage;
                // organization.img = i.org.img;
                // organization.fullname = i.org.fullname;
                // organization.compatibilities = ['Sponsor'];

                // organization.key = i.key;

                // if ($scope.sponsors === undefined || ($scope.sponsors !== undefined && !sponsorExists(organization, $scope.sponsors))) {
                //     if ($scope.metadata.sponsors === undefined) {
                //         $scope.metadata.sponsors = [];
                //     }
                //     $scope.sponsors.push(organization);
                //     $scope.metadata.sponsors.push(Helper.createKeyFromReferentialId(organization.key));
                // } else {
                //     console.log('Le sponsor est déjà présent dans la liste des sponsors de la ressource.');
                // }
                WorkspaceMetadataService.addSponsor(i);

                clearSearchSponsor();

                $scope.$apply();
            });

            /**
             * Methods for loadings entities
             **/

            function loadOrganization(organization) {
                ReferentialResource.get({name: organization.id}, function (entity) {
                    WorkspaceMetadataService.setOrganization(organization, entity.content);
                });
            }

            function loadOrganizations() {
                if (angular.isDefined($scope.metadata.producers) && $scope.metadata.producers.length > 0) {
                    $scope.metadata.producersEntity = [];
                    angular.forEach($scope.metadata.producers, function (producer) {
                        if (typeof producer === 'string') {
                            var producerEntity = {id: Helper.extractNameFromReferentialId(producer)};
                            $scope.metadata.producersEntity.push(producerEntity);
                            loadOrganization(producerEntity);
                        } else {
                            $scope.metadata.producersEntity.push(producer);
                        }
                    });
                }
                if (angular.isDefined($scope.metadata.sponsors) && $scope.metadata.sponsors.length > 0) {
                    $scope.metadata.sponsorsEntity = [];
                    angular.forEach($scope.metadata.sponsors, function (sponsor) {
                        if (typeof sponsor === 'string') {
                            var sponsorEntity = {id: Helper.extractNameFromReferentialId(sponsor)};
                            $scope.metadata.sponsorsEntity.push(sponsorEntity);
                            loadOrganization(sponsorEntity);
                        } else {
                            $scope.metadata.sponsorsEntity.push(sponsor);
                        }
                    });
                }
            }

            function loadAllRoles() {
                ReferentialResource.get({type: 'ROLE'}, function (entities) {
                    var allRoles = [];
                    angular.forEach(entities.entries, function (entry) {
                        var content = entry.content;
                        content.label = Helper.getMultilingualValue(content.labels);

                        allRoles.push(content);
                    });
                    $scope.allRoles = $filter('orderBy')(allRoles, 'label');
                });
            }

            /**
             * Initialize the scope
             **/
            function init() {
                $scope.WorkspaceMetadataService = WorkspaceMetadataService;

                $scope.allRoles = [];
                $scope.searchOrganization = '';
                $scope.searchSponsor = '';
                $scope.searchContributor = '';
                $scope.selectedRoles = [];

                loadOrganizations();
                loadContributors();

                loadAllRoles();
            }

            init();
        }]);
