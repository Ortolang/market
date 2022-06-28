'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:parts
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('parts', ['$rootScope', '$translate', 'Helper', 'Content', 'icons', 'WorkspaceMetadataService', function ($rootScope, $translate, Helper, Content, icons, WorkspaceMetadataService) {
        return {
            restrict: 'EA',
            scope: {
                model: '=',
                wsalias: '=',
                snapshotName: '=',
                clickAction: '=',
                deleteAction: '=',
                showTitle: '='
            },
            templateUrl: 'common/directives/parts-template.html',
            link: function(scope) {
                function loadParts (parts, lang) {
                    scope.models.parts = [];
                    angular.forEach(parts, function (part) {
                        var imageUrl = null;
                        if (part.image) {
                            imageUrl = Content.getThumbUrlWithPath(part.image, scope.wsalias, scope.snapshotName, 100, true);
                        }
                        scope.models.parts.push({
                            title: Helper.getMultilingualValue(part.title, lang),
                            description: Helper.getMultilingualValue(part.description, lang),
                            path: part.path,
                            imageUrl: imageUrl,
                            part: part
                        });
                    });
                }
                function init () {
                    scope.models = {};
                    scope.partViewMode = 1;
                    scope.icons = icons;
                    scope.WorkspaceMetadataService = WorkspaceMetadataService;
                }
                init();

                scope.changePartViewMode = function (mode) {
                    scope.partViewMode = mode;
                };

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
