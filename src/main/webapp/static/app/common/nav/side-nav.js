'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', '$animate', 'Nav', function ($rootScope, $scope, $route, $translate, $animate, Nav) {

        $scope.sideNavElements = Nav.getSideNavElements();

        $scope.select = function (element, animate) {
            if (animate === undefined) {
                animate = true;
            }
            $scope.selectedElementCopy = element;
            angular.forEach(Nav.getSideNavElements(), function (value) {
                if (value.class === element.class) {
                    value.active =  'active';
                    if (value.hidden) {
                        $scope.selectedElement = value;
                    } else {
                        var clickedElement = $('.side-nav').find('.' + element.class).parent(),
                            copy = angular.element('.side-nav-active-item.copy'),
                            real = angular.element('.side-nav-active-item.real');
                        $rootScope.navPosition = clickedElement.position().top;
                        if (animate) {
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

        $scope.getCssClass = function (element) {
            return (element.active ? 'active ' : '') + (element.class === 'divider' ? 'divider' : '');
        };

        // *********************** //
        //           Init          //
        // *********************** //

        function init() {
            var regExp, regExpBis, i, currentPath;
            for (i = 0; i < Nav.getSideNavElements().length; i++) {
                regExp = new RegExp('^' + Nav.getSideNavElements()[i].path);
                if (Nav.getSideNavElements()[i].otherPath) {
                    regExpBis = new RegExp('^' + Nav.getSideNavElements()[i].otherPath);
                }
                currentPath = $route.current.originalPath;
                if (currentPath.indexOf(':section') !== -1) {
                    currentPath = currentPath.replace(':section', $route.current.params.section);
                }
                if (currentPath.match(regExp) ||
                        (regExpBis && $route.current.originalPath && $route.current.originalPath.match(regExpBis))) {
                    Nav.getSideNavElements()[i].active = 'active';
                    $scope.selectedElement = Nav.getSideNavElements()[i];
                    break;
                }
            }
        }

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            console.log('$routeChangeSuccess', current, previous);
            if (!previous) {
                init();
            } else {
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
