'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:contributorsEditor
 * @description
 * # contributorsEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('contributorsEditor', ['$q', '$modal', '$filter', 'WorkspaceMetadataService', 'ReferentialResource', 'Helper',
        function ($q, $modal, $filter, WorkspaceMetadataService, ReferentialResource, Helper) {
        return {
            restrict: 'AE',
            scope: {
                disabled: '=',
                contributors: '=',
                metadata: '='
            },
            templateUrl: 'workspace/directives/contributors-editor.html',
            link: function (scope) {

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
                 * Method for cleaning the DOM element
                 **/
                scope.clearSearchContributor = function () {
                    angular.element('#search-contributor').val('');
                };

                /**
                 * Methods on contributor
                 **/

                scope.deleteContributor = function (contributor) {
                    var index = scope.contributors.indexOf(contributor);
                    if (index > -1) {
                        scope.contributors.splice(index, 1);
                    }
                };

                scope.suggestPerson = function (term) {
                    if (term.length < 2 || angular.isObject(term)) {
                        return [];
                    }
                    var deferred = $q.defer();
                    ReferentialResource.get({type: 'PERSON', lang: 'FR', term: $filter('removeAccents')(term)}, function (results) {
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

                scope.orderContributorsByLastName = function () {
                    scope.contributors = $filter('orderBy')(scope.contributors, '+entityContent.lastname');
                };

                /**
                 * Adds contributor listener.
                 */
                scope.$on('tacontributor.select', function (v, i) {
                    scope.person = {};
                    scope.person.id = i.id;
                    scope.person.lastname = i.lastname;
                    scope.person.firstname = i.firstname;
                    if (i.midname) {
                        scope.person.midname = i.midname;
                    }
                    if (angular.isDefined(i.organization)) {
                        ReferentialResource.get({name: Helper.extractNameFromReferentialId(i.organization)}, function (entity) {
                            scope.person.organizationEntity = entity.content;
                        });
                        scope.person.organization = i.organization;
                    }
                    scope.person.fullname = i.fullname;

                    scope.$apply();
                });

                scope.addContributor = function () {
                    if (scope.selectedRoles.length === 0) {
                        console.log('Select a role');
                        return;
                    }
                    if (personExists(scope.person, scope.contributors)) {
                        console.log('Person already exists');
                        return;
                    }

                    var contributor = {};
                    contributor.roles = [];
                    angular.forEach(scope.selectedRoles, function (role) {
                        contributor.roles.push(Helper.createKeyFromReferentialName(role.id));
                    });
                    contributor.rolesEntity = scope.selectedRoles;

                    contributor.entity = Helper.createKeyFromReferentialName(scope.person.id);
                    contributor.entityContent = scope.person;

                    if (contributor.entityContent.organization) {
                        contributor.organization = contributor.entityContent.organization;
                        contributor.organizationEntity = contributor.entityContent.organizationEntity;
                    }
                    if (scope.contributors === undefined) {
                        scope.contributors = [];
                    }
                    scope.contributors.push(contributor);
                    scope.searchContributor = '';
                    scope.selectedRoles = [];
                };

                scope.showAddPersonModal = function (person) {
                    if (WorkspaceMetadataService.canEdit) {
                        return;
                    }
                    var modalScope = Helper.createModalScope(true);
                    modalScope.allRoles = scope.allRoles;
                    modalScope.metadata = scope.metadata;
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
                    if (angular.isDefined(scope.contributors)) {
                        angular.forEach(scope.contributors, function (contributor) {
                            loadContributor(contributor);
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
                        scope.allRoles = $filter('orderBy')(allRoles, 'label');
                    });
                }


                /**
                 * Initialize the scope
                 **/
                function init() {
                    scope.WorkspaceMetadataService = WorkspaceMetadataService;

                    scope.allRoles = [];
                    scope.searchContributor = '';
                    scope.selectedRoles = [];

                    loadAllRoles();
                    loadContributors();
                }
                init();
            }
        };
    }]);
