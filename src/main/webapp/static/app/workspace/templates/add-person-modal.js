'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddPersonCtrl
 * @description
 * # AddPersonCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddPersonCtrl', ['$scope', '$filter', 'Helper', 'ReferentialEntityResource', '$q', 
    	function ($scope, $filter, Helper, ReferentialEntityResource, $q) {

            function getFullnameOfPerson(person) {
                var fullname = person.firstname;
                fullname += angular.isDefined(person.midname) ? ' ' + person.midname : '';
                fullname += ' ' + person.lastname;
                return fullname;
            }

            function setPerson(contributor, modalScope) {
                contributor.entity.lastname = modalScope.models.lastname;
                // contributor.entity.rid = modalScope.models.rid;
                contributor.entity.key = modalScope.models.key;
                contributor.entity.firstname = modalScope.models.firstname;
                contributor.entity.midname = modalScope.models.midname;

                // if (angular.isDefined(modalScope.organization) && modalScope.organization.originOrganizationFullname === modalScope.models.organizationFullname) {
                    // contributor.entity.organization = modalScope.organization;
                    // contributor.entity.organization = '${' + modalScope.organization.key + '}';
                    contributor.entity.organization = modalScope.organization;
                    contributor.organizationEntity = modalScope.organizationEntity;
                // }

                contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
            }

            function setRoles(contributor, myScope) {
                contributor.roles = [];
                angular.forEach(myScope.models.roleTag, function (tag) {
                    contributor.roles.push(tag);
                });
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

            function postForm(name, metadata) {
                var deferred = $q.defer();
                var content = angular.toJson(metadata);
                var fd = new FormData();

                fd.append('type', 'PERSON');
                fd.append('content', content);
                // var blob = new Blob([content], { type: 'text/json'});
                // fd.append('stream', blob);

                ReferentialEntityResource.post({name: name}, {type: 'PERSON', content: content}, function () {
                    deferred.resolve();
                }, function (errors) {
                    deferred.reject(errors);
                });
                return deferred.promise;
            }

            $scope.submit = function (addContributorForm) {
            	
                if ($scope.models.firstname) { //TODO not set
                    addContributorForm.firstname.$setValidity('exists', true);
                } else {
                    addContributorForm.firstname.$setValidity('exists', false);
                }

                if (!personExists($scope.models, $scope.contributors)) {
                    addContributorForm.fullname.$setValidity('exists', true);
                } else {
                    addContributorForm.fullname.$setValidity('exists', false);
                }
                //TODO looking for firstname and fullname at person referential
                if ($scope.models.roleTag.length > 0) {
                    addContributorForm.roleTag.$setValidity('role', true);
                } else {
                    addContributorForm.roleTag.$setValidity('role', false);
                }

                //TODO Check organization is a ref entity

                if (addContributorForm.$valid) {
                    var contributor = {entity: {}, roles: []};

                    setPerson(contributor, $scope);

                    setRoles(contributor, $scope);

                    if ($scope.metadata.contributors === undefined) {
                        $scope.metadata.contributors = [];
                    }


                    var roles = [];
                    angular.forEach(contributor.roles, function (role) {
                        roles.push(Helper.createKeyFromReferentialId(role.id));
                    });
                    
                    if (angular.isUndefined(contributor.entity.key)) {
                        // $scope.metadata.contributors.push({entity: contributor.entity, roles: roles, organization: contributor.entity.organization});
                        //TODO checks if not exists (SearchResource)
                        var name = contributor.entity.fullname.toLowerCase().replace(' ', '_').replace('\'', '-');
                        ReferentialEntityResource.get({name: name}, function() {
                            //TODO notiry and ask to choose one of the result or create a new one
                            console.log('Person exists');
                        }, function () {
                            delete contributor.entity.rid;
                            delete contributor.entity.key;
                            contributor.entity.schema = 'http://www.ortolang.fr/schema/person/02#';
                            contributor.entity.type = 'Person';
                            contributor.entity.id = name;
                            //TODO Create a new referential
                            postForm(name, contributor.entity).then(function () {
                                console.log('person created');
                                $scope.contributors.push(contributor);
                                $scope.metadata.contributors.push({entity: Helper.createKeyFromReferentialName(name), roles: roles, organization: contributor.entity.organization});
                                console.log('person added to contributors');
                            }, function (reason) {
                                //TODO notify
                                console.log(reason);
                            });    
                        });
                    } else {
                        $scope.contributors.push(contributor);
                        $scope.metadata.contributors.push({entity: Helper.createKeyFromReferentialId(contributor.entity.key), roles: roles, organization: contributor.entity.organization});
                    }

            		Helper.hideModal();
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

            $scope.$on('ta-search-person.select', function (v, i) {
                $scope.models.rid = i.rid;
                $scope.models.key = i.key;
                $scope.models.lastname = i.lastname;
                $scope.models.firstname = i.firstname;
                $scope.models.midname = i.midname;
                if (angular.isDefined(i.org)) {
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(i.org)}, function(entity) {
                        var content = angular.fromJson(entity.content);
                        $scope.organizationEntity = content;
                        $scope.models.organizationFullname = content.fullname;
                        $scope.models.originOrganizationFullname = content.fullname;
                    });
                    $scope.organization = i.org;
                } else {
                    $scope.models.organizationFullname = '';
                    $scope.organization = {};
                }
                $scope.models.fullname = i.fullname;

                $scope.$apply();
            });

            $scope.$on('taorg.select', function (v, i) {
                $scope.organization = Helper.createKeyFromReferentialId(i.key);
                $scope.models.organizationFullname = i.org.fullname;
                $scope.models.originOrganizationFullname = i.org.fullname;
                $scope.organizationEntity = i.org;
                $scope.$apply();
            });

            $scope.clearSearch = function () {
                $scope.models = {};
                $scope.models.roleTag = [];
                $scope.searchPerson = '';
            };

            function setModels(contributor) {
                $scope.models.id = contributor.entity.id;
                $scope.models.fullname = contributor.entity.fullname;
                $scope.models.lastname = contributor.entity.lastname;
                $scope.models.key = contributor.entity.key;
                $scope.models.firstname = contributor.entity.firstname;
                $scope.models.midname = contributor.entity.midname;
                $scope.models.organization = contributor.entity.organization;

                $scope.models.roleTag = [];
                angular.forEach($scope.contributor.roles, function (tag) {
                    var roleFound = $filter('filter')($scope.allRoles, {id: tag.id});
                    if (roleFound.length>0) {
                        $scope.models.roleTag.push(roleFound[0]);
                    }
                });

                // contributor.entity.rid = modalScope.models.rid;
                // contributor.entity.key = modalScope.models.key;
                // contributor.entity.firstname = modalScope.models.firstname;
                // contributor.entity.midname = modalScope.models.midname;

                // if (angular.isDefined(modalScope.organization) && modalScope.organization.originOrganizationFullname === modalScope.models.organizationFullname) {
                    // contributor.entity.organization = modalScope.organization;
                    // contributor.entity.organization = '${' + modalScope.organization.key + '}';
                    // contributor.entity.organization = modalScope.organization;
                    // contributor.organizationEntity = modalScope.organizationEntity;
                // }

                // contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
            }

            function init() {
                $scope.searchPerson = '';

                if (angular.isUndefined($scope.contributor)) {
                    $scope.models = {};
                    $scope.models.roleTag = [];
                    $scope.models.organizationFullname = '';
                } else {
                    // angular.copy($scope.contributor.entity, $scope.models);
                    setModels($scope.contributor);
                }
            }
            init();

    }]);