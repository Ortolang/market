'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:sideNav
 * @description
 * # sideNav
 */
angular.module('ortolangMarketApp')
    .directive('sideNav', function () {

        function link(scope, element, attrs) {
            scope.navElements = [
                {
                    href: '#/products',
                    description: 'Portail',
                    iconCss: 'fa fa-home fa-2x',
                    active: 'active'
                },
                {
                    href: '#/myspace',
                    description: 'Mon espace',
                    iconCss: 'fa fa-desktop fa-2x',
                    active: undefined
                },
                {
                    href: '#',
                    description: 'Settings',
                    iconCss: 'fa fa-cog fa-2x',
                    active: undefined
                }
            ];

            scope.select = function ($event, element) {
                angular.element($event.target).parent().addClass('activated').on('mouseleave', function () {
                    angular.element(this).removeClass('activated').off('mouseleave');
                });
                angular.forEach(scope.navElements, function (value) {
                    value.active = value === element ? 'active' : undefined;
                });
            };
        }

        return {
            templateUrl: 'views/side-nav.html',
            restrict: 'E',
            link: link
        };
    });
