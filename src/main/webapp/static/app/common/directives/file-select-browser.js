'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:fileSelectBrowser
 * @description
 * # fileSelectBrowser
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('fileSelectBrowser', ['$filter', 'FileSelectBrowserService', 'WorkspaceResource', 'ObjectResource', 'Settings', function ($filter, FileSelectBrowserService, WorkspaceResource, ObjectResource, Settings) {
        return {
            restrict: 'A',
            scope: {
                forceMimeTypes: '=',
                forceWorkspace: '=',
                forceHead: '=',
                fileSelectId: '='
            },
            templateUrl: 'common/directives/browser.html',
            link: {
                pre : function (scope, element, attrs) {
                    scope.workspaceList = WorkspaceResource.get();
                    var workspace;
                    scope.browserSettings = Settings[FileSelectBrowserService.id];
                    scope.workspaceList.$promise.then(function (data) {
                        if (scope.browserSettings.wskey || scope.forceWorkspace) {
                            var key = scope.forceWorkspace || scope.browserSettings.wskey,
                                filteredWorkspace = $filter('filter')(data.entries, {key: key}, true);
                            if (filteredWorkspace.length !== 1) {
                                console.error('No workspace with key "%s" available', key);
                                if (!scope.forceWorkspace) {
                                    workspace = data.entries[0];
                                }
                            } else {
                                workspace = filteredWorkspace[0];
                            }
                        } else {
                            workspace = data.entries[0];
                        }
                        if (workspace) {
                            FileSelectBrowserService.workspace = workspace;
                            scope.$broadcast('initWorkspaceVariables');
                        }
                    });

                    function getSnapshotNameFromHistory(workspaceSnapshot) {
                        if (FileSelectBrowserService.workspace.snapshots) {
                            var filteredSnapshot = $filter('filter')(FileSelectBrowserService.workspace.snapshots, {key: workspaceSnapshot.key}, true);
                            if (filteredSnapshot.length === 1) {
                                return filteredSnapshot[0].name;
                            }
                        }
                        return undefined;
                    }

                    scope.getSnapshotsHistory = function () {
                        ObjectResource.history({key: FileSelectBrowserService.workspace.head}, function (data) {
                            scope.workspaceHistory = data.entries;
                            angular.forEach(scope.workspaceHistory, function (workspaceSnapshot) {
                                workspaceSnapshot.name = getSnapshotNameFromHistory(workspaceSnapshot);
                            });
                        });
                    };

                    scope.isFileSelect = true;
                    scope.fileSelectAcceptMultiple = attrs.acceptMultiple &&
                        (attrs.acceptMultiple === 'true' || attrs.acceptMultiple === 'multiple');
                }
            }
        };
    }]);
