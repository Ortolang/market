'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', '$translate', function ($rootScope, $scope, $route, $translate) {

        function sortNavElements() {
            $scope.sortedNavElements = angular.copy($scope.navElements).sort(function (a, b) {
                if (a.active === 'active') {
                    return -100;
                } else if (b.active === 'active') {
                    return 100;
                } else {
                    return 0;
                }
            });
        }

        $scope.select = function (element) {
            angular.forEach($scope.navElements, function (value) {
                value.active = value.class === element.class ? 'active' : undefined;
            });
            sortNavElements();
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

        $rootScope.$on('$translateChangeSuccess', function () {
            initTranslations();
        });

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
                    break;
                }
            }
            sortNavElements();
        }

        function initTranslations() {
            return $translate([
                'NAV.MARKET',
                'NAV.MY_WORKSPACES',
                'NAV.TOOLS',
                'NAV.PROCESSES',
                'NAV.TASKS',
                'NAV.SETTINGS',
                'NAV.PRESENTATION',
                'NAV.DOCUMENTATION',
                'NAV.PROFILE'
            ]).then(function (translations) {
                $scope.translationsMarket = translations['NAV.MARKET'];
                $scope.translationsMyWorkspaces = translations['NAV.MY_WORKSPACES'];
                $scope.translationsTools = translations['NAV.TOOLS'];
                $scope.translationsProcesses = translations['NAV.PROCESSES'];
                $scope.translationsTasks = translations['NAV.TASKS'];
                $scope.translationsSettings = translations['NAV.SETTINGS'];
                $scope.translationPresentation = translations['NAV.PRESENTATION'];
                $scope.translationDocumentation = translations['NAV.DOCUMENTATION'];
                $scope.translationProfile = translations['NAV.PROFILE'];

                $scope.navElements = [
                    {
                        class: 'market',
                        path: '/market',
                        description: $scope.translationsMarket,
                        iconCss: 'fa fa-home fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'presentation',
                        path: '/presentation',
                        description: $scope.translationPresentation,
                        iconCss: 'fa fa-info fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'documentation',
                        path: '/documentation',
                        description: $scope.translationDocumentation,
                        iconCss: 'fa fa-book fa-2x',
                        active: undefined,
                        authenticated: false
                    },
                    {
                        class: 'workspaces',
                        path: '/workspaces',
                        otherPath: '/workspaces',
                        description: $scope.translationsMyWorkspaces,
                        iconCss: 'fa fa-cloud fa-2x',
                        active: undefined,
                        authenticated: true
                    },
                    {
                        class: 'processes',
                        path: '/processes',
                        description: $scope.translationsProcesses,
                        iconCss: 'fa fa-tasks fa-2x',
                        badge: function () {
                            return {
                                value: $rootScope.activeProcessesNbr,
                                class: 'processes'
                            };
                        },
                        active: undefined,
                        hidden: true,
                        authenticated: true
                    },
                    {
                        class: 'tasks',
                        path: '/tasks',
                        description: $scope.translationsTasks,
                        iconCss: 'fa fa-bell fa-2x',
                        badge: function () {
                            return {
                                value: $rootScope.tasks ? $rootScope.tasks.length : 0,
                                class: 'tasks'
                            };
                        },
                        active: undefined,
                        hidden: true,
                        authenticated: true
                    },
                    {
                        class: 'profile',
                        path: '/profile',
                        description: $scope.translationProfile,
                        iconCss: 'fa fa-user fa-2x',
                        active: undefined,
                        authenticated: true
                    }
                ];
                init();
            });
        }

        initTranslations();

    }]);
