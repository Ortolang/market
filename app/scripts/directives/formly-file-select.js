'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:formlyFileSelect
 * @description
 * # formlyFileSelect
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('formlyFileSelect', [ '$rootScope', '$modal', function ($rootScope, $modal) {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                value: '=',
                id: '='
            },
            templateUrl: '/views/ortolang-formly-file-select-template.html',
            link: {
                pre : function (scope, element, attrs) {
                    var fileSelectModalScope = $rootScope.$new(true);
                    fileSelectModalScope.acceptMultiple = false;
                    fileSelectModalScope.fileSelectId = scope.id;
                    //fileSelectModalScope.forceMimeTypes = 'ortolang/collection';
                    scope.fileSelectModal = $modal({scope: fileSelectModalScope, title: scope.options.label || 'Select workspace element', template: 'views/file-select-modal-template.html', show: false});

                    scope.showModal = function () {
                        scope.fileSelectModal.show();
                    };

                    fileSelectModalScope.$on('browserSelectedElements', function ($event, elements, fileSelectId) {
                        console.log('toto', fileSelectId, scope.id);
                        if (fileSelectId === scope.id) {
                            console.debug('on browserSelectedElements', elements);
                            scope.value = elements[0].key;
                            scope.displayedValue = elements[0];
                            scope.fileSelectModal.hide();
                        }
                    });
                }
            }
        };
    }]);
