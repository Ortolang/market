'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddOrganizationCtrl
 * @description
 * # AddOrganizationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddOrganizationCtrl', ['$scope', '$filter', 'Helper', 'ReferentialEntityResource', '$q', 
    	function ($scope, $filter, Helper) {

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

            $scope.submit = function (addOrganizationForm) {

                if (angular.isUndefined($scope.models.name)) {
                    addOrganizationForm.name.$setValidity('undefined', false);
                } else {
                    addOrganizationForm.name.$setValidity('undefined', true);
                }

                if (angular.isDefined($scope.sponsor)) {
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
                    var organization = {};

                    setOrganization(organization, $scope);

                    if(angular.isDefined($scope.sponsor)) {
                        if ($scope.metadata.sponsors === undefined) {
                            $scope.metadata.sponsors = [];
                        }
                        $scope.metadata.sponsors.push(organization);
                        $scope.sponsors.push(organization);
                    } else {
                        if ($scope.metadata.producers === undefined) {
                            $scope.metadata.producers = [];
                        }
                        $scope.metadata.producers.push(organization);
                        $scope.producers.push(organization);
                    }

                    Helper.hideModal();
                }
            };
    }]);