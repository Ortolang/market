'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemEditor
 * @description
 * # marketItemEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemEditor', ['$rootScope', '$translate', '$http', '$location', '$window', '$modal', '$anchorScroll', '$filter', 'ortolangType', 'url', 'WorkspaceElementResource', function ($rootScope, $translate, $http, $location, $window, $modal, $anchorScroll, $filter, ortolangType, url, WorkspaceElementResource) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/market-item-editor.html',
            scope: {
                metadata: '=',
                workspace: '=',
                root: '=',
                togglePreviewing: '&',
                toggleEditing: '&',
                toggleCreating: '&',
                step: '='
            },
            link: {
                pre: function (scope) {

                    scope.submitForm = function () {
                        console.log('submit form');

                        if (scope.metadataItemform.$invalid) {
                            console.log('not ready');
                            return;
                        }

                        for(var propertyName in scope.metadata) {
                            if(scope.metadata[propertyName].length===0) {
                                delete scope.metadata[propertyName];
                            }
                        }

                        var content = angular.toJson(scope.metadata),
                            contentType = 'text/json';

                        sendForm(content, contentType);
                    };


                    function sendForm(content, contentType) {

                        var uploadUrl = url.api + '/workspaces/' + (scope.selectedElements ? scope.selectedElements[0].workspace : scope.workspace.key) + '/elements/',
                            fd = new FormData(),
                            currentPath = scope.selectedElements ? scope.selectedElements[0].path : '/';

                        fd.append('path', currentPath);
                        fd.append('type', ortolangType.metadata);

                        // fd.append('format', scope.userMetadataFormat.key);
                        fd.append('name', 'ortolang-item-json');

                        var blob = new Blob([content], { type: contentType});

                        fd.append('stream', blob);

                        $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function () {

                            console.log('submit form success');
                            // scope.hideEditor();
                            // resetMetadataFormat();
                            // scope.refreshSelectedElement();
                            if(scope.step) {
                                scope.toggleCreating();
                                scope.togglePreviewing();
                            } else {
                                scope.toggleEditing();
                            }

                        })
                        .error(function (error) {
                            console.error('creation of metadata failed !', error);
                            // scope.hideEditor();
                            // resetMetadataFormat();
                        });
                    }

                    scope.selectType = function () {
                        scope.metadata.type = scope.selectedType.key;
                    };

                    scope.selectStatusOfUse = function () {
                        scope.metadata.statusOfUse = scope.selectedStatusOfUse.key;
                    };

                    scope.nextStep = function() {
                        if(scope.stepCurrent==='basic_info') {
                            scope.stepBasicInfoSuccess = stepBasicInfoSuccess();
                            if(scope.stepBasicInfoSuccess) {
                                scope.stepCurrent = 'whos_involved';
                            }
                        } else if(scope.stepCurrent==='whos_involved') {
                            scope.stepWhosInvolvedSuccess = stepWhosInvolvedSuccess();
                            if(scope.stepWhosInvolvedSuccess) {
                                scope.stepCurrent = 'describe';
                            }
                        } else if(scope.stepCurrent==='describe') {
                            scope.stepDescribeSuccess = stepDescribeSuccess();
                            if(scope.stepDescribeSuccess) {
                                scope.stepCurrent = 'licence';
                                scope.scrolltoHref('licence');
                            }
                        } else if(scope.stepCurrent==='licence') {
                            scope.stepLicenceSuccess = stepLicenceSuccess();
                            if(scope.stepLicenceSuccess) {
                                // scope.stepCurrent = 'licence';
                                scope.submitForm();
                            }
                        }
                    };

                    function stepBasicInfoSuccess() {
                        if(scope.metadataItemform.type.$valid && scope.metadataItemform.title.$valid && scope.metadataItemform.langtitle.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.type.$dirty = true;
                            scope.metadataItemform.title.$dirty = true;
                            return false;
                        }
                    }

                    function stepWhosInvolvedSuccess() {
                        if(scope.metadata.contributors.length>0) {
                            return true;
                        }
                        return false;
                    }

                    function stepDescribeSuccess() {
                        if(scope.metadataItemform.description.$valid && scope.metadataItemform.langdescription.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.description.$dirty = true;
                            return false;
                        }
                    }

                    function stepLicenceSuccess() {
                        if(scope.metadataItemform.statusOfUse.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.statusOfUse.$dirty = true;
                            return false;
                        }
                    }

                    var deregisterFileLicenceSelectModal = $rootScope.$on('browserSelectedElements-fileLicenceSelectModal', function ($event, elements) {
                        console.log('metadata-form-market-ortolang caught event "browserSelectedElements-fileLicenceSelectModal" (selected elements: %o)', elements);
                        
                        scope.metadata.license = elements[0].path;
                        scope.license = elements[0];
                        scope.fileLicenceSelectModal.hide();
                    });

                    scope.$on('$destroy', function () {
                        deregisterFileLicenceSelectModal();
                    });


                    // ScrollSpy //

                    scope.scrolltoHref = function (id) {
                        // set the location.hash to the id of
                        // the element you wish to scroll to.
                        $location.hash(id);
                        // call $anchorScroll()
                        $anchorScroll();
                    };

                    // *********************** //
                    //          Resize         //
                    // *********************** //

                    scope.resizeMetadataItemEditor = function () {
                        var topNavWrapper = angular.element('#top-nav-wrapper'),
                            footerWrapper = angular.element('#footer-wrapper'),
                            topOffset = topNavWrapper.outerHeight(),
                            height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                            bottomOffset = footerWrapper.outerHeight(),
                            browserToolbarHeight = angular.element('#metadata-item-editor-toolbar').innerHeight();

                        height = height - topOffset - bottomOffset;
                        if (height < 1) {
                            height = 1;
                        }
                        if (height > topOffset) {
                            height -= 1;

                        var editorWrapper = angular.element('.metadata-item-editor'),
                            editorAside = angular.element('.editor-aside'),
                            editorStepHeight = angular.element('.metadata-editor-progress-bar').innerHeight();

                        editorAside.css('min-height', (height - browserToolbarHeight) + 'px');
                        editorWrapper.find('.editor-pane').css('height', (height - browserToolbarHeight - editorStepHeight) + 'px');
                        }
                    };

                    angular.element($window).bind('resize', function () {
                        scope.resizeMetadataItemEditor();
                    });

                    function init() {
                        if(!angular.isDefined(scope.metadata)) {
                            scope.metadata = {schema: 'http://www.ortolang.fr/schema/012#', contributors:[]};
                        }

                        scope.itemTypes = [ 
                            { 
                                key:'Corpus', 
                                value: $translate.instant('MARKET.ITEM_TYPE.CORPORA') 
                            },
                            { 
                                key:'Lexique', 
                                value: $translate.instant('MARKET.ITEM_TYPE.LEXICON') 
                            },
                            { 
                                key:'Outil', 
                                value: $translate.instant('MARKET.ITEM_TYPE.TOOL') 
                            },
                            { 
                                key:'Application', 
                                value: $translate.instant('MARKET.ITEM_TYPE.INTEGRATED_PROJECT') 
                            }
                        ];
                        if(angular.isDefined(scope.metadata.type)) {

                            var typeFound = $filter('filter')(scope.itemTypes, {key:scope.metadata.type});
                            if(typeFound.length>0) {
                                scope.selectedType = typeFound[0];
                            }
                        }

                        scope.allStatusOfUse = [ 
                            { 
                                key:'Libre', 
                                value: 'Libre'
                            },
                            { 
                                key:'Libre sans utilisation commerciale', 
                                value: 'Libre sans utilisation commerciale' 
                            },
                            { 
                                key:'Libre pour l’enseignement supérieur et la recherche', 
                                value: 'Libre pour l’enseignement supérieur et la recherche'
                            },
                            { 
                                key:'Négociation nécessaire', 
                                value: 'Négociation nécessaire' 
                            }
                        ];
                        if(angular.isDefined(scope.metadata.statusOfUse)) {

                            var statusOfUseFound = $filter('filter')(scope.allStatusOfUse, {key:scope.metadata.statusOfUse});
                            if(statusOfUseFound.length>0) {
                                scope.selectedStatusOfUse = statusOfUseFound[0];
                            }
                        }

                        var fileLicenceSelectModalScope = $rootScope.$new(true);
                        fileLicenceSelectModalScope.acceptMultiple = false;
                        fileLicenceSelectModalScope.forceMimeTypes = ['ortolang/collection', 'text'];
                        fileLicenceSelectModalScope.forceWorkspace = scope.workspace.key;
                        fileLicenceSelectModalScope.forceHead = true;
                        fileLicenceSelectModalScope.fileSelectId = 'fileLicenceSelectModal';
                        scope.fileLicenceSelectModal = $modal({scope: fileLicenceSelectModalScope, title: 'File select', template: 'common/directives/file-select-modal-template.html', show: false});

                        if(angular.isDefined(scope.metadata.license)) {

                            WorkspaceElementResource.get({path: scope.metadata.license, wskey: scope.workspace.key, root: scope.root}).$promise.then(function (data) {
                                scope.license = data;
                            });
                        }

                        scope.stepCurrent = 'basic_info';
                        scope.stepBasicInfoSuccess = false;
                        scope.stepWhosInvolvedSuccess = false;
                        scope.stepDescribeSuccess = false;
                        scope.stepLicenceSuccess = false;
                    }
                    init();
                }
            }
        };
    }]);