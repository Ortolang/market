'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
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
 * @property {boolean}  isFileSelect        - If the browser is a file selector browser
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
        '$filter',
        '$timeout',
        '$window',
        '$q',
        '$translate',
        '$modal',
        '$alert',
        '$analytics',
        'hotkeys',
        'ObjectResource',
        'VisualizerService',
        'Content',
        'AuthService',
        'WorkspaceElementResource',
        'icons',
        'ortolangType',
        'browserConfig',
        'Settings',
        'Cart',
        'Helper',
        'url',
        function ($scope, $location, $route, $rootScope, $filter, $timeout, $window, $q, $translate, $modal, $alert, $analytics, hotkeys, ObjectResource, VisualizerService, Content, AuthService, WorkspaceElementResource, icons, ortolangType, browserConfig, Settings, Cart, Helper, url) {

            var ctrl = this;

            var isMobile, isClickedOnce, previousFilterNameQuery, previousFilterMimeTypeQuery, previousFilterType,
                previousFilteredChildren, initialDisplayedItemLimit, lastSelectedElement,
                lastShiftSelectedElement, modalScope, clickedChildSelectionDeferred, eventRefreshTimeoutPromise,
                uploadRefreshTimeoutPromise, parentDataPromise, subTimeout, crudTimeout;

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function populateBreadcrumbDropdownMenu() {
                ctrl.breadcrumbDropdownItems = [];
                if (ctrl.config.canEdit && ctrl.isHead) {
                    ctrl.breadcrumbDropdownItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.plus, action: 'addCollection'});
                    if (ctrl.hasOnlyParentSelected()) {
                        ctrl.breadcrumbDropdownItems.push({divider: true});
                        ctrl.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                        ctrl.breadcrumbDropdownItems.push({text: 'BROWSER.UPLOAD_ZIP', icon: icons.browser.uploadZip, action: 'uploadZip'});
                    }
                    if (!ctrl.hasOnlyRootCollectionSelected()) {
                        ctrl.breadcrumbDropdownItems.push({divider: true});
                        ctrl.breadcrumbDropdownItems.push({text: 'RENAME', icon: icons.edit, action: 'rename'});
                    }
                }
            }

            function buildBreadcrumb() {
                var breadcrumbParts = [], tmp = '';
                angular.forEach(ctrl.parent.pathParts, function (key) {
                    tmp += '/' + key;
                    breadcrumbParts.push(tmp);
                });
                ctrl.breadcrumbParts = breadcrumbParts;
            }

            // *********************** //
            //       Context Menu      //
            // *********************** //

            function clearContextMenuItems() {
                ctrl.contextMenuItems = [];
            }

            function activateContextMenu() {
                ctrl.isContextMenuActive = true;
            }

            ctrl.deactivateContextMenu = function () {
                if (ctrl.isContextMenuActive) {
                    ctrl.isContextMenuActive = false;
                    clearContextMenuItems();
                }
            };

            ctrl.contextMenu = function (clickEvent, sameChild) {
                // If right click
                if (!ctrl.isFileSelect && clickEvent && clickEvent.button === 2) {
                    // If the context menu has already been build no need to do it again
                    if (!(ctrl.isContextMenuActive && sameChild)) {
                        clearContextMenuItems();
                        if (ctrl.config.canEdit && ctrl.isHead && ctrl.hasOnlyParentSelected()) {
                            ctrl.contextMenuItems.push({text: 'BROWSER.NEW_COLLECTION', icon: icons.plus, action: 'addCollection'});
                            //ctrl.contextMenuItems.push({text: 'BROWSER.NEW_LINK', icon: icons.link, action: 'addLink'});
                            ctrl.contextMenuItems.push({divider: true});
                            ctrl.contextMenuItems.push({text: 'BROWSER.UPLOAD_FILES', icon: icons.browser.upload, action: 'uploadFiles'});
                            ctrl.contextMenuItems.push({text: 'BROWSER.UPLOAD_ZIP', icon: icons.browser.uploadZip, action: 'uploadZip'});
                            ctrl.contextMenuItems.push({divider: true});
                        }
                        if (ctrl.config.canPreview) {
                            // TODO Display all compatible visualizers when multiple
                            if (ctrl.visualizers) {
                                ctrl.contextMenuItems.push({text: 'BROWSER.PREVIEW', icon: icons.browser.preview, action: 'preview'});
                            }
                            var hasMD = ctrl.hasOnlyOneElementSelected() && hasXMd(ctrl.selectedElements[0]);
                            if (hasMD) {
                                ctrl.contextMenuItems.push({text: 'BROWSER.SEE_MD', icon: icons.browser.metadata, action: 'showMetadata'});
                            }
                            if (ctrl.visualizers || hasMD) {
                                ctrl.contextMenuItems.push({divider: true});
                            }
                        }
                        if (ctrl.config.canEdit && ctrl.isHead && !ctrl.hasOnlyParentSelected()) {
                            if (ctrl.selectedElements.length === 1) {
                                ctrl.contextMenuItems.push({text: 'RENAME', icon: icons.edit, action: 'rename'});
                            }
                            ctrl.contextMenuItems.push({text: 'BROWSER.MOVE', icon: icons.browser.move, action: 'move'});
                            ctrl.contextMenuItems.push({text: 'BROWSER.DELETE', icon: icons.browser.delete, action: 'delete'});
                            ctrl.contextMenuItems.push({divider: true});
                        }
                        if (ctrl.config.canDownload && !ctrl.hasOnlyParentSelected()) {
                            if (ctrl.isMarket && ctrl.hasOnlyOneElementSelected()) {
                                ctrl.contextMenuItems.push({text: 'SHARE', icon: icons.share, action: 'share'});
                            }
                            ctrl.contextMenuItems.push({text: 'DOWNLOAD', icon: icons.browser.download, action: 'download'});
                            //ctrl.contextMenuItems.push({text: 'BROWSER.ADD_TO_CART', icon: icons.cartPlus, action: 'addToCart'});
                            ctrl.contextMenuItems.push({divider: true});
                        }
                        ctrl.contextMenuItems.push({text: ctrl.viewMode[ctrl.browserSettings.viewMode].text, icon: ctrl.viewMode[ctrl.browserSettings.viewMode].icon, action: 'switchViewMode'});
                        if (ctrl.contextMenuItems.length > 0 && ctrl.contextMenuItems[ctrl.contextMenuItems.length - 1].divider) {
                            ctrl.contextMenuItems.pop();
                        }
                        activateContextMenu();
                    }
                    if (ctrl.contextMenuItems.length > 0) {
                        var wrapper = angular.element('.browser-wrapper'),
                            wrapperOffset = wrapper.offset(),
                            top = clickEvent.pageY - wrapperOffset.top - 3,
                            estimatedHeight = ctrl.contextMenuItems.length * 32,
                            bottom;
                        ctrl.contextMenuStyle = {
                            left: clickEvent.pageX - wrapperOffset.left - 3 + 'px'
                        };
                        if (top + estimatedHeight > wrapper.height()) {
                            bottom = wrapper.height() - clickEvent.pageY + wrapperOffset.top;
                            ctrl.contextMenuStyle.bottom = bottom + 'px';
                        } else {
                            ctrl.contextMenuStyle.top = top + 'px';
                        }
                    }
                } else {
                    ctrl.deactivateContextMenu();
                }
            };

            // *********************** //
            //         Get Data        //
            // *********************** //


            function getParentData(refresh, forceNewSelection) {
                if (refresh === undefined) {
                    refresh = false;
                }
                parentDataPromise = WorkspaceElementResource.get({wskey: ctrl.workspace.key, path: ctrl.path, root: ctrl.root, policy: !ctrl.isFileSelect}).$promise;
                parentDataPromise.then(function (element) {
                    resetDisplayedItemLimit();
                    ctrl.parent = element;
                    // If hasOnlyParentSelected then we need to select parent again to force angular to refresh aside info
                    if (ctrl.hasOnlyParentSelected() || !refresh || forceNewSelection) {
                        newSelectedElement(ctrl.parent);
                    }
                    // If we just refreshed the data no need to build the breadcrumb again
                    if (!refresh) {
                        buildBreadcrumb();
                        populateBreadcrumbDropdownMenu();
                        angular.element('.table-wrapper.table-workspace-elements-wrapper').scrollTop(0);
                    }
                    clearPreviousFilteringQueries();
                    var allChildrenMimeTypesValues = [];
                    ctrl.filterModels.allChildrenMimeTypes = [];
                    angular.forEach(ctrl.parent.elements, function (value) {
                        if (allChildrenMimeTypesValues.indexOf(value.mimeType) === -1) {
                            allChildrenMimeTypesValues.push(value.mimeType);
                            ctrl.filterModels.allChildrenMimeTypes.push({value: value.mimeType, label: '<span class="type ' + $filter('mimeTypeIconCss')(value.mimeType) + '"></span>' + value.mimeType});
                        }
                    });
                    if (ctrl.isWorkspace) {
                        if (ctrl.path === '/') {
                            $rootScope.ortolangPageSubtitle = ctrl.workspace.alias + ' : / | ';
                        } else {
                            $rootScope.ortolangPageSubtitle = ctrl.workspace.alias + ' : ' + ctrl.path.slice(ctrl.path.lastIndexOf('/') + 1) + ' | ';
                        }
                    }
                }, function (response) {
                    if (response.status === 401) {
                        if (ctrl.isMarket && ctrl.path === '/' && $scope.browseContent) {
                            $scope.browseContent();
                        }
                    } else {
                        Helper.showErrorModal(response.data);
                        initWorkspaceVariables();
                    }
                });
                return parentDataPromise;
            }

            function getSnapshotNameFromHistory(workspaceSnapshot) {
                if (ctrl.workspace.snapshots) {
                    var filteredSnapshot = $filter('filter')(ctrl.workspace.snapshots, {key: workspaceSnapshot.key}, true);
                    if (filteredSnapshot.length === 1) {
                        return filteredSnapshot[0].name;
                    }
                }
                return null;
            }

            function getTagName(workspaceSnapshotName) {
                if (ctrl.workspace.tags) {
                    var filteredTag = $filter('filter')(ctrl.workspace.tags, {snapshot: workspaceSnapshotName}, true);
                    if (filteredTag.length === 1) {
                        return filteredTag[0].name;
                    }
                }
                return null;
            }

            function getSnapshotsHistory() {
                ctrl.workspaceHistoryTags = {};
                if (!ctrl.isMarket) {
                    ObjectResource.history({key: ctrl.workspace.head}, function (data) {
                        ctrl.workspaceHistory = data;
                        angular.forEach(data, function (workspaceSnapshot) {
                            workspaceSnapshot.name = getSnapshotNameFromHistory(workspaceSnapshot);
                            workspaceSnapshot.tag = getTagName(workspaceSnapshot.name);
                            if (workspaceSnapshot.name) {
                                ctrl.workspaceHistoryTags[workspaceSnapshot.name] = workspaceSnapshot.tag || workspaceSnapshot.name;
                            }
                        });
                    });
                } else {
                    ctrl.workspaceHistoryTags[ctrl.root] = getTagName(ctrl.root);
                }
            }

            function hasXMd(object) {
                var i;
                for (i = 0; i < object.metadatas.length; i++) {
                    if (/^system-x-(\w+)-json$/.test(object.metadatas[i].name)) {
                        return true;
                    }
                }
                return false;
            }

            function checkMetadata(object) {
                if (object.type === ortolangType.object) {
                    angular.forEach(object.metadatas, function (metadata) {
                        var type;
                        var exec = /^system-x-(\w+)-json$/.exec(metadata.name);
                        if (exec) {
                            type = exec[1];
                        }
                        if (type) {
                            Content.downloadWithKey(metadata.key).promise.then(function (data) {
                                var md = angular.fromJson(data.data);
                                if (md['X-Parsed-By'] !== 'org.apache.tika.parser.EmptyParser') {
                                    object.x = md;
                                    object['X-Type'] = type;
                                }
                            });
                        }
                    });
                }
            }

            ctrl.showMetadata = function () {
                createModalScope();
                modalScope.metadata = ctrl.selectedElements[0].x;
                var tmp = [];
                angular.forEach(modalScope.metadata, function (v, k) {
                    tmp.push({
                        name: k,
                        value: v
                    });
                });
                modalScope.metadata = tmp;
                modalScope.isArray = angular.isArray;
                $modal({
                    scope: modalScope,
                    templateUrl: 'common/directives/metadata-modal-template.html',
                    show: true
                });
            };

            ctrl.showAclLegend = function ($event) {
                createModalScope();
                modalScope.AuthService = AuthService;
                $event.stopPropagation();
                $modal({
                    scope: modalScope,
                    templateUrl: 'common/directives/acl-legend-modal-template.html',
                    show: true
                });
            };

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
                        ctrl.selectedElements.push(data);
                        if (push !== 'shift') {
                            lastSelectedElement = data;
                        }
                    } else {
                        newSelectedElement(data);
                        lastSelectedElement = data;
                        checkMetadata(data);
                    }
                    checkCompatibleVisualizers();
                    if (!refresh) {
                        ctrl.contextMenu(clickEvent, false);
                    }
                });
                return promise;
            }

            function selectAll() {
                if (ctrl.hasOnlyParentSelected()) {
                    ctrl.selectedElements = [];
                }
                angular.forEach(ctrl.parent.elements, function (child) {
                    if (!ctrl.isSelected(child)) {
                        selectChild(child, 'shift');
                    }
                });
                lastSelectedElement = null;
                lastShiftSelectedElement = null;
            }

            function getChildData(child) {
                return WorkspaceElementResource.get({
                    wskey: ctrl.workspace.key,
                    path: ctrl.path + '/' + child.name,
                    root: ctrl.root,
                    policy: ctrl.isWorkspace
                }).$promise;
            }

            ctrl.download = function () {
                var paths = [],
                    elements = ctrl.selectedElements;
                if (elements.length > 1 || elements[0].type === ortolangType.collection) {
                    angular.forEach(elements, function (element) {
                        paths.push(Helper.normalizePath(ctrl.workspace.alias + '/' + ctrl.root + ctrl.path + (ctrl.hasOnlyParentSelected() ? '' : '/' + element.name)));
                    });
                    if (elements.length === 1) {
                        if (ctrl.path === '/' && ctrl.hasOnlyParentSelected()) {
                            // Root collection
                            Content.export(paths, ctrl.workspace.alias);
                        } else {
                            // A folder: the name of the archive is the name of the folder
                            Content.export(paths, elements[0].name);
                        }
                    } else {
                        Content.export(paths);
                    }
                } else {
                    var elementPath = Helper.normalizePath(ctrl.path + (ctrl.hasOnlyParentSelected() ? '' : '/' + elements[0].name));
                    paths.push(Helper.normalizePath(ctrl.workspace.alias + '/' + ctrl.root + elementPath));
                    Content.downloadWithPathInWindow(elementPath, ctrl.workspace.alias, ctrl.root);
                }
                if (ctrl.isMarket) {
                    angular.forEach(paths, function (path) {
                        $analytics.trackLink(url.content + '/' + path, 'download');
                    });
                }
            };

            ctrl.share = function () {
                createModalScope();
                modalScope.models = {
                    type: ctrl.selectedElements[0].type,
                    name: ctrl.selectedElements[0].name
                };
                modalScope.handles = {};
                ObjectResource.pids({key: ctrl.selectedElements[0].key}, function (data) {
                    modalScope.handles.others = [];
                    angular.forEach(data, function (handle) {
                        handle = handle.toLowerCase();
                        var parts = handle.split('/');
                        if (parts[0] === url.handlePrefix && parts[1] === ctrl.workspace.alias) {
                            if (parts[2] === ctrl.workspaceHistoryTags[ctrl.root]) {
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

            function createModalScope(isolate, autofocus) {
                modalScope = Helper.createModalScope(isolate, autofocus);
                modalScope.$on('modal.show.before', function () {
                    ctrl.deactivateContextMenu();
                });
            }

            // *********************** //
            //        Selection        //
            // *********************** //

            ctrl.isSelected = function (element) {
                var i;
                for (i = 0; i < ctrl.selectedElements.length; i++) {
                    if (ctrl.selectedElements[i].key === element.key) {
                        return true;
                    }
                }
                return false;
            };

            ctrl.hasOnlyParentSelected = function () {
                return !ctrl.selectedElements || (ctrl.selectedElements.length === 1 && ctrl.selectedElements[0].key === ctrl.parent.key);
            };

            ctrl.hasOnlyOneElementSelected = function () {
                return ctrl.selectedElements && ctrl.selectedElements.length === 1;
            };

            ctrl.hasOnlyRootCollectionSelected = function () {
                return ctrl.hasOnlyParentSelected() && (ctrl.path === null || ctrl.path === '/');
            };

            ctrl.browserHelperFn = {
                hasOnlyParentSelected: ctrl.hasOnlyParentSelected,
                hasOnlyOneElementSelected: ctrl.hasOnlyOneElementSelected
            };

            function refreshSelectedElements(updatedElement) {
                if (updatedElement && !ctrl.hasOnlyParentSelected()) {
                    if (ctrl.hasOnlyOneElementSelected()) {
                        if (ctrl.selectedElements[0].key === updatedElement.key ||
                            ctrl.selectedElements[0].name === updatedElement.name) {
                            selectChild(ctrl.selectedElements[0], undefined, undefined, true);
                        }
                    } else {
                        // If there are several elements selected we force a new selection with parent KISS
                        newSelectedElement(ctrl.parent);
                    }
                }
            }

            function deselectChild(child) {
                ctrl.selectedElements = $filter('filter')(ctrl.selectedElements, {key: '!' + child.key}, true);
                if (ctrl.selectedElements.length === 0) {
                    newSelectedElement(ctrl.parent);
                }
                checkCompatibleVisualizers();
            }

            function deselectOthers(child) {
                selectChild(child);
            }

            function deselectChildren() {
                ctrl.selectedElements = [ctrl.parent];
                ctrl.deactivateContextMenu();
                clearVisualizers();
            }

            function getChildIndex(child) {
                var i,
                    filteredOrderedChildren = ctrl.filteredOrderedChildren();
                for (i = 0; i < filteredOrderedChildren.length; i++) {
                    if (filteredOrderedChildren[i].key === child.key) {
                        return i;
                    }
                }
                return -1;
            }

            ctrl.clickChild = function (child, $event) {
                if (isMobile &&  $event && $event.button !== 2) {
                    clickedChildSelectionDeferred = $q.defer();
                    selectChild(child, false, $event).then(function () {
                        clickedChildSelectionDeferred.resolve();
                    });
                    ctrl.doubleClickChild(child);
                    return;
                }
                var modKey = Helper.isMac() ? $event.metaKey : $event.ctrlKey;
                if (ctrl.isSelected(child) && !$event.shiftKey) {
                    if (modKey) {
                        deselectChild(child);
                    } else if ($event.button === 0) {
                        if (!ctrl.hasOnlyOneElementSelected()) {
                            // Check if the user left-clicked again on the same element
                            if (child.key !== ctrl.selectedElements[ctrl.selectedElements.length - 1].key) {
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
                    ctrl.contextMenu($event, true);
                } else {
                    if ((!ctrl.isFileSelect || ctrl.fileSelectAcceptMultiple) &&
                        (modKey || $event.shiftKey) && !ctrl.hasOnlyParentSelected()) {
                        if (modKey) {
                            selectChild(child, 'mod', $event);
                        } else if ($event.shiftKey) {
                            var lastSelectedElementIndex = getChildIndex(lastSelectedElement),
                                lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : null,
                                childIndex = getChildIndex(child),
                                i,
                                j,
                                filteredOrderedChildren = ctrl.filteredOrderedChildren(),
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
                                    if (!ctrl.isSelected(filteredOrderedChildren[i])) {
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
            };

            function newSelectedElement(element) {
                ctrl.selectedElements = [element];
            }

            ctrl.preventRightClick = function () {};

            ctrl.checkSelection = function ($event) {
                if ((ctrl.workspace || ctrl.isMarket) &&
                    !angular.element($event.target).closest('.workspace-element').length) {
                    deselectChildren();
                    ctrl.contextMenu($event, false);
                }
            };

            // *********************** //
            //         Delete          //
            // *********************** //

            ctrl.delete = function () {
                if (!ctrl.hasOnlyParentSelected()) {
                    var sources = [],
                        collectionNumber = 0,
                        objectNumber = 0,
                        deferred = $q.defer(),
                        deleteMultipleElementsModal;
                    angular.forEach(ctrl.selectedElements, function (element) {
                        sources.push(Helper.normalizePath(ctrl.parent.path + '/' + element.name));
                        if (element.type === ortolangType.collection) {
                            collectionNumber++;
                        } else if (element.type === ortolangType.object) {
                            objectNumber++;
                        }
                    });
                    if (collectionNumber || objectNumber > 1) {
                        createModalScope();
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
                            templateUrl: 'browser/templates/delete-multiple-elements.modal.html',
                            show: true
                        });
                    } else {
                        deferred.resolve();
                    }
                    deferred.promise.then(function () {
                        WorkspaceElementResource.bulkAction({wskey: ctrl.workspace.key}, {action: 'delete', sources: sources, force: true}, function () {
                            getParentData(true, true);
                        }, function (error) {
                            Helper.showErrorModal(error.data);
                        });
                    });
                    ctrl.deactivateContextMenu();
                }
            };

            // *********************** //
            //       Upload Zip        //
            // *********************** //

            function uploadZip() {
                var uploadZipModal;
                createModalScope();
                modalScope.parent = ctrl.parent;
                modalScope.wsName = ctrl.workspace.name;
                modalScope.models.zipoverwrites = false;
                modalScope.models.root = '';
                modalScope.uploadZip = function () {
                    var files = angular.element('#upload-zip-file').prop('files');
                    $rootScope.uploader.addToQueue(files, {
                        'process-name': $translate.instant('WORKSPACE.PROCESS_NAMES.IMPORT_ZIP', {zipName: files[0].name, wsName: ctrl.workspace.name}),
                        'ziproot': Helper.normalizePath(ctrl.parent.path + '/' + modalScope.models.root),
                        'zipoverwrites': modalScope.models.zipoverwrites,
                        'wskey': ctrl.workspace.key,
                        'wsName': ctrl.workspace.name,
                        'ortolangType': 'zip'
                    });
                    uploadZipModal.hide();
                };
                uploadZipModal = $modal({
                    scope: modalScope,
                    templateUrl: 'browser/templates/upload-zip.modal.html',
                    show: true
                });
            }

            // *********************** //
            //     Add Collection      //
            // *********************** //

            ctrl.addCollection = function () {
                if (ctrl.config.canEdit && ctrl.isHead) {
                    var addCollectionModal;
                    createModalScope(true, true);
                    modalScope.submit = function (form) {
                        var formData,
                            path = ctrl.parent.path + '/';

                        if (ctrl.hasOnlyOneElementSelected() && !ctrl.hasOnlyParentSelected() &&
                            Helper.isCollection(ctrl.selectedElements[0])) {
                            path += ctrl.selectedElements[0].name + '/';
                        }
                        path += modalScope.models.newCollectionName;

                        formData = new FormData();
                        formData.append('path', path);
                        formData.append('type', ortolangType.collection);
                        WorkspaceElementResource.post({wskey: ctrl.workspace.key}, formData, function () {
                            getParentData(true).then(function () {
                                var filtered = $filter('filter')(ctrl.parent.elements, {name: modalScope.models.newCollectionName}, true);
                                if (filtered.length === 1) {
                                    selectChild(filtered[0]);
                                }
                                addCollectionModal.hide();
                            });
                        }, function (error) {
                            if (error.data.code === '2') {
                                form.name.$setValidity('conflict', false);
                            } else {
                                Helper.showUnexpectedErrorAlert('#add-collection-modal', 'top');
                            }
                        });
                    };
                    addCollectionModal = $modal({
                        scope: modalScope,
                        templateUrl: 'browser/templates/add-collection.modal.html',
                        show: true
                    });
                }
            };

            ctrl.rename = function () {
                if (ctrl.config.canEdit && ctrl.isHead) {
                    var renameModal;
                    createModalScope(true, true);
                    modalScope.models.childNewName = ctrl.selectedElements[0].name;
                    modalScope.rename = function () {
                        if (modalScope.childNewName !== ctrl.selectedElements[0].name) {
                            var data = ctrl.selectedElements[0], destination;
                            if (ctrl.hasOnlyParentSelected()) {
                                destination = ctrl.parent.path.substring(0, ctrl.parent.path.lastIndexOf('/'));
                            } else {
                                destination = ctrl.parent.path;
                            }
                            destination += '/' + modalScope.models.childNewName;

                            WorkspaceElementResource.put({wskey: ctrl.workspace.key, destination: destination}, data, function (element) {
                                if (ctrl.hasOnlyParentSelected()) {
                                    ctrl.browseToPath(destination);
                                    renameModal.hide();
                                } else {
                                    getParentData(true).then(function () {
                                        ctrl.selectedElements[0].name = modalScope.models.childNewName;
                                        refreshSelectedElements(element);
                                        renameModal.hide();
                                    });
                                }
                            });
                        } else {
                            renameModal.hide();
                        }
                    };
                    renameModal = $modal({
                        scope: modalScope,
                        templateUrl: 'browser/templates/rename.modal.html',
                        show: true
                    });
                }
            };

            ctrl.move = function () {
                if (ctrl.config.canEdit && ctrl.isHead) {
                    var moveModal, hideElements = [], sources = [];
                    createModalScope();
                    modalScope.title = 'WORKSPACE.MOVE_CHILD_MODAL.TITLE';
                    modalScope.titleValues = {name: ctrl.selectedElements.length > 1 ? '' : ctrl.selectedElements[0].name};
                    modalScope.forceWorkspace = ctrl.workspace.key;
                    modalScope.forceHead = true;
                    angular.forEach(ctrl.selectedElements, function (selectedElement) {
                        hideElements.push(selectedElement.key);
                        sources.push(Helper.normalizePath(ctrl.path + '/' + selectedElement.name));
                    });
                    modalScope.hideElements = hideElements;
                    modalScope.forcePath = ctrl.parent.path;
                    modalScope.forceMimeTypes = 'ortolang/collection';
                    modalScope.acceptMultiple = false;
                    modalScope.fileSelectId = 'moveChildModal';

                    modalScope.$on('browserSelectedElements-moveChildModal', function ($event, elements) {
                        modalScope.move(elements[0]);
                    });

                    modalScope.move = function (destination) {
                        WorkspaceElementResource.bulkAction({wskey: ctrl.workspace.key}, {action: 'move', sources: sources, destination: destination.path}, function () {
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
                        templateUrl: 'browser/browser-file-select-modal-template.html',
                        show: true
                    });
                }
            };

            ctrl.doAction = function (name) {
                switch (name) {
                    case 'uploadFiles':
                        // Using $timeout to prevent '$apply already in progress' error
                        $timeout(function () {
                            angular.element('#object-upload-file-select').click();
                        });
                        break;
                    case 'addFileMobile':
                        $timeout(function () {
                            angular.element('.mobile-add-file').click();
                        });
                        break;
                    default:
                        if (ctrl[name]) {
                            ctrl[name]();
                        }
                        break;
                }
                ctrl.deactivateContextMenu();
            };

            // *********************** //
            //       Visualizers       //
            // *********************** //

            function clearVisualizers() {
                ctrl.visualizers = null;
            }

            function checkCompatibleVisualizers() {
                ctrl.visualizers = VisualizerService.getCompatibleVisualizers(ctrl.selectedElements);
                if (ctrl.visualizers.length === 0) {
                    clearVisualizers();
                }
            }

            function checkPermissions(deferred) {
                var authorized = true,
                    promises = [],
                    i;
                for (i = 0; i < ctrl.selectedElements.length; i++) {
                    if (ctrl.selectedElements[i].unrestrictedDownload === false) {
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
                    angular.forEach(ctrl.selectedElements, function (element) {
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
            }

            ctrl.preview = function (visualizer) {
                if (ctrl.config.canPreview) {
                    if (Helper.isModalOpened('visualizer')) {
                        Helper.hideModal();
                    } else {
                        createModalScope(true);
                        visualizer = visualizer || (ctrl.visualizers ? ctrl.visualizers[0] : undefined);
                        // No visualizer available for this type of file
                        if (angular.isUndefined(visualizer)) {
                            modalScope.data = {
                                element: ctrl.selectedElements[0]
                            };
                            modalScope.actions = {
                                download: function () {
                                    ctrl.download();
                                }
                            };
                            VisualizerService.showModal(modalScope);
                            return;
                        }
                        // If market we need to check if the user can download the file(s)
                        var deferred = $q.defer();
                        if (ctrl.isMarket) {
                            checkPermissions(deferred);
                        } else {
                            deferred.resolve();
                        }
                        deferred.promise.then(function () {
                            modalScope.data = {};
                            angular.forEach(visualizer.data, function (name) {
                                switch (name) {
                                    case 'root':
                                        modalScope.data.root = ctrl.root;
                                        break;
                                    case 'alias':
                                        modalScope.data.alias = ctrl.workspace.alias;
                                        break;
                                    case 'element':
                                        modalScope.data.element = ctrl.selectedElements[0];
                                        break;
                                    case 'elements':
                                        modalScope.data.elements = ctrl.selectedElements;
                                        break;
                                    case 'parent':
                                        modalScope.data.parent = ctrl.parent;
                                        break;
                                }
                            });
                            modalScope.visualizer = visualizer;
                            VisualizerService.showModal(modalScope);
                        });
                    }
                }
            };

            ctrl.browseToPath = function (path) {
                path = Helper.normalizePath(path);
                setPath(path);
                if (!ctrl.isWorkspace) {
                    getParentData();
                }
                clearVisualizers();
            };

            function browseToChild(child) {
                ctrl.browseToPath(ctrl.parent.path + '/' + child.name);
            }

            ctrl.browseToParent = function () {
                if (ctrl.path !== '/') {
                    var pathPartsCopy = angular.copy(ctrl.parent.pathParts);
                    pathPartsCopy.pop();
                    ctrl.browseToPath('/' + pathPartsCopy.join('/'));
                }
            };

            function getSelectedElementsCopy() {
                var selectedElementsCopy = angular.copy(ctrl.selectedElements),
                    matchingSelectedElements,
                    isForceMimeTypesArray = ctrl.forceMimeTypes ? angular.isArray(ctrl.forceMimeTypes) : null;
                if (isForceMimeTypesArray) {
                    matchingSelectedElements = [];
                }
                angular.forEach(selectedElementsCopy, function (element) {
                    if (isForceMimeTypesArray) {
                        var i, mimeTypeRegExp;
                        for (i = 0; i < ctrl.forceMimeTypes.length; i++) {
                            mimeTypeRegExp = new RegExp(ctrl.forceMimeTypes[i], 'i');
                            if (mimeTypeRegExp.test(element.mimeType)) {
                                matchingSelectedElements.push(element);
                                break;
                            }
                        }
                    }
                });
                if (ctrl.forceMimeTypes && !isForceMimeTypesArray) {
                    matchingSelectedElements = $filter('filter')(selectedElementsCopy, {mimeType: ctrl.forceMimeTypes}, false);
                }
                return ctrl.forceMimeTypes ? matchingSelectedElements : selectedElementsCopy;
            }

            ctrl.doubleClickChild = function (child) {
                if (Helper.isCollection(child)) {
                    browseToChild(child);
                } else {
                    if (ctrl.isFileSelect) {
                        var elements = getSelectedElementsCopy();
                        if (elements && elements.length > 0) {
                            $rootScope.$emit('browserSelectedElements-' + ctrl.fileSelectId, elements);
                        }
                    } else {
                        clickedChildSelectionDeferred.promise.then(function () {
                            ctrl.preview();
                        });
                    }
                }
            };

            // *********************** //
            //          Events         //
            // *********************** //

            $scope.$on('$destroy', function () {
                if (ctrl.isWorkspace) {
                    $rootScope.ortolangPageSubtitle = undefined;
                }
                // Unbind listeners
                angular.element($window).unbind('hide.bs.dropdown.' + $scope.$id);
            });

            $rootScope.$on('browserAskSelectedElements', function () {
                console.log('%s caught event "browserAskSelectedElements"', ctrl.config.id);
                if (ctrl.isFileSelect) {
                    var elements = getSelectedElementsCopy();
                    if (elements && elements.length > 0) {
                        //console.log('%s emit "browserSelectedElements-%s" event', ctrl.config.id, ctrl.fileSelectId);
                        $scope.$emit('browserSelectedElements-' + ctrl.fileSelectId, elements);
                    }
                }
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

            function checkUploaderEvent(representation) {
                if (representation) {
                    if (uploadRefreshTimeoutPromise) {
                        $timeout.cancel(uploadRefreshTimeoutPromise);
                    }
                    uploadRefreshTimeoutPromise = $timeout(function () {
                        if (getParentPath(representation.path) === ctrl.path) {
                            getParentData(true).then(function () {
                                refreshSelectedElements(representation);
                            });
                        }
                    }, 400);
                }
            }

            $rootScope.$on('uploader.object.create', function ($event, representation) {
                checkUploaderEvent(representation);
            });

            $rootScope.$on('uploader.object.update', function ($event, representation) {
                checkUploaderEvent(representation);
            });

            function checkCreateEvent(eventMessage) {
                if (ctrl.workspace.key === eventMessage.fromObject) {
                    if (ctrl.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')(ctrl.parent.elements, {key: eventMessage.arguments.key}, true);
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
                if (ctrl.workspace.key === eventMessage.fromObject) {
                    if (ctrl.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')(ctrl.parent.elements, {key: eventMessage.arguments.key}, true);
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
                if (ctrl.workspace.key === eventMessage.fromObject) {
                    if (ctrl.path === getParentPath(eventMessage.arguments['dest-path'])) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')(ctrl.parent.elements, {key: eventMessage.arguments.key}, true);
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
                    } else if (ctrl.path === getParentPath(eventMessage.arguments['src-path'])) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                // Check if we have the original element (okey)
                                var filtered = $filter('filter')(ctrl.parent.elements, {key: eventMessage.arguments.okey}, true);
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
                if (ctrl.workspace.key === eventMessage.fromObject) {
                    if (ctrl.path === getParentPath(eventMessage.arguments.path)) {
                        $timeout(function () {
                            parentDataPromise.then(function () {
                                var filtered = $filter('filter')(ctrl.parent.elements, {key: eventMessage.arguments.key}, true);
                                if (filtered.length > 0) {
                                    if (eventRefreshTimeoutPromise) {
                                        $timeout.cancel(eventRefreshTimeoutPromise);
                                    }
                                    eventRefreshTimeoutPromise = $timeout(function () {
                                        filtered = $filter('filter')(ctrl.selectedElements, {key: '!'+eventMessage.arguments.key}, true);
                                        // The only selected element has been deleted: force parent selection
                                        if (filtered.length === 0) {
                                            getParentData(true, true);
                                        } else {
                                            // If lengths different: the deleted element is selected, remove it from selected elements
                                            if (filtered.length !== ctrl.selectedElements.length) {
                                                ctrl.selectedElements = filtered;
                                            }
                                            getParentData(true);
                                        }
                                    }, 400);
                                }
                            });
                        }, subTimeout);
                    } else if (eventMessage.type === 'core.collection.delete' &&
                        eventMessage.arguments.path.indexOf(ctrl.path) === 0) {
                        // If an ancestor collection has been deleted we browse to the parent of the deleted collection
                        ctrl.browseToPath(getParentPath(eventMessage.arguments.path));
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
                if (ctrl.isMarket || (ctrl.isWorkspace && $location.search().section === 'content')) {
                    if ($location.search().path !== ctrl.path) {
                        setPath($location.search().path);
                    }
                    if ($location.search().root && $location.search().root !== ctrl.root) {
                        setRoot($location.search().root);
                    }
                    resetFilterModels();
                    getParentData();
                }
            });

            ctrl.changeWorkspace = function (workspace) {
                if (!ctrl.forceWorkspace) {
                    // If not the active workspace
                    if (workspace !== ctrl.workspace) {
                        initWorkspaceVariables(workspace);
                    } else {
                        if (ctrl.path !== '/') {
                            ctrl.browseToPath('/');
                        } else {
                            deselectChildren();
                        }
                    }
                }
            };

            ctrl.changeRoot = function (root) {
                if (ctrl.path === '/') {
                    setRoot(root);
                } else {
                    // Check if that path exist in the selected version
                    WorkspaceElementResource.get({wskey: ctrl.workspace.key, root: root, path: ctrl.path})
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
                ctrl.filterModels = {};
                angular.element('#filter-query-wrapper.open').find('.dropdown-toggle').dropdown('toggle');
            }

            ctrl.filterChildren = function (nameQuery, mimeTypeQuery, type) {
                //console.count('Browser filterChildren');
                return function (child) {
                    if (type && child.type !== type) {
                        return false;
                    }
                    if (ctrl.hideElements && ctrl.hideElements.indexOf(child.key) >= 0) {
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

            ctrl.filteredOrderedChildren = function () {
                ctrl.filteredOrderedChildrenArray = $filter('orderBy')(ctrl.filteredChildren(), ctrl.orderProp, ctrl.orderReverse);
                return ctrl.filteredOrderedChildrenArray;
            };

            ctrl.filteredChildren = function (type) {
                //console.count('Browser filteredChildren');
                if (ctrl.parent && ctrl.parent.elements) {
                    if (!ctrl.hideElements && ctrl.filterModels.nameQuery === previousFilterNameQuery &&
                        ctrl.filterModels.mimeTypeQuery === previousFilterMimeTypeQuery &&
                        type === previousFilterType) {
                        if (type) {
                            return previousFilteredChildren[type] || ctrl.parent.elements;
                        }
                        return previousFilteredChildren.noType || ctrl.parent.elements;
                    }
                    var filterResult = $filter('filter')(ctrl.parent.elements, ctrl.filterChildren(ctrl.filterModels.nameQuery, ctrl.filterModels.mimeTypeQuery, type), true);
                    if (type) {
                        previousFilteredChildren[type] = filterResult;
                    } else {
                        previousFilteredChildren.noType = filterResult;
                    }
                    previousFilterNameQuery = ctrl.filterModels.nameQuery;
                    previousFilterMimeTypeQuery = ctrl.filterModels.mimeTypeQuery;
                    previousFilterType = type;
                    return filterResult;
                }
                return [];
            };

            ctrl.order = function (predicate, reverse) {
                // If ask to toggle with a different predicate force reverse to false (ascending)
                if (reverse === undefined || (reverse === 'toggle' && !angular.equals(predicate, ctrl.orderProp))) {
                    reverse = false;
                }
                ctrl.orderReverse = reverse === 'toggle' ? !ctrl.orderReverse : reverse;
                if (ctrl.orderReverse && angular.equals(predicate, ['type','name'])) {
                    // Conserve collection on top of data objects; i.e. reverse only name
                    predicate = ['-type', 'name'];
                }
                ctrl.orderProp = predicate;
                lastShiftSelectedElement = null;
            };

            ctrl.displayAll = function () {
                ctrl.loadingAll = true;
                $timeout(function () {
                    ctrl.displayedItemLimit = null;
                });
            };

            function resetDisplayedItemLimit() {
                ctrl.displayedItemLimit = initialDisplayedItemLimit;
                ctrl.loadingAll = false;
            }

            ctrl.openFilter = function (event) {
                event.stopPropagation();
            };

            $scope.$on('ngRepeatRenderingFinished', function() {
                ctrl.loadingAll = false;
            });

            angular.element('#filter-query-wrapper').on('hide.bs.dropdown.' + $scope.$id, function () {
                if ((ctrl.filterModels.nameQuery !== undefined && ctrl.filterModels.nameQuery.length !== 0) ||
                    (ctrl.filterModels.mimeTypeQuery !== undefined && ctrl.filterModels.mimeTypeQuery.length !== 0)) {
                    return false;
                }
            });

            function navigate(down, event) {
                if (ctrl.isViewModeLine()) {
                    var i, deferred, promise;
                    if (ctrl.hasOnlyOneElementSelected()) {
                        if (ctrl.selectedElements[0].key === ctrl.parent.key) {
                            if (down) {
                                promise = selectChild(ctrl.filteredOrderedChildrenArray[0]);
                            } else {
                                promise = selectChild(ctrl.filteredOrderedChildrenArray[ctrl.filteredOrderedChildrenArray.length - 1]);
                            }
                        } else {
                            for (i = 0; i < ctrl.filteredOrderedChildrenArray.length; i++) {
                                if (ctrl.filteredOrderedChildrenArray[i].key === ctrl.selectedElements[0].key) {
                                    if (down) {
                                        i++;
                                    } else {
                                        i--;
                                    }
                                    break;
                                }
                            }
                            if (i >= 0 && i < ctrl.filteredOrderedChildrenArray.length) {
                                if (event.shiftKey) {
                                    deferred = $q.defer();
                                    promise = deferred.promise;
                                    ctrl.clickChild(ctrl.filteredOrderedChildrenArray[i], event);
                                    deferred.resolve();
                                } else {
                                    promise = selectChild(ctrl.filteredOrderedChildrenArray[i]);
                                }
                            }
                        }
                    } else {
                        var j, k = 0, lastSelectedElementIndex, lastShiftSelectedElementIndex;
                        if (event.shiftKey) {
                            lastSelectedElementIndex = lastSelectedElement ? getChildIndex(lastSelectedElement) : null;
                            lastShiftSelectedElementIndex = lastShiftSelectedElement ? getChildIndex(lastShiftSelectedElement) : null;
                            if ((!down && lastShiftSelectedElementIndex === 0) || (down && lastShiftSelectedElementIndex === ctrl.filteredOrderedChildrenArray.length - 1)) {
                                return;
                            }
                        }
                        for (i = 0; i < ctrl.filteredOrderedChildrenArray.length; i++) {
                            for (j = 0; j < ctrl.selectedElements.length; j++) {
                                if (ctrl.filteredOrderedChildrenArray[i].key === ctrl.selectedElements[j].key) {
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
                            if (k === ctrl.selectedElements.length) {
                                if (down) {
                                    i++;
                                } else {
                                    i--;
                                }
                                break;
                            }
                        }
                        if (i >= 0) {
                            if (i >= ctrl.filteredOrderedChildrenArray.length) {
                                i = ctrl.filteredOrderedChildrenArray.length - 1;
                            }
                            if (event.shiftKey) {
                                if (lastSelectedElementIndex !== null) {
                                    deferred = $q.defer();
                                    promise = deferred.promise;
                                    ctrl.clickChild(ctrl.filteredOrderedChildrenArray[i], event);
                                    deferred.resolve();
                                }
                            } else {
                                promise = selectChild(ctrl.filteredOrderedChildrenArray[i]);
                            }
                        }
                    }
                    if (promise) {
                        // TODO fix
                        promise.then(function () {
                            var element = angular.element('tr[data-key="' + ctrl.selectedElements[ctrl.selectedElements.length - 1].key + '"]'),
                                parent = angular.element('.table-wrapper.table-workspace-elements-wrapper'),
                                elementTop = element.position() ? element.position().top : undefined;
                            if (ctrl.selectedElements[ctrl.selectedElements.length - 1].key === ctrl.filteredOrderedChildrenArray[0].key) {
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

            function bindHotkeys() {
                hotkeys.bindTo($scope)
                    .add({
                        combo: ['up', 'shift+up'],
                        description: $translate.instant('BROWSER.SHORTCUTS.UP'),
                        callback: function (event) {
                            if (!Helper.isModalOpened() || ctrl.isFileSelect) {
                                preventDefault(event);
                                navigate(false, event);
                            }
                        }
                    })
                    .add({
                        combo: ['down', 'shift+down'],
                        description: $translate.instant('BROWSER.SHORTCUTS.DOWN'),
                        callback: function (event) {
                            if (!Helper.isModalOpened() || ctrl.isFileSelect) {
                                preventDefault(event);
                                navigate(true, event);
                            }
                        }
                    })
                    .add({
                        combo: 'backspace',
                        description: $translate.instant('BROWSER.SHORTCUTS.BACKSPACE'),
                        callback: function (event) {
                            if (!Helper.isModalOpened() || ctrl.isFileSelect) {
                                preventDefault(event);
                                ctrl.browseToParent();
                            }
                        }
                    });
                if (ctrl.config.canSwitchViewMode) {
                    hotkeys.bindTo($scope).add({
                        combo: 'v',
                        description: $translate.instant('BROWSER.SHORTCUTS.VIEW_MODE'),
                        callback: function (event) {
                            if (!Helper.isModalOpened()) {
                                preventDefault(event);
                                ctrl.switchViewMode();
                            }
                        }
                    });
                }
                if (ctrl.config.displayAsideInfo) {
                    hotkeys.bindTo($scope).add({
                        combo: 'i',
                        description: $translate.instant('BROWSER.SHORTCUTS.INFO'),
                        callback: function (event) {
                            if (!Helper.isModalOpened()) {
                                preventDefault(event);
                                ctrl.toggleAsideInfo();
                            }
                        }
                    });
                }
                if (ctrl.config.canPreview) {
                    hotkeys.bindTo($scope)
                        .add({
                            combo: 'space',
                            description: $translate.instant('BROWSER.PREVIEW'),
                            callback: function (event) {
                                if (!Helper.isModalOpened() || Helper.isModalOpened('visualizer')) {
                                    preventDefault(event);
                                    ctrl.preview();
                                }
                            }
                        });
                    hotkeys.bindTo($scope)
                        .add({
                            combo: 'esc',
                            description: $translate.instant('BROWSER.PREVIEW'),
                            callback: function (event) {
                                if (Helper.isModalOpened('visualizer')) {
                                    preventDefault(event);
                                    ctrl.preview();
                                }
                            }
                        });
                }
                hotkeys.bindTo($scope)
                    .add({
                        combo: 'enter',
                        description: $translate.instant('BROWSER.SHORTCUTS.ENTER'),
                        callback: function (event) {
                            if (!Helper.isModalOpened() || ctrl.isFileSelect) {
                                preventDefault(event);
                                if (ctrl.hasOnlyParentSelected()) {
                                    return;
                                }
                                if (ctrl.hasOnlyOneElementSelected() && Helper.isCollection(ctrl.selectedElements[0])) {
                                    browseToChild(ctrl.selectedElements[0]);
                                } else {
                                    ctrl.preview();
                                }
                            }
                        }
                    })
                    .add({
                        combo: 'mod+f',
                        description: $translate.instant('BROWSER.SHORTCUTS.FILTER'),
                        callback: function (event) {
                            if (!Helper.isModalOpened()) {
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
                            if (!Helper.isModalOpened() || (ctrl.isFileSelect && ctrl.fileSelectAcceptMultiple)) {
                                preventDefault(event);
                                selectAll();
                            }
                        }
                    });
                if (ctrl.config.canEdit) {
                    hotkeys.bindTo($scope).add({
                        combo: 'mod+backspace',
                        description: $translate.instant('BROWSER.SHORTCUTS.DELETE'),
                        callback: function (event) {
                            if (!Helper.isModalOpened()) {
                                preventDefault(event);
                                if (!ctrl.hasOnlyParentSelected()) {
                                    ctrl.delete();
                                }
                            }
                        }
                    })
                        .add({
                            combo: 'shift+f',
                            description: $translate.instant('BROWSER.SHORTCUTS.NEW_COLLECTION'),
                            callback: function (event) {
                                if (!Helper.isModalOpened()) {
                                    preventDefault(event);
                                    ctrl.addCollection();
                                }
                            }
                        })
                        .add({
                            combo: 'u',
                            description: $translate.instant('BROWSER.UPLOAD_FILES'),
                            callback: function (event) {
                                if (!Helper.isModalOpened()) {
                                    preventDefault(event);
                                    ctrl.doAction('uploadFiles');
                                }
                            }
                        });
                }
                hotkeys.get('?').description = $translate.instant('BROWSER.SHORTCUTS.SHOW_SHORTCUTS');
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                bindHotkeys();
            });

            ctrl.showCheatsheet = function ($event) {
                hotkeys.get('?').callback($event);
            };

            // *********************** //
            //        View mode        //
            // *********************** //

            function setViewMode(viewMode) {
                ctrl.browserSettings.viewMode = viewMode;
                Settings.store();
            }

            ctrl.switchViewMode = function () {
                if (ctrl.config.canSwitchViewMode) {
                    clearPreviousFilteringQueries();
                    ctrl.deactivateContextMenu();
                    if (ctrl.isViewModeLine()) {
                        setViewMode(ctrl.viewMode.tile.id);
                    } else {
                        setViewMode(ctrl.viewMode.line.id);
                    }
                }
            };

            ctrl.isViewModeLine = function () {
                return ctrl.browserSettings.viewMode === ctrl.viewMode.line.id;
            };

            ctrl.tileCssClasses = function () {
                if (ctrl.config.displayAsideInfo && ctrl.browserSettings.hideInfo) {
                    return 'col-sm-4 col-md-3 col-lg-3 col-xlg-15 col-xxlg-15';
                }
                return 'col-sm-6 col-md-4 col-lg-4 col-xlg-14 col-xxlg-15';
            };

            ctrl.toggleAsideInfo = function () {
                ctrl.browserSettings.hideInfo = !ctrl.browserSettings.hideInfo;
                Settings.store();
            };

            ctrl.toggleWorkspaceList = function () {
                ctrl.browserSettings.hideWorkspaceList = !ctrl.browserSettings.hideWorkspaceList;
                Settings.store();
            };

            ctrl.displayAsideWorkspaceList = function () {
                return !ctrl.forceWorkspace && angular.isDefined(ctrl.workspaces);
            };

            // *********************** //
            //           Cart          //
            // *********************** //

            ctrl.addToCart = function () {
                var path, items = [];
                angular.forEach(ctrl.selectedElements, function (element) {
                    path = Helper.normalizePath(ctrl.path + '/' + (ctrl.hasOnlyParentSelected() ? '' : element.name));
                    items.push({
                        wsalias: ctrl.workspace.alias,
                        root: ctrl.root,
                        //tag: getTagName(ctrl.root),
                        name: ctrl.hasOnlyParentSelected() ? ctrl.parent.name : element.name,
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
                isMobile = Helper.isMobile();
                isClickedOnce = false;
                clearPreviousFilteringQueries();
                initialDisplayedItemLimit = 50;
                subTimeout = 500;
                crudTimeout = 400;
            }

            function initOptions() {
                angular.forEach(ctrl.options, function (option, key) {
                    if (angular.isDefined(option)) {
                        ctrl[key] = option;
                    }
                });
            }

            function initScopeVariables() {
                $scope.icons = icons;
                $scope.ortolangType = ortolangType;
                ctrl.filterModels = {};
                if (ctrl.isFileSelect) {
                    ctrl.config = browserConfig.fileSelect;
                    if (ctrl.forceMimeTypes) {
                        ctrl.filterModels.mimeTypeQuery = ctrl.forceMimeTypes;
                    }
                } else if ($route.current && /\/workspaces\/:alias/.test($route.current.originalPath)) {
                    ctrl.config = browserConfig.workspace;
                    ctrl.isWorkspace = true;
                } else {
                    ctrl.config = browserConfig.market;
                    ctrl.isMarket = true;
                }
                // Settings
                ctrl.browserSettings = Settings.browser[ctrl.config.id];
                if (!ctrl.browserSettings.viewMode) {
                    setViewMode(ctrl.config.defaultViewMode);
                }
                ctrl.viewMode = {
                    line: {id: 'line', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'},
                    tile: {id: 'tile', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'}
                };
                bindHotkeys();
                ctrl.parent = null;
                ctrl.selectedElements = null;
                // Breadcrumb
                ctrl.breadcrumbParts = null;
                ctrl.breadcrumbDropdownItems = [];
                // Context Menu
                ctrl.isContextMenuActive = false;
                ctrl.contextMenuItems = [];
                // Filter
                ctrl.orderProp = ['type', 'name'];
                ctrl.dateFormat = 'short';
                ctrl.reverse = false;
                // Visualizers
                ctrl.visualizers = null;
                // Workspace
                ctrl.displayedItemLimit = initialDisplayedItemLimit;
                ctrl.Content = Content;
            }

            function setPath(path) {
                if (path) {
                    if (angular.isUndefined(ctrl.path) && ctrl.isWorkspace) {
                        $location.replace();
                    }
                    path = Helper.normalizePath(path);
                    ctrl.path = path;
                    if (!ctrl.isFileSelect) {
                        $location.search('path', path);
                    }
                }
            }

            function setRoot(root) {
                ctrl.root = root;
                ctrl.isHead = ctrl.root === 'head';
                if (ctrl.isWorkspace) {
                    $location.search('root', root);
                }
            }

            function initWorkspaceVariables(root, path) {
                if (!ctrl.workspace) {
                    return;
                }
                if (ctrl.isFileSelect) {
                    ctrl.browserSettings.wskey = ctrl.workspace.key;
                    Settings.store();
                }
                setRoot(root || 'head');
                setPath(path || '/');
                getSnapshotsHistory();
                getParentData();
            }

            (function init() {
                initLocalVariables();
                initOptions();
                initScopeVariables();
                populateBreadcrumbDropdownMenu();
                if (ctrl.isMarket) {
                    initWorkspaceVariables(ctrl.root, $location.search().path);
                } else if (ctrl.isWorkspace) {
                    initWorkspaceVariables($location.search().root, $location.search().path);
                } else if (ctrl.isFileSelect) {
                    ctrl.$onChanges = function (changesObj) {
                        if (changesObj.workspace && angular.isDefined(changesObj.workspace.currentValue)) {
                            initWorkspaceVariables($location.search().root, $location.search().path);
                        }
                    };
                }
            }());

        }]);
