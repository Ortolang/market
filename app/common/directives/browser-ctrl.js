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
        '$window',
        'hotkeys',
        'WorkspaceResource',
        'WorkspaceElementResource',
        'VisualizerManager',
        'icons',
        'MarketBrowserService',
        'WorkspaceBrowserService',
        'FileSelectBrowserService',
        function ($scope, $location, $routeParams, $route, $rootScope, $compile, $filter, $window, hotkeys, WorkspaceResource, WorkspaceElementResource, VisualizerManager, icons, MarketBrowserService, WorkspaceBrowserService, FileSelectBrowserService) {

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function initBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                if ($scope.browserService.canAdd) {
                    $scope.breadcrumbDropdownItems.push({text: 'New Collection', icon: icons.browser.plus, action: 'newCollection'});
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
                    if ($scope.browserService.canAdd && $scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                        $scope.contextMenuItems.push({text: 'New Collection', icon: icons.browser.plus, action: 'newCollection'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.browserService.canPreview && $scope.visualizers) {
                        $scope.contextMenuItems.push({text: 'Preview', icon: icons.browser.preview, action: 'preview'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.browserService.canDownload && $scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
                        $scope.contextMenuItems.push({text: 'Download', icon: icons.browser.download, href: $scope.selectedElements[0].downloadUrl});
                    }
                    if ($scope.browserService.canDelete) {
                        $scope.contextMenuItems.push({text: 'Delete', icon: icons.browser.delete, action: 'delete'});
                    }
                    activateContextMenu();
                } else {
                    deactivateContextMenu();
                }
            };

            // *********************** //
            //         Get Data        //
            // *********************** //

            function getParentData(refresh) {
                console.log('getParentData / refresh :', refresh);
                $scope.browserService.getData({oKey: $scope.itemKey, wsName: $scope.wsName, path: $scope.path, root: $scope.root})
                    .$promise.then(function (element) {
                        console.log('getParentData success', element);
                        $scope.parent = $scope.browserService.getDataResource === 'object' ? element.object : element;
                        // If we just refreshed the data no need to build the breadcrumb again
                        if (!refresh) {
                            buildBreadcrumb();
                        }
                        newSelectedElement($scope.parent);
                        $scope.resizeBrowser();
                        clearPreviousFilteringQueries();
                        angular.forEach($scope.parent.elements, function (value) {
                            if ($scope.allChildrenMimeTypes.indexOf(value.mimeType) === -1) {
                                $scope.allChildrenMimeTypes.push(value.mimeType);
                            }
                        });
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
                $scope.browserService.getData({oKey: child.key, wsName: $scope.wsName, path: $scope.path + '/' + child.name, root: $scope.root})
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
                    $scope.browserService.getData({oKey: $scope.itemKey, wsName: $scope.wsName, path: $scope.path + child.name, root: $scope.root})
                        .$promise.then(function (data) {
                            if ($scope.browserService.getDataResource === 'object') {
                                data = data.object;
                            }
                            data.downloadUrl = buildChildDownloadUrl(data);
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

            $scope.refreshSelectedElement = function () {
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true);
                } else if ($scope.hasOnlyOneElementSelected()) {
                    getChildData($scope.selectedElements[0], true, undefined, false);
                }
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
                if (($scope.fileSelectAcceptMultiple || !$scope.browserService.isFileSelect) &&
                        modKey && !$scope.hasOnlyParentSelected()) {
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
                    WorkspaceElementResource.put({wsName: $scope.wsName }, data, function () {
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

            $rootScope.$on('completeMetadataUpload', function () {
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true);
                } else {
                    getChildData(true);
                }
            });

            $scope.showMetadata = function () {
                $rootScope.$broadcast('metadata-list-show');
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
                $scope.visualizers = VisualizerManager.getCompatibleVisualizers(element.mimeType, element.name);
                if ($scope.visualizers.length === 0) {
                    clearVisualizers();
                }
            }

            function finishPreview(visualizer) {
                var isolatedScope = $rootScope.$new();
                if ($scope.children && $scope.children.length !==0) {
                    isolatedScope.elements = $scope.children;
                } else {
                    isolatedScope.elements = $scope.selectedElements;
                }
                var element = $compile(visualizer.element)(isolatedScope),
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
                    $scope.children = undefined;
                    finishPreview(visualizer);
                }
            };

            $scope.browseTo = function (path) {
                if ($scope.browserService.isFileSelect) {
                    $scope.path = path;
                    getParentData(false);
                } else {
                    $location.path($scope.browserService.buildBrowseUrlFromPath($scope.wsName, path, $scope.root));
                }
            };

            $scope.browseToChild = function (child) {
                if ($scope.browserService.isFileSelect) {
                    $scope.browseTo($scope.parent.path + '/' + child.name);
                } else {
                    $location.path($scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root));
                }
            };

            function getSelectedElementsCopy() {
                var selectedElementsCopy = angular.copy($scope.selectedElements);
                angular.forEach(selectedElementsCopy, function (element) {
                    element.path = $scope.parent.path + '/' + element.name;
                });
                return selectedElementsCopy;
            }

            $scope.doubleClickChild = function ($event, child) {
                if (child.type === 'collection') {
                    $scope.browseToChild(child);
                } else {
                    if ($scope.browserService.isFileSelect) {
                        $rootScope.$broadcast('browserSelectedElements', getSelectedElementsCopy(), $scope.fileSelectId);
                    } else {
                        if ($scope.allSuportedMimeTypes[child.mimeType]) {
                            $scope.clickPreview();
                        }
                    }
                }
            };

            // *********************** //
            //          Events         //
            // *********************** //

            $rootScope.$on('browserAskSelectedElements', function () {
                if ($scope.browserService.isFileSelect) {
                    var selectedElementsCopy = angular.copy($scope.selectedElements);
                    angular.forEach(selectedElementsCopy, function (element) {
                        element.path = $scope.parent.path + '/' + element.name;
                    });
                    $rootScope.$broadcast('browserSelectedElements', getSelectedElementsCopy(), $scope.fileSelectId);
                }
            });

            $rootScope.$on('browserAskChangeWorkspace', function ($event, workspace) {
                $scope.wsName = workspace.key;
                $scope.root = 'head';
                $scope.path = '/';
                getParentData(false);
            });

            $scope.changeWorkspace = function (workspace) {
                if (!$scope.forceWorkspace && workspace.key !== $scope.wsName) {
                    $scope.wsName = workspace.key;
                    $scope.root = 'head';
                    $scope.browseTo('/');
                }
            };

            $scope.isActiveWorkspace = function (workspace) {
                return $scope.wsName === workspace.key ? 'active' : '';
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

            //$scope.filteringTime = 0;
            $scope.filterChildren = function (filterNameQuery, filterMimeTypeQuery, type) {
                return function (child) {
                    //$scope.filteringTime += 1;
                    //console.log($scope.filteringTime, filterNameQuery, filterMimeTypeQuery, type);
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
                if ($scope.newWorkspaceName !== undefined) {
                    WorkspaceResource.save({key: $scope.newWorkspaceName, name: $scope.newWorkspaceName, type: $scope.newWorkspaceType}, function () {
                        $scope.wsList = WorkspaceResource.get();
                        $('#create-workspace-modal').modal('hide');
                        $scope.newWorkspaceName = undefined;
                        $scope.newWorkspaceType = undefined;
                    });
                }
            };

            // *********************** //
            //          Resize         //
            // *********************** //

            $scope.resizeBrowser = function () {
                if (!$scope.browserService.isFileSelect) {
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
                        $('.browser-aside').css('min-height', (height - browserToolbarHeight) + 'px');
                        var browserWrapper = $('#browser-wrapper');
                        browserWrapper.find('.table-wrapper.workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                        browserWrapper.find('.browsed-element-children-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                    }
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

            var isMacOs, isClickedOnce, viewModeLine, viewModeTile,
                previousFilterNameQuery, previousFilterMimeTypeQuery, previousFilterType, previousFilteredChildren;

            function initLocalVariables() {
                viewModeLine = {id: 'line', name: 'Mode line', icon: icons.browser.viewModeLine};
                viewModeTile = {id: 'tile', name: 'Mode tile', icon: icons.browser.viewModeTile};
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
                } else if ($route.current.originalPath.match(/\/workspaces/)) {
                    $scope.browserService = WorkspaceBrowserService;
                } else {
                    $scope.browserService = MarketBrowserService;
                }
                console.debug('browserService', $scope.browserService.getId());
                $scope.wsList = WorkspaceResource.get();
                $scope.wsName = $routeParams.wsName;
                $scope.root = $routeParams.root;
                $scope.path = $routeParams.path;
                $scope.itemKey = $routeParams.itemKey;
                initViewMode();
                $scope.parent = undefined;
                $scope.children = undefined;
                $scope.allChildrenMimeTypes = [];
                $scope.selectedElements = [];
                $scope.icons = icons;
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
                // Visualizers
                $scope.visualizers = undefined;
                $scope.allSuportedMimeTypes = VisualizerManager.getAllSupportedMimeTypes();
                // Add collection
                $scope.newCollectionName = undefined;
                $scope.newCollectionDescription = undefined;
            }

            function init() {
                console.debug('init browser');
                initLocalVariables();
                initScopeVariables();
                if ($scope.wsName) {
                    getParentData(false);
                    initBreadcrumbDropdownMenu();
                } else {
                    $scope.wsList.$promise.then(function (data) {
                        if ($scope.forceWorkspace) {
                            if ($filter('filter')(data.entries, {key: $scope.forceWorkspace}, true).length !== 1) {
                                console.error('No workspace with key "' + $scope.forceWorkspace + '" available');
                                return;
                            }
                            $scope.wsName = $scope.forceWorkspace;
                        } else {
                            $scope.wsName = data.entries[0].key;
                        }
                        $scope.root = 'head';
                        $scope.path = '/';
                        getParentData(false);
                        initBreadcrumbDropdownMenu();
                    });
                }
            }
            init();

        }]);
