'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:tableArrayContributor
 * @description
 * # tableArrayContributor
 * Directive of the ortolangMarketApp
 */
angular.module('schemaForm')
    .directive('tableArrayContributor', ['$rootScope', '$modal', '$filter', '$translate', '$sce', 'QueryBuilderFactory', 'JsonResultResource', 'Settings', function ($rootScope, $modal, $filter, $translate, $sce, QueryBuilderFactory, JsonResultResource, Settings) {
        return {
            restrict: 'AE',
            scope: {
                add: '=addLabel',
                model: '='
            },
            templateUrl: 'common/directives/table-array-contributor.html',
            link: {
                pre : function (scope) {

                    /**
                     * Commons methods on contributor
                     **/

                    scope.editContributor = function (contributor) {
                        if(contributor.entity.type==='person') {
                            scope.editPerson(contributor);
                        } else if(contributor.entity.type==='organization') {
                            scope.editOrganization(contributor);
                        }
                    };

                    scope.deleteContributor = function (contributor) {
                        var index = scope.model.indexOf(contributor);
                        if (index > -1) {
                            scope.model.splice(index, 1);
                        }
                    };

                    /**
                     * Methods on person
                     **/

                    function prepareModalScopeForPerson() {
                        var modalScope = $rootScope.$new(true);
                        modalScope.type = 'person';
                        modalScope.roleTag = [];

                        // Role
                        // var roles = ['developer', 'manager'];
                        modalScope.suggestRole = function (query) {
                            var result = $filter('filter')(scope.allRoles, {label:query});
                            return result;
                        };

                        modalScope.searchPerson = '';
                        modalScope.persons = scope.allPersons;

                        modalScope.$on('talastname.select', function(v,i){
                            modalScope.lastname = i.lastname;
                            modalScope.firstname = i.firstname;
                            modalScope.midname = i.midname;
                            if(angular.isDefined(i.org)) {
                                modalScope.organizationFullname = i.org.fullname;
                                modalScope.organization = i.org;
                            }

                            modalScope.$apply();
                        });

                        modalScope.organizationFullname = '';
                        modalScope.allOrganizations = scope.allOrganizations;

                        modalScope.$on('taorg.select', function(v,i){
                            modalScope.organization = i.lastname;

                            modalScope.$apply();
                        });


                        // modalScope.onRoleAdded = function(role) {
                            // modalScope.organization = role.id;

                        //     modalScope.$apply();
                        // };

                        return modalScope;
                    }

                    function setPerson(contributor, myScope) {
                        contributor.entity.type = myScope.type;
                        contributor.entity.lastname = myScope.lastname;
                        contributor.entity.firstname = myScope.firstname;
                        contributor.entity.midname = myScope.midname;
                        // contributor.entity.lastname = myScope.lastname;
                        // if(angular.isDefined(myScope.searchLastname.value)) {
                        //     contributor.entity.lastname = myScope.searchLastname.value;
                        // } else {
                        //     contributor.entity.lastname = myScope.searchLastname;
                        // }
                        
                        if(angular.isDefined(myScope.organization)) {
                            contributor.entity.organization = myScope.organization;
                        }

                        contributor.role = [];
                        angular.forEach(myScope.roleTag, function(tag) {
                            contributor.role.push(tag.id);
                        });
                        contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
                    }

                    function getFullnameOfPerson(person) {
                        var fullname = person.firstname;
                        fullname += angular.isDefined(person.midname) ? ' '+person.midname : '';
                        fullname += ' '+person.lastname;
                        return fullname;
                    }

                    scope.addContributor = function () {
                        
                        var modalScope = prepareModalScopeForPerson(),
                            addContributorModal;

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                var contributor = {entity:{},role:[]};

                                setPerson(contributor, modalScope);

                                scope.model.push(contributor);
                                addContributorModal.hide();
                            }
                        };

                        addContributorModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-contributor-template.html'
                        });
                    };

                    scope.editPerson = function (contributor) {
                        var modalScope = prepareModalScopeForPerson(),
                            addContributorModal;

                        modalScope.firstname = contributor.entity.firstname;
                        modalScope.midname = contributor.entity.midname;
                        modalScope.lastname = contributor.entity.lastname;
                        modalScope.fullname = contributor.entity.fullname;
                        if(angular.isDefined(contributor.entity.organization)) {
                            modalScope.organization = contributor.entity.organization;
                            modalScope.organizationFullname = contributor.entity.organization.fullname;
                        }

                        angular.forEach(contributor.role, function(tag) {
                            var tagFound = $filter('filter')(scope.allRoles, {id:tag});
                            if(tagFound.length>0) {
                                modalScope.roleTag.push(tagFound[0]);
                            } else {
                                modalScope.roleTag.push({id:tag,label:tag});
                            }
                        });

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                setPerson(contributor, modalScope);

                                addContributorModal.hide();
                            }
                        };

                        modalScope.editing = true;
                        addContributorModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-contributor-template.html'
                        });
                    };

                    /**
                     * Methods on Organizations
                     **/

                    function prepareModalScopeForOrganization() {
                        var modalScope = $rootScope.$new(true);
                        modalScope.type = 'organization';

                        return modalScope;
                    }

                    function getFullnameOfOrganization(org) {
                        var fullname = org.name;
                        var details = '';
                        details += angular.isDefined(org.acronym) ? org.acronym+',' : '';
                        details += angular.isDefined(org.city) ? ' '+org.city : '';
                        details += angular.isDefined(org.country) ? ' '+org.country : '';
                        if(details!=='') {
                            fullname += ' ('+details+')';
                        }
                        return fullname;
                    }

                    function setOrganization(organization, myScope) {
                        organization.entity.type = myScope.type;
                        organization.entity.name = myScope.name;
                        organization.entity.fullname = getFullnameOfOrganization(myScope);
                        organization.entity.acronym = myScope.acronym;
                        organization.entity.city = myScope.city;
                        organization.entity.country = myScope.country;
                        organization.entity.homepage = myScope.homepage;
                        organization.entity.img = myScope.img;
                    }

                    scope.addProducer = function () {

                    };

                    scope.editOrganization = function (organization) {
                        var modalScope = prepareModalScopeForOrganization(),
                            addOrganizationModal;

                        modalScope.name = organization.entity.name;
                        modalScope.fullname = organization.entity.fullname;
                        modalScope.acronym = organization.entity.acronym;
                        modalScope.city = organization.entity.city;
                        modalScope.country = organization.entity.country;
                        modalScope.homepage = organization.entity.homepage;
                        modalScope.img = organization.entity.img;

                        modalScope.submit = function (addOrganizationForm) {
                            if (addOrganizationForm.$valid) {
                                setOrganization(organization, modalScope);

                                addOrganizationModal.hide();
                            }
                        };

                        modalScope.editing = true;
                        addOrganizationModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-organization-template.html'
                        });
                    };

                    /**
                     * Utils
                     **/

                    function loadAllPersons() {

                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key',
                            source: 'ReferentielEntity'
                        });

                        queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.lastname', 'lastname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.firstname', 'firstname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.midname', 'midname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.organization', 'organization');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'person');

                        var query = queryBuilder.toString();
                        scope.allPersons = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var person = angular.fromJson(result);

                                    scope.allPersons.push({
                                        value: person.fullname,
                                        lastname: person.lastname, 
                                        firstname: person.firstname, 
                                        midname: person.midname,
                                        org: person.organization, 
                                        label: '<span>'+person.fullname+'</span>'
                                    });

                            });
                        });
                    }

                    function loadAllOrganizations() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'organization');

                        var query = queryBuilder.toString();
                        scope.allOrganizations = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var organization = angular.fromJson(result);

                                // Load organization document
                                var queryOrganizationgMeta = 'select from ' + organization['meta_ortolang-referentiel-json'];
                                JsonResultResource.get({query: queryOrganizationgMeta}).$promise.then(function (jsonObject) {
                                    var org = angular.fromJson(jsonObject[0]);

                                    cleanJsonDocument(org);

                                    scope.allOrganizations.push({
                                        value: organization.fullname,
                                        fullname: organization.fullname, 
                                        org: org,
                                        label: '<span>'+organization.fullname+'</span>'
                                    });
                                });

                                
                            });
                        });
                    }

                    function loadAllRoles() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'role');

                        var query = queryBuilder.toString();
                        scope.allRoles = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var role = angular.fromJson(result);
                                
                                scope.allRoles.push({id: role.id, label: role.label});
                            });
                        });
                    }

                    function cleanJsonDocument(doc) {
                        for(var propertyName in doc) {
                            if(propertyName.substring(0,1)==='@') {
                                delete doc[propertyName];
                            }
                        }
                    }

                    /**
                     * Initialize the scope
                     **/

                    function init() {

                        scope.selectedItem = undefined;
                        scope.addLabel = 'Ajouter ...';

                        if(scope.model===undefined) {
                            scope.model = [];
                        }

                        loadAllPersons();
                        loadAllOrganizations();
                        loadAllRoles();
                    }
                    init();
                }
            }
        };
    }]);
