'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardPermissionsCtrl
 * @description
 * # WorkspaceDashboardPermissionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardPermissionsCtrl', ['$scope', '$modal', '$q', 'Workspace', 'WorkspaceElementResource', 'ortolangType', 'Helper', function ($scope, $modal, $q, Workspace, WorkspaceElementResource, ortolangType, Helper) {

        function loadChild(path) {
            var deferred = $q.defer();
            WorkspaceElementResource.get({wskey: Workspace.active.workspace.key, path: path, policy: true}, function (data) {
                var i;
                data.effectiveAcl = data.publicationPolicy;
                for (i = 0; i < data.metadatas.length; i++) {
                    if (data.metadatas[i].name === 'ortolang-acl-json') {
                        data.effectiveAcl = null;
                        break;
                    }
                }
                if (path === '/') {
                    data.name = '/';
                }
                data.expanded = $scope.models.tree[data.key] ? $scope.models.tree[data.key].expanded : false;
                $scope.models.tree[data.key] = data;
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        function loadChildren(parent) {
            angular.forEach(parent.elements, function (element) {
                loadChild('/' + (parent.path ? parent.path + '/' : '') + element.name);
            });
        }

        $scope.nodeToggle = function (element) {
            if (element.type === ortolangType.collection) {
                $scope.models.tree[element.key].expanded = !$scope.models.tree[element.key].expanded;
                $scope.models.expanded[element.key] = !$scope.models.expanded[element.key];
                var children = $scope.models.tree[element.key].elements;
                if (children.length > 0 && !$scope.models.tree[children[0].key]) {
                    loadChildren($scope.models.tree[element.key]);
                }
            }
        };

        function refreshChildren(parent) {
            angular.forEach(parent.elements, function (child) {
                if ($scope.models.tree[child.key] && $scope.models.tree[child.key].path) {
                    loadChild($scope.models.tree[child.key].path);
                    if (child.type === ortolangType.collection) {
                        refreshChildren($scope.models.tree[child.key]);
                    }
                }
            });
        }

        $scope.removeAcl = function (element, $event) {
            $event.stopPropagation();
            WorkspaceElementResource.delete({wskey: Workspace.active.workspace.key, path: element.path, metadataname: 'ortolang-acl-json'}, function () {
                loadChild(element.path);
                refreshChildren(element);
            });
        };

        function setAcl(element, template, recursive) {
            WorkspaceElementResource.setPublicationPolicy({wskey: Workspace.active.workspace.key, path: element.path, recursive: recursive}, {template: template}, function () {
                loadChild(element.path);
                refreshChildren(element);
            });
        }

        $scope.setAcl = function (element, template, $event) {
            $event.stopPropagation();
            if (element.type === ortolangType.collection) {
                var permissionsModal,
                    modalScope = Helper.createModalScope(true);
                modalScope.element = element;
                modalScope.template = template;
                modalScope.models = {
                    recursive: true
                };
                modalScope.set = function () {
                    setAcl(element, template, modalScope.models.recursive);
                    permissionsModal.hide();
                };
                permissionsModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/permissions-modal.html',
                    show: true
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
                loadChild('/', true).then(function (data) {
                    data.expanded = true;
                    loadChildren(data);
                });
            });
        }());
    }]);
