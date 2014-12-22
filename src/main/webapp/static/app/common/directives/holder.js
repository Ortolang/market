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
                attrs.$set('data-src', attrs['holderJs']);
                Holder.addTheme('custom', {
                    background: '#f8f8f8',
                    foreground: '#AAAAAA',
                    fontweight: 'normal'
                }).run({
                    images: element[0]
                });
            }
        };
    });
