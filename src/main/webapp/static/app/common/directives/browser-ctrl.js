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
        'AuthService',
        'WorkspaceElementResource',
        'VisualizerManager',
        'icons',
        'MarketBrowserService',
        'WorkspaceBrowserService',
        'FileSelectBrowserService',
        'MetadataFormatResource',
        function ($scope, $location, $routeParams, $route, $rootScope, $compile, $filter, $timeout, $window, $q, $translate, $modal, hotkeys, WorkspaceResource, ObjectResource, Download, Runtime, AuthService, WorkspaceElementResource, VisualizerManager, icons, MarketBrowserService, WorkspaceBrowserService, FileSelectBrowserService, MetadataFormatResource) {

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
                        if ($scope.browserService.canAdd && $scope.isHead && $scope.selectedElements.length === 1 && $scope.isCollection($scope.selectedElements[0])) {
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
                        $scope.contextMenuItems.push({text: $scope.settings.viewMode.text, icon: $scope.settings.viewMode.icon, action: 'switchViewMode'});
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
                        $scope.allChildrenMimeTypes.push({value: value.mimeType, label: '<span class="' + $filter('mimeTypeIconCss')(value.mimeType) + '"></span>&nbsp; ' + value.mimeType});
                    }
                });
                //if ($scope.browserService.getDataResource !== 'object') {
                //    getWorkspaceData();
                //}
            }

            function getParentData(refresh, forceNewSelection) {
                if (refresh === undefined) {
                    refresh = false;
                }
                var config = {oKey: $scope.itemKey, wskey: $scope.wskey, path: $scope.path, root: $scope.root},
                    promise;
                //console.log('Getting parent data (refresh: %s, forceNewSelection: %s, config: %o)', refresh, forceNewSelection, config);
                promise = $scope.browserService.getData(config).$promise;
                promise.then(function (element) {
                    finishGetParentData(element, refresh, forceNewSelection);
                });
                return promise;
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
                    // If push we use data stored inside parent.elements not detailed data retrieved from ObjectResource
                    if (!push && $scope.browserService.getDataResource === 'object') {
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
                return promise;
            }

            function selectAll() {
                if ($scope.hasOnlyParentSelected()) {
                    $scope.selectedElements = [];
                }
                angular.forEach($scope.parent.elements, function (child) {
                    if (!$scope.isSelected(child)) {
                        selectChild(child, 'shift');
                    }
                });
                lastSelectedElement = undefined;
                lastShiftSelectedElement = undefined;
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
                var i;
                for (i = 0; i < $scope.selectedElements.length; i++) {
                    if ($scope.selectedElements[i].key === element.key) {
                        return true;
                    }
                }
                return false;
            };

            $scope.isCollection = function (element) {
                return element.type === 'collection' ||
                    (element.objectIdentifier && element.objectIdentifier.type === 'collection');
            };

            $scope.hasOnlyParentSelected = function () {
                return !$scope.selectedElements || ($scope.selectedElements.length === 1 && $scope.selectedElements[0].key === $scope.parent.key);
            };

            function hasOnlyOneElementSelectedNotParent() {
                return $scope.hasOnlyOneElementSelected() && $scope.selectedElements[0].key !== $scope.parent.key;
            }

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
                    if ((!$scope.browserService.isFileSelect || $scope.fileSelectAcceptMultiple) &&
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
                            if (lastShiftSelectedElementIndex !== undefined) {
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
                if (($scope.workspace || $scope.isMarket()) &&
                    !($(clickEvent.target).parent('tr').length ||
                    $(clickEvent.target).parent('td').length ||
                    $(clickEvent.target).parent('.browsed-element-child').length ||
                    $(clickEvent.target).parent().parent('.browsed-element-child').length ||
                    $(clickEvent.target).hasClass('my-workspaces-item') ||
                    $(clickEvent.target).parents('#context-menu').length ||
                    $(clickEvent.target).parents('.btn-toolbar').length)) {
                    deselectChildren();
                    if (!$(clickEvent.target).hasClass('my-workspaces')) {
                        $scope.contextMenu(clickEvent, false);
                    }
                }
                if ($scope.isScreenMd && !$scope.settings.aside.hideWorkspaceListMdScreen &&
                    !$(clickEvent.target).hasClass('my-workspaces')) {
                    $scope.toggleWorkspaceList();
                }
            };

            function getCollectionSize(collection) {
                var i,
                    size = {
                        value: 0,
                        elementNumber: 0,
                        collectionNumber: 0,
                        partial: false
                    };
                if (collection) {
                    for (i = 0; i < collection.length; i++) {
                        if (collection[i].type === 'object') {
                            size.value += collection[i].size;
                            size.elementNumber += 1;
                        } else if (collection[i].type === 'collection') {
                            size.elementNumber += 1;
                            size.collectionNumber += 1;
                            size.partial = true;
                        }
                    }
                }
                return size;
            }

            $scope.selectedElementsSize = function () {
                return getCollectionSize($scope.selectedElements);
            };

            $scope.collectionSize = function () {
                if ($scope.hasOnlyParentSelected()) {
                    return getCollectionSize($scope.parent.elements);
                }
                return getCollectionSize($scope.selectedElements[0].elements);
            };

            $scope.calculateCollectionSize = function () {
                var oKey;
                if ($scope.hasOnlyParentSelected()) {
                    oKey = $scope.parent.key;
                } else if ($scope.selectedElements[0].type === 'collection') {
                    oKey = $scope.selectedElements[0].key;
                } else {
                    return;
                }
                ObjectResource.size({oKey: oKey}, function (data) {
                    $scope.selectedElements[0].realSize = data.size;
                });
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
                    getParentData(true).then(function () {
                        deselectChildren();
                    });
                }
            }

            $scope.clickDelete = function () {
                var toBeDeletedElements = $scope.selectedElements;
                deleteElements(toBeDeletedElements);
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
                            $scope.isCollection($scope.selectedElements[0])) {
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
                            getParentData(true).then(function () {
                                addCollectionModal.hide();
                                deactivateContextMenu();
                            });
                        });
                    };
                    addCollectionModalScope.cancel = function () {
                        addCollectionModal.hide();
                        deactivateContextMenu();
                    };
                    addCollectionModalScope.$on('modal.show', function () {
                        angular.element('#new-collection-modal').find('[autofocus]:first').focus();
                    });
                    addCollectionModal = $modal({
                        scope: addCollectionModalScope,
                        template: 'workspace/templates/add-collection-modal.html',
                        show: true
                    });
                }
            };

            $scope.editDescription = function () {
                if ($scope.browserService.canAdd && $scope.isHead && $scope.hasOnlyOneElementSelected()) {
                    var editDescriptionModalScope = $rootScope.$new(true),
                        editDescriptionModal;
                    editDescriptionModalScope.selectedElement = $scope.selectedElements[0];
                    editDescriptionModalScope.editDescription = function () {
                        // Delete properties that are not part of the representation
                        if (!!editDescriptionModalScope.selectedElement.realSize) {
                            delete editDescriptionModalScope.selectedElement.realSize;
                        }
                        WorkspaceElementResource.put({wskey: $scope.wskey }, editDescriptionModalScope.selectedElement, function () {
                            getParentData(true).then(function () {
                                editDescriptionModal.hide();
                                deactivateContextMenu();
                            });
                        });
                    };
                    editDescriptionModalScope.cancel = function () {
                        editDescriptionModal.hide();
                        deactivateContextMenu();
                    };
                    editDescriptionModalScope.$on('modal.show', function () {
                        angular.element('#new-collection-modal').find('[autofocus]:first').focus();
                    });
                    editDescriptionModal = $modal({
                        scope: editDescriptionModalScope,
                        template: 'workspace/templates/edit-description-modal.html',
                        show: true
                    });
                }
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                //console.log('%s caught event "uploaderCompleteItemUpload"', $scope.browserService.getId());
                getParentData(true, $scope.hasOnlyParentSelected());
            });

            // *********************** //
            //        Metadata         //
            // *********************** //

            $scope.showMetadataItem = function () {
                //TODO pre load metadataFormat
                MetadataFormatResource.get({name: 'ortolang-item-json'}).$promise.then( 
                    function(data) {
                        if(data.entries.length>0) {

                            var entry = data.entries[0];
                            MetadataFormatResource.download({name:'ortolang-item-json'}).$promise.then(
                                function(schema) {
                                    entry.schemaContent = schema;
                                    entry.view = 'workspace/metadata-form-schema.html';
                                    entry.displayed = false;

                                    // $scope.metadataFormats.push(entry);
                                    WorkspaceElementResource.get({wskey: $scope.selectedElements[0].workspace, path: $scope.selectedElements[0].path, metadata: 'ortolang-item-json'}).$promise.then(
                                        function (data) {
                                            $rootScope.$broadcast('metadata-editor-edit', entry, data);
                                        },
                                        function (reason) {
                                            $rootScope.$broadcast('metadata-editor-show', entry);
                                        }
                                    );
                                    
                                },
                                function(reason) {
                                    console.error('Cant get schema of metadata formats '+entry.name+' ; failed cause '+reason+' !');
                                }
                            );
                        }
                    },
                    function(reason) {
                        console.error('Cant get metadata formats for item ; failed cause '+reason+' !');
                    }
                );
            };

            $scope.hasPresentationMetadata = function() {
                return $scope.hasOnlyRootCollectionSelected && $scope.selectedElements && $filter('filter')($scope.selectedElements[0].metadatas, {'name': 'ortolang-item-json'}).length>0
            }

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
                $rootScope.$broadcast('tool-list-show');
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
                snapshotModalScope.$on('modal.show', function () {
                    angular.element('#snapshot-workspace-form').find('[autofocus]:first').focus();
                });
                snapshotModal = $modal({
                    scope: snapshotModalScope,
                    template: 'workspace/templates/snapshot-modal.html',
                    show: true
                });
            };

            $scope.showMembers = function () {
                var workspaceMembersModalScope = $rootScope.$new(true);
                workspaceMembersModalScope.wsName = $scope.wsName;
                workspaceMembersModalScope.members = $scope.workspaceMembers.members;

                $modal({
                    scope: workspaceMembersModalScope,
                    template: 'workspace/templates/workspace-members-modal.html',
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
                var isolatedScope = $rootScope.$new(),
                    element,
                    visualizerModal;
                if ($scope.children && $scope.children.length !== 0) {
                    isolatedScope.elements = $scope.children;
                } else {
                    isolatedScope.elements = $scope.selectedElements;
                }
                element = $compile(visualizer.getElement())(isolatedScope);
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

            function hideTooltip() {
                // Hide manually to prevent tooltip to stay visible
                var tooltip = angular.element('.tooltip');
                if (tooltip.length > 0) {
                    tooltip.scope().$parent.$hide();
                }
            }

            $scope.goBack = function () {
                hideTooltip();
                $scope.keyHistory.forward.push($scope.itemKey);
                browseToKey($scope.keyHistory.back.pop(), true);
            };

            $scope.goForward = function () {
                hideTooltip();
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

            function browseToParent() {
                if ($scope.browserService.getDataResource !== 'object' &&
                    (!browseUsingLocation || $scope.browserService.isFileSelect) && $scope.path !== '/') {
                    var pathPartsCopy = angular.copy($scope.parent.pathParts);
                    pathPartsCopy.pop();
                    $scope.browseToPath('/' + pathPartsCopy.join('/'));
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
                    matchingSelectedElements = $filter('filter')(selectedElementsCopy, {mimeType: $scope.forceMimeTypes}, false);
                }
                return $scope.forceMimeTypes ? matchingSelectedElements : selectedElementsCopy;
            }

            $scope.doubleClickChild = function (child) {
                if ($scope.isCollection(child)) {
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
                if (!$scope.forceWorkspace) {
                    if (!$scope.isActiveWorkspace(workspace)) {
                        initWorkspaceVariables(workspace);
                        getParentData();
                        $scope.settings.wskey = workspace.key;
                        storeSettings();
                    } else {
                        if ($scope.path !== '/') {
                            $scope.browseToPath('/');
                        } else {
                            deselectChildren();
                        }
                    }
                }
            };

            $scope.isActiveWorkspace = function (workspace) {
                return $scope.wskey === workspace.key;
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
                        if ($scope.isCollection(child)) {
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
                lastShiftSelectedElement = undefined;
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

            function navigate(down, event) {
                if (angular.element('.visualizer-modal.in').length === 0 && $scope.isViewModeLine()) {
                    var i, deferred, promise;
                    if ($scope.hasOnlyOneElementSelected()) {
                        if ($scope.selectedElements[0].key === $scope.parent.key) {
                            if (down) {
                                promise = selectChild($scope.filteredOrderedChildrenArray[0]);
                            } else {
                                promise = selectChild($scope.filteredOrderedChildrenArray[$scope.filteredOrderedChildrenArray.length - 1]);
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
                                if (event.shiftKey) {
                                    deferred = $q.defer();
                                    promise = deferred.promise;
                                    $scope.clickChild($scope.filteredOrderedChildrenArray[i], event);
                                    deferred.resolve();
                                } else {
                                    promise = selectChild($scope.filteredOrderedChildrenArray[i]);
                                }
                            }
                        }
                    } else {
                        var j, k = 0, lastSelectedElementIndex, lastShiftSelectedElementIndex;
                        if (event.shiftKey) {
                            lastSelectedElementIndex = lastSelectedElement ? getChildIndex(lastSelectedElement) : undefined;
                            lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : undefined;
                            if ((!down && lastShiftSelectedElementIndex === 0) || (down && lastShiftSelectedElementIndex === $scope.filteredOrderedChildrenArray.length - 1)) {
                                return;
                            }
                        }
                        for (i = 0; i < $scope.filteredOrderedChildrenArray.length; i++) {
                            for (j = 0; j < $scope.selectedElements.length; j++) {
                                if ($scope.filteredOrderedChildrenArray[i].key === $scope.selectedElements[j].key) {
                                    k++;
                                    break;
                                }
                            }
                            if (lastShiftSelectedElementIndex !== undefined && k === 1) {
                                if (lastShiftSelectedElementIndex < lastSelectedElementIndex) {
                                    if (down) {
                                        i++;
                                    } else if (i !== 0){
                                        i--;
                                    }
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
                                i = $scope.filteredOrderedChildrenArray.length - 1;
                            }
                            if (event.shiftKey) {
                                if (lastSelectedElementIndex !== undefined) {
                                    deferred = $q.defer();
                                    promise = deferred.promise;
                                    $scope.clickChild($scope.filteredOrderedChildrenArray[i], event);
                                    deferred.resolve();
                                }
                            } else {
                                promise = selectChild($scope.filteredOrderedChildrenArray[i]);
                            }
                        }
                    }
                    if (promise) {
                        promise.then(function () {
                            var element = angular.element('tr[data-key="' + $scope.selectedElements[$scope.selectedElements.length - 1].key + '"]'),
                                parent = angular.element('.table-wrapper'),
                                elementTop = element.position() ? element.position().top : undefined;
                            if ($scope.selectedElements[$scope.selectedElements.length - 1].key === $scope.filteredOrderedChildrenArray[0].key) {
                                parent.scrollTop(0);
                            } else {
                                if (elementTop < 0) {
                                    parent.scrollTop(parent.scrollTop() + elementTop - 6);
                                } else if (elementTop > parent.outerHeight() - element.outerHeight()) {
                                    parent.scrollTop(parent.scrollTop() + elementTop - parent.outerHeight() + element.outerHeight() + 6);
                                }
                            }
                        });
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

            function previewWithShortcut(event) {
                preventDefault(event);
                if (angular.element('.visualizer-modal.in').length > 0) {
                    angular.element('.visualizer-modal').modal('hide');
                } else {
                    $scope.clickPreview();
                }
            }

            function bindHotkeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: ['up', 'shift+up'],
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.UP'),
                        callback: function (event) {
                            preventDefault(event);
                            navigate(false, event);
                        }
                    })
                    .add({
                        combo: ['down', 'shift+down'],
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.DOWN'),
                        callback: function (event) {
                            preventDefault(event);
                            navigate(true, event);
                        }
                    })
                    .add({
                        combo: 'backspace',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.BACKSPACE'),
                        callback: function (event) {
                            preventDefault(event);
                            if ($scope.isMarket()) {
                                $scope.goBack();
                            } else {
                                browseToParent();
                            }
                        }
                    })
                    .add({
                        combo: 'v',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.VIEW_MODE'),
                        callback: function (event) {
                            preventDefault(event);
                            $scope.switchViewMode();
                        }
                    });
                if ($scope.browserService.displayAsideInfo) {
                    hotkeys.bindTo($scope).add({
                        combo: 'i',
                        description: $translate.instant('BROWSER.SHORTCUTS.INFO'),
                        callback: function (event) {
                            preventDefault(event);
                            $scope.toggleAsideInfo();
                        }
                    });
                }
                if ($scope.browserService.displayAsideWorkspaceList) {
                    hotkeys.bindTo($scope).add({
                        combo: 'w',
                        description: $translate.instant('BROWSER.SHORTCUTS.WORKSPACE_LIST'),
                        callback: function (event) {
                            preventDefault(event);
                            $scope.toggleWorkspaceList();
                        }
                    });
                }
                hotkeys.bindTo($scope)
                    .add({
                        combo: 'space',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.PREVIEW'),
                        callback: function (event) {
                            previewWithShortcut(event);
                        }
                    })
                    .add({
                        combo: 'enter',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.ENTER'),
                        callback: function (event) {
                            preventDefault(event);
                            if (hasOnlyOneElementSelectedNotParent() && $scope.isCollection($scope.selectedElements[0])) {
                                browseToChild($scope.selectedElements[0]);
                            } else {
                                previewWithShortcut(event);
                            }
                        }
                    })
                    .add({
                        combo: 'mod+f',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.FILTER'),
                        callback: function (event) {
                            preventDefault(event);
                            var filterWrapper = $('#filter-query-wrapper');
                            filterWrapper.find('button').dropdown('toggle');
                            filterWrapper.find('#filter-input').focus();
                        }
                    })
                    .add({
                        combo: 'mod+a',
                        description: $scope.browserService.isFileSelect ? undefined : $translate.instant('BROWSER.SHORTCUTS.SELECT_ALL'),
                        callback: function (event) {
                            preventDefault(event);
                            selectAll();
                        }
                    });
                if ($scope.browserService.canAdd) {
                    hotkeys.bindTo($scope).add({
                        combo: 'mod+backspace',
                        description: $translate.instant('BROWSER.SHORTCUTS.DELETE'),
                        callback: function (event) {
                            preventDefault(event);
                            if (!$scope.hasOnlyParentSelected()) {
                                deleteElements($scope.selectedElements);
                            }
                        }
                    })
                        .add({
                            combo: 'shift+f',
                            description: $translate.instant('BROWSER.SHORTCUTS.NEW_COLLECTION'),
                            callback: function (event) {
                                preventDefault(event);
                                $scope.addCollection();
                            }
                        })
                        .add({
                            combo: 'u',
                            description: $translate.instant('BROWSER.UPLOAD_FILES'),
                            callback: function (event) {
                                preventDefault(event);
                                $scope.doAction('uploadFiles');
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
                        WorkspaceResource.createWorkspace({name: createWorkspaceModalScope.newWorkspaceName, type: 'user'}, function (newWorkspace) {
                            $scope.workspaceList = WorkspaceResource.get();
                            $scope.changeWorkspace(newWorkspace);
                            createWorkspaceModal.hide();
                        });
                    };
                    createWorkspaceModalScope.$on('modal.show', function () {
                        angular.element('#create-workspace-modal').find('[autofocus]:first').focus();
                    });
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
                    browserToolbarHeight = $('.browser-toolbar').innerHeight();
                    if ($scope.isMarket()) {
                        topOffset += angular.element('.market-item').find('header').outerHeight();
                        height -= 1;
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
                        browserWrapper.find('.browser-aside-left-collapsed').css('height', (height - browserToolbarHeight) + 'px');
                    }
                    $scope.isScreenMd = window.innerWidth < 992;
                    $scope.settings.aside.hideWorkspaceListMdScreen = $scope.isScreenMd;
                    $scope.$applyAsync();
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
            //         Settings        //
            // *********************** //

            function storeSettings() {
                if (localStorage !== undefined) {
                    localStorage.setItem($scope.browserService.getId() + 'Settings', JSON.stringify($scope.settings));
                }
            }

            function initSettings() {
                // Default settings
                var initialViewMode;
                if ($scope.browserService.defaultViewMode === viewModeLine.id) {
                    initialViewMode = viewModeLine;
                } else {
                    initialViewMode = viewModeTile;
                }
                $scope.settings.aside = {
                    hideInfo: false,
                    hideWorkspaceList: false,
                    hideWorkspaceListMdScreen: false
                };
                // Saved settings
                if (localStorage !== undefined) {
                    var savedItem = localStorage.getItem($scope.browserService.getId() + 'Settings');
                    if (savedItem && savedItem !== 'undefined') {
                        var savedSettings = JSON.parse(savedItem);
                        if (savedSettings.viewMode) {
                            initialViewMode = savedSettings.viewMode;
                        }
                        if (savedSettings.aside) {
                            $scope.settings.aside.hideInfo = savedSettings.aside.hideInfo;
                        }
                        if (savedSettings.wskey) {
                            $scope.settings.wskey = savedSettings.wskey;
                        }
                    }
                }
                setViewMode(initialViewMode);
            }

            // *********************** //
            //        View mode        //
            // *********************** //

            function setViewMode(viewMode) {
                $scope.settings.viewMode = viewMode;
                storeSettings();
            }

            $scope.switchViewMode = function () {
                clearPreviousFilteringQueries();
                deactivateContextMenu();
                if ($scope.isViewModeLine()) {
                    setViewMode(viewModeTile);
                } else {
                    setViewMode(viewModeLine);
                }
            };

            $scope.isViewModeLine = function () {
                return $scope.settings.viewMode.id === viewModeLine.id;
            };

            $scope.tileCssClasses = function () {
                if ($scope.browserService.displayAsideInfo && !$scope.settings.aside.hideInfo) {
                    return 'col-lg-3 col-xlg-14 col-xxlg-15 col-md-4 col-sm-4 col-xs-6';
                }
                return 'col-lg-3 col-xlg-15 col-xxlg-16 col-md-4 col-sm-4 col-xs-6';
            };

            $scope.middleCssClass = function () {
                var columnNumber = 12;
                if ($scope.browserService.displayAsideInfo && !$scope.settings.aside.hideInfo) {
                    columnNumber -= 3;
                }
                if ($scope.isScreenMd) {
                    if ($scope.browserService.displayAsideInfo && !$scope.settings.aside.hideInfo) {
                        columnNumber -= 2;
                    }
                } else {
                    if ($scope.displayAsideWorkspaceList() && !$scope.settings.aside.hideWorkspaceList) {
                        columnNumber -= 2;
                    }
                }
                return 'col-sm-' + columnNumber + ($scope.settings.aside.hideWorkspaceList || $scope.settings.aside.hideWorkspaceListMdScreen ? ' browser-middle-collapsed' : '');
            };

            $scope.toggleAsideInfo = function () {
                $scope.settings.aside.hideInfo = !$scope.settings.aside.hideInfo;
                storeSettings();
            };

            $scope.toggleWorkspaceList = function () {
                if ($scope.isScreenMd) {
                    $scope.settings.aside.hideWorkspaceListMdScreen = !$scope.settings.aside.hideWorkspaceListMdScreen;
                } else {
                    $scope.settings.aside.hideWorkspaceList = !$scope.settings.aside.hideWorkspaceList;
                }
                storeSettings();
            };

            $scope.displayAsideWorkspaceList = function () {
                return !$scope.forceWorkspace && $scope.browserService.displayAsideWorkspaceList;
            };

            $scope.isMarket = function () {
                return $scope.browserService === MarketBrowserService;
            };

            $scope.isSuperUser = function () {
                return AuthService.isSuperUser();
            };

            $scope.getToken = function () {
                return 'Bearer: ' + AuthService.getToken();
            };

            // *********************** //
            //           Init          //
            // *********************** //

            function initLocalVariables() {
                viewModeLine = {id: 'line', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'};
                viewModeTile = {id: 'tile', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'};
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
                $scope.settings = {};
                initSettings();
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
                $scope.isScreenMd = false;
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
                        if ($scope.settings.wskey || $scope.forceWorkspace) {
                            var key = $scope.settings.wskey || $scope.forceWorkspace,
                                filteredWorkspace = $filter('filter')(data.entries, {key: key}, true);
                            if (filteredWorkspace.length !== 1) {
                                console.error('No workspace with key "%s" available', key);
                                $scope.workspace = data.entries[0];
                                if ($scope.workspace) {
                                    $scope.settings.wskey = $scope.workspace.key;
                                    storeSettings();
                                }
                            } else {
                                $scope.workspace = filteredWorkspace[0];
                            }
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
