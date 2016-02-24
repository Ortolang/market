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
        // 160x160 size 56 / 100x100 size 35 / 180x180 size 63
        Holder.addTheme('custom', {
            background: '#f8f8f8',
            foreground: '#AAAAAA',
            fontweight: 'normal'
        }).addTheme('a', {
            background: '#45b29d',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('b', {
            background: '#e27a3f',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('c', {
            background: '#df5a49',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('d', {
            background: '#00c0a0',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('e', {
            background: '#FDDD4E',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('f', {
            background: '#b683db',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('g', {
            background: '#AE7DD8',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('i', {
            background: '#f7b900',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('m', {
            background: '#EB8200',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('p', {
            background: '#D49F2C',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('r', {
            background: '#5A7FCE',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('s', {
            background: '#efc94c',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('t', {
            background: '#41A6D8',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('v', {
            background: '#66839E',
            foreground: '#FFFFFF',
            fontweight: 'normal'
        });
    });
