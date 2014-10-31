'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserNextCtrl
 * @description
 * # BrowserNextCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserNextCtrl', ['$scope', '$location', '$routeParams', '$route', '$rootScope', '$compile', '$filter', '$window', 'hotkeys', 'DownloadResource', 'WorkspaceElementResource', 'VisualizerManager', 'icons', 'MarketBrowserService', 'WorkspaceBrowserService',
        function ($scope, $location, $routeParams, $route, $rootScope, $compile, $filter, $window, hotkeys, DownloadResource, WorkspaceElementResource, VisualizerManager, icons, MarketBrowserService, WorkspaceBrowserService) {

            // *********************** //
            //        Breadcrumb       //
            // *********************** //

            function initBreadcrumbDropdownMenu() {
                $scope.breadcrumbDropdownItems = [];
                $scope.breadcrumbDropdownItems.push({text: 'New Collection', icon: icons.browser.plus, action: 'newCollection'});
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
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                        $scope.contextMenuItems.push({text: 'New Collection', icon: icons.browser.plus, action: 'newCollection'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.browserService.canPreview && $scope.visualizers) {
                        $scope.contextMenuItems.push({text: 'Preview', icon: icons.browser.preview, action: 'preview'});
                        $scope.contextMenuItems.push({divider: true});
                    }
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
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
                var resource = $scope.browserService.getData({oKey: $routeParams.itemKey, wsName: $routeParams.wsName, path: $routeParams.path, root: $routeParams.root});
                resource.$promise.then(function (element) {
                    console.log('getParentData success', element);
                    $scope.parent = $scope.isMarket ? element.object : element;
                    // If we just refreshed the data no need to build the breadcrumb again
                    if (!refresh) {
                        buildBreadcrumb();
                        newSelectedElement($scope.parent);
                    }
                    $scope.resizeBrowser();
                    angular.forEach($scope.parent.elements, function (value) {
                        if ($scope.allChildrenMimeTypes.indexOf(value.mimeType) === -1) {
                            $scope.allChildrenMimeTypes.push(value.mimeType);
                        }
                    });
                });
            }

            function buildChildDownloadUrl(data) {
                return $scope.browserService.buildChildBrowseUrl(data, $scope.parent, $scope.root);
            }

            $scope.getChildBrowseUrl = function (child) {
                return $scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root);
            };

            function getChildData(child, refresh, clickEvent, isPush) {
                clickEvent = clickEvent || undefined;
                var resource = $scope.browserService.getData({oKey: child.key, wsName: $routeParams.wsName, path: $routeParams.path + '/' + child.name, root: $routeParams.root});
                resource.$promise.then(function (data) {
                    if ($scope.isMarket) {
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
                    $location.path($scope.browserService.buildChildBrowseUrl(child, $scope.parent, $scope.root));
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
                    var browserWrapper = $('#browser-wrapper');
                    browserWrapper.find('.table-wrapper.workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                    browserWrapper.find('.browsed-element-children-wrapper').css('height', (height - browserToolbarHeight) + 'px');
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

            function initViewMode() {
                if ($scope.browserService.defaultViewMode === 'tile') {
                    $scope.viewMode = viewModeLine;
                }
                $scope.switchViewMode();
            }

            $scope.switchViewMode = function () {
                if ($scope.viewMode === viewModeLine) {
                    $scope.viewMode = viewModeTile;
                    $scope.otherViewMode = viewModeLine;
                } else {
                    $scope.viewMode = viewModeLine;
                    $scope.otherViewMode = viewModeTile;
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

            // *********************** //
            //           Init          //
            // *********************** //

            var isMacOs, isClickedOnce, viewModeLine, viewModeTile;

            function initLocalVariables() {
                viewModeLine = {name: 'Mode line', icon: icons.browser.viewModeLine};
                viewModeTile = {name: 'Mode tile', icon: icons.browser.viewModeTile};
                isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                isClickedOnce = false;
            }

            function initScopeVariables() {
                $scope.isMarket = !$route.current.originalPath.match(/\/workspaces/);
                console.debug('isMarket browser', $scope.isMarket);
                if ($scope.isMarket) {
                    $scope.browserService = MarketBrowserService;
                } else {
                    $scope.browserService = WorkspaceBrowserService;
                }
                $scope.wsName = $routeParams.wsName;
                initViewMode();
                $scope.root = $routeParams.root;
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
                $scope.filterNameQuery = undefined;
                $scope.filterMimeTypeQuery = undefined;
                // Visualizers
                $scope.visualizers = undefined;
                $scope.allSuportedMimeTypes = VisualizerManager.getAllSupportedMimeTypes();
                // Add collection
                $scope.newCollectionName = undefined;
                $scope.newCollectionDescription = undefined;
            }

            function init() {
                initLocalVariables();
                initScopeVariables();
                getParentData(false);
                initBreadcrumbDropdownMenu();
                // TODO to be removed
                //$scope.switchViewMode();
            }
            init();

        }]);
