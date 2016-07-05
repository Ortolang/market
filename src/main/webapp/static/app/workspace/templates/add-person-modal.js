'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddPersonCtrl
 * @description
 * # AddPersonCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddPersonCtrl', ['$scope', '$filter', 'Helper', 'ReferentialEntityResource', '$q', 'WorkspaceMetadataService', 'User', 
    	function ($scope, $filter, Helper, ReferentialEntityResource, $q, WorkspaceMetadataService, User) {

            var regExp = new RegExp(' +', 'g');

            function getFullnameOfPerson(person) {
                var fullname = '';
                fullname += angular.isDefined(person.firstname) ? person.firstname : '';
                fullname += angular.isDefined(person.midname) ? ' ' + person.midname : '';
                fullname += angular.isDefined(person.lastname) ? ' ' + person.lastname : '';
                return fullname;
            }

            function normalizeId(id) {
                id = $filter('diacritics')(id);
                $scope.models.entityContent.id = id ? id.replace(/[^\w\s]/g, '').replace(regExp, '_').toLowerCase() : id;
            }

            $scope.generateId = function (person) {
                $scope.models.entityContent.fullname = getFullnameOfPerson(person);
                normalizeId($scope.models.entityContent.fullname);
            };

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

            function checkForm (addContributorForm) {

                if ($scope.models.entityContent.firstname) {
                    addContributorForm.firstname.$setValidity('exists', true);
                } else {
                    addContributorForm.firstname.$setValidity('exists', false);
                }

                if ($scope.models.rolesEntity && $scope.models.rolesEntity.length > 0) {
                    addContributorForm.roles.$setValidity('role', true);
                } else {
                    addContributorForm.roles.$setValidity('role', false);
                }

                //TODO Check organization is a ref entity
            }

            $scope.addContributorFromScratch = function (addContributorForm) {
            	
                checkForm(addContributorForm);

                if (angular.isUndefined($scope.contributor)) {
                    if (!personExists($scope.models.entityContent, $scope.contributors)) {
                        addContributorForm.fullname.$setValidity('exists', true);
                    } else {
                        addContributorForm.fullname.$setValidity('exists', false);
                    }
                }

                if (addContributorForm.$valid) {
                    if (typeof $scope.models.entity  !== 'string') {
                        delete $scope.models.entityContent.id;
                        $scope.models.entity = angular.copy($scope.models.entityContent);
                    }

                    $scope.models.roles = [];
                    angular.forEach($scope.models.rolesEntity, function (role) {
                        $scope.models.roles.push(Helper.createKeyFromReferentialName(role.id));
                    });

                    if (angular.isUndefined($scope.contributor)) {
                        if ($scope.metadata.contributors === undefined) {
                            $scope.metadata.contributors = [];
                        }
                        $scope.metadata.contributors.push($scope.models);
                    } else {
                        $scope.contributor.entity = angular.copy($scope.models.entity);
                        $scope.contributor.entityContent = angular.copy($scope.models.entityContent);
                        $scope.contributor.roles = angular.copy($scope.models.roles);
                        $scope.contributor.rolesEntity = angular.copy($scope.models.rolesEntity);
                        $scope.contributor.organizationEntity = angular.copy($scope.models.organizationEntity);
                        $scope.contributor.organization = angular.copy($scope.models.organization);
                    }

                    WorkspaceMetadataService.metadataChanged = true;
            		Helper.hideModal();
                }
            };

            function createEntity(name, metadata) {
                var deferred = $q.defer();
                var content = angular.toJson(metadata);
                ReferentialEntityResource.post({}, {name: name, type: 'PERSON', content: content}, function () {
                    deferred.resolve();
                }, function (errors) {
                    deferred.reject(errors);
                });
                return deferred.promise;
            }

            $scope.setContributorFromNewEntity = function (form) {

                checkForm(form);

                if (form.$valid) {
                    ReferentialEntityResource.get({name: $scope.models.entityContent.id}, function() {
                        //TODO notify and ask to choose one of the result or create a new one
                        console.log('Person exists');
                    }, function () {
                        var entity = angular.copy($scope.models.entityContent);
                        entity.schema = 'http://www.ortolang.fr/schema/person/02#';
                        entity.type = 'Person';
                        createEntity(entity.id, entity).then(function () {
                            //TODO notify by toast
                            console.log('person created');
                            $scope.models.entity = Helper.createKeyFromReferentialName(entity.id);

                            $scope.models.roles = [];
                            angular.forEach($scope.models.rolesEntity, function (role) {
                                $scope.models.roles.push(Helper.createKeyFromReferentialName(role.id));
                            });
                            
                            if (angular.isUndefined($scope.contributor)) {
                                if ($scope.metadata.contributors === undefined) {
                                    $scope.metadata.contributors = [];
                                }
                                $scope.metadata.contributors.push($scope.models);
                            } else {
                                $scope.contributor.entity = angular.copy($scope.models.entity);
                                $scope.contributor.entityContent = angular.copy($scope.models.entityContent);
                                $scope.contributor.roles = angular.copy($scope.models.roles);
                                $scope.contributor.rolesEntity = angular.copy($scope.models.rolesEntity);
                                $scope.contributor.organizationEntity = angular.copy($scope.models.organizationEntity);
                                $scope.contributor.organization = angular.copy($scope.models.organization);
                            }

                            WorkspaceMetadataService.metadataChanged = true;
                        }, function (reason) {
                            //TODO notify
                            console.log(reason);
                        });    
                    });

                    Helper.hideModal();
                } else {
                    console.log('form not valid');
                }
            };

            /**
             * Suggest an organization.
             **/
            $scope.suggestOrganization = function (term, sponsor) {
                if(term.length<2 || angular.isObject(term)) {
                    return [];
                }
                if ($scope.models.originOrganizationFullname && $scope.models.originOrganizationFullname === $scope.models.organizationFullname) {
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

            /**
             * Sets organization listener.
             **/
            $scope.$on('taorg.select', function (v, i) {
                $scope.models.organization = Helper.createKeyFromReferentialId(i.key);
                $scope.models.entityContent.organization = Helper.createKeyFromReferentialId(i.key);
                $scope.models.organizationEntity = i.org;

                $scope.organizationFullname = i.org.fullname;
                $scope.originOrganizationFullname = i.org.fullname;
                $scope.$apply();
            });

            function init() {
                $scope.searchPerson = '';
                $scope.User = User;
                $scope.identifier = {autoGenerated: true};

                if (angular.isUndefined($scope.contributor)) {
                    $scope.models = {entity: {}, roles: []};
                    $scope.organizationFullname = '';
                    $scope.disabled = false;
                } else {
                    $scope.models = {};
                    $scope.models.entity = angular.copy($scope.contributor.entity);
                    $scope.models.entityContent = angular.copy($scope.contributor.entityContent);
                    $scope.models.roles = angular.copy($scope.contributor.roles);
                    $scope.models.rolesEntity = angular.copy($scope.contributor.rolesEntity);
                    $scope.models.organization = angular.copy($scope.contributor.organization);
                    $scope.models.organizationEntity = angular.copy($scope.contributor.organizationEntity);
                    if ($scope.contributor.organizationEntity) {
                        $scope.organizationFullname = $scope.contributor.organizationEntity.fullname;
                    }
                    $scope.disabled = angular.isDefined($scope.models.entityContent.id);
                    if (angular.isUndefined($scope.models.entityContent.id)) {
                        normalizeId($scope.models.entityContent.fullname);
                    }
                }
            }
            init();

    }]);