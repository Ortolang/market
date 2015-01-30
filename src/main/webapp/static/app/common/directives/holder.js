'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:holderJs
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('holderJs', function () {
        return {
            link: function (scope, element, attrs) {
                attrs.$set('data-src', attrs.holderJs);
                Holder.addTheme('custom', {
                    background: '#f8f8f8',
                    foreground: '#AAAAAA',
                    fontweight: 'normal',
                    size:56,
                }).addTheme('a', {
                    background: '#45b29d',
                    foreground: '#FFFFFF',
                    fontweight: 'normal',
                    size:56,
                }).addTheme('b', {
                    background: '#e27a3f',
                    foreground: '#FFFFFF',
                    fontweight: 'normal',
                    size:56,
                }).addTheme('c', {
                    background: '#df5a49',
                    foreground: '#FFFFFF',
                    fontweight: 'normal',
                    size:56,
                }).addTheme('s', {
                    background: '#efc94c',
                    foreground: '#FFFFFF',
                    fontweight: 'normal',
                    size:56,
                })
                .run({
                    images: element[0]
                });
            }
        };
    });
