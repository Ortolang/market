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
            scope: {
                holderJs: '@'
            },
            link: function (scope, element, attrs) {
                function run() {
                    attrs.$set('data-src', attrs.holderJs);
                    Holder.run({
                        images: element[0]
                    });
                }

                scope.$watch('holderJs', function () {
                    run();
                });
            }
        };
    }).config(function () {
        Holder.addTheme('ortolang', {
            background: '#475b6e',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            nowrap: false
        }).addTheme('ortolangBold', {
            background: '#008bd0',
            foreground: '#FFFFFF',
            fontweight: 'bold',
            nowrap: true
        });

        Holder.addTheme('custom', {
            background: '#f8f8f8',
            foreground: '#AAAAAA',
            fontweight: 'normal',
            size: 56
        }).addTheme('a', {
            background: '#45b29d',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('b', {
            background: '#e27a3f',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('c', {
            background: '#df5a49',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('d', {
            background: '#00c0a0',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('e', {
            background: '#fce064',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('f', {
            background: '#b683db',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('f', {
            background: '#b683db',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('g', {
            background: '#41A6D8',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('p', {
            background: '#e2802f',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('r', {
            background: '#5A7FCE',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('s', {
            background: '#efc94c',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        }).addTheme('m', {
            background: '#EB8200',
            foreground: '#FFFFFF',
            fontweight: 'normal',
            size: 56
        });
    });
