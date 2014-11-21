'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$rootScope', '$scope', '$route', function ($rootScope, $scope, $route) {

        $scope.navElements = [
            {
                path: '/market',
                description: 'Market',
                iconCss: 'fa fa-home fa-2x',
                active: undefined
            },
            {
                path: '/workspaces',
                otherPath: '/workspaces',
                description: 'Mes espaces',
                iconCss: 'fa fa-cloud fa-2x',
                active: undefined
            },
            {
                path: '/tools',
                description: 'Outils',
                iconCss: 'fa fa-puzzle-piece fa-2x',
                active: undefined
            },
            {
                path: '/processes',
                description: 'Processes',
                iconCss: 'fa fa-tasks fa-2x',
                badge: function () {return $rootScope.activeProcessesNbr; },
                active: undefined
            },
            {
                path: '/settings',
                description: 'Settings',
                iconCss: 'fa fa-cog fa-2x',
                active: undefined
            }
        ];

        $scope.select = function ($event, element) {
            angular.element($event.target).parent().addClass('activated').on('mouseleave', function () {
                angular.element(this).removeClass('activated').off('mouseleave');
            });
            angular.forEach($scope.navElements, function (value) {
                value.active = value === element ? 'active' : undefined;
            });
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
                    break;
                }
            }
        }

        init();

    }]);
