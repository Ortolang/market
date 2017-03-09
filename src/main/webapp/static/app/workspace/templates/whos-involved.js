'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WhosInvolvedCtrl
 * @description
 * # WhosInvolvedCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WhosInvolvedCtrl', ['$scope', '$modal', '$filter', 'SearchResource', 'Helper', 'WorkspaceMetadataService', '$q',
        function ($scope, $modal, $filter, SearchResource, Helper, WorkspaceMetadataService, $q) {

            /**
             * Methods for cleaning DOM element
             **/

            function clearSearchProducer() {
                angular.element('#search-producer').val('');
            }

            function clearSearchSponsor() {
                angular.element('#search-sponsors').val('');
            }

            $scope.showAddPersonModal = function (person) {
                if (!WorkspaceMetadataService.canEdit) {
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
                SearchResource.entities({type: 'ORGANIZATION', 'fullname*': term}, function (results) {
                    var suggestedOrganizations = [];
                    angular.forEach(results, function (entity) {
                        if (angular.isUndefined(sponsor)) {
                            if (angular.isUndefined(entity.compatibilities)) {
                                suggestedOrganizations.push(entity);
                            }
                        } else {
                            suggestedOrganizations.push(entity);
                        }
                    });
                    deferred.resolve(suggestedOrganizations);
                }, function () {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.showAddOrganizationModal = function (organization) {
                if (!WorkspaceMetadataService.canEdit) {
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
                if (!WorkspaceMetadataService.canEdit) {
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

            $scope.moveProducer = function ($index) {
                $scope.metadata.producersEntity.splice($index, 1);
                WorkspaceMetadataService.updateProducersOrder();
            };

            $scope.moveSponsor = function ($index) {
                $scope.metadata.sponsorsEntity.splice($index, 1);
                WorkspaceMetadataService.updateSponsorsOrder();
            };

            /**
             * Adds sponsor listener.
             **/
            $scope.$on('tasponsor.select', function (v, i) {
                WorkspaceMetadataService.addSponsor(i);
                clearSearchSponsor();
                $scope.$apply();
            });

            /**
             * Methods for loadings entities
             **/

            function loadOrganization(organization) {
                SearchResource.getEntity({id: Helper.createIdFromReferentialName(organization.id), type: 'ORGANIZATION'}, function (entity) {
                    WorkspaceMetadataService.setOrganization(organization, entity);
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
            }

            init();
        }]);
