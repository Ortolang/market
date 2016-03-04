'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', 'sideNavElements', 'Helper', function ($rootScope, $scope, $route, $translate, sideNavElements, Helper) {

        $scope.sideNavElements = sideNavElements;
        $scope.sideNavActiveClass = null;

        $scope.select = function (elementClass) {
            $scope.sideNavActiveClass = elementClass;
        };

        // *********************** //
        //          Events         //
        // *********************** //

        $rootScope.$on('$routeUpdate', function () {
            var modal = angular.element('.modal');
            if (modal.length > 0) {
                Helper.hideModal();
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if (current.$$route) {
                if (current.$$route.title) {
                    $rootScope.ortolangPageTitle = $translate.instant(current.$$route.title) + ' | ';
                } else if (previous || current.$$route.originalPath === '/') {
                    $rootScope.ortolangPageTitle = '';
                } else {
                    $rootScope.ortolangPageTitle = undefined;
                }
                $scope.reducedSideNav = current.$$route.originalPath === '/workspaces' || current.$$route.originalPath === '/workspaces/:alias';
                if (previous) {
                    switch (current.$$route.originalPath) {
                        case '/':
                            $scope.select('home');
                            break;
                        case '/profile/information':
                            $scope.select('profile');
                            break;
                        case '/search':
                            $scope.select('search');
                            break;
                        case '/information/:section?':
                            $scope.select('information');
                            break;
                        case '/market/corpora':
                            $scope.select('corpora');
                            break;
                        case '/market/applications':
                            $scope.select('applications');
                            break;
                        case '/market/tools':
                            $scope.select('tools');
                            break;
                        case '/market/lexicons':
                            $scope.select('lexicons');
                            break;
                        default:
                            if (current.params.section && previous.params.section === 'item') {
                                $scope.select(current.params.section);
                            }
                    }
                } else {
                    var regExp, i, currentPath;
                    if ($route.current.originalPath === '/') {
                        $scope.sideNavActiveClass = sideNavElements[0].class;
                    } else {
                        for (i = 1; i < sideNavElements.length; i++) {
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
            }
        });
    }]);
