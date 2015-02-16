'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', '$animate', '$timeout', function ($rootScope, $scope, $route, $translate, $animate, $timeout) {

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

        $rootScope.$on('$translateChangeSuccess', function () {
            initTranslations();
        });

        $scope.getCssClass = function (element) {
            return (element.active ? 'active ' : '') + (element.class === 'divider' ? 'divider' : '');
        };

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

        function initTranslations() {
            return $translate([
                'NAV.HOME',
                'NAV.MARKET',
                'NAV.CORPUS',
                'NAV.INTEGRATED_PROJECTS',
                'NAV.MY_WORKSPACES',
                'NAV.TOOLS',
                'NAV.LEXICONS',
                'NAV.ITEM',
                'NAV.PROCESSES',
                'NAV.TASKS',
                'NAV.SETTINGS',
                'NAV.INFORMATION',
                'NAV.PROFILE'
            ]).then(function (translations) {
                $scope.translationsHome = translations['NAV.HOME'];
                $scope.translationsMarket = translations['NAV.MARKET'];
                $scope.translationsCorpus = translations['NAV.CORPUS'];
                $scope.translationsIntegratedProjects = translations['NAV.INTEGRATED_PROJECTS'];
                $scope.translationsMyWorkspaces = translations['NAV.MY_WORKSPACES'];
                $scope.translationsTools = translations['NAV.TOOLS'];
                $scope.translationsLexicons = translations['NAV.LEXICONS'];
                $scope.translationsItem = translations['NAV.ITEM'];
                $scope.translationsProcesses = translations['NAV.PROCESSES'];
                $scope.translationsTasks = translations['NAV.TASKS'];
                $scope.translationsSettings = translations['NAV.SETTINGS'];
                $scope.translationInformation = translations['NAV.INFORMATION'];
                $scope.translationProfile = translations['NAV.PROFILE'];

                $rootScope.sideNavElements = [
                    {
                        class: 'market',
                        path: '/market/news',
                        description: $scope.translationsHome,
                        iconCss: 'fa fa-fw fa-home fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: false
                    },
                    {
                        class: 'corpus',
                        path: '/market/corpus',
                        description: $scope.translationsCorpus,
                        iconCss: 'fa fa-fw fa-book fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: false
                    },
                    {
                        class: 'integrated-projects',
                        path: '/market/websites',
                        description: $scope.translationsIntegratedProjects,
                        iconCss: 'fa fa-fw fa-briefcase fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: false
                    },
                    {
                        class: 'tools',
                        path: '/market/tools',
                        description: $scope.translationsTools,
                        iconCss: 'fa fa-fw fa-cubes fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: false
                    },
                    {
                        class: 'lexicons',
                        path: '/market/lexicons',
                        description: $scope.translationsLexicons,
                        iconCss: 'fa fa-fw fa-quote-right fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: false
                    },
                    {
                        class: 'item',
                        path: '/market/item',
                        description: $scope.translationsItem,
                        iconCss: 'fa fa-fw fa-cube fa-2x',
                        active: undefined,
                        hidden: true,
                        authenticated: false
                    },
                    {
                        class: 'divider',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'information',
                        path: '/information',
                        hiddenPath: '/information/presentation',
                        description: $scope.translationInformation,
                        iconCss: 'fa fa-fw fa-info fa-2x',
                        active: undefined,
                        hidden: true,
                        authenticated: false
                    },
                    {
                        class: 'workspaces',
                        path: '/workspaces',
                        description: $scope.translationsMyWorkspaces,
                        iconCss: 'fa fa-fw fa-cloud fa-2x',
                        active: undefined,
                        hidden: false,
                        authenticated: true
                    },
                    {
                        class: 'processes',
                        path: '/processes',
                        description: $scope.translationsProcesses,
                        iconCss: 'fa fa-fw fa-tasks fa-2x',
                        active: undefined,
                        hidden: true,
                        authenticated: true
                    },
                    {
                        class: 'tasks',
                        path: '/tasks',
                        description: $scope.translationsTasks,
                        iconCss: 'fa fa-fw fa-bell fa-2x',
                        active: undefined,
                        hidden: true,
                        authenticated: true
                    },
                    {
                        class: 'profile',
                        path: '/profile',
                        description: $scope.translationProfile,
                        iconCss: 'fa fa-fw fa-user fa-2x',
                        active: undefined,
                        hidden: true,
                        authenticated: true
                    }
                ];
                init();
            });
        }

        initTranslations();

    }]);
