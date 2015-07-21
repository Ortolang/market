'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:formlyFileSelect
 * @description
 * # formlyFileSelect
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('formlyFileSelect', [ '$rootScope', '$modal', '$translate', function ($rootScope, $modal, $translate) {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                model: '=',
                id: '='
            },
            templateUrl: 'common/formly/ortolang-formly-file-select-template.html',
            link: {
                pre : function (scope, element, attrs) {
                    var fileSelectModalScope = $rootScope.$new(true);
                    fileSelectModalScope.acceptMultiple = false;
                    fileSelectModalScope.fileSelectId = scope.id;
                    scope.fileSelectModal = $modal({
                        scope: fileSelectModalScope,
                        title: scope.options.labelProp || $translate.instant('SELECT_WORKSPACE_ELEMENT'),
                        templateUrl: 'common/directives/file-select-modal-template.html',
                        show: false
                    });

                    scope.showModal = function () {
                        scope.fileSelectModal.show();
                    };

                    var unbindListener = $rootScope.$on('browserSelectedElements-' + scope.id, function ($event, elements) {
                        console.log('formlyFileSelect with id "%s" caught event "browserSelectedElements-%s" (selected elements: %o)', scope.id, scope.id, elements);
                        scope.model = elements[0].key;
                        scope.displayedValue = elements[0];
                        scope.fileSelectModal.hide();
                        $event.stopPropagation();
                    });

                    scope.$on('$destroy', function () {
                        unbindListener();
                    });
                }
            }
        };
    }]);
