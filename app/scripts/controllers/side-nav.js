'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SideNavCtrl
 * @description
 * # SideNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SideNavCtrl', [ '$scope', '$route', function ($scope, $route) {

        function workspaceSubElements() {
            return [
                { description: 'System', path: '/workspaces/system/head///browse'},
                { description: 'System', path: '/workspaces/system/head///browse'}
            ];
        }

        $scope.navElements = [
            {
                path: '/products',
                description: 'Portail',
                iconCss: 'fa fa-home fa-2x',
                active: undefined
            },
            {
                path: '/market',
                description: 'Market',
                iconCss: 'fa fa-tree fa-2x',
                active: undefined
            },
            {
                path: '/myspace',
                otherPath: '/workspaces',
                description: 'Mes espaces',
                iconCss: 'fa fa-cloud fa-2x',
                active: undefined
                //subElements: workspaceSubElements()
            },
            {
                path: '/tools',
                description: 'Outils',
                iconCss: 'fa fa-puzzle-piece fa-2x',
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
