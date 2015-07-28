'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', 'sideNavElements','StaticWebsite', function ($rootScope, $scope, $route, sideNavElements, StaticWebsite) {

        $scope.sideNavElements = sideNavElements;

        $scope.select = function (element) {
            angular.forEach(sideNavElements, function (value) {
                value.active = value.class === element.class ? 'active' : undefined;
            });
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
                            $rootScope.ortolangPageTitle = undefined;
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
                    }

                    // Add class for static website element
                    if (StaticWebsite.getInformationMenu() &&
                        current.$$route.originalPath === '/' + StaticWebsite.getInformationMenu().id + '/:section') {
                        $scope.select({class: StaticWebsite.getInformationMenu().class});
                    }
                }
            }
        });

        $rootScope.$on('static-site-initialized', function () {
            // Add static site link to side-nav-elements if needed
            var informationMenu = StaticWebsite.getInformationMenu(),
                classStaticMenu = informationMenu.class,
                pathStaticMenu = '/' + informationMenu.id,
                hiddenPathStaticMenu = '/' + informationMenu.id + '/' + informationMenu.content[0],
                titleStaticMenu = informationMenu.title,
                iconStaticMenu = 'fa fa-fw fa-2x ' + informationMenu.iconSide,
                staticElement = {
                    class: classStaticMenu,
                    path: pathStaticMenu,
                    hiddenPath: hiddenPathStaticMenu,
                    description: titleStaticMenu,
                    iconCss: iconStaticMenu,
                    active: undefined,
                    hiddenSideNav: false,
                    hiddenTopNav: false,
                    authenticated: false
                },
                initialized = false;
            angular.forEach(sideNavElements, function (sideNavElement, index) {
                if (sideNavElement.class === classStaticMenu) {
                    sideNavElements[index] = staticElement;
                    initialized = true;
                }
            });
            if (!initialized) {
                sideNavElements.push(staticElement);
            }
        });

        // *********************** //
        //           Init          //
        // *********************** //

        function init() {
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
                if (currentPath.match(regExp) ||
                    (regExpBis && $route.current.originalPath && $route.current.originalPath.match(regExpBis))) {
                    sideNavElements[i].active = 'active';
                    break;
                }
            }
        }

        init();

    }]);
