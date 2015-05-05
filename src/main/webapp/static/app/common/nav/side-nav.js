'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', '$animate', 'sideNavElements', function ($rootScope, $scope, $route, $translate, $animate, sideNavElements) {

        $scope.sideNavElements = sideNavElements;
        $scope.selectedElement = undefined;
        var lastSelectedElementClass;

        $scope.select = function (element, animate) {
            if (element.class === lastSelectedElementClass) {
                return;
            }
            lastSelectedElementClass = element.class;
            if (animate === undefined) {
                animate = true;
            }
            $scope.selectedElementCopy = element;
            angular.forEach(sideNavElements, function (value) {
                if (value.class === element.class) {
                    value.active =  'active';
                    if (value.hiddenSideNav) {
                        $scope.selectedElement = value;
                    } else {
                        if (animate) {
                            var clickedElement = $('.side-nav').find('.' + element.class).parent(),
                                copy = angular.element('.side-nav-active-item.copy'),
                                real = angular.element('.side-nav-active-item.real');
                            $rootScope.navPosition = clickedElement.position().top;
                            console.log('$rootScope.navPosition', $rootScope.navPosition, element);
                            real.addClass('animated');
                            $animate.removeClass(copy, 'ng-hide').then(function () {
                                $scope.$apply(function () {
                                    $scope.selectedElement = value;
                                    real.removeClass('animated');
                                    copy.addClass('ng-hide');
                                });
                            });
                        } else {
                            $scope.selectedElement = value;
                        }
                    }
                } else {
                    value.active =  undefined;
                }
            });
        };

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
                    $scope.selectedElement = sideNavElements[i];
                    break;
                }
            }
        }

        init();

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if (previous && current.$$route.originalPath !== previous.$$route.originalPath) {
                switch (current.$$route.originalPath) {
                    case '/':
                        $scope.select({class: 'market'}, false);
                        break;
                    case '/tasks':
                        $scope.select({class: 'tasks'}, false);
                        break;
                    case '/processes':
                        $scope.select({class: 'processes'}, false);
                        break;
                    case '/profile':
                        $scope.select({class: 'profile'}, false);
                        break;
                    case '/search':
                        $scope.select({class: 'search'}, false);
                        break;
                    case '/information/:section':
                        $scope.select({class: 'information'}, false);
                        break;
                }
            }
        });

    }]);
