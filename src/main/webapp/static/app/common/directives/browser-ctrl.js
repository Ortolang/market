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
        function ($scope, $location, $routeParams, $route, $rootScope, $compile, $filter, $timeout, $window, $translate, $modal, hotkeys, WorkspaceResource, ObjectResource, Download, Runtime, WorkspaceElementResource, VisualizerManager, icons, MarketBrowserService, WorkspaceBrowserService, FileSelectBrowserService) {

            var isMacOs, isClickedOnce, viewModeLine, viewModeTile, browseUsingLocation,
                previousFilterNameQuery, previousFilterMimeTypeQuery, previousFilterType, previousFilteredChildren;

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function populateBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                if ($scope.browserService.canAdd && $scope.isHead) {
                    $scope.breadcrumbDropdownItems.push({text: $scope.translationsNewCollection, icon: icons.browser.plus, action: 'addCollection'});
                    $scope.breadcrumbDropdownItems.push({divider: true});
                    $scope.breadcrumbDropdownItems.push({text: $scope.translationsUploadFiles, icon: icons.browser.upload, action: 'uploadFiles'});
                    //$scope.breadcrumbDropdownItems.push({text: $scope.translationsUploadFolder, icon: icons.browser.upload, action: 'uploadFolder'});
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
                    $scope.contextMenuStyle = {
                        position: 'absolute',
                        display: 'block',
                        // Fix dropdown offset because of margin-left on page wrapper
                        left: clickEvent.pageX + 'px',
                        // Fix dropdown offset because of navbar and toolbar
                        top: clickEvent.pageY + 'px'
                    };
                    // If the context menu has already been build no need to do it again
                    if ($scope.isContextMenuActive && sameChild) {
                        return;
                    }
                    clearContextMenuItems();
                    if ($scope.browserService.canAdd && $scope.isHead && $scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                        $scope.contextMenuItems.push({text: $scope.translationsNewCollection, icon: icons.browser.plus, action: 'addCollection'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.browserService.canPreview && $scope.visualizers) {
                        $scope.contextMenuItems.push({text: $scope.translationsPreview, icon: icons.browser.preview, action: 'preview'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.browserService.canDownload && $scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
                        $scope.contextMenuItems.push({text: $scope.translationsDownload, icon: icons.browser.download, action: 'download'});
                    }
                    if ($scope.browserService.canDelete && $scope.isHead) {
                        $scope.contextMenuItems.push({text: $scope.translationsDelete, icon: icons.browser.delete, action: 'delete'});
                    }
                    activateContextMenu();
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
                console.debug('Getting parent data (refresh: %s, forceNewSelection: %s, config: %o)', refresh, forceNewSelection, config);
                $scope.browserService.getData(config).$promise.then(function (element) {
                    finishGetParentData(element, refresh, forceNewSelection);
                });
            }

            function buildChildDownloadUrl(data) {
                return $scope.browserService.buildChildDownloadUrl(data, $scope.parent, $scope.root);
            }

            $scope.getChildBrowseUrl = function (child) {
                return $scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root);
            };

            function getChildData(child, refresh, clickEvent, isPush) {
                clickEvent = clickEvent || undefined;
                $scope.browserService.getData({oKey: child.key, wskey: $scope.wskey, path: $scope.path + '/' + child.name, root: $scope.root})
                    .$promise.then(function (data) {
                        if ($scope.browserService.getDataResource === 'object') {
                            data = data.object;
                        }
                        if (!refresh) {
                            data.downloadUrl = buildChildDownloadUrl(data);
                        }
                        child.element = data;
                        if (isPush) {
                            pushSelectedElement(data);
                        } else {
                            newSelectedElement(data);
                        }
                        if (!refresh) {
                            $scope.contextMenu(clickEvent, false);
                        }
                        checkCompatibleVisualizers();
                    });
            }

            function getChildrenDataOfTypes(mimeTypes, isPreview, visualizer) {
                console.debug('Starting to get children data of types %o', Object.keys(mimeTypes));
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
                    console.debug('Requesting data of child %s', child.name);
                    $scope.browserService.getData({oKey: $scope.itemKey, wskey: $scope.wskey, path: $scope.path + child.name, root: $scope.root})
                        .$promise.then(function (data) {
                            if ($scope.browserService.getDataResource === 'object') {
                                data = data.object;
                            }
                            data.downloadUrl = buildChildDownloadUrl(data);
                            data.selected = $scope.isSelected(data);
                            $scope.children.push(data);
                            console.debug('Successfully retrieved data of child %s: %o', child.name, data);
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
                    getChildData($scope.selectedElements[0], true, undefined, false);
                }
            };

            function getSnapshotsHistory() {
                ObjectResource.history({oKey: $scope.workspace.head}, function (data) {
                    $scope.snapshotsHistory = data.entries;
                });
            }

            function getWorkspaceMembers() {
                ObjectResource.get({oKey: $scope.workspace.members}, function (data) {
                    $scope.workspaceMembers = data.object;
                });
            }

            $scope.getSnapshotFromHistory = function (snapshotHistory) {
                if ($scope.workspace.snapshots) {
                    var filteredSnapshot = $filter('filter')($scope.workspace.snapshots, {key: snapshotHistory.key}, true);
                    if (filteredSnapshot.length === 1) {
                        return filteredSnapshot[0];
                    }
                }
                return undefined;
            };

            $scope.getSnapshotNameFromHistory = function (snapshotHistory) {
                var snapshot = $scope.getSnapshotFromHistory(snapshotHistory);
                if (snapshot) {
                    return snapshot.name;
                }
                return undefined;
            };

            $scope.download = function (element) {
                Download.downloadInNewWindow(element);
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

            function deselectOthers(element) {
                $scope.selectedElements = $filter('filter')($scope.selectedElements, {key: element.key}, true);
            }

            function deselectChildren() {
                $scope.selectedElements = [$scope.parent];
                deactivateContextMenu();
                clearVisualizers();
            }

            $scope.clickChild = function (clickEvent, child) {
                // Target with attribute ng-click equalling browseToChild means that we don't need
                // to select the child since a browseToChild is about to occur
                if (angular.element(clickEvent.target).attr('ng-click') !== 'browseToChild(child)') {
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
                    if (($scope.fileSelectAcceptMultiple || !$scope.browserService.isFileSelect) &&
                            modKey && !$scope.hasOnlyParentSelected()) {
                        getChildData(child, false, clickEvent, true);
                    } else {
                        getChildData(child, false, clickEvent, false);
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
                if (!($(clickEvent.target).parent('tr').length || $(clickEvent.target).parent('td').length ||
                        $(clickEvent.target).parent('.browsed-element-child').length ||
                        $(clickEvent.target).parent().parent('.browsed-element-child').length ||
                        $(clickEvent.target).parents('#context-menu').length ||
                        $(clickEvent.target).parents('.btn-toolbar').length)) {
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
                    addCollectionModal = $modal({
                        scope: addCollectionModalScope,
                        template: 'workspace/templates/add-collection-modal.html',
                        show: true
                    });
                }
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                console.debug('%s caught event "uploaderCompleteItemUpload"', $scope.browserService.getId());
                getParentData(true, $scope.isOnlySelectedElementParent());
            });

            // *********************** //
            //        Metadata         //
            // *********************** //

            $rootScope.$on('completeMetadataUpload', function () {
                console.debug('%s caught event "completeMetadataUpload"', $scope.browserService.getId());
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true);
                } else {
                    getChildData(true);
                }
            });

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
                    $timeout(function () {
                        angular.element('#object-upload-file-select').click();
                    });
                    break;
                case 'uploadFolder':
                    angular.element('#object-upload-folder-select').click();
                    break;
                default:
                    break;
                }
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
                visualizerModal.find('.modal-header strong').text(visualizer.getName());
                visualizerModal.find('.modal-body').empty().append(element);
                visualizerModal.modal('show');
                $scope.contextMenu();
            }

            $scope.clickPreview = function (_visualizer_) {
                //if (_visualizer_ || $scope.visualizers) {
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
                //}
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
                $scope.keyHistory.forward.push($scope.itemKey);
                browseToKey($scope.keyHistory.back.pop(), true);
            };

            $scope.goForward = function () {
                $scope.keyHistory.back.push($scope.itemKey);
                browseToKey($scope.keyHistory.forward.pop(), true);
            };

            $scope.browseToChild = function (child) {
                if ($scope.browserService.getDataResource !== 'object' && (!browseUsingLocation || $scope.browserService.isFileSelect)) {
                    $scope.browseToPath($scope.parent.path + '/' + child.name);
                } else if ($scope.browserService.getDataResource === 'object' && (!browseUsingLocation)) {
                    browseToKey(child.key);
                } else {
                    $location.path($scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root));
                }
            };

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

            $scope.doubleClickChild = function ($event, child) {
                if (child.type === 'collection') {
                    $scope.browseToChild(child);
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
                console.debug('%s caught event "browserAskSelectedElements"', $scope.browserService.getId());
                if ($scope.browserService.isFileSelect) {
                    var elements = getSelectedElementsCopy();
                    if (elements && elements.length > 0) {
                        console.debug('%s emit "browserSelectedElements-%s" event', $scope.browserService.getId(), $scope.fileSelectId);
                        $scope.$emit('browserSelectedElements-' + $scope.fileSelectId, elements);
                    }
                }
            });

            $rootScope.$on('$translateChangeSuccess', function () {
                console.debug('%s caught event "$translateChangeSuccess"', $scope.browserService.getId());
                initTranslations();
            });

            $rootScope.$on('browserAskChangeWorkspace', function ($event, workspace) {
                console.debug('%s caught event "browserAskChangeWorkspace"', $scope.browserService.getId());
                initWorkspaceVariables(workspace);
                getParentData();
            });

            $rootScope.$on('publishWorkspaceCompleted', function () {
                console.debug('%s caught event "publishWorkspaceCompleted"', $scope.browserService.getId());
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
            //     Create Workspace    //
            // *********************** //

            $scope.createWorkspace = function () {
                if ($scope.browserService.canAdd) {
                    var createWorkspaceModalScope = $rootScope.$new(),
                        createWorkspaceModal;
                    createWorkspaceModalScope.createWorkspace = function () {
                        WorkspaceResource.save({name: createWorkspaceModalScope.newWorkspaceName, type: 'user'}, function () {
                            $scope.wsList = WorkspaceResource.get();
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
                    console.debug('Resizing browser');
                    var topOffset = $('#main-navbar').innerHeight(),
                        height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                        browserToolbarHeight = $('#browser-toolbar').innerHeight();

                    height = height - topOffset;
                    if (height < 1) {
                        height = 1;
                    }
                    if (height > topOffset) {
                        height -= 1;
                        if ($rootScope.uploadQueueStatus === 'active') {
                            height -= angular.element('.upload-queue').innerHeight();
                        }
                        $('.browser-aside').css('min-height', (height - browserToolbarHeight) + 'px');
                        var browserWrapper = $('#browser-wrapper');
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
                    console.debug('uploadQueueStatus changed (old: %s, new: %s)', oldValue, newValue);
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

            // *********************** //
            //           Init          //
            // *********************** //



            function initLocalVariables() {
                viewModeLine = {id: 'line', icon: icons.browser.viewModeLine};
                viewModeTile = {id: 'tile', icon: icons.browser.viewModeTile};
                browseUsingLocation = false;
                isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                isClickedOnce = false;
                clearPreviousFilteringQueries();
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
                console.debug('Initializing browser using %s', $scope.browserService.getId());
                $scope.wsList = WorkspaceResource.get();
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
                $scope.dateFormat = 'medium';
                $scope.reverse = false;
                // Visualizers
                $scope.visualizers = undefined;
                // Workspace
                $scope.snapshotsHistory = undefined;
                $scope.workspaceMembers = undefined;
            }

            function initTranslations() {
                return $translate([
                    'BROWSER.VIEW_MODE_LINE',
                    'BROWSER.VIEW_MODE_TILE',
                    'BROWSER.NEW_COLLECTION',
                    'BROWSER.PREVIEW',
                    'BROWSER.DELETE',
                    'DOWNLOAD',
                    'BROWSER.UPLOAD_FILES',
                    'BROWSER.UPLOAD_FOLDER'
                ]).then(function (translations) {
                    $scope.translationsNewCollection = translations['BROWSER.NEW_COLLECTION'];
                    $scope.translationsPreview = translations['BROWSER.PREVIEW'];
                    $scope.translationsDelete = translations['BROWSER.DELETE'];
                    $scope.translationsDownload = translations['DOWNLOAD'];
                    $scope.translationsUploadFiles = translations['BROWSER.UPLOAD_FILES'];
                    $scope.translationsUploadFolder = translations['BROWSER.UPLOAD_FOLDER'];
                    viewModeLine.name = translations['BROWSER.VIEW_MODE_LINE'];
                    viewModeTile.name = translations['BROWSER.VIEW_MODE_TILE'];
                    populateBreadcrumbDropdownMenu();
                });
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
                console.debug('Browsing workspace "%s"', $scope.workspace.name);
            }

            function init() {
                initTranslations();
                initLocalVariables();
                initScopeVariables();
                if ($scope.wskey || $scope.itemKey) {
                    getParentData();
                } else {
                    $scope.wsList.$promise.then(function (data) {
                        console.log(data);
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
                        console.log($scope.workspace);
                        initWorkspaceVariables();
                        getParentData();
                    });
                }
            }
            init();

        }]);
