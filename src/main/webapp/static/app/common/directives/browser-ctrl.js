'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', [
        '$scope',
        '$location',
        '$routeParams',
        '$route',
        '$rootScope',
        '$compile',
        '$filter',
        '$timeout',
        '$window',
        '$q',
        '$translate',
        '$modal',
        'hotkeys',
        'WorkspaceResource',
        'ObjectResource',
        'Download',
        'Runtime',
        'WorkspaceElementResource',
        'VisualizerManager',
        'icons',
        'MarketBrowserService',
        'WorkspaceBrowserService',
        'FileSelectBrowserService',
        function ($scope, $location, $routeParams, $route, $rootScope, $compile, $filter, $timeout, $window, $q, $translate, $modal, hotkeys, WorkspaceResource, ObjectResource, Download, Runtime, WorkspaceElementResource, VisualizerManager, icons, MarketBrowserService, WorkspaceBrowserService, FileSelectBrowserService) {

            var isMacOs, isClickedOnce, viewModeLine, viewModeTile, browseUsingLocation, pageWrapperMarginLeft,
                marketItemHeader, footerHeight, previousFilterNameQuery, previousFilterMimeTypeQuery, previousFilterType,
                previousFilteredChildren, browserToolbarHeight, topNavWrapper, footerWrapper, lastSelectedElement, lastShiftSelectedElement;

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function populateBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                if ($scope.browserService.canAdd && $scope.isHead) {
                    $scope.breadcrumbDropdownItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.browser.plus, action: 'addCollection'});
                    $scope.breadcrumbDropdownItems.push({divider: true});
                    $scope.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                    //$scope.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_FOLDER', icon: icons.browser.upload, action: 'uploadFolder'});
                }
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
                // TODO Context menu could be optimized when clicking on a same child but context menu deactivated
                // If right click
                if (clickEvent && clickEvent.button === 2) {
                    // If the context menu has already been build no need to do it again
                    if (!($scope.isContextMenuActive && sameChild)) {
                        clearContextMenuItems();
                        if ($scope.browserService.canAdd && $scope.isHead && $scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                            $scope.contextMenuItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.browser.plus, action: 'addCollection'});
                            // TODO Support importing files into selected directory
                            if ($scope.hasOnlyParentSelected()) {
                                $scope.contextMenuItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                            }
                            $scope.contextMenuItems.push({divider: true});
                        }
                        if ($scope.browserService.canPreview && $scope.visualizers) {
                            $scope.contextMenuItems.push({text: 'BROWSER.PREVIEW', icon: icons.browser.preview, action: 'preview'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        if ($scope.browserService.canDownload && $scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
                            $scope.contextMenuItems.push({text: 'DOWNLOAD', icon: icons.browser.download, action: 'download'});
                        }
                        if ($scope.browserService.canDelete && $scope.isHead && !$scope.hasOnlyParentSelected()) {
                            $scope.contextMenuItems.push({text: 'BROWSER.DELETE', icon: icons.browser.delete, action: 'delete'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        //$scope.contextMenuItems.push({text: $scope.otherViewMode.text, icon: $scope.otherViewMode.icon, action: 'switchViewMode'});
                        if ($scope.contextMenuItems.length > 0 && $scope.contextMenuItems[$scope.contextMenuItems.length - 1].divider) {
                            $scope.contextMenuItems.pop();
                        }
                        activateContextMenu();
                    }
                    if ($scope.contextMenuItems.length > 0) {
                        if (!marketItemHeader) {
                            marketItemHeader = angular.element('.market-item').find('header').outerHeight();
                        }
                        if (!footerHeight) {
                            footerHeight = angular.element('#footer-wrapper').outerHeight();
                        }
                        $scope.contextMenuStyle = {
                            position: 'absolute',
                            display: 'block',
                            // Fix dropdown offset because of margin-left on page wrapper
                            left: clickEvent.pageX - pageWrapperMarginLeft - 18 + 'px',
                            // Fix dropdown offset because of navbar and toolbar
                            top: clickEvent.pageY - marketItemHeader - browserToolbarHeight - 4 + 'px'
                        };
                    }
                } else {
                    deactivateContextMenu();
                }
            };

            // *********************** //
            //         Get Data        //
            // *********************** //

            function getWorkspaceData() {
                WorkspaceResource.get({wskey: $scope.workspace.key}).$promise.then(function (data) {
                    $scope.workspace = data;
                });
            }

            function finishGetParentData(element, refresh, forceNewSelection) {
                $scope.parent = $scope.browserService.getDataResource === 'object' ? element.object : element;
                // If we just refreshed the data no need to build the breadcrumb again
                if (!refresh) {
                    buildBreadcrumb();
                    populateBreadcrumbDropdownMenu();
                }
                if (!refresh || forceNewSelection) {
                    newSelectedElement($scope.parent);
                }
                clearPreviousFilteringQueries();
                angular.forEach($scope.parent.elements, function (value) {
                    if ($scope.allChildrenMimeTypes.indexOf(value.mimeType) === -1) {
                        $scope.allChildrenMimeTypes.push(value.mimeType);
                    }
                });
                if ($scope.browserService.getDataResource !== 'object') {
                    getWorkspaceData();
                }
            }

            function getParentData(refresh, forceNewSelection) {
                if (refresh === undefined) {
                    refresh = false;
                }
                var config = {oKey: $scope.itemKey, wskey: $scope.wskey, path: $scope.path, root: $scope.root};
                console.log('Getting parent data (refresh: %s, forceNewSelection: %s, config: %o)', refresh, forceNewSelection, config);
                $scope.browserService.getData(config).$promise.then(function (element) {
                    finishGetParentData(element, refresh, forceNewSelection);
                });
            }

            $scope.getChildBrowseUrl = function (child) {
                return $scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root);
            };

            function selectChild(child, push, clickEvent, refresh) {
                clickEvent = clickEvent || undefined;
                var deferred, promise;
                if (push) {
                    deferred = $q.defer();
                    deferred.resolve(child);
                    promise = deferred.promise;
                } else {
                    promise = getChildData(child);
                }
                if (!push || push !== 'shift') {
                    lastShiftSelectedElement = undefined;
                }
                promise.then(function (data) {
                    if ($scope.browserService.getDataResource === 'object') {
                        data = data.object;
                    }
                    if (push) {
                        pushSelectedElement(data);
                        if (push !== 'shift') {
                            lastSelectedElement = data;
                        }
                    } else {
                        newSelectedElement(data);
                        lastSelectedElement = data;
                    }
                    checkCompatibleVisualizers();
                    if (!refresh) {
                        $scope.contextMenu(clickEvent, false);
                    }
                });
            }

            function getChildData(child) {
                return $scope.browserService.getData({
                    oKey: child.key,
                    wskey: $scope.wskey,
                    path: $scope.path + '/' + child.name,
                    root: $scope.root
                }).$promise;
            }

            function getChildrenDataOfTypes(mimeTypes, isPreview, visualizer) {
                console.log('Starting to get children data of types %o', Object.keys(mimeTypes));
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
                    console.log('Requesting data of child %s', child.name);
                    $scope.browserService.getData({oKey: child.key, wskey: $scope.wskey, path: $scope.path + child.name, root: $scope.root})
                        .$promise.then(function (data) {
                            if ($scope.browserService.getDataResource === 'object') {
                                data = data.object;
                            }
                            data.downloadUrl = $scope.browserService.buildChildDownloadUrl(data, $scope.parent, $scope.root);
                            data.selected = $scope.isSelected(data);
                            $scope.children.push(data);
                            console.log('Successfully retrieved data of child %s: %o', child.name, data);
                            completedElements += 1;
                            if (isPreview && completedElements === filteredElements.length) {
                                finishPreview(visualizer);
                            }
                        });
                });
            }

            $scope.refreshSelectedElement = function () {
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true, true);
                } else if ($scope.hasOnlyOneElementSelected()) {
                    selectChild($scope.selectedElements[0]);
                }
            };

            function getSnapshotsHistory() {
                ObjectResource.history({oKey: $scope.workspace.head}, function (data) {
                    $scope.workspaceHistory = data.entries;
                    angular.forEach($scope.workspaceHistory, function (workspaceSnapshot) {
                        workspaceSnapshot.name = getSnapshotNameFromHistory(workspaceSnapshot);
                    });
                });
            }

            function getSnapshotNameFromHistory(workspaceSnapshot) {
                if ($scope.workspace.snapshots) {
                    var filteredSnapshot = $filter('filter')($scope.workspace.snapshots, {key: workspaceSnapshot.key}, true);
                    if (filteredSnapshot.length === 1) {
                        return filteredSnapshot[0].name;
                    }
                }
                return undefined;
            }

            function getWorkspaceMembers() {
                ObjectResource.get({oKey: $scope.workspace.members}, function (data) {
                    $scope.workspaceMembers = data.object;
                });
            }

            $scope.download = function (element) {
                Download.download(element);
            };

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
                return !$scope.selectedElements || ($scope.selectedElements.length === 1 && $scope.selectedElements[0].key === $scope.parent.key);
            };

            $scope.hasOnlyOneElementSelected = function () {
                return $scope.selectedElements && $scope.selectedElements.length === 1;
            };

            $scope.hasOnlyRootCollectionSelected = function () {
                return $scope.hasOnlyParentSelected() && ($scope.path === undefined || $scope.path === '/');
            };

            function deselectChild(child) {
                $scope.selectedElements = $filter('filter')($scope.selectedElements, {key: '!' + child.key}, true);
                if ($scope.selectedElements.length === 0) {
                    newSelectedElement($scope.parent);
                }
                checkCompatibleVisualizers();
            }

            function deselectOthers(child) {
                selectChild(child);
            }

            function deselectChildren() {
                $scope.selectedElements = [$scope.parent];
                deactivateContextMenu();
                clearVisualizers();
            }

            function getChildIndex(child) {
                var i,
                    filteredOrderedChildren = $scope.filteredOrderedChildren();
                for (i = 0; i < filteredOrderedChildren.length; i++) {
                    if (filteredOrderedChildren[i].key === child.key) {
                        return i;
                    }
                }
                return -1;
            }

            $scope.clickChild = function (child, $event) {
                var modKey = isMacOs ? $event.metaKey : $event.ctrlKey;
                if ($scope.isSelected(child) && !$event.shiftKey) {
                    if (modKey) {
                        deselectChild(child);
                    } else if ($event.button === 0) {
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
                    $scope.contextMenu($event, true);
                } else {
                    // Get detailed info on the selected child
                    if (($scope.fileSelectAcceptMultiple || !$scope.browserService.isFileSelect) &&
                            (modKey || $event.shiftKey) && !$scope.hasOnlyParentSelected()) {
                        if (modKey) {
                            selectChild(child, 'mod', $event);
                        } else if ($event.shiftKey) {
                            var lastSelectedElementIndex = getChildIndex(lastSelectedElement),
                                lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : undefined,
                                childIndex = getChildIndex(child),
                                i,
                                j,
                                filteredOrderedChildren = $scope.filteredOrderedChildren(),
                                skip = false;
                            if (lastShiftSelectedElementIndex) {
                                if (childIndex < lastShiftSelectedElementIndex) {
                                    if (childIndex > lastSelectedElementIndex) {
                                        i = childIndex + 1;
                                        j = lastShiftSelectedElementIndex;
                                        skip = true;
                                    } else {
                                        i = lastSelectedElementIndex + 1;
                                        j = lastShiftSelectedElementIndex;
                                    }
                                } else {
                                    if (childIndex < lastSelectedElementIndex) {
                                        i = lastShiftSelectedElementIndex;
                                        j = childIndex - 1;
                                        skip = true;
                                    } else {
                                        i = lastShiftSelectedElementIndex;
                                        j = lastSelectedElementIndex - 1;
                                    }
                                }
                                for (i; i <= j; i++) {
                                    deselectChild(filteredOrderedChildren[i]);
                                }
                            }
                            if (!skip) {
                                if (lastSelectedElementIndex < childIndex) {
                                    i = lastSelectedElementIndex + 1;
                                    j = childIndex;
                                } else {
                                    i = childIndex;
                                    j = lastSelectedElementIndex;
                                }
                                for (i; i <= j; i++) {
                                    if (!$scope.isSelected(filteredOrderedChildren[i])) {
                                        selectChild(filteredOrderedChildren[i], 'shift', $event);
                                    }
                                }
                            }
                            lastShiftSelectedElement = filteredOrderedChildren[childIndex];
                        }
                    } else {
                        selectChild(child, false, $event);
                    }
                }
            };

            function pushSelectedElement(element) {
                $scope.selectedElements.push(element);
            }

            function newSelectedElement(element) {
                $scope.selectedElements = [element];
            }

            $scope.checkSelection = function (clickEvent) {
                if (($scope.workspace || $scope.isMarket()) && !($(clickEvent.target).parent('tr').length || $(clickEvent.target).parent('td').length ||
                    $(clickEvent.target).parent('.browsed-element-child').length ||
                    $(clickEvent.target).parent().parent('.browsed-element-child').length ||
                    $(clickEvent.target).parents('#context-menu').length ||
                    $(clickEvent.target).parents('.btn-toolbar').length)) {
                    deselectChildren();
                    $scope.contextMenu(clickEvent, false);
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

            $scope.collectionSize = function () {
                var size = 0;
                angular.forEach($scope.parent.elements, function (element) {
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
                    WorkspaceElementResource.delete({wskey: $scope.wskey, path: $scope.parent.path + '/' + toBeDeletedElements.pop().name}, function () {
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

            $scope.addCollection = function () {
                if ($scope.browserService.canAdd && $scope.isHead) {
                    var addCollectionModalScope = $rootScope.$new(true),
                        addCollectionModal;
                    addCollectionModalScope.addCollection = function () {
                        var data,
                            path = $scope.parent.path + '/';

                        if ($scope.hasOnlyOneElementSelected() && !$scope.hasOnlyParentSelected() &&
                            $scope.selectedElements[0].type === 'collection') {
                            path += $scope.selectedElements[0].name + '/';
                        }
                        path += addCollectionModalScope.newCollectionName;

                        data = {
                            path: path,
                            type: 'collection'
                        };
                        if (addCollectionModalScope.newCollectionDescription) {
                            data.description = addCollectionModalScope.newCollectionDescription;
                        }
                        WorkspaceElementResource.put({wskey: $scope.wskey }, data, function () {
                            getParentData(true);
                            addCollectionModal.hide();
                            deactivateContextMenu();
                        });
                    };
                    addCollectionModalScope.cancel = function () {
                        addCollectionModal.hide();
                        deactivateContextMenu();
                    };
                    addCollectionModal = $modal({
                        scope: addCollectionModalScope,
                        template: 'workspace/templates/add-collection-modal.html',
                        show: true
                    });
                }
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                console.log('%s caught event "uploaderCompleteItemUpload"', $scope.browserService.getId());
                getParentData(true, $scope.isOnlySelectedElementParent());
            });

            // *********************** //
            //        Metadata         //
            // *********************** //

            //$rootScope.$on('completeMetadataUpload', function () {
            //    console.log('%s caught event "completeMetadataUpload"', $scope.browserService.getId());
            //    if ($scope.hasOnlyParentSelected()) {
            //        getParentData(true);
            //    } else {
            //        getChildData(true);
            //    }
            //});

            $scope.showMetadata = function () {
                $rootScope.$broadcast('metadata-list-show');
            };

            $scope.hasPresentationMetadata = function () {
                return $scope.hasOnlyRootCollectionSelected() && $scope.selectedElements && $scope.selectedElements[0].metadatas.length !== 0;
            };

            $scope.doAction = function (name) {
                switch (name) {
                    case 'download':
                        $scope.download($scope.selectedElements[0]);
                        deactivateContextMenu();
                        break;
                    case 'addCollection':
                        $scope.addCollection();
                        break;
                    case 'delete':
                        $scope.clickDelete();
                        break;
                    case 'preview':
                        $scope.clickPreview();
                        break;
                    case 'uploadFiles':
                        // Using $timeout to prevent '$apply already in progress' error
                        $timeout(function () {
                            angular.element('#object-upload-file-select').click();
                        });
                        break;
                    case 'switchViewMode':
                        $scope.switchViewMode();
                        break;
                    case 'uploadFolder':
                        angular.element('#object-upload-folder-select').click();
                        break;
                    default:
                        break;
                }
            };


            // ***************** //
            //       Tools       //
            // ***************** //

            $scope.showToolsList = function () {
                $rootScope.$broadcast('tools-list-show');
            };


            // *********************** //
            //       Publication       //
            // *********************** //

            $scope.publishWorkspace = function () {
                var publishModalScope = $rootScope.$new(true),
                    publishModal;
                publishModalScope.wsName = $scope.wsName;
                publishModalScope.publish = function () {
                    Runtime.createProcess({
                        'process-type': 'publish-workspace',
                        'process-name': 'Publication of workspace: ' + $scope.wsName + ' (version ' + ($scope.workspace.snapshots.length + 1) + ')',
                        'wskey': $scope.wskey
                    });
                    publishModal.hide();
                };
                publishModal = $modal({
                    scope: publishModalScope,
                    template: 'workspace/templates/publish-modal.html',
                    show: true
                });
            };

            $scope.snapshotWorkspace = function () {
                var snapshotModalScope = $rootScope.$new(true),
                    snapshotModal;
                snapshotModalScope.wsName = $scope.wsName;
                snapshotModalScope.snapshotname = 'Version ' + $scope.workspace.clock;
                snapshotModalScope.snapshot = function () {
                    WorkspaceResource.snapshots({wskey: $scope.wskey}, {snapshotname: snapshotModalScope.snapshotname}, function () {
                        snapshotModal.hide();
                        getSnapshotsHistory();
                    });
                };
                snapshotModal = $modal({
                    scope: snapshotModalScope,
                    template: 'workspace/templates/snapshot-modal.html',
                    show: true
                });
            };


            // *********************** //
            //       Visualizers       //
            // *********************** //

            function clearVisualizers() {
                $scope.visualizers = undefined;
            }

            function checkCompatibleVisualizers() {
                $scope.visualizers = VisualizerManager.getCompatibleVisualizers($scope.selectedElements);
                if ($scope.visualizers.length === 0) {
                    clearVisualizers();
                }
            }

            function finishPreview(visualizer) {
                var isolatedScope = $rootScope.$new();
                if ($scope.children && $scope.children.length !== 0) {
                    isolatedScope.elements = $scope.children;
                } else {
                    isolatedScope.elements = $scope.selectedElements;
                }
                var element = $compile(visualizer.getElement())(isolatedScope),
                    visualizerModal = $('.visualizer-modal');
                visualizerModal.find('.modal-content').empty().append(element);
                visualizerModal.modal('show');
                $scope.contextMenu();
            }

            $scope.clickPreview = function (_visualizer_) {
                if (_visualizer_ || $scope.visualizers) {
                    var visualizer = _visualizer_ || $scope.visualizers[0];
                    if (visualizer.needAllChildrenData) {
                        // TODO Won't work for visualizers accepting multiple
                        if (visualizer.isAcceptingSingle()) {
                            getChildrenDataOfTypes(visualizer.getCompatibleTypes(), true, visualizer);
                        }
                    } else {
                        $scope.children = undefined;
                        finishPreview(visualizer);
                    }
                }
            };

            $scope.browseToPath = function (path) {
                if (!browseUsingLocation || $scope.browserService.isFileSelect) {
                    $scope.path = path;
                    getParentData();
                } else {
                    $location.path($scope.browserService.buildBrowseUrlFromPath($scope.wskey, path, $scope.root));
                }
                clearVisualizers();
            };

            function browseToKey(key, usingHistory) {
                if (!usingHistory) {
                    $scope.keyHistory.back.push($scope.itemKey);
                    $scope.keyHistory.forward = [];
                }
                clearVisualizers();
                $scope.itemKey = key;
                getParentData();
            }

            $scope.goBack = function () {
                // Hide manually to prevent tooltip to stay visible
                angular.element('.tooltip').scope().$parent.$hide();
                $scope.keyHistory.forward.push($scope.itemKey);
                browseToKey($scope.keyHistory.back.pop(), true);
            };

            $scope.goForward = function () {
                angular.element('.tooltip').scope().$parent.$hide();
                $scope.keyHistory.back.push($scope.itemKey);
                browseToKey($scope.keyHistory.forward.pop(), true);
            };

            function browseToChild(child) {
                if ($scope.browserService.getDataResource !== 'object' && (!browseUsingLocation || $scope.browserService.isFileSelect)) {
                    $scope.browseToPath($scope.parent.path + '/' + child.name);
                } else if ($scope.browserService.getDataResource === 'object' && (!browseUsingLocation)) {
                    browseToKey(child.key);
                } else {
                    $location.path($scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root));
                }
            }

            function getSelectedElementsCopy() {
                var selectedElementsCopy = angular.copy($scope.selectedElements),
                    matchingSelectedElements,
                    isForceMimeTypesArray = $scope.forceMimeTypes ? angular.isArray($scope.forceMimeTypes) : undefined;
                if (isForceMimeTypesArray) {
                    matchingSelectedElements = [];
                }
                angular.forEach(selectedElementsCopy, function (element) {
                    element.path = $scope.parent.path + '/' + element.name;
                    if (isForceMimeTypesArray) {
                        var i, mimeTypeRegExp;
                        for (i = 0; i < $scope.forceMimeTypes.length; i++) {
                            mimeTypeRegExp = new RegExp($scope.forceMimeTypes[i], 'gi');
                            if (element.mimeType.match(mimeTypeRegExp)) {
                                matchingSelectedElements.push(element);
                                break;
                            }
                        }
                    }
                });
                if ($scope.forceMimeTypes && !isForceMimeTypesArray) {
                    matchingSelectedElements = $filter('filter')(selectedElementsCopy, {mimeType: $scope.forceMimeTypes}, false)
                }
                return $scope.forceMimeTypes ? matchingSelectedElements : selectedElementsCopy;
            }

            $scope.doubleClickChild = function (child) {
                if (child.type === 'collection') {
                    browseToChild(child);
                } else {
                    if ($scope.browserService.isFileSelect) {
                        var elements = getSelectedElementsCopy();
                        if (elements && elements.length > 0) {
                            $rootScope.$emit('browserSelectedElements-' + $scope.fileSelectId, elements);
                        }
                    } else {
                        if ($scope.visualizers) {
                            $scope.clickPreview();
                        }
                    }
                }
            };

            // *********************** //
            //          Events         //
            // *********************** //

            $rootScope.$on('browserAskSelectedElements', function () {
                console.log('%s caught event "browserAskSelectedElements"', $scope.browserService.getId());
                if ($scope.browserService.isFileSelect) {
                    var elements = getSelectedElementsCopy();
                    if (elements && elements.length > 0) {
                        console.log('%s emit "browserSelectedElements-%s" event', $scope.browserService.getId(), $scope.fileSelectId);
                        $scope.$emit('browserSelectedElements-' + $scope.fileSelectId, elements);
                    }
                }
            });

            $rootScope.$on('browserAskChangeWorkspace', function ($event, workspace) {
                console.log('%s caught event "browserAskChangeWorkspace"', $scope.browserService.getId());
                initWorkspaceVariables(workspace);
                getParentData();
            });

            $rootScope.$on('publishWorkspaceCompleted', function () {
                console.log('%s caught event "publishWorkspaceCompleted"', $scope.browserService.getId());
                getParentData(true);
                getSnapshotsHistory();
            });

            $scope.changeWorkspace = function (workspace) {
                if (!$scope.forceWorkspace && workspace.key !== $scope.wskey) {
                    initWorkspaceVariables(workspace);
                    getParentData();
                }
            };

            $scope.isActiveWorkspace = function (workspace) {
                return $scope.wskey === workspace.key ? 'active' : '';
            };

            $scope.changeRoot = function (snapshot) {
                if ($scope.path === '/') {
                    initWorkspaceVariables(undefined, snapshot.name);
                    getParentData();
                } else {
                    $scope.browserService.getData({wskey: $scope.wskey, root: snapshot.name, path: $scope.path})
                        .$promise.then(function (element) {
                            initWorkspaceVariables(undefined, snapshot.name, $scope.path);
                            finishGetParentData(element);
                        }, function () {
                            initWorkspaceVariables(undefined, snapshot.name);
                            getParentData();
                        });
                }
            };

            $scope.showCheatsheet = function ($event) {
                hotkeys.get('?').callback($event);
            };

            // *********************** //
            //          Filter         //
            // *********************** //

            function clearPreviousFilteringQueries() {
                previousFilterNameQuery = undefined;
                previousFilterMimeTypeQuery = undefined;
                previousFilterType = undefined;
                previousFilteredChildren = {};
            }

            $scope.filterChildren = function (filterNameQuery, filterMimeTypeQuery, type) {
                //console.count('Browser filterChildren');
                return function (child) {
                    if (type && child.type !== type) {
                        return false;
                    }
                    if (!filterNameQuery && !filterMimeTypeQuery) {
                        return true;
                    }
                    var nameRegExp = new RegExp(filterNameQuery, 'gi'),
                        mimeTypeRegExp,
                        matchMimeTypes = false,
                        matchName = !filterNameQuery || filterNameQuery.length < 2 || child.name.match(nameRegExp);
                    if (matchName) {
                        if (child.type === 'collection') {
                            return true;
                        }
                        if (!filterMimeTypeQuery || filterMimeTypeQuery.length < 2) {
                            matchMimeTypes = true;
                        } else {
                            if (angular.isArray(filterMimeTypeQuery)) {
                                var i;
                                for (i = 0; i < filterMimeTypeQuery.length; i++) {
                                    mimeTypeRegExp = new RegExp(filterMimeTypeQuery[i], 'gi');
                                    if (child.mimeType.match(mimeTypeRegExp)) {
                                        matchMimeTypes = true;
                                        break;
                                    }
                                }
                            } else {
                                mimeTypeRegExp = new RegExp(filterMimeTypeQuery, 'gi');
                                matchMimeTypes = child.mimeType.match(mimeTypeRegExp);
                            }
                        }
                        return matchMimeTypes;
                    }
                    return false;
                };
            };

            $scope.filteredOrderedChildren = function () {
                $scope.filteredOrderedChildrenArray = $filter('orderBy')($scope.filteredChildren(), $scope.orderProp, $scope.orderReverse);
                return $scope.filteredOrderedChildrenArray;
            };

            $scope.filteredChildren = function (type) {
                //console.count('Browser filteredChildren');
                if ($scope.parent && $scope.parent.elements) {
                    if ($scope.filterNameQuery === previousFilterNameQuery &&
                        $scope.filterMimeTypeQuery === previousFilterMimeTypeQuery &&
                        type === previousFilterType) {
                        if (type) {
                            return previousFilteredChildren[type] || $scope.parent.elements;
                        }
                        return previousFilteredChildren.noType || $scope.parent.elements;
                    }
                    var filterResult = $filter('filter')($scope.parent.elements, $scope.filterChildren($scope.filterNameQuery, $scope.filterMimeTypeQuery, type), true);
                    if (type) {
                        previousFilteredChildren[type] = filterResult;
                    } else {
                        previousFilteredChildren.noType = filterResult;
                    }
                    previousFilterNameQuery = $scope.filterNameQuery;
                    previousFilterMimeTypeQuery = $scope.filterMimeTypeQuery;
                    previousFilterType = type;
                    return filterResult;
                }
                return [];
            };

            $scope.order = function (predicate, reverse) {
                // If ask to toggle with a different predicate whe force reverse to false (ascending)
                if (reverse === undefined || (reverse === 'toggle' && predicate !== $scope.orderProp)) {
                    reverse = false;
                }
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                $scope.orderProp = predicate;
            };

            $scope.openFilter = function (event) {
                event.stopPropagation();
            };

            angular.element('#filter-query-wrapper').on('hide.bs.dropdown', function () {
                if (($scope.filterNameQuery !== undefined && $scope.filterNameQuery.length !== 0) ||
                    ($scope.filterMimeTypeQuery !== undefined && $scope.filterMimeTypeQuery.length !== 0)) {
                    return false;
                }
            });

            function navigate(down) {
                if (angular.element('.visualizer-modal.in').length === 0 && $scope.isViewModeLine()) {
                    var i;
                    if ($scope.hasOnlyOneElementSelected()) {
                        if ($scope.selectedElements[0].key === $scope.parent.key) {
                            if (down) {
                                selectChild($scope.filteredOrderedChildrenArray[0]);
                            } else {
                                selectChild($scope.filteredOrderedChildrenArray[$scope.filteredOrderedChildrenArray.length - 1]);
                            }
                        } else {
                            for (i = 0; i < $scope.filteredOrderedChildrenArray.length; i++) {
                                if ($scope.filteredOrderedChildrenArray[i].key === $scope.selectedElements[0].key) {
                                    if (down) {
                                        i++;
                                    } else {
                                        i--;
                                    }
                                    break;
                                }
                            }
                            if (i >= 0 && i < $scope.filteredOrderedChildrenArray.length) {
                                selectChild($scope.filteredOrderedChildrenArray[i]);
                            }
                        }
                    } else {
                        var j, k = 0;
                        for (i = 0; i < $scope.filteredOrderedChildrenArray.length; i++) {
                            for (j = 0; j < $scope.selectedElements.length; j++) {
                                if ($scope.filteredOrderedChildrenArray[i].key === $scope.selectedElements[j].key) {
                                    k++;
                                    break;
                                }
                            }
                            if (k === $scope.selectedElements.length) {
                                if (down) {
                                    i++;
                                } else {
                                    i--;
                                }
                                break;
                            }
                        }
                        if (i >= 0) {
                            if (i >= $scope.filteredOrderedChildrenArray.length) {
                                i = $scope.filteredOrderedChildrenArray.length -1;
                            }
                            selectChild($scope.filteredOrderedChildrenArray[i]);
                        }
                    }
                }
            }

            function preventDefault(event) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else { // IE
                    event.returnValue = false;
                }
            }

            function bindHotkeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: 'mod+f',
                        description: $translate.instant('BROWSER.SHORTCUTS.FILTER'),
                        callback: function (event) {
                            preventDefault(event);
                            var filterWrapper = $('#filter-query-wrapper');
                            filterWrapper.find('button').dropdown('toggle');
                            filterWrapper.find('#filter-input').focus();
                        }
                    })
                    .add({
                        combo: 'down',
                        description: $translate.instant('BROWSER.SHORTCUTS.DOWN'),
                        callback: function (event) {
                            preventDefault(event);
                            navigate(true);
                        }
                    })
                    .add({
                        combo: 'up',
                        description: $translate.instant('BROWSER.SHORTCUTS.UP'),
                        callback: function (event) {
                            preventDefault(event);
                            navigate(false);
                        }
                    })
                    .add({
                        combo: 'space',
                        description: $translate.instant('BROWSER.PREVIEW'),
                        callback: function (event) {
                            preventDefault(event);
                            if (angular.element('.visualizer-modal.in').length > 0) {
                                angular.element('.visualizer-modal').modal('hide');
                            } else {
                                $scope.clickPreview();
                            }
                        }
                    }).add({
                        combo: 'mod+v',
                        description: $translate.instant('BROWSER.SHORTCUTS.VIEW_MODE'),
                        callback: function (event) {
                            preventDefault(event);
                            $scope.switchViewMode();
                        }
                    });
                if ($scope.browserService.canAdd) {
                    hotkeys.bindTo($scope).add({
                            combo: 'mod+n',
                            description: $translate.instant('BROWSER.NEW_COLLECTION'),
                            callback: function (event) {
                                preventDefault(event);
                                $scope.addCollection();
                            }
                        });
                }
            }


            // *********************** //
            //     Create Workspace    //
            // *********************** //

            $scope.createWorkspace = function () {
                if ($scope.browserService.canAdd) {
                    var createWorkspaceModalScope = $rootScope.$new(),
                        createWorkspaceModal;
                    createWorkspaceModalScope.createWorkspace = function () {
                        WorkspaceResource.save({name: createWorkspaceModalScope.newWorkspaceName, type: 'user'}, function () {
                            $scope.workspaceList = WorkspaceResource.get();
                            createWorkspaceModal.hide();
                        });
                    };
                    createWorkspaceModal = $modal({
                        scope: createWorkspaceModalScope,
                        template: 'workspace/templates/create-workspace-modal.html',
                        show: true
                    });
                }
            };

            // *********************** //
            //          Resize         //
            // *********************** //

            $scope.resizeBrowser = function () {
                if (!$scope.browserService.isFileSelect) {
                    console.log('Resizing browser');
                    var topOffset = topNavWrapper.outerHeight(),
                        height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                        bottomOffset = footerWrapper.outerHeight();
                    browserToolbarHeight = $('.browser-toolbar').outerHeight();
                    if ($scope.isMarket()) {
                        topOffset += angular.element('.market-item').find('header').outerHeight();
                    }
                    height = height - topOffset - bottomOffset;
                    if (height < 1) {
                        height = 1;
                    }
                    if (height > topOffset) {
                        height -= 1;
                        if ($rootScope.uploadQueueStatus === 'active') {
                            height -= angular.element('.upload-queue').innerHeight();
                        }
                        var browserWrapper = angular.element('#browser-wrapper'),
                            browserAside = angular.element('.browser-aside');
                        browserAside.css('min-height', (height - browserToolbarHeight) + 'px');
                        browserAside.find('.my-workspaces').css('height', (height - browserToolbarHeight - 80) + 'px');
                        browserWrapper.find('.table-wrapper.workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                        browserWrapper.find('.browsed-element-children-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                    }
                }
            };

            angular.element($window).bind('resize', function () {
                $scope.resizeBrowser();
            });

            $rootScope.$watch('uploadQueueStatus', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log('uploadQueueStatus changed (old: %s, new: %s)', oldValue, newValue);
                    $scope.resizeBrowser();
                }
            });

            // *********************** //
            //        View mode        //
            // *********************** //

            function storeViewMode() {
                if (localStorage !== undefined) {
                    localStorage.setItem($scope.browserService.getId(), $scope.viewMode.id);
                }
            }

            function setViewMode(viewMode) {
                if (viewMode === viewModeLine.id) {
                    $scope.viewMode = viewModeLine;
                    $scope.otherViewMode = viewModeTile;
                } else {
                    $scope.viewMode = viewModeTile;
                    $scope.otherViewMode = viewModeLine;
                }
                storeViewMode();
            }

            function initViewMode() {
                var initialViewMode = $scope.browserService.defaultViewMode;
                if (localStorage !== undefined) {
                    var storedViewMode = localStorage.getItem($scope.browserService.getId());
                    if (storedViewMode) {
                        initialViewMode = storedViewMode;
                    }
                }
                setViewMode(initialViewMode);
            }

            $scope.switchViewMode = function () {
                clearPreviousFilteringQueries();
                deactivateContextMenu();
                if ($scope.viewMode === viewModeLine) {
                    setViewMode(viewModeTile.id);
                } else {
                    setViewMode(viewModeLine.id);
                }
            };

            $scope.isViewModeLine = function () {
                return $scope.viewMode === viewModeLine;
            };

            $scope.tileCssClasses = function () {
                if ($scope.browserService.displayAsideInfo) {
                    return 'col-lg-3 col-xlg-14 col-xxlg-15 col-md-4 col-sm-4 col-xs-6';
                }
                return 'col-lg-3 col-xlg-15 col-xxlg-16 col-md-4 col-sm-4 col-xs-6';
            };

            $scope.middleCssClass = function () {
                var columnNumber = 12;
                if ($scope.browserService.displayAsideInfo) {
                    columnNumber -= 3;
                }
                if ($scope.displayAsideWorkspaceList()) {
                    columnNumber -= 2;
                }
                return 'col-md-' + columnNumber;
            };

            $scope.displayAsideWorkspaceList = function () {
                return !$scope.forceWorkspace && $scope.browserService.displayAsideWorkspaceList;
            };

            $scope.isMarket = function () {
                return $scope.browserService === MarketBrowserService;
            };

            // *********************** //
            //           Init          //
            // *********************** //

            function initLocalVariables() {
                viewModeLine = {id: 'line', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'};
                viewModeTile = {id: 'tile', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'};
                browseUsingLocation = false;
                isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                isClickedOnce = false;
                clearPreviousFilteringQueries();
                pageWrapperMarginLeft = parseInt(angular.element('#main-wrapper').css('margin-left'), 10);
                topNavWrapper = angular.element('#top-nav-wrapper');
                footerWrapper = angular.element('#footer-wrapper');
            }

            function initScopeVariables() {
                if ($scope.isFileSelect) {
                    $scope.browserService = FileSelectBrowserService;
                    if ($scope.forceMimeTypes) {
                        $scope.filterMimeTypeQuery = $scope.forceMimeTypes;
                    }
                } else if ($route.current && $route.current.originalPath.match(/\/workspaces/)) {
                    $scope.browserService = WorkspaceBrowserService;
                } else {
                    $scope.browserService = MarketBrowserService;
                }
                console.log('Initializing browser using %s', $scope.browserService.getId());
                bindHotkeys();
                if ($scope.browserService !== MarketBrowserService) {
                    $scope.workspaceList = WorkspaceResource.get();
                }
                $scope.wskey = $routeParams.wskey;
                $scope.root = $routeParams.root;
                $scope.path = $routeParams.path;
                $scope.itemKey = $routeParams.itemKey;
                initViewMode();
                $scope.parent = undefined;
                $scope.children = undefined;
                $scope.allChildrenMimeTypes = [];
                $scope.selectedElements = undefined;
                $scope.icons = icons;
                // Breadcrumb
                $scope.breadcrumbParts = undefined;
                $scope.breadcrumbDropdownItems = [];
                if ($scope.browserService.getDataResource === 'object') {
                    $scope.keyHistory = {
                        back: [],
                        forward: []
                    };
                }
                // Context Menu
                $scope.isContextMenuActive = false;
                $scope.contextMenuItems = [];
                // Filter
                $scope.orderProp = ['type', 'name'];
                $scope.dateFormat = 'short';
                $scope.reverse = false;
                // Visualizers
                $scope.visualizers = undefined;
                // Workspace
                $scope.workspaceHistory = undefined;
                $scope.workspaceMembers = undefined;
            }

            function initWorkspaceVariables(workspace, root, path) {
                if (workspace) {
                    $scope.workspace = workspace;
                }
                $scope.wskey = $scope.workspace.key;
                $scope.wsName = $scope.workspace.name;
                $scope.root = root || 'head';
                $scope.isHead = $scope.root === 'head';
                $scope.path = path || '/';
                getSnapshotsHistory();
                getWorkspaceMembers();
                console.log('Browsing workspace "%s"', $scope.workspace.name);
            }

            function init() {
                initLocalVariables();
                initScopeVariables();
                populateBreadcrumbDropdownMenu();
                if ($scope.wskey || $scope.itemKey) {
                    getParentData();
                } else {
                    $scope.workspaceList.$promise.then(function (data) {
                        if ($scope.forceWorkspace) {
                            var filteredWorkspace = $filter('filter')(data.entries, {key: $scope.forceWorkspace}, true);
                            if (filteredWorkspace.length !== 1) {
                                console.error('No workspace with key "%s" available', $scope.forceWorkspace);
                                return;
                            }
                            $scope.workspace = filteredWorkspace[0];
                        } else {
                            $scope.workspace = data.entries[0];
                        }
                        if ($scope.workspace) {
                            initWorkspaceVariables();
                            getParentData();
                        } else {
                            $scope.resizeBrowser();
                        }
                    });
                }
            }
            init();

        }]);
