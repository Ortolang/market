'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$animateCss', '$translate', 'sideNavElements', function ($rootScope, $scope, $route, $animateCss, $translate, sideNavElements) {

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
                            var clickedElement = angular.element('.side-nav').find('.' + element.class).parent(),
                                copy = angular.element('.side-nav-active-item.copy'),
                                real = angular.element('.side-nav-active-item.real');
                            real.addClass('animated');
                            $animateCss(copy, {
                                removeClass: 'ng-hide',
                                easing: 'ease-in-out',
                                from: { top: clickedElement.position().top + 'px' },
                                to: { top: '0px' },
                                duration: 0.6
                            }).start().then(function () {
                                $scope.selectedElement = value;
                                real.removeClass('animated');
                                copy.addClass('ng-hide');
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

        $rootScope.$on('$routeUpdate', function () {
            var modal = angular.element('.modal.am-fade');
            if (modal.length > 0) {
                modal.scope().$hide();
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
            if (previous) {
                switch (current.$$route.originalPath) {
                    case '/':
                        $scope.select({class: 'home'}, false);
                        $rootScope.title = undefined;
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
