'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$rootScope', '$scope', '$modal', '$filter', 'Settings', 'ReferentialEntityResource', 'Helper', 'Workspace', '$q',
        function ($rootScope, $scope, $modal, $filter, Settings, ReferentialEntityResource, Helper, Workspace, $q) {

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

            $scope.deleteContributor = function (contributor) {
                var index = $scope.contributors.indexOf(contributor);
                if (index > -1) {
                    $scope.metadata.contributors.splice(index, 1);
                    $scope.contributors.splice(index, 1);
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
                        var content = angular.fromJson(refentity.content);
                        
                        suggestedPersons.push({
                            key: refentity.key,
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
                    deferred.resolve(suggestedPersons);
                }, function () {
                    deferred.reject([]);
                });

                return deferred.promise;
            };

            $scope.addContributor = function () {
                var contributor = {};

                if ($scope.models.roleTag.length === 0) {
                    alert('Select a role');
                    return;
                }
                var roles = [];
                angular.forEach($scope.selectedRole, function (role) {
                    roles.push(Helper.createKeyFromReferentialId(role.id));
                });
                contributor.roles = roles;

                if (personExists($scope.person, $scope.contributors)) {
                    alert('Person already exists');
                    return;
                }
                contributor.entity = $scope.person;
                //TODO copy organization
            };

            $scope.createPerson = function () {
                if (Workspace.active.workspace.readOnly) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                    addContributorModal;
                modalScope.allRoles = $scope.allRoles;
                modalScope.metadata = $scope.metadata;
                modalScope.contributors = $scope.contributors;

                addContributorModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-person-modal.html',
                    show: true
                });
            };

            $scope.editPerson = function (person) {
                if (Workspace.active.workspace.readOnly) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                    addContributorModal;
                modalScope.allRoles = $scope.allRoles;
                modalScope.metadata = $scope.metadata;
                modalScope.contributors = $scope.contributors;
                modalScope.contributor = person;
                
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

            $scope.createOrganization = function (sponsor) {
                if (Workspace.active.workspace.readOnly) {
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

            function loadContributor(contributor) {
                var loadedContributor = {};
                if (typeof contributor.entity  === 'string') {
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
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function(orgEntities) {
                        var content = angular.fromJson(orgEntities.content);
                        loadedContributor.organizationEntity = content;
                    });
                }

                $scope.contributors.push(loadedContributor);
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
                        var label = Helper.getMultilingualValue(content.labels);

                        allRoles.push({id: entry.key, label: label, labels: content.labels});
                    });
                    $scope.allRoles = $filter('orderBy')(allRoles, 'label');
                });
            }

            function clearSearchProducer() {
                angular.element('#search-producer').val('');
            }

            function clearSearchSponsor() {
                angular.element('#search-sponsors').val('');
            }

            $scope.clearSearchContributor = function () {
                angular.element('#search-contributor').val('');
            };

            $scope.$on('tacontributor.select', function (v, i) {
                $scope.person = {};
                $scope.person.key = i.key;
                $scope.person.lastname = i.lastname;
                $scope.person.firstname = i.firstname;
                $scope.person.midname = i.midname;
                if (angular.isDefined(i.org)) {
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(i.org)}, function(entity) {
                        var content = angular.fromJson(entity.content);
                        $scope.person.organizationEntity = content;
                        $scope.person.organizationFullname = content.fullname;
                        $scope.person.originOrganizationFullname = content.fullname;
                    });
                    $scope.person.organization = i.org;
                } else {
                    $scope.person.organizationFullname = '';
                    $scope.person.organization = {};
                }
                $scope.person.fullname = i.fullname;

                $scope.$apply();
            });

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
             * Initialize the scope
             **/
            function init() {
                $scope.producers = [];
                $scope.sponsors = [];
                $scope.contributors = [];

                $scope.allRoles = [];
                $scope.searchOrganization = '';                
                $scope.searchSponsor = '';
                $scope.searchContributor = '';
                $scope.selectedRole = [];

                loadOrganizations();
                loadContributors();

                loadAllRoles();
            }
            init();
        }]);
