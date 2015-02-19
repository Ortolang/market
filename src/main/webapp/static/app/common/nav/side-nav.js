'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', '$animate', function ($rootScope, $scope, $route, $translate, $animate) {

        $scope.select = function (element, animate) {
            if (animate === undefined) {
                animate = true;
            }
            $scope.selectedElementCopy = element;
            angular.forEach($rootScope.sideNavElements, function (value) {
                if (value.class === element.class) {
                    value.active =  'active';
                    if (value.hidden) {
                        $scope.selectedElement = value;
                    } else {
                        var clickedElement = $('.side-nav').find('.' + element.class).parent(),
                            copy = angular.element('.side-nav-active-item.copy'),
                            real = angular.element('#side-nav-active-item');
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

        $rootScope.selectTasks = function () {
            $scope.select({class: 'tasks'}, false);
        };

        $rootScope.selectInformation = function () {
            $scope.select({class: 'information'}, false);
        };

        $rootScope.selectProcesses = function () {
            $scope.select({class: 'processes'}, false);
        };

        $rootScope.selectHome = function () {
            $scope.select({class: 'market'}, false);
        };

        $rootScope.selectProfile = function () {
            $scope.select({class: 'profile'}, false);
        };

        $rootScope.selectSearch = function () {
            $scope.select({class: 'search'}, false);
        };

        $scope.getCssClass = function (element) {
            return (element.active ? 'active ' : '') + (element.class === 'divider' ? 'divider' : '');
        };

        $rootScope.sideNavElements = [
            {
                class: 'market',
                path: '/market/news',
                description: 'NAV.HOME',
                iconCss: 'fa fa-fw fa-home fa-2x',
                active: undefined,
                hidden: false,
                authenticated: false
            },
            {
                class: 'corpora',
                path: '/market/corpora',
                description: 'CORPORA',
                iconCss: 'fa fa-fw fa-book fa-2x',
                active: undefined,
                hidden: false,
                authenticated: false
            },
            {
                class: 'integrated-projects',
                path: '/market/websites',
                description: 'INTEGRATED_PROJECTS',
                iconCss: 'fa fa-fw fa-briefcase fa-2x',
                active: undefined,
                hidden: false,
                authenticated: false
            },
            {
                class: 'tools',
                path: '/market/tools',
                description: 'TOOLS',
                iconCss: 'fa fa-fw fa-cubes fa-2x',
                active: undefined,
                hidden: false,
                authenticated: false
            },
            {
                class: 'lexicons',
                path: '/market/lexicons',
                description: 'LEXICONS',
                iconCss: 'fa fa-fw fa-quote-right fa-2x',
                active: undefined,
                hidden: false,
                authenticated: false
            },
            {
                class: 'item',
                path: '/market/item',
                description: 'NAV.ITEM',
                iconCss: 'fa fa-fw fa-cube fa-2x',
                active: undefined,
                hidden: true,
                authenticated: false
            },
            {
                class: 'divider',
                active: undefined,
                authenticated: true
            },
            {
                class: 'information',
                path: '/information',
                hiddenPath: '/information/presentation',
                description: 'NAV.INFORMATION',
                iconCss: 'fa fa-fw fa-info fa-2x',
                active: undefined,
                hidden: true,
                authenticated: false
            },
            {
                class: 'workspaces',
                path: '/workspaces',
                description: 'NAV.MY_WORKSPACES',
                iconCss: 'fa fa-fw fa-cloud fa-2x',
                active: undefined,
                hidden: false,
                authenticated: true
            },
            {
                class: 'processes',
                path: '/processes',
                description: 'NAV.PROCESSES',
                iconCss: 'fa fa-fw fa-tasks fa-2x',
                active: undefined,
                hidden: true,
                authenticated: true
            },
            {
                class: 'tasks',
                path: '/tasks',
                description: 'NAV.TASKS',
                iconCss: 'fa fa-fw fa-bell fa-2x',
                active: undefined,
                hidden: true,
                authenticated: true
            },
            {
                class: 'profile',
                path: '/profile',
                description: 'NAV.PROFILE',
                iconCss: 'fa fa-fw fa-user fa-2x',
                active: undefined,
                hidden: true,
                authenticated: true
            },
            {
                class: 'search',
                path: '/search',
                description: 'NAV.SEARCH',
                iconCss: 'fa fa-fw fa-search fa-2x',
                active: undefined,
                hidden: true,
                authenticated: true
            }
        ];

        // *********************** //
        //           Init          //
        // *********************** //

        function init() {
            var regExp, regExpBis, i, currentPath;
            for (i = 0; i < $rootScope.sideNavElements.length; i++) {
                regExp = new RegExp('^' + $rootScope.sideNavElements[i].path);
                if ($rootScope.sideNavElements[i].otherPath) {
                    regExpBis = new RegExp('^' + $rootScope.sideNavElements[i].otherPath);
                }
                currentPath = $route.current.originalPath;
                if (currentPath.indexOf(':section') !== -1) {
                    currentPath = currentPath.replace(':section', $route.current.params.section);
                }
                if (currentPath.match(regExp) ||
                        (regExpBis && $route.current.originalPath && $route.current.originalPath.match(regExpBis))) {
                    $rootScope.sideNavElements[i].active = 'active';
                    $scope.selectedElement = $rootScope.sideNavElements[i];
                    break;
                }
            }
        }

        init();
    }]);
