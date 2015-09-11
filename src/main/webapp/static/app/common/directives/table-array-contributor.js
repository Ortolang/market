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
                contributors: '='
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
                        var index = scope.contributors.indexOf(contributor);
                        if (index > -1) {
                            scope.contributors.splice(index, 1);
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
                            modalScope.id = i.id;
                            modalScope.lastname = i.lastname;
                            modalScope.firstname = i.firstname;
                            modalScope.midname = i.midname;
                            if(angular.isDefined(i.org)) {
                                modalScope.organizationFullname = i.org.fullname;
                                modalScope.organization = i.org;
                            }
                            modalScope.fullname = i.fullname;

                            modalScope.$apply();
                        });

                        modalScope.organizationFullname = '';
                        modalScope.allOrganizations = scope.allOrganizations;

                        modalScope.$on('taorg.select', function(v,i){
                            modalScope.organization = i.org;

                            modalScope.$apply();
                        });


                        modalScope.clearSearch = clearSearchPerson;

                        return modalScope;
                    }

                    function prepareModalScopeWithRole(contributor, modalScope) {
                        modalScope.roleTag = [];
                        angular.forEach(contributor.role, function(tag) {
                            var tagFound = $filter('filter')(scope.allRoles, {id:tag});
                            if(tagFound.length>0) {
                                modalScope.roleTag.push(tagFound[0]);
                            } else {
                                modalScope.roleTag.push({id:tag,label:tag});
                            }
                        });
                    }

                    function setPerson(contributor, myScope) {
                        contributor.entity.type = myScope.type;
                        contributor.entity.id = myScope.id;
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

                        contributor.entity.fullname = getFullnameOfPerson(contributor.entity);
                    }

                    function clearModalScopeForPerson(modalScope) {
                        delete modalScope.id;
                        delete modalScope.lastname;
                        delete modalScope.firstname;
                        delete modalScope.midname;
                        delete modalScope.organization;
                        delete modalScope.organizationFullname;
                        delete modalScope.fullname;
                    }

                    function clearSearchPerson(modalScope) {
                        angular.element('#add-contributor-searchPerson').val('');

                        clearModalScopeForPerson(modalScope);
                    }

                    function setRole(contributor, myScope) {
                        contributor.role = [];
                        angular.forEach(myScope.roleTag, function(tag) {
                            contributor.role.push(tag.id);
                        });
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

                        modalScope.newPerson = false;
                        modalScope.createPerson = function() {
                            modalScope.newPerson = !modalScope.newPerson;
                            clearSearchPerson(modalScope);
                        };

                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                        });

                        modalScope.submit = function (addContributorForm) {

                            if(!contributorExists(modalScope, scope.contributors)) {
                                addContributorForm.fullname.$setValidity('exists', true);
                            } else {
                                addContributorForm.fullname.$setValidity('exists', false);
                            }

                            if(modalScope.roleTag.length>0) {
                                addContributorForm.roleTag.$setValidity('role', true);
                            } else {
                                addContributorForm.roleTag.$setValidity('role', false);
                            }

                            if (addContributorForm.$valid) {
                                var contributor = {entity:{},role:[]};

                                setPerson(contributor, modalScope);

                                setRole(contributor, modalScope);

                                scope.contributors.push(contributor);
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

                        modalScope.id = contributor.entity.id;
                        modalScope.firstname = contributor.entity.firstname;
                        modalScope.midname = contributor.entity.midname;
                        modalScope.lastname = contributor.entity.lastname;
                        modalScope.fullname = contributor.entity.fullname;
                        if(angular.isDefined(contributor.entity.organization)) {
                            modalScope.organization = contributor.entity.organization;
                            modalScope.organizationFullname = contributor.entity.organization.fullname;
                        }

                        prepareModalScopeWithRole(contributor, modalScope);

                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                        });

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                setPerson(contributor, modalScope);

                                setRole(contributor, modalScope);

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

                        modalScope.searchOrganization = '';
                        modalScope.organizations = scope.allOrganizations;

                        modalScope.$on('taorg.select', function(v,i){
                            modalScope.id = i.org.id;
                            modalScope.name = i.org.name;
                            modalScope.acronym = i.org.acronym;
                            modalScope.city = i.org.city;
                            modalScope.country = i.org.country;
                            modalScope.homepage = i.org.homepage;
                            modalScope.img = i.org.img;
                            modalScope.fullname = i.org.fullname;

                            modalScope.$apply();
                        });

                        modalScope.clearSearch = function clearSearchOrganization() {
                            angular.element('#add-organization-searchOrganization').val('');

                            clearModalScopeForOrganization(modalScope);
                        };

                        return modalScope;
                    }

                    function clearSearchOrganization(modalScope) {
                        angular.element('#add-organization-searchOrganization').val('');

                        clearModalScopeForOrganization(modalScope);
                    }

                    function getFullnameOfOrganization(org) {
                        var fullname = org.name;
                        var details = '';
                        details += angular.isDefined(org.acronym) ? org.acronym : '';
                        details += (angular.isDefined(org.acronym) && (angular.isDefined(org.city) || angular.isDefined(org.country))) ? ', ' : '';
                        details += angular.isDefined(org.city) ? org.city : '';
                        details += angular.isDefined(org.country) ? ' '+org.country : '';
                        if(details!=='') {
                            fullname += ' ('+details+')';
                        }
                        return fullname;
                    }

                    function setOrganization(organization, myScope) {
                        organization.entity.type = myScope.type;
                        organization.entity.id = myScope.id;
                        organization.entity.name = myScope.name;
                        organization.entity.fullname = getFullnameOfOrganization(myScope);
                        organization.entity.acronym = myScope.acronym;
                        organization.entity.city = myScope.city;
                        organization.entity.country = myScope.country;
                        organization.entity.homepage = myScope.homepage;
                        organization.entity.img = myScope.img;
                    }

                    function clearModalScopeForOrganization(modalScope) {
                        delete modalScope.id;
                        delete modalScope.name;
                        delete modalScope.acronym;
                        delete modalScope.city;
                        delete modalScope.country;
                        delete modalScope.homepage;
                        delete modalScope.img;
                        delete modalScope.fullname;
                    }

                    scope.addProducer = function () {
                        var modalScope = prepareModalScopeForOrganization(),
                            addOrganizationModal;

                        modalScope.roleTag = [{id:'producer',label:'producer'}];

                        modalScope.newOrganization = false;
                        modalScope.createOrganization = function() {
                            modalScope.newOrganization = !modalScope.newOrganization;

                            clearSearchOrganization(modalScope);
                        };

                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                        });

                        modalScope.submit = function (addOrganizationForm) {

                            if(!contributorExists(modalScope, scope.contributors)) {
                                addOrganizationForm.fullname.$setValidity('exists', true);
                            } else {
                                addOrganizationForm.fullname.$setValidity('exists', false);
                            }

                            if (addOrganizationForm.$valid) {
                                var organization = {entity:{},role:[]};

                                setOrganization(organization, modalScope);

                                setRole(organization, modalScope);

                                scope.contributors.push(organization);
                                addOrganizationModal.hide();
                            }
                        };

                        addOrganizationModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-organization-template.html'
                        });
                    };

                    scope.editOrganization = function (organization) {
                        var modalScope = prepareModalScopeForOrganization(),
                            editOrganizationModal;

                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                        });

                        modalScope.submit = function (addOrganizationForm) {
                            if (addOrganizationForm.$valid) {
                                setOrganization(organization, modalScope);

                                setRole(organization, modalScope);

                                editOrganizationModal.hide();
                            }
                        };

                        modalScope.id = organization.entity.id;
                        modalScope.name = organization.entity.name;
                        modalScope.fullname = organization.entity.fullname;
                        modalScope.acronym = organization.entity.acronym;
                        modalScope.city = organization.entity.city;
                        modalScope.country = organization.entity.country;
                        modalScope.homepage = organization.entity.homepage;
                        modalScope.img = organization.entity.img;

                        prepareModalScopeWithRole(organization, modalScope);

                        modalScope.editing = true;
                        editOrganizationModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-organization-template.html'
                        });
                    };

                    /**
                     * Utils
                     **/

                    function contributorExists(contributor, contributors) {
                        if(angular.isDefined(contributor.fullname) && angular.isDefined(contributors)) {
                            var iContributor;
                            for (iContributor = 0; iContributor < contributors.length; iContributor++) {
                                if(angular.isDefined(contributors[iContributor].entity.id) && angular.isDefined(contributor.id)) {
                                    if (contributors[iContributor].entity.id === contributor.id) {
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

                    function loadAllPersons() {

                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key',
                            source: 'ReferentielEntity'
                        });

                        queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
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
                                        id: person.id,
                                        fullname: person.fullname,
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

                        if(scope.contributors===undefined) {
                            scope.contributors = [];
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
