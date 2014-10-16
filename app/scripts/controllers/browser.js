'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', ['$scope', '$routeParams', '$rootScope', '$compile', '$filter', 'Url', 'hotkeys', 'WorkspaceElementResource',
        function ($scope, $routeParams, $rootScope, $compile, $filter, Url, hotkeys, WorkspaceElementResource) {
//    .controller('BrowserCtrl', ['$scope', '$routeParams', '$rootScope', '$compile', '$filter', 'Url', 'hotkeys', 'WorkspaceElementResource', 'VisualizerManager',
//        function ($scope, $routeParams, $rootScope, $compile, $filter, Url, hotkeys, WorkspaceElementResource, VisualizerManager) {

            $scope.urlBase = Url.urlBase();
            $scope.wsName = $routeParams.wsName;
            $scope.orderProp = ['type', 'name'];
            $scope.dateFormat = 'medium';
            $scope.reverse = false;
//            $scope.selectedChildren = [];
            $scope.selectedElements = [];

            function buildChildDownloadUrl(data) {
                return Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/download?path=' + $scope.parent.path + '/' + data.name;
            }

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
                $scope.path = $scope.parent.path.replace('/', 'head/root/').split('/');
            }

            // *********************** //
            //       Context Menu      //
            // *********************** //

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
                    $scope.isContextMenuActive = true;
                    $scope.menuItems = [];
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].type === 'collection') {
                        $scope.menuItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
                        $scope.menuItems.push({divider: true});
                    }
                    if ($scope.visualizers) {
                        $scope.menuItems.push({text: 'Preview', icon: 'eye-open', action: 'preview'});
                        $scope.menuItems.push({divider: true});
                    }
                    if ($scope.selectedElements.length === 1 && $scope.selectedElements[0].stream) {
                        $scope.menuItems.push({text: 'Download', icon: 'download', href: $scope.selectedElements[0].downloadUrl});
                    }
                    $scope.menuItems.push({text: 'Delete', icon: 'trash', action: 'delete'});
                } else {
                    $scope.isContextMenuActive = false;
                }
            };

            function pushSelectedElement(element) {
                $scope.selectedElements.push(element);
            }

            function newSelectedElement(element) {
                $scope.selectedElements = [element];
            }

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


            function getChildData(child, refresh, clickEvent, isPush) {
                clickEvent = clickEvent || undefined;
                WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path + child.name, root: $routeParams.root},
                    function (data) {
                        if (!refresh) {
                            data.downloadUrl = buildChildDownloadUrl(data);
                        }
                        child.element = data;
                        if (isPush) {
                            pushSelectedElement(data);
//                            $scope.selectedChildren.push(child);
                            clearVisualizers();
                        } else {
                            newSelectedElement(data);
//                            $scope.selectedChildren = [child];
                            checkVisualizer(data);
                        }
                        if (!refresh) {
                            $scope.contextMenu(clickEvent, false);
                        }
                    });
            }

            function getChildrenData(isPreview) {
                $scope.children = [];
                var completedElements = 0;
                angular.forEach($scope.parent.elements, function (child) {
                    WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path + child.name, root: $routeParams.root},
                        function (data) {
                            data.downloadUrl = Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/download?path=' + $scope.parent.path + '/' + data.name;
                            data.selected = $scope.isSelected(data);
                            $scope.children.push(data);
                            console.log(data);
                            completedElements += 1;
                            if (isPreview && completedElements === $scope.parent.elements.length) {
                                finishPreview();
                            }
                        });
                });
            }

            $scope.selectedElementsSize = function () {
                var size = 0;
                angular.forEach($scope.selectedElements, function (element) {
                    if (element.type === 'object') {
                        size += element.size;
                    }
                });
                return size;
            };

            function getMetadatasOfSelectedElement() {
                return $scope.selectedElements[0].metadatas;
            }

            $scope.isSelected = function (element) {
                return $filter('filter')($scope.selectedElements, {key: element.key}, true).length === 1;
            };

            function deselectChild(child) {
//                $scope.selectedChildren = $filter('filter')($scope.selectedChildren, {key: '!' + child.key}, true);
                $scope.selectedElements = $filter('filter')($scope.selectedElements, {key: '!' + child.key}, true);
                if ($scope.hasOnlyOneElementSelected()) {
                    checkVisualizer($scope.selectedElements[0]);
                } else if ($scope.selectedElements.length === 0) {
                    newSelectedElement($scope.parent);
                }
            }

            $scope.clickChild = function (clickEvent, child) {
                if ($scope.isSelected(child)) {
                    if (clickEvent.metaKey) {
                        deselectChild(child);
                        return;
                    }
                    $scope.contextMenu(clickEvent, true);
                    return;
                }
//                $scope.selectedChild = child;
                // Get detailed info on the selected child
                if (clickEvent.metaKey && !$scope.hasOnlyParentSelected()) {
                    getChildData(child, false, clickEvent, true);
                } else {
                    getChildData(child, false, clickEvent, false);
                }
            };

            function deselectChildren() {
                $scope.selectedElements = [$scope.parent];
//                $scope.selectedChild = undefined;
//                $scope.selectedChildren = [];
                $scope.selectedChildData = undefined;
                $scope.isContextMenuActive = false;
                clearVisualizers();
            }

            $scope.checkSelection = function (clickEvent) {
                if (!($(clickEvent.target).parent('tr').length || $(clickEvent.target).parent('td').length ||
                    $(clickEvent.target).parents('#context-menu').length || $(clickEvent.target).parents('.btn-toolbar').length)) {
                    deselectChildren();
                }
            };

            $scope.clickDelete = function () {
                var toBeDeletedElements = $scope.selectedElements;
                deselectChildren();
                angular.forEach(toBeDeletedElements, function (element) {
                    WorkspaceElementResource.delete({wsName: $scope.wsName, path: $scope.parent.path + '/' + element.name}, function () {
                        getParentData(true);
                    });
                });
            };

            $scope.newCollectionModal = function () {
                // TODO give focus to button
                $('#new-collection-modal').modal('show').find('button.add-collection').focus();
            };

            $scope.isOnlySelectedElementParent = function () {
                return $scope.selectedElements[0] === $scope.parent;
            };

            $scope.hasOnlyParentSelected = function () {
                return $scope.selectedElements.length === 1 && $scope.selectedElements[0] === $scope.parent;
            };

            $scope.hasOnlyOneElementSelected = function () {
                return $scope.selectedElements.length === 1;
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
                        $scope.isContextMenuActive = false;
                    });
                } else {
                    $('#new-collection-name').parentsUntil('form', '.form-group').addClass('has-error');
                }
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                getParentData(true);
            });

            $rootScope.$on('completeMetadataUpload', function () {
                if ($scope.hasOnlyParentSelected()) {
                    getParentData(true);
                } else {
                    getChildData(true);
                }
            });

            $('#browser-side-tabs').find('a').click(function (e) {
                e.preventDefault();
            });

            $scope.showMetadata = function () {
                $rootScope.$broadcast('metadata-list-show', getMetadatasOfSelectedElement());
            };

            $scope.order = function (predicate, reverse) {
                if (predicate !== $scope.orderProp) {
                    reverse = false;
                }
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                $scope.orderProp = predicate;
            };

            $scope.toggleTab = function (clickEvent) {
                clickEvent.preventDefault();
                $(clickEvent.target).tab('show');
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

            function checkVisualizer(element) {
//                $scope.visualizers = VisualizerManager.getCompatibleVisualizers(element.mimetype);
//                if ($scope.visualizers.length === 0) {
                    clearVisualizers();
//                }
            }

            function finishPreview() {
                var firstVisualizer = $scope.visualizers[0],
                    element = $compile(firstVisualizer.element)($scope),
                    visualizerModal = $('#visualizer-modal');
                visualizerModal.find('.modal-header h4').text(firstVisualizer.name);
                visualizerModal.find('.modal-body').empty().append(element);
                visualizerModal.modal('show');
                $scope.contextMenu();
            }

            $scope.clickPreview = function () {
                var firstVisualizer = $scope.visualizers[0];
                if (firstVisualizer.needAllChildrenData) {
                    getChildrenData(true);
                } else {
                    finishPreview();
                }
            };

            // *********************** //
            //          Filter         //
            // *********************** //

            $scope.openFilter = function (event) {
                event.stopPropagation();
            };

            $('#filter-query-wrapper').on('hide.bs.dropdown', function () {
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
            //          Init         //
            // *********************** //

            function init() {
                getParentData(false);
                initBreadcrumbDropdownMenu();
            }
            init();

        }]);
