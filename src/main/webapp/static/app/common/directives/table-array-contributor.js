'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:tableArrayContributor
 * @description
 * # tableArrayContributor
 * Directive of the ortolangMarketApp
 */
angular.module('schemaForm')
    .directive('tableArrayContributor', ['$rootScope', '$modal', '$filter', '$translate', function ($rootScope, $modal, $filter, $translate) {
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

                    scope.addContributor = function () {
                        
                        var modalScope = $rootScope.$new(true),
                            addContributorModal;
                        // modalScope.refresh = function () {
                        //     AuthService.forceReload();
                        // };
                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                var contributor = {entity:{},role:[]};
                                contributor.entity.name = modalScope.name;
                                contributor.entity.firstname = modalScope.firstname;
                                contributor.entity.midname = modalScope.midname;
                                contributor.entity.lastname = modalScope.lastname;
                                
                                angular.forEach(modalScope.roleTag, function(tag) {
                                    contributor.role.push(tag.text);
                                });
                                contributor.entity.fullname = modalScope.firstname+' '+modalScope.lastname;

                                scope.model.push(contributor);
                                addContributorModal.hide();
                            }
                        };
                        var roles = ['developer', 'manager'];
                        modalScope.suggestRole = function (query) {
                            return $filter('filter')(roles, query);
                        };
                        addContributorModal = $modal({
                            scope: modalScope,
                            template: 'common/directives/add-contributor-template.html'
                        });
                    };

                    scope.editContributor = function(contributor) {
                        var modalScope = $rootScope.$new(true),
                            addContributorModal;

                        modalScope.name = contributor.entity.name;
                        modalScope.firstname = contributor.entity.firstname;
                        modalScope.midname = contributor.entity.midname;
                        modalScope.lastname = contributor.entity.lastname;
                        modalScope.fullname = contributor.entity.fullname;
                        modalScope.roleTag = [];
                        angular.forEach(contributor.role, function(tag) {
                            modalScope.roleTag.push(tag);
                        });

                        modalScope.submit = function (addContributorForm) {
                            if (addContributorForm.$valid) {
                                contributor.entity.name = modalScope.name;
                                contributor.entity.firstname = modalScope.firstname;
                                contributor.entity.midname = modalScope.midname;
                                contributor.entity.lastname = modalScope.lastname;

                                contributor.role = [];
                                angular.forEach(modalScope.roleTag, function(tag) {
                                    contributor.role.push(tag.text);
                                });
                                contributor.entity.fullname = modalScope.firstname+' '+modalScope.lastname;

                                addContributorModal.hide();
                            }
                        };

                        var roles = ['developer', 'manager'];
                        modalScope.suggestRole = function (query) {
                            return $filter('filter')(roles, query);
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
                    }
                    init();
                }
            }
        };
    }]);
