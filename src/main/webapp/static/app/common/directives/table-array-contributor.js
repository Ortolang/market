'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:tableArrayContributor
 * @description
 * # tableArrayContributor
 * Directive of the ortolangMarketApp
 */
angular.module('schemaForm')
    .directive('tableArrayContributor', ['$rootScope', '$modal', '$filter', '$translate', '$sce', 'QueryBuilderFactory', 'JsonResultResource', function ($rootScope, $modal, $filter, $translate, $sce, QueryBuilderFactory, JsonResultResource) {
        return {
            restrict: 'AE',
            scope: {
                add: '=addLabel',
                model: '='
            },
            templateUrl: 'common/directives/table-array-contributor.html',
            link: {
                pre : function (scope, element, attrs) {

                    scope.selectItem = function (item) {
                        scope.selectedItem = item;
                    };

                    scope.resetSelectedItem = function () {
                        scope.selectedItem = undefined;
                    };

                    scope.hasSelectedItem = function() {
                        return scope.selectedItem !== undefined;
                    };

                    scope.isItemSelected = function (item) {
                        return ( item !== undefined && scope.selectedItem !== undefined && scope.selectedItem.entity.fullname === item.entity.fullname );
                    };

                    scope.addSelectedItem = function () {
                        scope.model.push(scope.selectedItem);
                        scope.resetSelectedItem();
                    };

                    function prepareModalScope() {
                        var modalScope = $rootScope.$new(true);
                        modalScope.roleTag = [];

                        // Role
                        var roles = ['developer', 'manager'];
                        modalScope.suggestRole = function (query) {
                            return $filter('filter')(roles, query);
                        };

                        // modalScope.persons = '["cyril","jerome"]';
                        // modalScope.persons = '[{"firstname":"cyril", "lastname":"pestel"}]';
                        // modalScope.searchFirstname = '';
                        // modalScope.searchLastname = '';
                        // modalScope.firtnames = [];
                        // modalScope.firtnames.push({value:'cyril', lastname: 'pestel', label:'<span>cyril</span>'});

                        // modalScope.$on('tafirstname.select', function(v,i){
                            // modalScope.lastname = i.value;
                            // modalScope.lastname = i.lastname;
                            // modalScope.searchLastname = i.lastname;

                            // modalScope.$apply();
                        // });

                        modalScope.searchPerson = '';
                        modalScope.persons = scope.allPersons;
                        // modalScope.lastnames = [];
                        // modalScope.lastnames.push({value:'pestel', firstname: 'cyril', label:'<span>pestel</span>'});

                        modalScope.$on('talastname.select', function(v,i){
                            modalScope.lastname = i.lastname;
                            modalScope.firstname = i.firstname;
                            modalScope.midname = i.midname;
                            // modalScope.searchFirstname = i.firstname;

                            modalScope.$apply();
                        });

                        return modalScope;
                    }

                    function setContributor(contributor, myScope) {
                        // if(angular.isDefined(myScope.searchFirstname.value)) {
                        //     contributor.entity.firstname = myScope.searchFirstname.value;
                        // } else {
                        //     contributor.entity.firstname = myScope.searchFirstname;
                        // }
                        contributor.entity.lastname = myScope.lastname;
                        contributor.entity.firstname = myScope.firstname;
                        contributor.entity.midname = myScope.midname;
                        // contributor.entity.lastname = myScope.lastname;
                        // if(angular.isDefined(myScope.searchLastname.value)) {
                        //     contributor.entity.lastname = myScope.searchLastname.value;
                        // } else {
                        //     contributor.entity.lastname = myScope.searchLastname;
                        // }
                        
                        contributor.role = [];
                        angular.forEach(myScope.roleTag, function(tag) {
                            contributor.role.push(tag.text);
                        });
                        contributor.entity.fullname = getFullname(contributor.entity);
                    }

                    function getFullname(person) {
                        var fullname = person.firstname;
                        fullname += angular.isDefined(person.midname) ? ' '+person.midname : '';
                        fullname += ' '+person.lastname;
                        return fullname;
                    }

                    scope.addContributor = function () {
                        
                        var modalScope = prepareModalScope(),
                            addContributorModal;

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                var contributor = {entity:{},role:[]};
                                // contributor.entity.firstname = modalScope.firstname;
                                setContributor(contributor, modalScope);

                                scope.model.push(contributor);
                                addContributorModal.hide();
                            }
                        };

                        
                        addContributorModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-contributor-template.html'
                        });
                    };

                    scope.editContributor = function(contributor) {
                        var modalScope = prepareModalScope(),
                            addContributorModal;

                        modalScope.name = contributor.entity.name;
                        modalScope.firstname = contributor.entity.firstname;
                        // modalScope.searchFirstname = contributor.entity.firstname;
                        modalScope.midname = contributor.entity.midname;
                        modalScope.lastname = contributor.entity.lastname;
                        // modalScope.searchLastname = contributor.entity.lastname;
                        modalScope.fullname = contributor.entity.fullname;
                        
                        angular.forEach(contributor.role, function(tag) {
                            modalScope.roleTag.push(tag);
                        });

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                               setContributor(contributor, modalScope);

                                addContributorModal.hide();
                            }
                        };

                        modalScope.editing = true;
                        addContributorModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-contributor-template.html'
                        });
                    };

                    function init() {

                        scope.selectedItem = undefined;
                        scope.addLabel = 'Ajouter ...';

                        if(scope.model===undefined) {
                            scope.model = [];
                        }


                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key',
                            source: 'ReferentielEntity'
                        });

                        queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.lastname', 'lastname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.firstname', 'firstname');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.midname', 'midname');

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
                                    label: '<span>'+person.fullname+'</span>'
                                });
                            });
                        });
                    }
                    init();
                }
            }
        };
    }]);
