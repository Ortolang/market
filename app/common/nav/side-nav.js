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

        $scope.select = function ($event, element) {
            angular.element($event.target).parent().addClass('activated').on('mouseleave', function () {
                angular.element(this).removeClass('activated').off('mouseleave');
            });
            angular.forEach($scope.navElements, function (value) {
                value.active = value === element ? 'active' : undefined;
            });
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
        }

        function initTranslations() {
            return $translate([
                'NAV.MARKET',
                'NAV.MY_WORKSPACES',
                'NAV.TOOLS',
                'NAV.PROCESSES',
                'NAV.SETTINGS'
            ]).then(function (translations) {
                $scope.translationsMarket = translations['NAV.MARKET'];
                $scope.translationsMyWorkspaces = translations['NAV.MY_WORKSPACES'];
                $scope.translationsTools = translations['NAV.TOOLS'];
                $scope.translationsProcesses = translations['NAV.PROCESSES'];
                $scope.translationsSettings = translations['NAV.SETTINGS'];

                $scope.navElements = [
                    {
                        path: '/market',
                        description: $scope.translationsMarket,
                        iconCss: 'fa fa-home fa-2x',
                        active: undefined
                    },
                    {
                        path: '/workspaces',
                        otherPath: '/workspaces',
                        description: $scope.translationsMyWorkspaces,
                        iconCss: 'fa fa-cloud fa-2x',
                        active: undefined
                    },
                    {
                        path: '/tools',
                        description: $scope.translationsTools,
                        iconCss: 'fa fa-puzzle-piece fa-2x',
                        active: undefined
                    },
                    {
                        path: '/processes',
                        description: $scope.translationsProcesses,
                        iconCss: 'fa fa-tasks fa-2x',
                        badge: function () {return $rootScope.activeProcessesNbr; },
                        active: undefined
                    },
                    {
                        path: '/settings',
                        description: $scope.translationsSettings,
                        iconCss: 'fa fa-cog fa-2x',
                        active: undefined
                    }
                ];
                init();
            });
        }

        initTranslations();

    }]);
