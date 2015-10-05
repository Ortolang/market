'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', 'sideNavElements', function ($rootScope, $scope, $route, sideNavElements) {

        $scope.sideNavElements = sideNavElements;
        $scope.sideNavActiveClass = null;

        $scope.select = function (element) {
            $scope.sideNavActiveClass = element.class;
        };

        // *********************** //
        //          Events         //
        // *********************** //

        $rootScope.$on('$routeUpdate', function () {
            var modal = angular.element('.modal.am-fade');
            if (modal.length > 0) {
                modal.scope().$hide();
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if (current.$$route) {
                $rootScope.ortolangPageTitle = current.$$route.title;
                if (previous) {
                    switch (current.$$route.originalPath) {
                        case '/':
                            $scope.select({class: 'home'});
                            $rootScope.ortolangPageTitle = null;
                            break;
                        case '/tasks':
                            $scope.select({class: 'tasks'});
                            break;
                        case '/processes':
                            $scope.select({class: 'processes'});
                            break;
                        case '/profile':
                            $scope.select({class: 'profile'});
                            break;
                        case '/search':
                            $scope.select({class: 'search'});
                            break;
                        case '/information/:section?':
                            $scope.select({class: 'information'});
                            break;
                        default:
                            if (current.params.section && previous.params.section === 'item') {
                                $scope.select({class: current.params.section});
                            }
                    }
                } else {
                    var regExp, regExpBis, i, currentPath;

                    for (i = 0; i < sideNavElements.length; i++) {
                        regExp = new RegExp('^' + sideNavElements[i].path);
                        if (sideNavElements[i].otherPath) {
                            regExpBis = new RegExp('^' + sideNavElements[i].otherPath);
                        }
                        currentPath = $route.current.originalPath;
                        if (currentPath.indexOf(':section') !== -1) {
                            currentPath = currentPath.replace(':section', $route.current.params.section);
                        }
                        if (regExp.test(currentPath) ||
                            (regExpBis && $route.current.originalPath && regExpBis.test($route.current.originalPath))) {
                            $scope.sideNavActiveClass = sideNavElements[i].class;
                            break;
                        }
                    }
                }
            }
        });
    }]);
