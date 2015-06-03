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
                    case '/information/:section':
                        $scope.select({class: 'information'});
                        break;
                }
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
