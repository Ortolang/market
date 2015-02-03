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

        $scope.select = function (element) {
            $scope.selectedElementCopy = element;
            angular.forEach($scope.navElements, function (value) {
                if (value.class === element.class) {
                    value.active =  'active';
                    if (value.hidden) {
                        $scope.selectedElement = value;
                    } else {
                        var clickedElement = $('.side-nav').find('.' + element.class).parent(),
                            copy = angular.element('.side-nav-active-item.copy'),
                            real = angular.element('#side-nav-active-item');
                        $rootScope.navPosition = clickedElement.position().top;
                        real.addClass('animated');
                        $animate.removeClass(copy, 'ng-hide').then(function () {
                            $scope.$apply(function () {
                                $scope.selectedElement = value;
                                real.removeClass('animated');
                                copy.addClass('ng-hide');
                            });
                        });
                    }
                } else {
                    value.active =  undefined;
                }
            });
        };

        $rootScope.selectTasks = function () {
            $scope.select({class: 'tasks'});
        };

        $rootScope.selectProcesses = function () {
            $scope.select({class: 'processes'});
        };

        $rootScope.selectHome = function () {
            $scope.select({class: 'market'});
        };

        $rootScope.selectProfile = function () {
            $scope.select({class: 'profile'});
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
            var regExp, regExpBis, i;
            for (i = 0; i < $scope.navElements.length; i++) {
                regExp = new RegExp('^' + $scope.navElements[i].path);
                if ($scope.navElements[i].otherPath) {
                    regExpBis = new RegExp('^' + $scope.navElements[i].otherPath);
                }
                if ($route.current.originalPath.match(regExp) ||
                        (regExpBis && $route.current.originalPath && $route.current.originalPath.match(regExpBis))) {
                    $scope.navElements[i].active = 'active';
                    $scope.selectedElement = $scope.navElements[i];
                    break;
                }
            }
        }

        function initTranslations() {
            return $translate([
                'NAV.MARKET',
                'NAV.CORPUS',
                'NAV.INTEGRATED_PROJECTS',
                'NAV.MY_WORKSPACES',
                'NAV.TOOLS',
                'NAV.LEXICONS',
                'NAV.PROCESSES',
                'NAV.TASKS',
                'NAV.SETTINGS',
                'NAV.INFORMATION',
                'NAV.PROFILE'
            ]).then(function (translations) {
                $scope.translationsMarket = translations['NAV.MARKET'];
                $scope.translationsCorpus = translations['NAV.CORPUS'];
                $scope.translationsIntegratedProjects = translations['NAV.INTEGRATED_PROJECTS'];
                $scope.translationsMyWorkspaces = translations['NAV.MY_WORKSPACES'];
                $scope.translationsTools = translations['NAV.TOOLS'];
                $scope.translationsLexicons = translations['NAV.LEXICONS'];
                $scope.translationsProcesses = translations['NAV.PROCESSES'];
                $scope.translationsTasks = translations['NAV.TASKS'];
                $scope.translationsSettings = translations['NAV.SETTINGS'];
                $scope.translationInformation = translations['NAV.INFORMATION'];
                $scope.translationProfile = translations['NAV.PROFILE'];

                $scope.navElements = [
                    {
                        class: 'market',
                        path: '/market?section=news',
                        description: $scope.translationsMarket,
                        iconCss: 'fa fa-fw fa-home fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'corpus',
                        path: '/market?section=corpus',
                        description: $scope.translationsCorpus,
                        iconCss: 'fa fa-fw fa-book fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'integrated-projects',
                        path: '/market?section=websites',
                        description: $scope.translationsIntegratedProjects,
                        iconCss: 'fa fa-fw fa-briefcase fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'tools',
                        path: '/market?section=tools',
                        description: $scope.translationsTools,
                        iconCss: 'fa fa-fw fa-cubes fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'lexicons',
                        path: '/market?section=lexicons',
                        description: $scope.translationsLexicons,
                        iconCss: 'fa fa-fw fa-quote-right fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'divider',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'presentation',
                        path: '/information',
                        description: $scope.translationInformation,
                        iconCss: 'fa fa-fw fa-info fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'workspaces',
                        path: '/workspaces',
                        otherPath: '/workspaces',
                        description: $scope.translationsMyWorkspaces,
                        iconCss: 'fa fa-fw fa-cloud fa-2x',
                        active: undefined,
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
