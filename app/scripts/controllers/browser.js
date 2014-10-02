'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserCtrl
 * @description
 * # BrowserCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$filter', 'Url',
        function ($scope, $http, $routeParams, $rootScope, $filter, Url) {

            $scope.urlBase = Url.urlBase();
            $scope.wsName = $routeParams.wsName;
            $scope.rootName = $routeParams.rootName;
            $scope.orderProp = ['type', 'name'];
            $scope.dateFormat = 'medium';
            $scope.reverse = false;
            $scope.newCollectionName = undefined;
            $scope.newCollectionDescription = undefined;
            $scope.code = undefined;

            var url = Url.urlBase() + '/rest/workspaces/' +
                $scope.wsName + '/elements?root=' + $scope.rootName + '&path=' + $routeParams.elementPath;

            function buildSelectedChildDeleteUrl() {
                return Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/elements?path=' + $scope.element.path + '/' + $scope.selectedChildData.object.name;
            }

            function buildSelectedChildDownloadUrl() {
                return Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/download?path=' + $scope.element.path + '/' + $scope.selectedChildData.object.name;
            }

            $scope.initBreadcrumbDropdownMenu = function () {
                $scope.breadcrumbDropdownItems = [];
                $scope.breadcrumbDropdownItems.push({text: 'New Collection', icon: 'plus', action: 'newCollection'});
            };
            $scope.initBreadcrumbDropdownMenu();

            $scope.contextMenu = function (clickEvent, sameChild) {
                // If right click
                if (clickEvent.button === 2) {
                    var browserToolbarHeight = $('#browser-toolbar').outerHeight();
                    var navbarHeight = $('#main-navbar').outerHeight();
                    var pageWrapperMarginLeft = parseFloat($('#page-wrapper').css('margin-left'));
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
                $http.get(url).success(function (data) {
                    $scope.element = data;
                    // If we just refresh the data no need to build the breadcrumb again
                    if (!refresh) {
                        var breadcrumbParts = [], tmp = '';
                        angular.forEach(data.pathParts, function (key) {
                            tmp += '/' + key;
                            breadcrumbParts.push(tmp);
                        });
                        $scope.breadcrumbParts = breadcrumbParts;
                        $scope.path = data.path.replace('/', 'head/root/').split('/');
                    }
                    console.log(breadcrumbParts);
                    $(window).trigger('resize');
                });
            }

            function getChildData(refresh, clickEvent) {
                clickEvent = clickEvent || undefined;
                $http.get(Url.urlBase() + '/rest/objects/' + $scope.selectedChild.key).success(function (data) {
                    $scope.selectedChildData = data;
                    if (!refresh) {
                        $scope.selectedChildData.object.downloadUrl = buildSelectedChildDownloadUrl();
                        $scope.contextMenu(clickEvent, false);
                    }
                });
            }

            getElementData(false);

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
                $http.delete(buildSelectedChildDeleteUrl()).success(function () {
                    $scope.selectedChildData = undefined;
                    getElementData(true);
                    deselectChild();
                });
            };

            $scope.newCollectionModal = function () {
                $('#new-collection-modal').modal('show');
            };

            $scope.toggleUploadZoneStatus = function () {
                if ($rootScope.uploadZoneStatus === 'active') {
                    $rootScope.uploadZoneStatus = undefined;
                } else {
                    $rootScope.uploadZoneStatus = 'active';
                }
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
                    $http.put(Url.urlBase() + '/rest/workspaces/' + $routeParams.wsName + '/elements', data).success(function () {
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

            $scope.clearUploaderQueue = function () {
                $rootScope.uploader.clearQueue();
                $rootScope.uploadZoneStatus = undefined;
            };

            $rootScope.$on('uploaderCompleteItemUpload', function () {
                getElementData(true);
            });

            $rootScope.$on('uploaderAfterAddingAll', function () {
                $rootScope.uploadZoneStatus = 'active';
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

            function deselectMetadata(clickEvent) {
                if ($scope.selectedMetadata) {
                    if (clickEvent) {
                        $(clickEvent.target).removeClass('active');
                    } else {
                        $('.metadata-' + $scope.selectedMetadata.key).removeClass('active');
                    }
                    $scope.selectedMetadata = undefined;
                    $scope.code = undefined;
                }
            }

            $scope.loadMetadata = function (clickEvent, metadata) {
                clickEvent.preventDefault();
                if ($scope.selectedMetadata === metadata) {
                    deselectMetadata(clickEvent);
                    return;
                }
                if ($scope.selectedMetadata) {
                    $('.metadata-' + $scope.selectedMetadata.key).removeClass('active');
                }
                $(clickEvent.target).addClass('active');
                $scope.selectedMetadata = metadata;
                $http.get(Url.urlBase() + '/rest/objects/' + metadata.key + '/download').success(function (data) {
                    $scope.code = data;
                    $('#metadata-modal').modal('show');
                });
            };

            $scope.onDismissMetadataModal = function () {
                // When dismiss metadata modal: deselected selected metadata
                $('#metadata-modal').on('hide.bs.modal', function () {
                    deselectMetadata();
                });
            };


            $scope.order = function (predicate, reverse) {
                if (predicate !== $scope.orderProp) {
                    reverse = false;
                }
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                $scope.orderProp = predicate;
            };

            $scope.filterChildren = function (query) {
                return function (child) {
                    var re = new RegExp(query, 'gi');
                    return child.name.match(re) || ($filter('date')(child.modification, $scope.dateFormat)).match(re);
                };
            };

            $scope.toggleTab = function (clickEvent) {
                clickEvent.preventDefault();
                $(clickEvent.target).tab('show');
            };

            $rootScope.getSelectedChild = function () {
                return $scope.selectedChild;
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

            $scope.openFilter = function (event) {
                event.stopPropagation();
            };

            $('#testFilter').on('hide.bs.dropdown', function (e) {
                if ($scope.filter !== undefined && $scope.filter.length !== 0) {
                    return false;
                }
            });
        }]);
