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
                back: '&',
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
                            scope.back();

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
                            //TODO show error if there is
                            scope.submitForm();
                            var success = stepBasicInfoSuccess();
                            scope.stepBasicInfoSuccess = success;
                            if(success) {
                                scope.stepCurrent = 'whos_involved';
                            }
                        } else if(scope.stepCurrent==='whos_involved') {
                            var success = stepWhosInvolvedSuccess();
                            scope.stepWhosInvolvedSuccess = success;
                            if(success) {
                                scope.stepCurrent = 'describe';
                            }
                        }
                    };

                    function stepBasicInfoSuccess() {
                        if(scope.metadataItemform.type.$valid && scope.metadataItemform.title.$valid && scope.metadataItemform.langtitle.$valid) {
                            return true;
                        }
                        return false;
                    }

                    function stepWhosInvolvedSuccess() {
                        if(scope.metadata.contributors.length>0) {
                            return true;
                        }
                        return false;
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
                        // if (!$scope.isFileSelectBrowserService) {
                
                            var topNavWrapper = angular.element('#top-nav-wrapper'),
                                footerWrapper = angular.element('#footer-wrapper'),
                                topOffset = topNavWrapper.outerHeight(),
                                height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                                bottomOffset = footerWrapper.outerHeight();
                            var browserToolbarHeight = angular.element('.browser-toolbar').innerHeight();
                        //     if ($scope.isMarketBrowserService) {
                        //         topOffset += angular.element('.market-item').find('header').outerHeight();
                        //         height -= 1;
                        //     }
                            height = height - topOffset - bottomOffset;
                            if (height < 1) {
                                height = 1;
                            }
                            if (height > topOffset) {
                                height -= 1;
                        //         if ($rootScope.uploader && $rootScope.uploader.uploadQueueStatus === 'active') {
                        //             height -= angular.element('.upload-queue').innerHeight();
                        //         }
                                var editorWrapper = angular.element('.metadata-item-editor'),
                                    editorAside = angular.element('.editor-aside'),
                                    editorStepHeight = angular.element('.metadata-editor-progress-bar').innerHeight();
                                editorAside.css('min-height', (height - browserToolbarHeight) + 'px');
                                // editorAside.find('.my-workspaces').css('height', (height - browserToolbarHeight - 80) + 'px');
                                editorWrapper.find('.editor-pane').css('height', (height - browserToolbarHeight - editorStepHeight) + 'px');
                                // editorWrapper.find('.tile-workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                                // editorWrapper.find('.browser-aside-left-collapsed').css('height', (height - browserToolbarHeight) + 'px');
                            }
                        //     $scope.isScreenMd = window.innerWidth < 992;
                        //     $scope.browserSettings.hideWorkspaceListMdScreen = $scope.isScreenMd;
                        //     $scope.$applyAsync();
                        // }
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