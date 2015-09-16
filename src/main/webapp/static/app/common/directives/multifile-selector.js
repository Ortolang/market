'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multifileSelector
 * @description
 * # multifileSelector
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multifileSelector', ['$rootScope', '$modal',  function ($rootScope, $modal) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/multifile-selector-template.html',
            scope: {
                collection: '=',
                model: '=',
                mimeTypes: '=',
                workspace: '='
            },
            link: {
                pre : function (scope) {
                    
                    scope.addFile = function() {
                        var multifileSelectorModalScope = $rootScope.$new(true);

                        multifileSelectorModalScope.$on('modal.hide', function () {
                            multifileSelectorModalScope.$destroy();
                        });

                        multifileSelectorModalScope.acceptMultiple = false;
                        // multifileSelectorModalScope.forceMimeTypes = scope.mimeTypes;
                        multifileSelectorModalScope.forceWorkspace = scope.workspace.key;
                        multifileSelectorModalScope.forceHead = true;
                        multifileSelectorModalScope.fileSelectId = 'multifileSelecterModal';
                        scope.multifileSelecterModal = $modal({scope: multifileSelectorModalScope, title: 'File select', template: 'common/directives/file-select-modal-template.html'});
                    };

                    scope.removeFile = function(index) {
                        scope.model.splice(index, 1);
                    };

                    var deregisterMultifileSelectorModal = $rootScope.$on('browserSelectedElements-multifileSelecterModal', function ($event, elements) {
                        console.log('metadata-form-market-ortolang caught event "browserSelectedElements-multifileSelecterModal" (selected elements: %o)', elements);
                        
                        if(elements.length>0) {
                            if(scope.model.indexOf(elements[0].path) === -1){
                                scope.model.push(elements[0].path);
                            }
                            scope.multifileSelecterModal.hide();
                        }
                    });

                    scope.$on('$destroy', function () {
                        deregisterMultifileSelectorModal();
                    });

                    function init() {

                    }

                    init();
                }
            }
        };
    }]);
