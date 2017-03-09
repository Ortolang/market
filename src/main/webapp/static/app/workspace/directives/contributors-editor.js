'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:contributorsEditor
 * @description
 * # contributorsEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('contributorsEditor', ['$q', '$modal', '$filter', 'WorkspaceMetadataService', 'SearchResource', 'Helper', 'icons',
        function ($q, $modal, $filter, WorkspaceMetadataService, SearchResource, Helper, icons) {
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
                    SearchResource.entities({type: 'PERSON', 'fullname*': term}, function (results) {
                        var suggestedPersons = [];
                        angular.forEach(results, function (refentity) {
                            suggestedPersons.push(refentity);
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
                        scope.person.organizationEntity = i.organization;
                        scope.person.organization = Helper.createKeyFromReferentialName(i.organization.id);
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
                    if (!WorkspaceMetadataService.canEdit) {
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
                        SearchResource.getEntity({id: Helper.extractKeyFromReferentialId(contributor.entity), type: 'PERSON'}, function (entity) {
                            contributor.entityContent = entity;
                        });
                    } else {
                        contributor.entityContent = angular.copy(contributor.entity);
                    }

                    if (contributor.roles && contributor.roles.length > 0) {
                        contributor.rolesEntity = [];
                        angular.forEach(contributor.roles, function (role) {
                            SearchResource.getEntity({id: Helper.extractKeyFromReferentialId(role), type: 'ROLE'}, function (entity) {
                                entity.label = Helper.getMultilingualValue(entity.labels);
                                contributor.rolesEntity.push(entity);
                            });
                        });
                    }

                    if (contributor.organization) {
                        SearchResource.getEntity({id: Helper.extractKeyFromReferentialId(contributor.organization), type: 'ORGANIZATION'}, function (entity) {
                            contributor.organizationEntity = entity;
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
                    SearchResource.entities({type: 'ROLE', size: 100}, function (entities) {
                        var allRoles = [];
                        angular.forEach(entities, function (entry) {
                            entry.label = Helper.getMultilingualValue(entry.labels);
                            allRoles.push(entry);
                        });
                        scope.allRoles = $filter('orderBy')(allRoles, 'label');
                    });
                }


                /**
                 * Initialize the scope
                 **/
                function init() {
                    scope.WorkspaceMetadataService = WorkspaceMetadataService;
                    scope.icons = icons;

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
