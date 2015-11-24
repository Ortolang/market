'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardPermissionsCtrl
 * @description
 * # WorkspaceDashboardPermissionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardPermissionsCtrl', ['$scope', 'Workspace', 'Content', 'WorkspaceElementResource', 'ortolangType', function ($scope, Workspace, Content,WorkspaceElementResource, ortolangType) {

        function loadChildren(from, isRoot) {
            angular.forEach(from.elements, function (element, key) {
                WorkspaceElementResource.get({wskey: Workspace.active.workspace.key, path: '/' + (from.path ? from.path + '/' : '') + element.name}, function (data) {
                    var i, aclKey;
                    for (i = 0; i < data.metadatas.length; i++) {
                        if (data.metadatas[i].name === 'ortolang-acl-json') {
                            aclKey = data.metadatas[i].key;
                            break;
                        }
                    }
                    if (aclKey) {
                        Content.downloadWithKey(aclKey).promise.then(function (aclMetadata) {
                            data.acl = angular.fromJson(aclMetadata.data).template;
                        });
                    } else {
                        data.effectiveAcl = from.acl || from.effectiveAcl || 'forall';
                    }
                    data.parent = from.key;
                    if (isRoot) {
                        data.expanded = true;
                        data.name = '/';
                        $scope.models.treeData.push(data);
                        loadChildren(data);
                    } else {
                        from.elements[key] = data;
                    }
                    $scope.models.tree[data.key] = data;
                });
            });
        }

        $scope.nodeToggle = function (element) {
            if (element.type === ortolangType.collection) {
                element.expanded = !element.expanded;
                if (element.elements.length > 0 && !element.elements[0].path) {
                    loadChildren(element);
                }
            }
        };

        function propagateAcl(parent, template) {
            angular.forEach(parent.elements, function (child) {
                if ($scope.models.tree[child.key]) {
                    if (!$scope.models.tree[child.key].acl) {
                        $scope.models.tree[child.key].effectiveAcl = template;
                    }
                    propagateAcl(child, $scope.models.tree[child.key].acl || $scope.models.tree[child.key].effectiveAcl);
                }
            });
        }

        function removeAcl(element) {
            WorkspaceElementResource.delete({wskey: Workspace.active.workspace.key, path: element.path, metadataname: 'ortolang-acl-json'}, function () {
                element.acl = null;
                if (element.pathParts.length === 0) {
                    element.effectiveAcl = 'forall';
                    propagateAcl(element, element.effectiveAcl);
                } else {
                    propagateAcl($scope.models.tree[element.parent], $scope.models.tree[element.parent].acl || $scope.models.tree[element.parent].effectiveAcl);
                }
            });
        }

        $scope.setAcl = function (element, template, $event) {
            $event.stopPropagation();
            if (element.acl === template) {
                removeAcl(element);
                return;
            }
            var formData = new FormData();

            formData.append('path', element.path);
            formData.append('type', ortolangType.metadata);
            formData.append('name', 'ortolang-acl-json');

            var blob = new Blob([angular.toJson({template: template})], { type: 'application/json'});
            formData.append('stream', blob);

            WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, formData, function () {
                element.acl = template;
                element.effectiveAcl = null;
                propagateAcl(element, template);
            });
        };

        (function init() {
            $scope.models = {};
            $scope.models.treeData = [];
            $scope.models.tree = {};
            $scope.models.showObjects = false;
            Workspace.isActiveWorkspaceInfoLoaded().then(function () {
                var headCopy = angular.copy(Workspace.active.head);
                headCopy.name = '';
                loadChildren({elements: [headCopy]}, true);
            });
        }());
    }]);
