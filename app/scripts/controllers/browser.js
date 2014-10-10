'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', ['$scope', '$routeParams', '$rootScope', 'Url', 'hotkeys', 'WorkspaceElementResource', 'ObjectResource', '$aside',
        function ($scope, $routeParams, $rootScope, Url, hotkeys, WorkspaceElementResource, ObjectResource, $aside) {

            $scope.urlBase = Url.urlBase();
            $scope.wsName = $routeParams.wsName;
            $scope.orderProp = ['type', 'name'];
            $scope.dateFormat = 'medium';
            $scope.reverse = false;

            function buildSelectedChildDownloadUrl() {
                return Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/download?path=' + $scope.element.path + '/' + $scope.selectedChildData.object.name;
            }

            $scope.initBreadcrumbDropdownMenu = function () {
                $scope.breadcrumbDropdownItems = [];
                $scope.breadcrumbDropdownItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
            };

            function buildBreadcrumb() {
                var breadcrumbParts = [], tmp = '';
                angular.forEach($scope.element.pathParts, function (key) {
                    tmp += '/' + key;
                    breadcrumbParts.push(tmp);
                });
                $scope.breadcrumbParts = breadcrumbParts;
                $scope.path = $scope.element.path.replace('/', 'head/root/').split('/');
            }

            $scope.contextMenu = function (clickEvent, sameChild) {
                // If right click
                if (clickEvent.button === 2) {
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
                    if ($scope.selectedChild.type === 'collection') {
                        $scope.menuItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
                        $scope.menuItems.push({divider: true});
                    }
                    if ($scope.selectedChildData.object.stream) {
                        $scope.menuItems.push({text: 'Download', icon: 'download', href: $scope.selectedChildData.object.downloadUrl});
                    }
                    $scope.menuItems.push({text: 'Delete', icon: 'trash', action: 'delete'});
                } else {
                    $scope.isContextMenuActive = false;
                }
            };

            function getElementData(refresh) {
                WorkspaceElementResource.get({wsName: $routeParams.wsName, path: $routeParams.path, root: $routeParams.root},
                    function (element) {
                        $scope.element = element;
                        // If we just refresh the data no need to build the breadcrumb again
                        if (!refresh) {
                            buildBreadcrumb();
                        }
                        $scope.resizeBrowser();
                    });
            }

            function getChildData(refresh, clickEvent) {
                clickEvent = clickEvent || undefined;
                ObjectResource.get({oKey: $scope.selectedChild.key}, function (data) {
                    $scope.selectedChildData = data;
                    if (!refresh) {
                        $scope.selectedChildData.object.downloadUrl = buildSelectedChildDownloadUrl();
                        $scope.contextMenu(clickEvent, false);
                    }
                });
            }

            $scope.clickChild = function (clickEvent, child) {
                if ($scope.selectedChild === child) {
                    $scope.contextMenu(clickEvent, true);
                    return;
                }
                $scope.selectedChild = child;
                // Get detailed info on the selected child
                getChildData(false, clickEvent);
            };

            $scope.isSelected = function (item) {
                return $scope.selectedChild === item;
            };

            function deselectChild() {
                $scope.selectedChild = undefined;
                $scope.selectedChildData = undefined;
                $scope.isContextMenuActive = false;
            }

            $scope.checkSelection = function (clickEvent) {
                if (!($(clickEvent.target).parent('tr').length || $(clickEvent.target).parent('td').length ||
                    $(clickEvent.target).parents('#context-menu').length || $(clickEvent.target).parents('.btn-toolbar').length)) {
                    deselectChild();
                }
            };

            $scope.clickDelete = function () {
                if (!$scope.selectedChild) {
                    return;
                }
                WorkspaceElementResource.delete({wsName: $scope.wsName, path: $scope.element.path + '/' + $scope.selectedChildData.object.name}, function () {
                    $scope.selectedChildData = undefined;
                    getElementData(true);
                    deselectChild();
                });
            };

            $scope.newCollectionModal = function () {
                // TODO give focus to button
                $('#new-collection-modal').modal('show').find('button.add-collection').focus();
            };

            $scope.addCollection = function () {
                if ($scope.newCollectionName !== undefined) {
                    $('#new-collection-name').parentsUntil('form', '.form-group').removeClass('has-error');
                    var data = {
                        path: $scope.element.path + '/' + ($scope.selectedChild &&
                            $scope.selectedChild.type === 'collection' ? $scope.selectedChild.name + '/' : '') +
                            $scope.newCollectionName,
                        type: 'collection'
                    };
                    if ($scope.newCollectionDescription) {
                        data.description = $scope.newCollectionDescription;
                    }
                    WorkspaceElementResource.put({wsName: $routeParams.wsName }, data, function () {
                        getElementData(true);
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
                getElementData(true);
            });

            $rootScope.$on('completeMetadataUpload', function () {
                if ($scope.selectedChild) {
                    getChildData(true);
                } else {
                    getElementData(true);
                }
            });

            $('#browser-side-tabs').find('a').click(function (e) {
                e.preventDefault();
            });

            $scope.previewMetadata = function (clickEvent, metadata) {
                $rootScope.$broadcast('metadata-preview', clickEvent, metadata);
            };

            $scope.deleteMetadata = function (metadata) {
                $rootScope.$broadcast('metadata-delete', metadata);
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
                    default:
                        break;
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
            //          Metadata         //
            // *********************** //

            // DEPRECATED SINCE USE showMetadataCreator
            $scope.aside = {
                'title': 'Create metadata',
                'contentTemplate': 'views/metadata-creator-market-ortolang.html',
            };

            $scope.metadataFormats = [{id:'rdf-market-ortolang', name:'Présentation'}, {id:'oai_dc', name: 'OAI Dublin Core'}];
            $scope.userMetadataFormat = null;

            $scope.mdName = ''; //TODO aller cherhcer le nom de l'element selectionné

            $scope.dropdownMetadataFormats = [{
                'text': 'Présentation',
                'click': 'showMetadataCreator()'
            }
            ];

            $scope.showMetadataCreator = function() {
                console.debug('show metadata creator');

                $aside({title: 'Create metadata',
                    contentTemplate: 'views/metadata-creator-market-ortolang.html',
                    template: 'views/aside.tpl.html',
                    placement: 'right',
                    animation: 'am-fade-and-slide-right',
                    container: 'body'
                });
            };

            // *********************** //
            //          Init         //
            // *********************** //

            function init() {
                getElementData(false);
                $scope.initBreadcrumbDropdownMenu();
            }
            init();

        }]);
