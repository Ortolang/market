'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:holderJs
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('holderJsEditor', ['$translate', function ($translate) {
        var defaultText = $translate.instant('WORKSPACE.HOLDER_EDITOR_MODAL.TEXT');
        return {
            link: function (scope, element, attrs) {
                scope.models.height = scope.models.height || 200;
                scope.models.width = scope.models.width || 200;
                scope.models.text = scope.models.text || defaultText;
                scope.models.size = scope.models.size || 18;
                scope.models.bg = scope.models.bg || '#008bd0';
                scope.models.fg = scope.models.fg || '#FFFFFF';
                scope.models.bold = scope.models.bold || true;

                function generateHolderJs() {
                    Holder.addTheme('holderEditor', {
                        background: scope.models.bg,
                        foreground: scope.models.fg,
                        fontweight: 'normal'
                    });
                    Holder.addTheme('holderEditorBold', {
                        background: scope.models.bg,
                        foreground: scope.models.fg,
                        fontweight: 'bold'
                    });
                    scope.holder = 'holder.js/' + scope.models.height + 'x' + scope.models.width + '?text=' + (scope.models.text || defaultText) + '&size=' + scope.models.size + '&bg=' + scope.models.bg.substr(1) + '&fg=' + scope.models.fg.substr(1) + '&nowrap=true&theme=' + (scope.models.bold ? 'holderEditorBold' : 'holderEditor');
                }

                scope.$watchCollection('models', function () {
                    generateHolderJs();
                });

                generateHolderJs();
            }
        };
    }]);
