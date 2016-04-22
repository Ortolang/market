'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 *
 * @extends $rootScope.Scope
 *
 * @property {Object}   parent              - Browsed element
 * @property {Array}    children            - Children of the browsed element
 * @property {Array}    selectedElements    - Selected elements
 * @property {String}   path                - Current path (i.e. parent's path)
 * @property {String}   root                - Current root (snapshot/tag)
 * @property {Array}    visualizers         - List of the compatible visualizers for the selected element(s)
 * @property {Object}   filterModels        - Filtering query models for filtering by name, mimeType, etc.
 * @property {Array}    orderProp           - Ways of ordering the children
 * @property {boolean}  reverse             - If the ordering is reversed
 * @property {String}   dateFormat          - Date format (ex: 'short', 'full')
 * @property {boolean}  isFileSelectBrowserService  - If the browser is a file selector browser
 * @property {boolean}  fileSelectAcceptMultiple    - If multiple file selection is accepted in the case of a file selector browser
 * @property {boolean}  isContextMenuActive - If the context menu is opened
 * @property {Array}    forceMimeTypes      - List of the only mime types to be displayed
 * @property {Array}    contextMenuItems    - Context menu elements
 * @property {Array}    breadcrumbParts     - Paths of all the ancestors of the browsed element
 * @property {Array}    breadcrumbDropdownItems - List of the elements to be displayed in the context menu
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', [
        '$scope',
        '$location',
        '$route',
        '$rootScope',
        '$compile',
        '$filter',
        '$timeout',
        '$window',
        '$q',
        '$translate',
        '$modal',
        '$alert',
        'hotkeys',
        'ObjectResource',
        'Content',
        'AuthService',
        'WorkspaceElementResource',
        'VisualizerManager',
        'icons',
        'ortolangType',
        'Settings',
        'Cart',
        'MarketBrowserService',
        'WorkspaceBrowserService',
        'FileSelectBrowserService',
        'Helper',
        'url',
        function (/** ortolangMarketApp.controller:BrowserCtrl */$scope, $location, $route, $rootScope, $compile, $filter, $timeout, $window, $q, $translate, $modal, $alert, hotkeys, ObjectResource, Content, AuthService, WorkspaceElementResource, VisualizerManager, icons, ortolangType, Settings, Cart, MarketBrowserService, WorkspaceBrowserService, FileSelectBrowserService, Helper, url) {

            var isMacOs, isClickedOnce, previousFilterNameQuery, previousFilterMimeTypeQuery, previousFilterType,
                previousFilteredChildren, browserToolbarHeight, initialDisplayedItemLimit, lastSelectedElement,
                lastShiftSelectedElement, modalScope, clickedChildSelectionDeferred, eventRefreshTimeoutPromise,
                uploadRefreshTimeoutPromise, parentDataPromise, subTimeout, crudTimeout;

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function populateBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                if ($scope.browserService.canEdit && $scope.isHead) {
                    $scope.breadcrumbDropdownItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.plus, action: 'addCollection'});
                    if ($scope.hasOnlyParentSelected()) {
                        $scope.breadcrumbDropdownItems.push({divider: true});
                        $scope.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                        $scope.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_ZIP', icon: icons.browser.uploadZip, action: 'uploadZip'});
                    }
                    if (!$scope.hasOnlyRootCollectionSelected()) {
                        $scope.breadcrumbDropdownItems.push({divider: true});
                        $scope.breadcrumbDropdownItems.push({text: 'RENAME', icon: icons.edit, action: 'rename'});
                    }
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

            $scope.deactivateContextMenu = function () {
                if ($scope.isContextMenuActive) {
                    $scope.isContextMenuActive = false;
                    clearContextMenuItems();
                }
            };

            $scope.contextMenu = function (clickEvent, sameChild) {
                // If right click
                if (!$scope.isFileSelectBrowserService && clickEvent && clickEvent.button === 2) {
                    // If the context menu has already been build no need to do it again
                    if (!($scope.isContextMenuActive && sameChild)) {
                        clearContextMenuItems();
                        if ($scope.browserService.canEdit && $scope.isHead && $scope.hasOnlyParentSelected()) {
                            $scope.contextMenuItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.plus, action: 'addCollection'});
                            //$scope.contextMenuItems.push({text: 'BROWSER.NEW_LINK', icon: icons.link, action: 'addLink'});
                            $scope.contextMenuItems.push({divider: true});
                            $scope.contextMenuItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                            $scope.contextMenuItems.push({text: 'BROWSER.UPLOAD_ZIP', icon: icons.browser.uploadZip, action: 'uploadZip'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        if ($scope.browserService.canPreview && $scope.visualizers) {
                            // TODO Display all compatible visualizers when multiple
                            $scope.contextMenuItems.push({text: 'BROWSER.PREVIEW', icon: icons.browser.preview, action: 'preview'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        if ($scope.browserService.canEdit && $scope.isHead && !$scope.hasOnlyParentSelected()) {
                            if ($scope.selectedElements.length === 1) {
                                $scope.contextMenuItems.push({text: 'RENAME', icon: icons.edit, action: 'rename'});
                            }
                            $scope.contextMenuItems.push({text: 'BROWSER.MOVE', icon: icons.browser.move, action: 'move'});
                            $scope.contextMenuItems.push({text: 'BROWSER.DELETE', icon: icons.browser.delete, action: 'delete'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        if ($scope.browserService.canDownload && !$scope.hasOnlyParentSelected()) {
                            if ($scope.isMarketBrowserService && $scope.hasOnlyOneElementSelected()) {
                                $scope.contextMenuItems.push({text: 'SHARE', icon: icons.share, action: 'share'});
                            }
                            $scope.contextMenuItems.push({text: 'DOWNLOAD', icon: icons.browser.download, action: 'download'});
                            //$scope.contextMenuItems.push({text: 'BROWSER.ADD_TO_CART', icon: icons.cartPlus, action: 'addToCart'});
                            $scope.contextMenuItems.push({divider: true});
                        }
                        $scope.contextMenuItems.push({text: $scope.viewMode[$scope.browserSettings.viewMode].text, icon: $scope.viewMode[$scope.browserSettings.viewMode].icon, action: 'switchViewMode'});
                        if ($scope.contextMenuItems.length > 0 && $scope.contextMenuItems[$scope.contextMenuItems.length - 1].divider) {
                            $scope.contextMenuItems.pop();
                        }
                        activateContextMenu();
                    }
                    if ($scope.contextMenuItems.length > 0) {
                        $scope.contextMenuStyle = {};
                        var wrapper = angular.element('.browser-wrapper'),
                            wrapperOffset = wrapper.offset(),
                            top = clickEvent.pageY - wrapperOffset.top - 3,
                            estimatedHeight = $scope.contextMenuItems.length * 32,
                            bottom;
                        $scope.contextMenuStyle = {
                            left: clickEvent.pageX - wrapperOffset.left - 3 + 'px'
                        };
                        if (top + estimatedHeight > wrapper.height()) {
                            bottom = wrapper.height() - clickEvent.pageY + wrapperOffset.top;
                            $scope.contextMenuStyle.bottom = bottom + 'px';
                        } else {
                            $scope.contextMenuStyle.top = top + 'px';
                        }
                    }
                } else {
                    $scope.deactivateContextMenu();
                }
            };

            // *********************** //
            //         Get Data        //
            // *********************** //


            function getParentData(refresh, forceNewSelection) {
                if (refresh === undefined) {
                    refresh = false;
                }
                parentDataPromise = WorkspaceElementResource.get({wskey: $scope.browserService.workspace.key, path: $scope.path, root: $scope.root, policy: $scope.isWorkspaceBrowserService}).$promise;
                parentDataPromise.then(function (element) {
                    resetDisplayedItemLimit();
                    $scope.parent = element;
                    // If hasOnlyParentSelected then we need to select parent again to force angular to refresh aside info
                    if ($scope.hasOnlyParentSelected() || !refresh || forceNewSelection) {
                        newSelectedElement($scope.parent);
                    }
                    // If we just refreshed the data no need to build the breadcrumb again
                    if (!refresh) {
                        buildBreadcrumb();
                        populateBreadcrumbDropdownMenu();
                        angular.element('.table-wrapper.table-workspace-elements-wrapper').scrollTop(0);
                    }
                    clearPreviousFilteringQueries();
                    var allChildrenMimeTypesValues = [];
                    $scope.filterModels.allChildrenMimeTypes = [];
                    angular.forEach($scope.parent.elements, function (value) {
                        if (allChildrenMimeTypesValues.indexOf(value.mimeType) === -1) {
                            allChildrenMimeTypesValues.push(value.mimeType);
                            $scope.filterModels.allChildrenMimeTypes.push({value: value.mimeType, label: '<span class="type ' + $filter('mimeTypeIconCss')(value.mimeType) + '"></span>' + value.mimeType});
                        }
                    });
                    if ($scope.isWorkspaceBrowserService) {
                        if ($scope.path === '/') {
                            $rootScope.ortolangPageSubtitle = $scope.browserService.workspace.alias + ' : / | ';
                        } else {
                            $rootScope.ortolangPageSubtitle = $scope.browserService.workspace.alias + ' : ' + $scope.path.slice($scope.path.lastIndexOf('/') + 1) + ' | ';
                        }
                    }
                }, function (response) {
                    if (response.status === 401) {
                        if ($scope.isMarketBrowserService && $scope.path === '/') {
                            $location.search({});
                        }
                    } else {
                        Helper.showErrorModal(response.data);
                        initWorkspaceVariables();
                    }
                });
                return parentDataPromise;
            }

            function getSnapshotNameFromHistory(workspaceSnapshot) {
                if ($scope.browserService.workspace.snapshots) {
                    var filteredSnapshot = $filter('filter')($scope.browserService.workspace.snapshots, {key: workspaceSnapshot.key}, true);
                    if (filteredSnapshot.length === 1) {
                        return filteredSnapshot[0].name;
                    }
                }
                return null;
            }

            function getTagName(workspaceSnapshotName) {
                if ($scope.browserService.workspace.tags) {
                    var filteredTag = $filter('filter')($scope.browserService.workspace.tags, {snapshot: workspaceSnapshotName}, true);
                    if (filteredTag.length === 1) {
                        return filteredTag[0].name;
                    }
                }
                return null;
            }

            function getSnapshotsHistory() {
                $scope.workspaceHistoryTags = {};
                if (!$scope.isMarketBrowserService) {
                    ObjectResource.history({key: $scope.browserService.workspace.head}, function (data) {
                        $scope.workspaceHistory = data;
                        angular.forEach(data, function (workspaceSnapshot) {
                            workspaceSnapshot.name = getSnapshotNameFromHistory(workspaceSnapshot);
                            workspaceSnapshot.tag = getTagName(workspaceSnapshot.name);
                            if (workspaceSnapshot.name) {
                                $scope.workspaceHistoryTags[workspaceSnapshot.name] = workspaceSnapshot.tag || workspaceSnapshot.name;
                            }
                        });
                    });
                } else {
                    $scope.workspaceHistoryTags[$scope.root] = getTagName($scope.root);
                }
            }

            function selectChild(child, push, clickEvent, refresh) {
                clickEvent = clickEvent || null;
                var deferred, promise;
                if (!child) {
                    return;
                }
                if (push) {
                    deferred = $q.defer();
                    deferred.resolve(child);
                    promise = deferred.promise;
                } else {
                    promise = getChildData(child);
                }
                if (!push || push !== 'shift') {
                    lastShiftSelectedElement = null;
                }
                promise.then(function (data) {
                    // If push we use data stored inside parent.elements not detailed data retrieved from ObjectResource
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
                lastSelectedElement = null;
                lastShiftSelectedElement = null;
            }

            function getChildData(child) {
                return WorkspaceElementResource.get({
                    wskey: $scope.browserService.workspace.key,
                    path: $scope.path + '/' + child.name,
                    root: $scope.root,
                    policy: $scope.isWorkspaceBrowserService
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
                    WorkspaceElementResource.get({wskey: $scope.browserService.workspace.key, path: $scope.path + child.name, root: $scope.root}, function (data) {
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

            $scope.download = function (elements) {
                if (elements.length > 1 || elements[0].type === ortolangType.collection) {
                    var paths = [];
                    angular.forEach(elements, function (element) {
                        paths.push($scope.browserService.workspace.alias + '/' + $scope.root + $scope.path + ($scope.hasOnlyParentSelected() ? '' : '/' + element.name));
                    });
                    if (elements.length === 1) {
                        if ($scope.path === '/' && $scope.hasOnlyParentSelected()) {
                            Content.export(paths, $scope.browserService.workspace.alias);
                        } else {
                            Content.export(paths, elements[0].name);
                        }
                    } else {
                        Content.export(paths);
                    }
                } else {
                    Content.downloadWithKeyInWindow(elements[0].key, true);
                }
            };

            $scope.share = function () {
                createModalScope();
                modalScope.models = {
                    type: $scope.selectedElements[0].type,
                    name: $scope.selectedElements[0].name
                };
                modalScope.handles = {};
                ObjectResource.pids({key: $scope.selectedElements[0].key}, function (data) {
                    modalScope.handles.others = [];
                    angular.forEach(data, function (handle) {
                        handle = handle.toLowerCase();
                        var parts = handle.split('/');
                        if (parts[0] === url.handlePrefix && parts[1] === $scope.browserService.workspace.alias) {
                            if (parts[2] === $scope.workspaceHistoryTags[$scope.root]) {
                                modalScope.handles.static = handle;
                                modalScope.handles.staticUrl = 'https://hdl.handle.net/' + handle;
                            } else {
                                modalScope.handles.dynamic = handle;
                                modalScope.handles.dynamicUrl = 'https://hdl.handle.net/' + handle;
                            }
                        } else {
                            modalScope.handles.others.push({
                                handle: handle,
                                url: 'https://hdl.handle.net/' + handle
                            });
                        }
                    });
                });
                $modal({
                    scope: modalScope,
                    templateUrl: 'common/directives/share-modal-template.html',
                    show: true
                });
            };

            $scope.getPreviewUrl = function (element, large) {
                return Content.getPreviewUrlWithKey(element.key, large);
            };

            function createModalScope() {
                modalScope = Helper.createModalScope();
                modalScope.$on('modal.show.before', function () {
                    $scope.deactivateContextMenu();
                });
            }

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

            $scope.isLink = function (element) {
                return element.type === ortolangType.link;
            };

            $scope.isCollection = function (element) {
                return element.type === ortolangType.collection;
            };

            $scope.hasOnlyParentSelected = function () {
                return !$scope.selectedElements || ($scope.selectedElements.length === 1 && $scope.selectedElements[0].key === $scope.parent.key);
            };

            $scope.hasOnlyOneElementSelected = function () {
                return $scope.selectedElements && $scope.selectedElements.length === 1;
            };

            $scope.hasOnlyRootCollectionSelected = function () {
                return $scope.hasOnlyParentSelected() && ($scope.path === null || $scope.path === '/');
            };

            function refreshSelectedElements(updatedElement) {
                if (updatedElement && !$scope.hasOnlyParentSelected()) {
                    if ($scope.hasOnlyOneElementSelected()) {
                        if ($scope.selectedElements[0].key === updatedElement.key ||
                            $scope.selectedElements[0].name === updatedElement.name) {
                            selectChild($scope.selectedElements[0], undefined, undefined, true);
                        }
                    } else {
                        // If there are several elements selected we force a new selection with parent KISS
                        newSelectedElement($scope.parent);
                    }
                }
            }

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
                $scope.deactivateContextMenu();
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
                    if ((!$scope.isFileSelectBrowserService || $scope.fileSelectAcceptMultiple) &&
                        (modKey || $event.shiftKey) && !$scope.hasOnlyParentSelected()) {
                        if (modKey) {
                            selectChild(child, 'mod', $event);
                        } else if ($event.shiftKey) {
                            var lastSelectedElementIndex = getChildIndex(lastSelectedElement),
                                lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : null,
                                childIndex = getChildIndex(child),
                                i,
                                j,
                                filteredOrderedChildren = $scope.filteredOrderedChildren(),
                                skip = false;
                            if (lastShiftSelectedElementIndex !== null) {
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
                        clickedChildSelectionDeferred = $q.defer();
                        selectChild(child, false, $event).then(function () {
                            clickedChildSelectionDeferred.resolve();
                        });
                    }
                }
                if ($event.type === 'touchend') {
                    $scope.doubleClickChild(child);
                    $event.preventDefault();
                }
            };

            function pushSelectedElement(element) {
                $scope.selectedElements.push(element);
            }

            function newSelectedElement(element) {
                $scope.selectedElements = [element];
            }

            $scope.checkDeselection = function ($event) {
                if ($event.button === 2 || !angular.element($event.target).hasClass('btn')) {
                    deselectChildren();
                }
            };

            $scope.preventRightClick = function () {};

            $scope.checkSelection = function ($event) {
                if (($scope.browserService.workspace || $scope.isMarketBrowserService) &&
                    !angular.element($event.target).closest('.workspace-element').length) {
                    deselectChildren();
                    $scope.contextMenu($event, false);
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
                        if (collection[i].type === ortolangType.object) {
                            size.value += collection[i].size;
                            size.elementNumber += 1;
                        } else if (collection[i].type === ortolangType.collection) {
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
                var key;
                if ($scope.hasOnlyParentSelected()) {
                    key = $scope.parent.key;
                } else if ($scope.selectedElements[0].type === ortolangType.collection) {
                    key = $scope.selectedElements[0].key;
                } else {
                    return;
                }
                ObjectResource.size({key: key}, function (data) {
                    $scope.selectedElements[0].realSize = data.size;
                });
            };

            // *********************** //
            //         Delete          //
            // *********************** //

            $scope.deleteSelectedElements = function () {
                if (!$scope.hasOnlyParentSelected()) {
                    var sources = [],
                        collectionNumber = 0,
                        objectNumber = 0,
                        deferred = $q.defer(),
                        deleteMultipleElementsModal;
                    angular.forEach($scope.selectedElements, function (element) {
                        sources.push(Helper.normalizePath($scope.parent.path + '/' + element.name));
                        if (element.type === ortolangType.collection) {
                            collectionNumber++;
                        } else if (element.type === ortolangType.object) {
                            objectNumber++;
                        }
                    });
                    if (collectionNumber || objectNumber > 1) {
                        modalScope = Helper.createModalScope();
                        modalScope.delete = function () {
                            deferred.resolve();
                            deleteMultipleElementsModal.hide();
                        };
                        modalScope.cancel = function () {
                            deferred.reject();
                            deleteMultipleElementsModal.hide();
                        };
                        if (objectNumber === 0) {
                            if (collectionNumber === 1) {
                                modalScope.type = 'COLLECTION';
                            } else {
                                modalScope.type = 'COLLECTIONS';
                            }
                        } else {
                            if (collectionNumber === 0) {
                                modalScope.type = 'FILES';
                            } else {
                                modalScope.type = 'FILES_COLLECTIONS';
                            }
                        }
                        modalScope.numbers = {
                            collectionNumber: collectionNumber,
                            objectNumber: objectNumber
                        };
                        deleteMultipleElementsModal = $modal({
                            scope: modalScope,
                            templateUrl: 'workspace/templates/delete-multiple-elements-modal.html',
                            show: true
                        });
                    } else {
                        deferred.resolve();
                    }
                    deferred.promise.then(function () {
                        WorkspaceElementResource.bulkAction({wskey: $scope.browserService.workspace.key}, {action: 'delete', sources: sources, force: true}, function () {
                            getParentData(true, true);
                        }, function (error) {
                            Helper.showErrorModal(error.data);
                        });
                    });
                    $scope.deactivateContextMenu();
                }
            };

            // *********************** //
            //       Upload Zip        //
            // *********************** //

            function uploadZip() {
                var uploadZipModal;
                createModalScope();
                modalScope.parent = $scope.parent;
                modalScope.wsName = $scope.browserService.workspace.name;
                modalScope.models.zipoverwrites = false;
                modalScope.models.root = '';
                modalScope.uploadZip = function () {
                    var files = angular.element('#upload-zip-file').prop('files');
                    $rootScope.uploader.addToQueue(files, {
                        'process-name': $translate.instant('WORKSPACE.PROCESS_NAMES.IMPORT_ZIP', {zipName: files[0].name, wsName: $scope.browserService.workspace.name}),
                        'ziproot': Helper.normalizePath($scope.parent.path + '/' + modalScope.models.root),
                        'zipoverwrites': modalScope.models.zipoverwrites,
                        'wskey': $scope.browserService.workspace.key,
                        'wsName': $scope.browserService.workspace.name,
                        'ortolangType': 'zip'
                    });
                    uploadZipModal.hide();
                };
                uploadZipModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/upload-zip-modal.html',
                    show: true
                });
            }

            // *********************** //
            //     Add Collection      //
            // *********************** //

            $scope.addCollection = function () {
                if ($scope.browserService.canEdit && $scope.isHead) {
                    var addCollectionModal;
                    createModalScope();
                    modalScope.submit = function (form) {
                        var formData,
                            path = $scope.parent.path + '/';

                        if ($scope.hasOnlyOneElementSelected() && !$scope.hasOnlyParentSelected() &&
                            $scope.isCollection($scope.selectedElements[0])) {
                            path += $scope.selectedElements[0].name + '/';
                        }
                        path += modalScope.models.newCollectionName;

                        formData = new FormData();
                        formData.append('path', path);
                        formData.append('type', ortolangType.collection);
                        WorkspaceElementResource.post({wskey: $scope.browserService.workspace.key}, formData, function () {
                            getParentData(true).then(function () {
                                var filtered = $filter('filter')($scope.parent.elements, {name: modalScope.models.newCollectionName}, true);
                                if (filtered.length === 1) {
                                    selectChild(filtered[0]);
                                }
                                addCollectionModal.hide();
                            });
                        }, function (error) {
                            if (error.data.code === '2') {
                                form.name.$setValidity('conflict', false);
                            } else {
                                Helper.showUnexpectedErrorAlert('#new-collection-modal', 'top');
                            }
                        });
                    };
                    modalScope.$on('modal.show', function () {
                        angular.element('#new-collection-modal').find('[autofocus]:first').focus();
                    });
                    addCollectionModal = $modal({
                        scope: modalScope,
                        templateUrl: 'workspace/templates/add-collection-modal.html',
                        show: true
                    });
                }
            };

            $scope.renameChild = function () {
                if ($scope.browserService.canEdit && $scope.isHead) {
                    var renameChildModal;
                    createModalScope();
                    modalScope.models.childNewName = $scope.selectedElements[0].name;
                    modalScope.renameChild = function () {
                        if (modalScope.childNewName !== $scope.selectedElements[0].name) {
                            var data = $scope.selectedElements[0], destination;
                            if ($scope.hasOnlyParentSelected()) {
                                destination = $scope.parent.path.substring(0, $scope.parent.path.lastIndexOf('/'));
                            } else {
                                destination = $scope.parent.path;
                            }
                            destination += '/' + modalScope.models.childNewName;

                            WorkspaceElementResource.put({wskey: $scope.browserService.workspace.key, destination: destination}, data, function (element) {
                                if ($scope.hasOnlyParentSelected()) {
                                    $scope.browseToPath(destination);
                                    renameChildModal.hide();
                                } else {
                                    getParentData(true).then(function () {
                                        $scope.selectedElements[0].name = modalScope.models.childNewName;
                                        refreshSelectedElements(element);
                                        renameChildModal.hide();
                                    });
                                }
                            });
                        } else {
                            renameChildModal.hide();
                        }
                    };
                    modalScope.$on('modal.show', function () {
                        angular.element('#rename-collection-modal').find('[autofocus]:first').focus();
                    });
                    renameChildModal = $modal({
                        scope: modalScope,
                        templateUrl: 'workspace/templates/rename-modal.html',
                        show: true
                    });
                }
            };

            $scope.moveElements = function () {
                if ($scope.browserService.canEdit && $scope.isHead) {
                    var moveModal, hideElements = [], sources = [];
                    createModalScope();
                    modalScope.title = 'WORKSPACE.MOVE_CHILD_MODAL.TITLE';
                    modalScope.titleValues = {name: $scope.selectedElements.length > 1 ? '' : $scope.selectedElements[0].name};
                    modalScope.forceWorkspace = $scope.browserService.workspace.key;
                    modalScope.forceHead = true;
                    angular.forEach($scope.selectedElements, function (selectedElement) {
                        hideElements.push(selectedElement.key);
                        sources.push(Helper.normalizePath($scope.path + '/' + selectedElement.name));
                    });
                    modalScope.hideElements = hideElements;
                    modalScope.forcePath = $scope.parent.path;
                    modalScope.forceMimeTypes = 'ortolang/collection';
                    modalScope.acceptMultiple = false;
                    modalScope.fileSelectId = 'moveChildModal';

                    modalScope.$on('browserSelectedElements-moveChildModal', function ($event, elements) {
                        modalScope.moveElements(elements[0]);
                    });

                    modalScope.moveElements = function (selectedCollection) {
                        WorkspaceElementResource.bulkAction({wskey: $scope.browserService.workspace.key}, {action: 'move', sources: sources, destination: selectedCollection.path}, function () {
                            getParentData(true, true).then(function () {
                                moveModal.hide();
                            });
                        }, function (error) {
                            $alert({
                                container: '.file-select-modal-body',
                                placement: 'top',
                                title: error.status === 409 ? $translate.instant('WORKSPACE.MOVE_CONFLICT_ALERT.TITLE') : $translate.instant('UNEXPECTED_ERROR_ALERT.TITLE'),
                                content: error.status === 409 ? $translate.instant('WORKSPACE.MOVE_CONFLICT_ALERT.CONTENT', error.data) : $translate.instant('UNEXPECTED_ERROR_ALERT.CONTENT'),
                                type: 'danger'
                            });
                        });
                    };
                    modalScope.$on('modal.hide', function () {
                        bindHotkeys();
                    });
                    moveModal = $modal({
                        scope: modalScope,
                        templateUrl: 'common/directives/file-select-modal-template.html',
                        show: true
                    });
                }
            };

            $scope.doAction = function (name) {
                switch (name) {
                    case 'download':
                        $scope.download($scope.selectedElements);
                        $scope.deactivateContextMenu();
                        break;
                    case 'addCollection':
                        $scope.addCollection();
                        break;
                    case 'delete':
                        $scope.deleteSelectedElements();
                        break;
                    case 'rename':
                        $scope.renameChild();
                        break;
                    case 'move':
                        $scope.moveElements();
                        break;
                    case 'preview':
                        $scope.clickPreview();
                        break;
                    case 'share':
                        $scope.share();
                        break;
                    case 'addToCart':
                        $scope.addToCart();
                        $scope.deactivateContextMenu();
                        break;
                    case 'uploadFiles':
                        // Using $timeout to prevent '$apply already in progress' error
                        $timeout(function () {
                            angular.element('#object-upload-file-select').click();
                        });
                        break;
                    case 'uploadZip':
                        uploadZip();
                        break;
                    case 'switchViewMode':
                        $scope.switchViewMode();
                        break;
                    default:
                        break;
                }
            };

            // *********************** //
            //       Visualizers       //
            // *********************** //

            function clearVisualizers() {
                $scope.visualizers = null;
            }

            function checkCompatibleVisualizers() {
                $scope.visualizers = VisualizerManager.getCompatibleVisualizers($scope.selectedElements);
                if ($scope.visualizers.length === 0) {
                    clearVisualizers();
                }
            }

            function finishPreview(visualizer) {
                var element, visualizerModal,
                    deferred = $q.defer();
                createModalScope();
                if ($scope.children && $scope.children.length !== 0) {
                    modalScope.elements = $scope.children;
                } else {
                    modalScope.elements = $scope.selectedElements;
                }
                if ($scope.isMarketBrowserService) {
                    var authorized = true,
                        promises = [],
                        i;
                    for (i = 0; i < modalScope.elements.length; i++) {
                        if (modalScope.elements[i].unrestrictedDownload === false) {
                            if (AuthService.isAuthenticated()) {
                                authorized = false;
                                break;
                            } else {
                                $rootScope.$broadcast('unauthorized-user');
                                return;
                            }
                        }
                    }
                    if (authorized) {
                        deferred.resolve();
                    } else {
                        authorized = true;
                        angular.forEach(modalScope.elements, function (element) {
                            if (authorized) {
                                promises.push(ObjectResource.isAuthorized({key: element.key}, function (data) {
                                    authorized = data.download;
                                }).$promise);
                            }
                        });
                        $q.all(promises).then(function () {
                            if (authorized) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                                $rootScope.$broadcast('unauthorized-user');
                            }
                        });
                    }
                } else {
                    deferred.resolve();
                }
                deferred.promise.then(function () {
                    modalScope.visualizer = {
                        header: {},
                        content: {},
                        footer: {}
                    };
                    modalScope.root = $scope.root;
                    modalScope.wsAlias = $scope.browserService.workspace.alias;
                    modalScope.actions = {};
                    modalScope.doAction = function (name) {
                        if (modalScope.actions && modalScope.actions[name]) {
                            modalScope.actions[name]();
                        }
                    };
                    modalScope.pendingRequests = [];
                    modalScope.$on('modal.hide.before', function () {
                        angular.forEach(modalScope.pendingRequests, function (request) {
                            if (request.promise.$$state && request.promise.$$state.pending) {
                                request.timeout.resolve();
                            }
                        });
                    });
                    if (visualizer) {
                        element = $compile(visualizer.getElement())(modalScope);
                    } else {
                        modalScope.visualizer.header = {
                            fileName: modalScope.elements[0].name,
                            fileType: modalScope.elements[0].mimeType
                        };
                        modalScope.download = function () {
                            $scope.download($scope.selectedElements);
                        };
                        modalScope.visualizer.content.classes = 'center';
                        element = $compile('<div ng-include="\'common/visualizers/no-visualizer-template.html\'">')(modalScope);
                    }
                    element.addClass('close-on-click');
                    visualizerModal = $modal({
                        scope: modalScope,
                        templateUrl: 'common/visualizers/visualizer-template.html',
                        show: true
                    });
                    modalScope.$on('modal.show.before', function (event, modal) {
                        modal.$element.find('.visualizer-content').append(element);
                        modalScope.clickContent = function (event) {
                            if (angular.element(event.target).hasClass('close-on-click')) {
                                visualizerModal.hide();
                            }
                        };
                    });
                    $scope.contextMenu();
                });
            }

            $scope.clickPreview = function (_visualizer_) {
                if ($scope.browserService.canPreview) {
                    if (angular.element('.visualizer-modal').length > 0) {
                        Helper.hideModal();
                    } else if (_visualizer_ || $scope.visualizers) {
                        var visualizer = _visualizer_ || $scope.visualizers[0];
                        if (visualizer.needAllChildrenData) {
                            // TODO Won't work for visualizers accepting multiple
                            if (visualizer.isAcceptingSingle()) {
                                getChildrenDataOfTypes(visualizer.getCompatibleTypes(), true, visualizer);
                            }
                        } else {
                            $scope.children = null;
                            finishPreview(visualizer);
                        }
                    }
                }
            };

            $scope.browseToPath = function (path) {
                path = Helper.normalizePath(path);
                setPath(path);
                if (!$scope.isWorkspaceBrowserService) {
                    getParentData();
                }
                clearVisualizers();
            };

            function browseToChild(child) {
                $scope.browseToPath($scope.parent.path + '/' + child.name);
            }

            function browseToParent() {
                if ($scope.path !== '/') {
                    var pathPartsCopy = angular.copy($scope.parent.pathParts);
                    pathPartsCopy.pop();
                    $scope.browseToPath('/' + pathPartsCopy.join('/'));
                }
            }

            function getSelectedElementsCopy() {
                var selectedElementsCopy = angular.copy($scope.selectedElements),
                    matchingSelectedElements,
                    isForceMimeTypesArray = $scope.forceMimeTypes ? angular.isArray($scope.forceMimeTypes) : null;
                if (isForceMimeTypesArray) {
                    matchingSelectedElements = [];
                }
                angular.forEach(selectedElementsCopy, function (element) {
                    if (isForceMimeTypesArray) {
                        var i, mimeTypeRegExp;
                        for (i = 0; i < $scope.forceMimeTypes.length; i++) {
                            mimeTypeRegExp = new RegExp($scope.forceMimeTypes[i], 'i');
                            if (mimeTypeRegExp.test(element.mimeType)) {
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
                    if ($scope.isFileSelectBrowserService) {
                        var elements = getSelectedElementsCopy();
                        if (elements && elements.length > 0) {
                            $rootScope.$emit('browserSelectedElements-' + $scope.fileSelectId, elements);
                        }
                    } else {
                        clickedChildSelectionDeferred.promise.then(function () {
                            if ($scope.visualizers) {
                                $scope.clickPreview();
                            } else {
                                finishPreview();
                            }
                        });
                    }
                }
            };

            // *********************** //
            //          Events         //
            // *********************** //

            $scope.$on('$destroy', function () {
                if ($scope.isWorkspaceBrowserService) {
                    $rootScope.ortolangPageSubtitle = undefined;
                }
                // Unbind listeners
                angular.element($window).unbind('resize.' + $scope.$id);
                angular.element($window).unbind('hide.bs.dropdown.' + $scope.$id);
            });

            $rootScope.$on('browserAskSelectedElements', function () {
                console.log('%s caught event "browserAskSelectedElements"', $scope.browserService.id);
                if ($scope.isFileSelectBrowserService) {
                    var elements = getSelectedElementsCopy();
                    if (elements && elements.length > 0) {
                        console.log('%s emit "browserSelectedElements-%s" event', $scope.browserService.id, $scope.fileSelectId);
                        $scope.$emit('browserSelectedElements-' + $scope.fileSelectId, elements);
                    }
                }
            });

            $rootScope.$on('browserAskChangeWorkspace', function ($event, workspace) {
                console.log('%s caught event "browserAskChangeWorkspace"', $scope.browserService.id);
                $scope.changeWorkspace(workspace);
                $event.stopPropagation();
            });

            function getParentPath(path) {
                if (path) {
                    var parentPath = path.substring(0, path.lastIndexOf('/'));
                    if (parentPath.length === 0) {
                        parentPath = '/';
                    }
                    return parentPath;
                }
                return null;
            }

            function checkUploaderEvent(reprensentation) {
                if (reprensentation) {
                    if (uploadRefreshTimeoutPromise) {
                        $timeout.cancel(uploadRefreshTimeoutPromise);
                    }
                    uploadRefreshTimeoutPromise = $timeout(function () {
                        if (getParentPath(reprensentation.path) === $scope.path) {
                            getParentData(true).then(function () {
                                refreshSelectedElements(reprensentation);
                            });
                        }
                    }, 400);
                }
            }

            $rootScope.$on('uploader.object.create', function ($event, reprensentation) {
                checkUploaderEvent(reprensentation);
            });

            $rootScope.$on('uploader.object.update', function ($event, reprensentation) {
                checkUploaderEvent(reprensentation);
            });

            function checkCreateEvent(eventMessage) {
                if ($scope.browserService.workspace.key === eventMessage.fromObject) {
                    if ($scope.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')($scope.parent.elements, {key: eventMessage.arguments.key}, true);
                                if (filtered.length === 0) {
                                    if (eventRefreshTimeoutPromise) {
                                        $timeout.cancel(eventRefreshTimeoutPromise);
                                    }
                                    eventRefreshTimeoutPromise = $timeout(function () {
                                        getParentData(true);
                                    }, 400);
                                }
                            });
                        }, subTimeout);
                    }
                }
            }

            function checkUpdateEvent(eventMessage) {
                if ($scope.browserService.workspace.key === eventMessage.fromObject) {
                    if ($scope.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')($scope.parent.elements, {key: eventMessage.arguments.key}, true);
                                if (filtered.length === 1) {
                                    if (eventMessage.date - filtered[0].modification < 50) {
                                        // We already have the updated version
                                        return;
                                    }
                                }
                                if (eventRefreshTimeoutPromise) {
                                    $timeout.cancel(eventRefreshTimeoutPromise);
                                }
                                eventRefreshTimeoutPromise = $timeout(function () {
                                    getParentData(true, filtered.length === 0).then(function () {
                                        refreshSelectedElements(filtered[0]);
                                    });
                                }, 400);
                            });
                        }, subTimeout);
                    }
                }
            }

            function checkMoveEvent(eventMessage) {
                if ($scope.browserService.workspace.key === eventMessage.fromObject) {
                    if ($scope.path === getParentPath(eventMessage.arguments['dest-path'])) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')($scope.parent.elements, {key: eventMessage.arguments.key}, true);
                                if (filtered.length === 0) {
                                    if (eventRefreshTimeoutPromise) {
                                        $timeout.cancel(eventRefreshTimeoutPromise);
                                    }
                                    eventRefreshTimeoutPromise = $timeout(function () {
                                        getParentData(true);
                                    }, 400);
                                }
                            });
                        }, subTimeout);
                    } else if ($scope.path === getParentPath(eventMessage.arguments['src-path'])) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                // Check if we have the original element (okey)
                                var filtered = $filter('filter')($scope.parent.elements, {key: eventMessage.arguments.okey}, true);
                                if (filtered.length > 0) {
                                    if (eventRefreshTimeoutPromise) {
                                        $timeout.cancel(eventRefreshTimeoutPromise);
                                    }
                                    eventRefreshTimeoutPromise = $timeout(function () {
                                        getParentData(true, true);
                                    }, 400);
                                }
                            });
                        }, subTimeout);
                    }
                }
            }

            function checkDeleteEvent(eventMessage) {
                if ($scope.browserService.workspace.key === eventMessage.fromObject) {
                    if ($scope.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')($scope.parent.elements, {key: eventMessage.arguments.key}, true);
                                if (filtered.length > 0) {
                                    if (eventRefreshTimeoutPromise) {
                                        $timeout.cancel(eventRefreshTimeoutPromise);
                                    }
                                    eventRefreshTimeoutPromise = $timeout(function () {
                                        filtered = $filter('filter')($scope.selectedElements, {key: '!'+eventMessage.arguments.key}, true);
                                        // The only selected element has been deleted: force parent selection
                                        if (filtered.length === 0) {
                                            getParentData(true, true);
                                        } else {
                                            // If lengths different: the deleted element is selected, remove it from selected elements
                                            if (filtered.length !== $scope.selectedElements.length) {
                                                $scope.selectedElements = filtered;
                                            }
                                            getParentData(true);
                                        }
                                    }, 400);
                                }
                            });
                        }, subTimeout);
                    } else if (eventMessage.type === 'core.collection.delete' &&
                        eventMessage.arguments.path.indexOf($scope.path) === 0) {
                        // If an ancestor collection has been deleted we browse to the parent of the deleted collection
                        $scope.browseToPath(getParentPath(eventMessage.arguments.path));
                    }
                }
            }

            // OBJECT
            $rootScope.$on('core.object.create', function ($event, eventMessage) {
                checkCreateEvent(eventMessage);
            });
            $rootScope.$on('core.object.update', function ($event, eventMessage) {
                checkUpdateEvent(eventMessage);
            });
            $rootScope.$on('core.object.delete', function ($event, eventMessage) {
                checkDeleteEvent(eventMessage);
            });
            $rootScope.$on('core.object.move', function ($event, eventMessage) {
                checkMoveEvent(eventMessage);
            });
            // COLLECTION
            $rootScope.$on('core.collection.create', function ($event, eventMessage) {
                checkCreateEvent(eventMessage);
            });
            $rootScope.$on('core.collection.delete', function ($event, eventMessage) {
                checkDeleteEvent(eventMessage);
            });
            $rootScope.$on('core.collection.move', function ($event, eventMessage) {
                checkMoveEvent(eventMessage);
            });

            $scope.$on('$routeUpdate', function () {
                if ($scope.isWorkspaceBrowserService && $location.search().section === 'content') {
                    if ($location.search().path !== $scope.path) {
                        setPath($location.search().path);
                    }
                    if ($location.search().root && $location.search().root !== $scope.root) {
                        setRoot($location.search().root);
                    }
                    resetFilterModels();
                    getParentData();
                }
            });

            $scope.changeWorkspace = function (workspace) {
                if (!$scope.forceWorkspace) {
                    if (!$scope.isActiveWorkspace(workspace)) {
                        initWorkspaceVariables(workspace);
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
                return $scope.browserService.workspace.key === workspace.key;
            };

            $scope.changeRoot = function (root) {
                if ($scope.path === '/') {
                    setRoot(root);
                } else {
                    // Check if that path exist in the selected version
                    WorkspaceElementResource.get({wskey: $scope.browserService.workspace.key, root: root, path: $scope.path})
                        .$promise.then(function () {
                        setRoot(root);
                    }, function () {
                        setPath('/');
                        setRoot(root);
                    });
                }
            };

            // *********************** //
            //          Filter         //
            // *********************** //

            function clearPreviousFilteringQueries() {
                previousFilterNameQuery = null;
                previousFilterMimeTypeQuery = null;
                previousFilterType = null;
                previousFilteredChildren = {};
            }

            function resetFilterModels() {
                $scope.filterModels = {};
                angular.element('#filter-query-wrapper.open').find('.dropdown-toggle').dropdown('toggle');
            }

            $scope.filterChildren = function (nameQuery, mimeTypeQuery, type) {
                //console.count('Browser filterChildren');
                return function (child) {
                    if (type && child.type !== type) {
                        return false;
                    }
                    if ($scope.hideElements && $scope.hideElements.indexOf(child.key) >= 0) {
                        return false;
                    }
                    if (!nameQuery && !mimeTypeQuery) {
                        return true;
                    }
                    var matchMimeTypes = false,
                        matchName = !nameQuery || nameQuery.length < 2 || new RegExp(nameQuery, 'i').test(child.name);
                    if (matchName) {
                        if (!mimeTypeQuery || mimeTypeQuery.length < 2) {
                            matchMimeTypes = true;
                        } else {
                            if (angular.isArray(mimeTypeQuery)) {
                                var i;
                                for (i = 0; i < mimeTypeQuery.length; i++) {
                                    if (new RegExp(mimeTypeQuery[i], 'i').test(child.mimeType)) {
                                        matchMimeTypes = true;
                                        break;
                                    }
                                }
                            } else {
                                matchMimeTypes = new RegExp(mimeTypeQuery, 'i').test(child.mimeType);
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
                    if (!$scope.hideElements && $scope.filterModels.nameQuery === previousFilterNameQuery &&
                        $scope.filterModels.mimeTypeQuery === previousFilterMimeTypeQuery &&
                        type === previousFilterType) {
                        if (type) {
                            return previousFilteredChildren[type] || $scope.parent.elements;
                        }
                        return previousFilteredChildren.noType || $scope.parent.elements;
                    }
                    var filterResult = $filter('filter')($scope.parent.elements, $scope.filterChildren($scope.filterModels.nameQuery, $scope.filterModels.mimeTypeQuery, type), true);
                    if (type) {
                        previousFilteredChildren[type] = filterResult;
                    } else {
                        previousFilteredChildren.noType = filterResult;
                    }
                    previousFilterNameQuery = $scope.filterModels.nameQuery;
                    previousFilterMimeTypeQuery = $scope.filterModels.mimeTypeQuery;
                    previousFilterType = type;
                    return filterResult;
                }
                return [];
            };

            $scope.order = function (predicate, reverse) {
                // If ask to toggle with a different predicate force reverse to false (ascending)
                if (reverse === undefined || (reverse === 'toggle' && !angular.equals(predicate, $scope.orderProp))) {
                    reverse = false;
                }
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                if ($scope.orderReverse && angular.equals(predicate, ['type','name'])) {
                    // Conserve collection on top of data objects; i.e. reverse only name
                    predicate = ['-type', 'name'];
                }
                $scope.orderProp = predicate;
                lastShiftSelectedElement = null;
            };

            $scope.displayAll = function () {
                $scope.loadingAll = true;
                $timeout(function () {
                    $scope.displayedItemLimit = null;
                });
            };

            function resetDisplayedItemLimit() {
                $scope.displayedItemLimit = initialDisplayedItemLimit;
                $scope.loadingAll = false;
            }

            $scope.openFilter = function (event) {
                event.stopPropagation();
            };

            $scope.$on('ngRepeatRenderingFinished', function() {
                $scope.loadingAll = false;
            });

            angular.element('#filter-query-wrapper').on('hide.bs.dropdown.' + $scope.$id, function () {
                if (($scope.filterModels.nameQuery !== undefined && $scope.filterModels.nameQuery.length !== 0) ||
                    ($scope.filterModels.mimeTypeQuery !== undefined && $scope.filterModels.mimeTypeQuery.length !== 0)) {
                    return false;
                }
            });

            function navigate(down, event) {
                if (angular.element('.visualizer-modal').length === 0 && $scope.isViewModeLine()) {
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
                            lastSelectedElementIndex = lastSelectedElement ? getChildIndex(lastSelectedElement) : null;
                            lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : null;
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
                            if (lastShiftSelectedElementIndex !== null && k === 1 && lastShiftSelectedElementIndex < lastSelectedElementIndex) {
                                if (down) {
                                    i++;
                                } else if (i !== 0) {
                                    i--;
                                }
                                break;
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
                                if (lastSelectedElementIndex !== null) {
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
                                parent = angular.element('.table-wrapper.table-workspace-elements-wrapper'),
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
                $scope.clickPreview();
            }

            function hasOpenedModal() {
                return angular.element('.modal').length > 0;
            }

            function bindHotkeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: ['up', 'shift+up'],
                        description: $translate.instant('BROWSER.SHORTCUTS.UP'),
                        callback: function (event) {
                            if (!hasOpenedModal() || $scope.isFileSelectBrowserService) {
                                preventDefault(event);
                                navigate(false, event);
                            }
                        }
                    })
                    .add({
                        combo: ['down', 'shift+down'],
                        description: $translate.instant('BROWSER.SHORTCUTS.DOWN'),
                        callback: function (event) {
                            if (!hasOpenedModal() || $scope.isFileSelectBrowserService) {
                                preventDefault(event);
                                navigate(true, event);
                            }
                        }
                    })
                    .add({
                        combo: 'backspace',
                        description: $translate.instant('BROWSER.SHORTCUTS.BACKSPACE'),
                        callback: function (event) {
                            if (!hasOpenedModal() || $scope.isFileSelectBrowserService) {
                                preventDefault(event);
                                browseToParent();
                            }
                        }
                    });
                if ($scope.browserService.canSwitchViewMode) {
                    hotkeys.bindTo($scope).add({
                        combo: 'v',
                        description: $translate.instant('BROWSER.SHORTCUTS.VIEW_MODE'),
                        callback: function (event) {
                            if (!hasOpenedModal()) {
                                preventDefault(event);
                                $scope.switchViewMode();
                            }
                        }
                    });
                }
                if ($scope.browserService.displayAsideInfo) {
                    hotkeys.bindTo($scope).add({
                        combo: 'i',
                        description: $translate.instant('BROWSER.SHORTCUTS.INFO'),
                        callback: function (event) {
                            if (!hasOpenedModal()) {
                                preventDefault(event);
                                $scope.toggleAsideInfo();
                            }
                        }
                    });
                }
                if ($scope.browserService.displayAsideWorkspaceList && !$scope.isFileSelectBrowserService) {
                    hotkeys.bindTo($scope).add({
                        combo: 'w',
                        description: $translate.instant('BROWSER.SHORTCUTS.WORKSPACE_LIST'),
                        callback: function (event) {
                            if (!hasOpenedModal()) {
                                preventDefault(event);
                                $scope.toggleWorkspaceList();
                            }
                        }
                    });
                }
                if ($scope.browserService.canPreview) {
                    hotkeys.bindTo($scope)
                        .add({
                            combo: 'space',
                            description: $translate.instant('BROWSER.PREVIEW'),
                            callback: function (event) {
                                if (!hasOpenedModal() || angular.element('.visualizer-modal').length === 1) {
                                    previewWithShortcut(event);
                                }
                            }
                        });
                }
                hotkeys.bindTo($scope)
                    .add({
                        combo: 'enter',
                        description: $translate.instant('BROWSER.SHORTCUTS.ENTER'),
                        callback: function (event) {
                            if (!hasOpenedModal() || $scope.isFileSelectBrowserService) {
                                preventDefault(event);
                                if ($scope.hasOnlyParentSelected()) {
                                    return;
                                }
                                if ($scope.hasOnlyOneElementSelected() && $scope.isCollection($scope.selectedElements[0])) {
                                    browseToChild($scope.selectedElements[0]);
                                } else {
                                    previewWithShortcut(event);
                                }
                            }
                        }
                    })
                    .add({
                        combo: 'mod+f',
                        description: $translate.instant('BROWSER.SHORTCUTS.FILTER'),
                        callback: function (event) {
                            if (!hasOpenedModal()) {
                                preventDefault(event);
                                var filterWrapper = angular.element('#filter-query-wrapper');
                                filterWrapper.find('button').dropdown('toggle');
                                filterWrapper.find('#filter-input').focus();
                            }
                        }
                    })
                    .add({
                        combo: 'mod+a',
                        description: $translate.instant('BROWSER.SHORTCUTS.SELECT_ALL'),
                        callback: function (event) {
                            if (!hasOpenedModal() || ($scope.isFileSelectBrowserService && $scope.fileSelectAcceptMultiple)) {
                                preventDefault(event);
                                selectAll();
                            }
                        }
                    });
                if ($scope.browserService.canEdit) {
                    hotkeys.bindTo($scope).add({
                            combo: 'mod+backspace',
                            description: $translate.instant('BROWSER.SHORTCUTS.DELETE'),
                            callback: function (event) {
                                if (!hasOpenedModal()) {
                                    preventDefault(event);
                                    if (!$scope.hasOnlyParentSelected()) {
                                        $scope.deleteSelectedElements();
                                    }
                                }
                            }
                        })
                        .add({
                            combo: 'shift+f',
                            description: $translate.instant('BROWSER.SHORTCUTS.NEW_COLLECTION'),
                            callback: function (event) {
                                if (!hasOpenedModal()) {
                                    preventDefault(event);
                                    $scope.addCollection();
                                }
                            }
                        })
                        .add({
                            combo: 'u',
                            description: $translate.instant('BROWSER.UPLOAD_FILES'),
                            callback: function (event) {
                                if (!hasOpenedModal()) {
                                    preventDefault(event);
                                    $scope.doAction('uploadFiles');
                                }
                            }
                        });
                }
                hotkeys.get('?').description = $translate.instant('BROWSER.SHORTCUTS.SHOW_SHORTCUTS');
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                bindHotkeys();
            });

            $scope.showCheatsheet = function ($event) {
                hotkeys.get('?').callback($event);
            };

            // *********************** //
            //          Resize         //
            // *********************** //

            $scope.resizeBrowser = function () {
                if ($scope.isMarketBrowserService) {
                    console.log('resize');
                    var topOffset = angular.element('.browser-wrapper').offset().top,
                        height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                    browserToolbarHeight = angular.element('.browser-toolbar').innerHeight();
                    height = height - topOffset;
                    if (height < 1) {
                        height = 1;
                    }
                    if (height > topOffset) {
                        height -= 1;
                        if ($rootScope.uploader && $rootScope.uploader.uploadQueueStatus === 'active') {
                            height -= angular.element('.upload-queue').innerHeight();
                        }
                        var browserWrapper = angular.element('.browser-wrapper'),
                            browserAside = browserWrapper.find('.browser-aside');
                        browserAside.css('min-height', (height - browserToolbarHeight) + 'px');
                        browserAside.find('.my-workspaces').css('height', (height - browserToolbarHeight - 80) + 'px');
                        browserWrapper.find('.table-wrapper.table-workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                        browserWrapper.find('.tile-workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                        browserWrapper.find('.browser-aside-left-collapsed').css('height', (height - browserToolbarHeight) + 'px');
                    }
                    $scope.isScreenMd = window.innerWidth < 992;
                    $scope.browserSettings.hideWorkspaceListMdScreen = $scope.isScreenMd;
                    $scope.$applyAsync();
                }
            };

            angular.element($window).bind('resize.' + $scope.$id, function () {
                $scope.resizeBrowser();
            });

            $rootScope.$watch('uploader.uploadQueueStatus', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.resizeBrowser();
                }
            });

            // *********************** //
            //        View mode        //
            // *********************** //

            function setViewMode(viewMode) {
                $scope.browserSettings.viewMode = viewMode;
                Settings.store();
            }

            $scope.switchViewMode = function () {
                if ($scope.browserService.canSwitchViewMode) {
                    clearPreviousFilteringQueries();
                    $scope.deactivateContextMenu();
                    if ($scope.isViewModeLine()) {
                        setViewMode($scope.viewMode.tile.id);
                    } else {
                        setViewMode($scope.viewMode.line.id);
                    }
                }
            };

            $scope.isViewModeLine = function () {
                return $scope.browserSettings.viewMode === $scope.viewMode.line.id;
            };

            $scope.tileCssClasses = function () {
                if ($scope.browserService.displayAsideInfo && $scope.browserSettings.hideInfo) {
                    return 'col-sm-4 col-md-3 col-lg-3 col-xlg-15 col-xxlg-15';
                }
                return 'col-sm-6 col-md-4 col-lg-4 col-xlg-14 col-xxlg-15';
            };

            $scope.middleCssClass = function () {
                var columnNumber = 12;
                if ($scope.browserService.displayAsideInfo && !$scope.browserSettings.hideInfo) {
                    columnNumber -= 3;
                }
                if ($scope.isScreenMd) {
                    if ($scope.browserService.displayAsideInfo && !$scope.browserSettings.hideInfo) {
                        columnNumber -= 1;
                    }
                } else {
                    if ($scope.displayAsideWorkspaceList() && !$scope.browserSettings.hideWorkspaceList) {
                        columnNumber -= 2;
                    }
                }
                return 'col-sm-' + columnNumber + ($scope.browserSettings.hideWorkspaceList || $scope.browserSettings.hideWorkspaceListMdScreen ? ' browser-middle-collapsed' : '');
            };

            $scope.toggleAsideInfo = function () {
                $scope.browserSettings.hideInfo = !$scope.browserSettings.hideInfo;
                Settings.store();
            };

            $scope.toggleWorkspaceList = function () {
                if ($scope.isScreenMd) {
                    $scope.browserSettings.hideWorkspaceListMdScreen = !$scope.browserSettings.hideWorkspaceListMdScreen;
                } else {
                    $scope.browserSettings.hideWorkspaceList = !$scope.browserSettings.hideWorkspaceList;
                }
                Settings.store();
            };

            $scope.displayAsideWorkspaceList = function () {
                return !$scope.forceWorkspace && $scope.browserService.displayAsideWorkspaceList;
            };

            // *********************** //
            //           Cart          //
            // *********************** //

            $scope.addToCart = function () {
                var path, items = [];
                angular.forEach($scope.selectedElements, function (element) {
                    path = $scope.browserService.workspace.alias + '/' + $scope.root + $scope.path + ($scope.hasOnlyParentSelected() ? '' : element.name);
                    items.push({
                        wsalias: $scope.browserService.workspace.alias,
                        root: $scope.root,
                        name: $scope.hasOnlyParentSelected() ? $scope.parent.name : element.name,
                        type: element.type,
                        mimeType: element.mimeType,
                        path: path
                    });
                });
                Cart.add(items);
            };

            // *********************** //
            //           Init          //
            // *********************** //

            function initLocalVariables() {
                isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                isClickedOnce = false;
                clearPreviousFilteringQueries();
                initialDisplayedItemLimit = 50;
                subTimeout = 500;
                crudTimeout = 400;
            }

            function initScopeVariables() {
                $scope.filterModels = {};
                if ($scope.isFileSelectBrowserService) {
                    $scope.browserService = FileSelectBrowserService;
                    if ($scope.forceMimeTypes) {
                        $scope.filterModels.mimeTypeQuery = $scope.forceMimeTypes;
                    }
                } else if ($route.current && /\/workspaces\/:alias/.test($route.current.originalPath)) {
                    $scope.browserService = WorkspaceBrowserService;
                    $scope.isWorkspaceBrowserService = true;
                } else {
                    $scope.browserService = MarketBrowserService;
                    $scope.isMarketBrowserService = true;
                }
                console.log('Initializing browser using %s', $scope.browserService.id);
                // Settings
                $scope.browserSettings = Settings[$scope.browserService.id];
                if (!$scope.browserSettings.viewMode) {
                    setViewMode($scope.browserService.defaultViewMode);
                }
                $scope.viewMode = {
                    line: {id: 'line', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'},
                    tile: {id: 'tile', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'}
                };
                bindHotkeys();
                $scope.parent = null;
                $scope.children = null;
                $scope.selectedElements = null;
                $scope.ortolangType = ortolangType;
                // Breadcrumb
                $scope.breadcrumbParts = null;
                $scope.breadcrumbDropdownItems = [];
                // Context Menu
                $scope.isContextMenuActive = false;
                $scope.contextMenuItems = [];
                // Filter
                $scope.orderProp = ['type', 'name'];
                $scope.dateFormat = 'short';
                $scope.reverse = false;
                // Visualizers
                $scope.visualizers = null;
                // Workspace
                $scope.isScreenMd = false;
                $scope.displayedItemLimit = initialDisplayedItemLimit;
                $scope.Content = Content;
            }

            function setPath(path) {
                if (path) {
                    if (angular.isUndefined($scope.path) && !$scope.isFileSelectBrowserService) {
                        $location.replace();
                    }
                    path = Helper.normalizePath(path);
                    $scope.path = path;
                    if ($scope.isWorkspaceBrowserService) {
                        $location.search('path', path);
                    }
                }
            }

            function setRoot(root) {
                $scope.root = root;
                $scope.isHead = $scope.root === 'head';
                if ($scope.isWorkspaceBrowserService) {
                    $location.search('root', root);
                }
            }

            function initWorkspaceVariables(workspace, root, path) {
                if (workspace) {
                    $scope.browserService.workspace = workspace;
                }
                if (!$scope.browserService.workspace) {
                    return;
                }
                if ($scope.isFileSelectBrowserService) {
                    $scope.browserSettings.wskey = $scope.browserService.workspace.key;
                }
                Settings.store();
                setRoot(root || 'head');
                setPath(path || '/');
                getSnapshotsHistory();
                getParentData();
                console.log('Browsing workspace "%s"', $scope.browserService.workspace.name || $scope.browserService.workspace.alias);
            }

            function init() {
                initLocalVariables();
                initScopeVariables();
                populateBreadcrumbDropdownMenu();
                if ($scope.isMarketBrowserService) {
                    initWorkspaceVariables(undefined, $scope.root, $location.search().path);
                    if ($location.search().path) {
                        $location.replace();
                        $location.search({});
                    }
                } else {
                    $scope.$on('initWorkspaceVariables', function () {
                        initWorkspaceVariables(undefined, $location.search().root, $location.search().path);
                    });
                    if (!$scope.isFileSelectBrowserService) {
                        initWorkspaceVariables(undefined, $location.search().root, $location.search().path);
                    }
                }
            }
            init();

        }]);
