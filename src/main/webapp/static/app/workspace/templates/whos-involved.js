'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$rootScope', '$scope', '$modal', '$filter', 'Settings', 'ReferentialEntityResource', 'Helper', 'Workspace', 'WorkspaceMetadataService', '$q',
        function ($rootScope, $scope, $modal, $filter, Settings, ReferentialEntityResource, Helper, Workspace, WorkspaceMetadataService, $q) {

            /**
             * Utils
             * TODO : move this to WorkspaceMetadataService or Helper
             **/
            function producerExists(producer, producers) {
                if (angular.isDefined(producer.name) && angular.isDefined(producers)) {
                    //TODO with $filter (slower?)
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
                    //TODO with $filter (slower?)
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
                if(term.length<2 || angular.isObject(term)) {
                    return [];
                }
                var deferred = $q.defer();
                ReferentialEntityResource.get({type: 'PERSON', lang:'FR', term: term}, function(results) {
                    var suggestedPersons = [];
                    angular.forEach(results.entries, function(refentity) {
                        //TODO convert to JSON in ReferentialEntityResource
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
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(i.organization)}, function(entity) {
                        var content = angular.fromJson(entity.content);
                        $scope.person.organizationEntity = content;
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
            };

            $scope.showAddPersonModal = function (person) {
                if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                    addContributorModal;
                modalScope.allRoles = $scope.allRoles;
                modalScope.metadata = $scope.metadata;
                if (person) {
                    modalScope.contributor = person;
                }

                addContributorModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-person-modal.html',
                    show: true
                });
            };

            /**
             * Methods on organizations (producers and sponsors)
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

            $scope.suggestOrganization = function (term, sponsor) {
                if(term.length<2 || angular.isObject(term)) {
                    return [];
                }
                var deferred = $q.defer();
                ReferentialEntityResource.get({type: 'ORGANIZATION', lang:'FR', term: term}, function(results) {
                    var suggestedOrganizations = [];
                    angular.forEach(results.entries, function(refentity) {
                        var content = angular.fromJson(refentity.content);

                        if (angular.isUndefined(sponsor)) {
                            if(angular.isUndefined(content.compatibilities)) {
                                suggestedOrganizations.push({
                                    key: refentity.key,
                                    value: content.fullname,
                                    fullname: content.fullname,
                                    name: content.name,
                                    img: content.img,
                                    org: content,
                                    label: '<span>' + content.fullname + '</span>'
                                });
                            }
                        } else {
                            suggestedOrganizations.push({
                                key: refentity.key,
                                value: content.fullname,
                                fullname: content.fullname,
                                name: content.name,
                                img: content.img,
                                org: content,
                                label: '<span>' + content.fullname + '</span>'
                            });
                        }
                    });
                    deferred.resolve(suggestedOrganizations);
                }, function () {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.showAddOrganizationModal = function (sponsor) {
                if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                    addOrganizationModal;
                modalScope.sponsor = sponsor;
                modalScope.metadata = $scope.metadata;
                modalScope.sponsors = $scope.sponsors;
                modalScope.producers = $scope.producers;

                addOrganizationModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-organization-modal.html'
                });
            };

            /**
             * Adds sponsor listener.
             **/
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

                if (!producerExists(organization, $scope.producers)) {
                    if ($scope.metadata.producers === undefined) {
                        $scope.metadata.producers = [];
                    }
                    $scope.producers.push(organization);
                    $scope.metadata.producers.push(Helper.createKeyFromReferentialId(organization.key));
                } else {
                    console.log('Le laboratoire est déjà présent dans la liste des producteurs de la ressource.');
                }

                clearSearchProducer();

                $scope.$apply();
            });

            /**
             * Adds sponsor listener.
             **/
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
                    if ($scope.metadata.sponsors === undefined) {
                        $scope.metadata.sponsors = [];
                    }
                    $scope.sponsors.push(organization);
                    $scope.metadata.sponsors.push(Helper.createKeyFromReferentialId(organization.key));
                } else {
                    console.log('Le sponsor est déjà présent dans la liste des sponsors de la ressource.');
                }

                clearSearchSponsor();

                $scope.$apply();
            });

            /**
             * Methods for loadings entities
             **/

            function loadContributor(contributor) {
                if (typeof contributor.entity  === 'string') {
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.entity)}, function(entity) {
                        var content = angular.fromJson(entity.content);
                        contributor.entityContent = content;
                    });
                } else {
                    contributor.entityContent = angular.copy(contributor.entity);
                }

                if (contributor.roles && contributor.roles.length > 0) {
                    contributor.rolesEntity = [];
                    angular.forEach(contributor.roles, function (role) {
                        ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(role)}, function(roleEntities) {
                            var content = angular.fromJson(roleEntities.content);
                            content.label = Helper.getMultilingualValue(content.labels);
                            contributor.rolesEntity.push(content);
                        });
                    });
                }

                if (contributor.organization) {
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function(orgEntities) {
                        var content = angular.fromJson(orgEntities.content);
                        contributor.organizationEntity = content;
                    });
                }
            }

            function loadContributors () {
                if (angular.isDefined($scope.metadata.contributors)) {
                    angular.forEach($scope.metadata.contributors, function(contributor) {
                        loadContributor(contributor);
                    });
                }
            }

            function loadOrganization (organizationId, array) {
                ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(organizationId)}, function(orgEntities) {
                    var content = angular.fromJson(orgEntities.content);
                    array.push({
                        key: orgEntities.key,
                        value: content.fullname,
                        fullname: content.fullname,
                        name: content.name,
                        img: content.img,
                        org: content,
                        label: '<span>' + content.fullname + '</span>'
                    });
                });
            }

            function loadOrganizations () {
                if (angular.isDefined($scope.metadata.producers)) {
                    $scope.producers = [];
                    angular.forEach($scope.metadata.producers, function(producer) {

                        if (typeof producer  === 'string') {
                            loadOrganization(producer, $scope.producers);
                        } else {
                            $scope.producers.push(producer);
                        }
                    });
                }
                if (angular.isDefined($scope.metadata.sponsors)) {
                    $scope.sponsors = [];
                    angular.forEach($scope.metadata.sponsors, function(sponsor) {

                        if (typeof sponsor  === 'string') {
                            loadOrganization(sponsor, $scope.sponsors);
                        } else {
                            $scope.sponsors.push(sponsor);
                        }
                    });
                }
            }

            function loadAllRoles () {
                ReferentialEntityResource.get({type: 'ROLE'}, function(entities) {
                    var allRoles = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);
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
                $scope.producers = [];
                $scope.sponsors = [];

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
