'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:parts
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('parts', ['$rootScope', '$translate', 'Helper', function ($rootScope, $translate, Helper) {
        return {
            restrict: 'EA',
            scope: {
                model: '=',
                clickAction: '='
            },
            templateUrl: 'common/directives/parts-template.html',
            link: function(scope) {
                function loadParts (parts, lang) {
                    scope.models.parts = [];
                    angular.forEach(parts, function (part) {
                        scope.models.parts.push({
                            title: Helper.getMultilingualValue(part.title, lang),
                            description: Helper.getMultilingualValue(part.description, lang),
                            part: part
                        });
                    });
                }
                function init () {
                    scope.models = {};
                }
                init();

                $rootScope.$on('$translateChangeSuccess', function () {
                    if (scope.model) {
                        loadParts(scope.model, $translate.use());
                    }
                });

                scope.$watchCollection('model', function (newValue) {
                    if (newValue) {
                        loadParts(newValue);
                    }
                });

            }
        };
    }]);
