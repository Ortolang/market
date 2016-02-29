'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardPermissionsCtrl
 * @description
 * # WorkspaceDashboardPermissionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardPermissionsCtrl', ['$rootScope', '$scope', '$modal', '$q', 'Workspace', 'WorkspaceElementResource', 'ortolangType', 'Helper', function ($rootScope, $scope, $modal, $q, Workspace, WorkspaceElementResource, ortolangType, Helper) {

        function processElement(element) {
            var i;
            element.effectiveAcl = element.publicationPolicy;
            for (i = 0; i < element.metadatas.length; i++) {
                if (element.metadatas[i].name === 'ortolang-acl-json') {
                    element.effectiveAcl = null;
                    break;
                }
            }
            element.expanded = $scope.models.tree[element.key] ? $scope.models.tree[element.key].expanded : false;
            $scope.models.tree[element.key] = element;
        }

        function loadCollection(path) {
            var deferred = $q.defer();
            WorkspaceElementResource.getPublicationPolicy({wskey: Workspace.active.workspace.key, path: path}, function (data) {
                if (path === '/') {
                    data.parent.name = '/';
                }
                processElement(data.parent);
                angular.forEach(data.elements, function (element) {
                    processElement(element);
                });
                deferred.resolve(data.parent);
            });
            return deferred.promise;
        }

        $scope.nodeToggle = function (element) {
            if (element.type === ortolangType.collection) {
                $scope.models.tree[element.key].expanded = !$scope.models.tree[element.key].expanded;
                $scope.models.expanded[element.key] = !$scope.models.expanded[element.key];
                var children = $scope.models.tree[element.key].elements;
                if (children.length > 0 && !$scope.models.tree[children[0].key]) {
                    loadCollection($scope.models.tree[element.key].path);
                }
            }
        };

        function refreshChildren(parent) {
            angular.forEach(parent.elements, function (child) {
                if ($scope.models.tree[child.key] && $scope.models.tree[child.key].path) {
                    if (child.type === ortolangType.collection) {
                        loadCollection($scope.models.tree[child.key].path);
                        refreshChildren($scope.models.tree[child.key]);
                    }
                }
            });
        }

        function refreshElement(element) {
            var parentPath = element.path.substring(0, element.path.lastIndexOf('/'));
            if (parentPath.length === 0) {
                parentPath = '/';
            }
            if (element.type === ortolangType.collection) {
                loadCollection(element.path);
                refreshChildren(element);
                // if refreshing root
                if (element.path !== parentPath) {
                    loadCollection(parentPath);
                }
            } else {
                loadCollection(parentPath);
            }
        }

        $scope.removeAcl = function (element, $event) {
            $event.stopPropagation();
            WorkspaceElementResource.delete({wskey: Workspace.active.workspace.key, path: element.path, metadataname: 'ortolang-acl-json'}, function () {
                refreshElement(element);
            });
        };

        function setAcl(element, template, recursive) {
            return WorkspaceElementResource.setPublicationPolicy({wskey: Workspace.active.workspace.key, path: element.path, recursive: recursive}, {template: template}, function () {
                refreshElement(element);
            }, function () {
                Helper.showUnexpectedErrorAlert();
            });
        }

        $scope.setAcl = function (element, template, $event) {
            $event.stopPropagation();
            if (element.type === ortolangType.collection) {
                var permissionsModal,
                    modalScope = Helper.createModalScope(true);
                modalScope.element = element;
                modalScope.template = template;
                modalScope.icons = $rootScope.icons;
                modalScope.models = {
                    recursive: true
                };
                modalScope.set = function () {
                    modalScope.models.pendingSubmit = true;
                    setAcl(element, template, modalScope.models.recursive).$promise.then(function () {
                        modalScope.models.pendingSubmit = false;
                        permissionsModal.hide();
                    }, function () {
                        modalScope.models.pendingSubmit = false;
                    });
                };
                modalScope.$on('permissionsModal.hide.before', function ($event) {
                    if (modalScope.models.pendingSubmit) {
                        $event.preventDefault();
                    }
                });
                permissionsModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/permissions-modal.html',
                    show: true,
                    prefixEvent: 'permissionsModal'
                });
            } else {
                setAcl(element, template);
            }
        };

        (function init() {
            $scope.models = {};
            $scope.models.expanded = {};
            $scope.models.tree = {};
            $scope.models.showObjects = false;
            Workspace.isActiveWorkspaceInfoLoaded().then(function () {
                loadCollection('/').then(function (data) {
                    data.expanded = true;
                });
            });
        }());
    }]);
