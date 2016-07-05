    'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddOrganizationCtrl
 * @description
 * # AddOrganizationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddOrganizationCtrl', ['$scope', '$filter', 'Helper', 'WorkspaceMetadataService', 'User', 
    	function ($scope, $filter, Helper, WorkspaceMetadataService, User) {

            var regExp = new RegExp(' +', 'g');

            function normalizeId(id) {
                id = $filter('diacritics')(id);
                $scope.models.id = id ? id.replace(/[^\w\s]/g, '').replace(regExp, '_').toLowerCase() : id;
            }

            $scope.generateId = function () {
                normalizeId($scope.models.name);
            };

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

            $scope.addOrganizationFromScratch = function (addOrganizationForm) {

                if (angular.isUndefined($scope.models.name)) {
                    addOrganizationForm.name.$setValidity('undefined', false);
                } else {
                    addOrganizationForm.name.$setValidity('undefined', true);
                }

                if ($scope.isSponsor) {
	                if (!sponsorExists($scope, $scope.metadata.sponsors)) {
	                    addOrganizationForm.name.$setValidity('exists', true);
	                } else {
	                    addOrganizationForm.name.$setValidity('exists', false);
	                }
                } else {
	                if (!producerExists($scope, $scope.metadata.producers)) {
	                    addOrganizationForm.name.$setValidity('exists', true);
	                } else {
	                    addOrganizationForm.name.$setValidity('exists', false);
	                }
                }

                if (addOrganizationForm.$valid) {
                    delete $scope.models.id;
                    $scope.models.fullname = getFullnameOfOrganization($scope.models);

                    if($scope.isSponsor) {
                        if ($scope.organization) {
                            WorkspaceMetadataService.setOrganization($scope.organization, $scope.models);
                        } else {
                            WorkspaceMetadataService.addSponsor($scope.models);
                        }
                    } else {
                        if ($scope.organization) {
                            WorkspaceMetadataService.setOrganization($scope.organization, $scope.models);
                        } else {
                            WorkspaceMetadataService.addProducer($scope.models);
                        }
                    }

                    WorkspaceMetadataService.metadataChanged = true;
                    Helper.hideModal();
                }
            };

            $scope.setOrganizationFromNewEntity = function (addOrganizationForm) {

                if (angular.isUndefined($scope.models.name)) {
                    addOrganizationForm.name.$setValidity('undefined', false);
                } else {
                    addOrganizationForm.name.$setValidity('undefined', true);
                }

                if (addOrganizationForm.$valid) {
                    $scope.models.fullname = getFullnameOfOrganization($scope.models);
                    if($scope.isSponsor) {
                        WorkspaceMetadataService.replaceSponsor($scope.organization, $scope.models).then(function () {
                            // Notify entity created
                        }, function () {
                            // Notify entity not created
                        });
                    } else {
                        WorkspaceMetadataService.replaceProducer($scope.organization, $scope.models).then(function () {
                            // Notify entity created
                        }, function () {
                            // Notify entity not created
                        });
                    }

                    Helper.hideModal();
                }
            };

            function init() {
                $scope.User = User;
                $scope.disabled = false;

                if ($scope.organization) {
                    $scope.models = angular.copy($scope.organization);
                    $scope.disabled = angular.isDefined($scope.models.id);
                    if (angular.isUndefined($scope.models.id)) {
                        normalizeId($scope.models.name);
                    }
                } else {
                    $scope.models = {};
                }
            }
            init();
    }]);