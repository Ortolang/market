'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', ['$scope', '$location', '$routeParams', '$rootScope', '$compile', '$filter', '$window', 'hotkeys', 'DownloadResource', 'WorkspaceElementResource', 'VisualizerManager',
        function ($scope, $location, $routeParams, $rootScope, $compile, $filter, $window, hotkeys, DownloadResource, WorkspaceElementResource, VisualizerManager) {

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function initBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                $scope.breadcrumbDropdownItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
            }

            function buildBreadcrumb() {
                var breadcrumbParts = [], tmp = '';
                angular.forEach($scope.parent.pathParts, function (key) {
                    tmp += '/' + key;
                    breadcrumbParts.push(tmp);
                });
                $scope.breadcrumbParts = breadcrumbParts;
            }

            // *********************** //
            //       Context Menu      //
            // *********************** //

            function clearContextMenuItems() {
                $scope.contextMenuItems = [];
            }

            function activateContextMenu() {
                $scope.isContextMenuActive = true;
            }

            function deactivateContextMenu() {
                $scope.isContextMenuActive = false;
                clearContextMenuItems();
            }

            $scope.contextMenu = function (clickEvent, sameChild) {
                // If right click
                if (clickEvent && clickEvent.button === 2) {
                    var browserToolbarHeight = $('#browser-toolbar').outerHeight(),
                        navbarHeight = $('#main-navbar').outerHeight(),
                        pageWrapperMarginLeft = parseFloat($('#page-wrapper').css('margin-left'));
                    $scope.contextMenuStyle = {
                        position: 'absolute',
                        display: 'block',
                        // Fix dropdown offset because of margin-left on page wrapper
                        left: clickEvent.pageX - pageWrapperMarginLeft + 'px',
                        // Fix dropdown offset because of navbar and toolbar
                        top: clickEvent.pageY - navbarHeight - browserToolbarHeight + 'px'
                    };
                    // If the context menu has already been build no need to do it again
                    if ($scope.isContextMenuActive && sameChild) {
                        return;
                    }
                    clearContextMenuItems();
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                        $scope.contextMenuItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.visualizers) {
                        $scope.contextMenuItems.push({text: 'Preview', icon: 'eye-open', action: 'preview'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
                        $scope.contextMenuItems.push({text: 'Download', icon: 'download', href: $scope.selectedElements[0].downloadUrl});
                    }
                    $scope.contextMenuItems.push({text: 'Delete', icon: 'trash', action: 'delete'});
                    activateContextMenu();
                } else {
                    deactivateContextMenu();
                }
            };

            // *********************** //
            //         Get Data        //
            // *********************** //

            function getParentData(refresh) {
                WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path, root: $routeParams.root},
                    function (element) {
                        $scope.parent = element;
                        // If we just refreshed the data no need to build the breadcrumb again
                        if (!refresh) {
                            buildBreadcrumb();
                            newSelectedElement($scope.parent);
                        }
                        $scope.resizeBrowser();
                    });
            }

            function buildChildDownloadUrl(data) {
                return DownloadResource.getDownloadUrl({wsName: $scope.wsName, path: $scope.parent.path + '/' + data.name});
            }

            function getChildData(child, refresh, clickEvent, isPush) {
                clickEvent = clickEvent || undefined;
                WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path + '/' + child.name, root: $routeParams.root},
                    function (data) {
                        if (!refresh) {
                            data.downloadUrl = buildChildDownloadUrl(data);
                        }
                        child.element = data;
                        if (isPush) {
                            pushSelectedElement(data);
                            clearVisualizers();
                        } else {
                            newSelectedElement(data);
                            checkCompatibleVisualizers(data);
                        }
                        if (!refresh) {
                            $scope.contextMenu(clickEvent, false);
                        }
                    });
            }

            function getChildrenDataOfTypes(mimeTypes, isPreview, visualizer) {
                console.info('Starting to get children data of types', Object.keys(mimeTypes));
                $scope.children = [];
                var completedElements = 0,
                    filteredElements;
                if (mimeTypes) {
                    filteredElements = [];
                    angular.forEach(mimeTypes, function (value, mimeType) {
                        filteredElements = filteredElements.concat($filter('filter')($scope.parent.elements, {mimeType: mimeType}, true));
                    });
                } else {
                    filteredElements = $scope.parent.elements;
                }
                angular.forEach(filteredElements, function (child) {
                    console.info('Requesting data of ' + child.name);
                    WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path + child.name, root: $routeParams.root},
                        function (data) {
                            data.downloadUrl = DownloadResource.getDownloadUrl({wsName: $scope.wsName, path: $scope.parent.path + '/' + data.name});
                            data.selected = $scope.isSelected(data);
                            $scope.children.push(data);
                            console.info('Successfully retrieved data of ' + child.name, data);
                            completedElements += 1;
                            if (isPreview && completedElements === filteredElements.length) {
                                finishPreview(visualizer);
                            }
                        });
                });
            }

            function getAllChildrenData(isPreview, visualizer) {
                getChildrenDataOfTypes(undefined, isPreview, visualizer);
            }

            // *********************** //
            //        Selection        //
            // *********************** //

            $scope.isSelected = function (element) {
                return $filter('filter')($scope.selectedElements, {key: element.key}, true).length === 1;
            };

            $scope.isOnlySelectedElementParent = function () {
                return $scope.selectedElements[0].key === $scope.parent.key;
            };

            $scope.hasOnlyParentSelected = function () {
                return $scope.selectedElements.length === 1 && $scope.selectedElements[0].key === $scope.parent.key;
            };

            $scope.hasOnlyOneElementSelected = function () {
                return $scope.selectedElements.length === 1;
            };

            function deselectChild(child) {
                $scope.selectedElements = $filter('filter')($scope.selectedElements, {key: '!' + child.key}, true);
                if ($scope.hasOnlyOneElementSelected()) {
                    checkCompatibleVisualizers($scope.selectedElements[0]);
                } else if ($scope.selectedElements.length === 0) {
                    newSelectedElement($scope.parent);
                }
            }

            function deselectOthers(element) {
                $scope.selectedElements = $filter('filter')($scope.selectedElements, {key: element.key}, true);
            }

            function deselectChildren() {
                $scope.selectedElements = [$scope.parent];
                deactivateContextMenu();
                clearVisualizers();
            }

            $scope.clickChild = function (clickEvent, child) {
                var modKey = isMacOs ? clickEvent.metaKey : clickEvent.ctrlKey;
                if ($scope.isSelected(child)) {
                    if (modKey) {
                        deselectChild(child);
                        return;
                    }
                    if (clickEvent.button === 0) {
                        if (!$scope.hasOnlyOneElementSelected()) {
                            // Check if the user left-clicked again on the same element
                            if (child.key !== $scope.selectedElements[$scope.selectedElements.length - 1].key) {
                                deselectOthers(child);
                            } else {
                                // If it's the first time do nothing; if it's the second time deselect the others
                                if (isClickedOnce) {
                                    deselectOthers(child);
                                    isClickedOnce = false;
                                } else {
                                    isClickedOnce = true;
                                }
                            }
                        }
                    } else {
                        isClickedOnce = false;
                    }
                    $scope.contextMenu(clickEvent, true);
                    return;
                }
                // Get detailed info on the selected child
                if (modKey && !$scope.hasOnlyParentSelected()) {
                    getChildData(child, false, clickEvent, true);
                } else {
                    getChildData(child, false, clickEvent, false);
                }
            };

            function pushSelectedElement(element) {
                $scope.selectedElements.push(element);
            }

            function newSelectedElement(element) {
                $scope.selectedElements = [element];
            }

            $scope.checkSelection = function (clickEvent) {
                if (!($(clickEvent.target).parent('tr').length || $(clickEvent.target).parent('td').length ||
                    $(clickEvent.target).parents('#context-menu').length || $(clickEvent.target).parents('.btn-toolbar').length)) {
                    deselectChildren();
                }
            };

            $scope.selectedElementsSize = function () {
                var size = 0;
                angular.forEach($scope.selectedElements, function (element) {
                    if (element.type === 'object') {
                        size += element.size;
                    }
                });
                return size;
            };

            // *********************** //
            //         Delete          //
            // *********************** //

            function deleteElements(toBeDeletedElements) {
                if (toBeDeletedElements.length !== 0) {
                    WorkspaceElementResource.delete({wsName: $scope.wsName, path: $scope.parent.path + '/' + toBeDeletedElements.pop().name}, function () {
                        deleteElements(toBeDeletedElements);
                    });
                } else {
                    getParentData(true);
                }
            }

            $scope.clickDelete = function () {
                var toBeDeletedElements = $scope.selectedElements;
                deleteElements(toBeDeletedElements);
                deselectChildren();
            };

            // *********************** //
            //     Add Collection      //
            // *********************** //

            $scope.newCollectionModal = function () {
                // TODO give focus to button
                $('#new-collection-modal').modal('show').find('button.add-collection').focus();
            };

            $scope.addCollection = function () {
                if ($scope.newCollectionName !== undefined) {
                    $('#new-collection-name').parentsUntil('form', '.form-group').removeClass('has-error');
                    var data,
                        path = $scope.parent.path + '/';

                    if ($scope.hasOnlyOneElementSelected() && !$scope.hasOnlyParentSelected() &&
                            $scope.selectedElements[0].type === 'collection') {
                        path += $scope.selectedElements[0].name + '/';
                    }
                    path += $scope.newCollectionName;

                    data = {
                        path: path,
                        type: 'collection'
                    };
                    if ($scope.newCollectionDescription) {
                        data.description = $scope.newCollectionDescription;
                    }
                    WorkspaceElementResource.put({wsName: $routeParams.wsName }, data, function () {
                        getParentData(true);
                        $('#new-collection-modal').modal('hide');
                        $scope.newCollectionName = undefined;
                        $scope.newCollectionDescription = undefined;
                        deactivateContextMenu();
                    });
                } else {
                    $('#new-collection-name').parentsUntil('form', '.form-group').addClass('has-error');
                }
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                getParentData(true);
            });

            // *********************** //
            //        Metadata         //
            // *********************** //

            function getMetadatasOfSelectedElement() {
                return $scope.selectedElements[0].metadatas;
            }

            $rootScope.$on('completeMetadataUpload', function () {
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true);
                } else {
                    getChildData(true);
                }
            });

            $scope.showMetadata = function () {
                $rootScope.$broadcast('metadata-list-show', getMetadatasOfSelectedElement());
            };

            $scope.doAction = function (name) {
                switch (name) {
                case 'newCollection':
                    $scope.newCollectionModal();
                    break;
                case 'delete':
                    $scope.clickDelete();
                    break;
                case 'preview':
                    $scope.clickPreview();
                    break;
                default:
                    break;
                }
            };


            // *********************** //
            //       Visualizers       //
            // *********************** //

            function clearVisualizers() {
                $scope.visualizers = undefined;
            }

            function checkCompatibleVisualizers(element) {
                $scope.visualizers = VisualizerManager.getCompatibleVisualizers(element.mimetype, element.name);
                if ($scope.visualizers.length === 0) {
                    clearVisualizers();
                }
            }

            function finishPreview(visualizer) {
                var element = $compile(visualizer.element)($scope),
                    visualizerModal = $('#visualizer-modal');
                visualizerModal.find('.modal-header strong').text(visualizer.name);
                visualizerModal.find('.modal-body').empty().append(element);
                visualizerModal.modal('show');
                $scope.contextMenu();
            }

            $scope.clickPreview = function (_visualizer_) {
                var visualizer = _visualizer_ || $scope.visualizers[0];
                if (visualizer.needAllChildrenData) {
                    getChildrenDataOfTypes(visualizer.compatibleTypes, true, visualizer);
                } else {
                    finishPreview(visualizer);
                }
            };

            $scope.doubleClickChild = function ($event, child) {
                if (child.type === 'collection') {
                    $location.path('/workspaces/' + $routeParams.wsName + '/' + $routeParams.root +
                        '/' + $routeParams.path + '/' + child.name + '/browse');
                } else {
                    if ($scope.allSuportedMimeTypes[child.mimeType]) {
                        $scope.clickPreview();
                    }
                }
            };

            // *********************** //
            //          Filter         //
            // *********************** //

            $scope.order = function (predicate, reverse) {
                if (predicate !== $scope.orderProp) {
                    reverse = false;
                }
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                $scope.orderProp = predicate;
            };

            $scope.openFilter = function (event) {
                event.stopPropagation();
            };

            angular.element('#filter-query-wrapper').on('hide.bs.dropdown', function () {
                if ($scope.filterQuery !== undefined && $scope.filterQuery.length !== 0) {
                    return false;
                }
            });

            hotkeys.bindTo($scope)
                .add({
                    combo: 'mod+f',
                    description: 'Filter',
                    callback: function (event) {
                        event.preventDefault();
                        var filterWrapper = $('#filter-query-wrapper');
                        filterWrapper.find('button').dropdown('toggle');
                        filterWrapper.find('#filter-input').focus();
                    }
                });

            // *********************** //
            //          Resize         //
            // *********************** //

            $scope.resizeBrowser = function () {
                var topOffset = $('#main-navbar').innerHeight(),
                    height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                    browserToolbarHeight = $('#browser-toolbar').innerHeight();

                height = height - topOffset;
                if (height < 1) {
                    height = 1;
                }
                if (height > topOffset) {
                    if ($rootScope.uploadQueueStatus === 'active') {
                        height -= $('#upload-queue').innerHeight();
                    }
                    $('#browser-sidebar').css('min-height', (height - browserToolbarHeight) + 'px');
                    $('#browser-wrapper').find('.table-wrapper.workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                }
            };

            $(window).bind('resize', function () {
                $scope.resizeBrowser();
            });

            $rootScope.$watch('uploadQueueStatus', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.resizeBrowser();
                }
            });

            // *********************** //
            //           Init          //
            // *********************** //

            var isMacOs, isClickedOnce;

            function initLocalVariables() {
                isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                isClickedOnce = false;
            }

            function initScopeVariables() {
                $scope.wsName = $routeParams.wsName;
                $scope.parent = undefined;
                $scope.children = undefined;
                $scope.selectedElements = [];
                // Breadcrumb
                $scope.breadcrumbParts = undefined;
                $scope.breadcrumbDropdownItems = undefined;
                // Context Menu
                $scope.isContextMenuActive = false;
                $scope.contextMenuItems = undefined;
                // Filter
                $scope.orderProp = ['type', 'name'];
                $scope.dateFormat = 'medium';
                $scope.reverse = false;
                $scope.filterQuery = undefined;
                // Visualizers
                $scope.visualizers = undefined;
                $scope.allSuportedMimeTypes = VisualizerManager.getAllSupportedMimeTypes();
            }

            function init() {
                initLocalVariables();
                initScopeVariables();
                getParentData(false);
                initBreadcrumbDropdownMenu();
            }
            init();

        }]);
