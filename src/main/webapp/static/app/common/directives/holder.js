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
            bg: '#475b6e',
            fg: '#FFFFFF',
            fontweight: 'normal',
            nowrap: false
        }).addTheme('ortolangBold', {
            bg: '#008bd0',
            fg: '#FFFFFF',
            fontweight: 'bold',
            nowrap: true
        });
        // 160x160 size 56 / 100x100 size 35 / 180x180 size 63
        Holder.addTheme('custom', {
            bg: '#f8f8f8',
            fg: '#AAAAAA',
            fontweight: 'normal'
        }).addTheme('a', {
            bg: '#45b29d',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('b', {
            bg: '#e27a3f',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('c', {
            bg: '#df5a49',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('d', {
            bg: '#00c0a0',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('e', {
            bg: '#FDDD4E',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('f', {
            bg: '#b683db',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('g', {
            bg: '#AE7DD8',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('h', {
            bg: '#45b29d',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('i', {
            bg: '#f7b900',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('j', {
            bg: '#e27a3f',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('k', {
            bg: '#df5a49',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('l', {
            bg: '#00c0a0',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('m', {
            bg: '#EB8200',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('n', {
            bg: '#FDDD4E',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('o', {
            bg: '#b683db',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('p', {
            bg: '#D49F2C',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('q', {
            bg: '#AE7DD8',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('r', {
            bg: '#5A7FCE',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('s', {
            bg: '#efc94c',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('t', {
            bg: '#41A6D8',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('u', {
            bg: '#f7b900',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('v', {
            bg: '#66839E',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('w', {
            bg: '#5A7FCE',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('x', {
            bg: '#efc94c',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('y', {
            bg: '#41A6D8',
            fg: '#FFFFFF',
            fontweight: 'normal'
        }).addTheme('z', {
            bg: '#45b29d',
            fg: '#FFFFFF',
            fontweight: 'normal'
        });
    });
