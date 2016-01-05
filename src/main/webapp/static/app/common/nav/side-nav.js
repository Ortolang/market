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

        $scope.select = function (elementClass) {
            $scope.sideNavActiveClass = elementClass;
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
                $scope.reducedSideNav = current.$$route.originalPath === '/workspaces' || current.$$route.originalPath === '/workspaces/:alias';
                if (previous) {
                    switch (current.$$route.originalPath) {
                        case '/':
                        case '/market/home':
                            $scope.select('home');
                            $rootScope.ortolangPageTitle = undefined;
                            break;
                        case '/profile':
                            $scope.select('profile');
                            break;
                        case '/search':
                            $scope.select('search');
                            break;
                        case '/information/:section?':
                            $scope.select('information');
                            break;
                        default:
                            if (current.params.section && previous.params.section === 'item') {
                                $scope.select(current.params.section);
                            }
                    }
                } else {
                    var regExp, i, currentPath;

                    for (i = 0; i < sideNavElements.length; i++) {
                        regExp = new RegExp('^' + sideNavElements[i].path);
                        currentPath = $route.current.originalPath;
                        if (currentPath.indexOf(':section') !== -1) {
                            currentPath = currentPath.replace(':section', $route.current.params.section);
                        }
                        if (regExp.test(currentPath)) {
                            $scope.sideNavActiveClass = sideNavElements[i].class;
                            break;
                        }
                    }
                }
            }
        });
    }]);
