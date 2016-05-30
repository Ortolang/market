'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardThreadsCtrl
 * @description
 * # WorkspaceDashboardThreadsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardThreadsCtrl', ['$rootScope', '$scope', '$modal', '$q', 'Workspace', 'MessageResource', 'ortolangType', 'Helper', function ($rootScope, $scope, $modal, $q, Workspace, MessageResource, ortolangType, Helper) {

        $scope.listThreads = function () {
            MessageResource.listThreads({wskey: Workspace.active.workspace.key, o: $scope.models.offset, l: $scope.models.limit}, function (result) {
                $scope.models.activeThread = null;
                $scope.models.threads = result;
            }, function (error) {
                Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
            });
        };

        $scope.listMessages = function () {
            MessageResource.listMessages({tkey: $scope.models.activeThread.key, o: $scope.models.offset, l: $scope.models.limit}, function (result) {
                $scope.models.messages = result;
            }, function (error) {
                Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
            });
        };

        $scope.createThread = function () {
            var createThreadModal,
                modalScope = Helper.createModalScope(true);

            modalScope.submit = function (createThreadForm) {
                if (!modalScope.models.pendingSubmit) {
                    modalScope.models.pendingSubmit = true;
                    if (createThreadForm.$valid) {
                        MessageResource.createThread({workspace: Workspace.active.workspace.key, name: modalScope.models.name, description: modalScope.models.description}, function (newThread) {
                            createThreadModal.hide();
                        }, function (error) {
                            Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
                            modalScope.models.pendingSubmit = false;
                        });
                    } else {
                        modalScope.models.pendingSubmit = false;
                    }
                }
            };
            modalScope.$on('modal.show', function () {
                angular.element('#create-thread-modal').find('[autofocus]:first').focus();
            });
            createThreadModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/create-thread-modal.html',
                show: true
            });
        };

        $scope.openThread = function(thread) {
            $scope.models.activeThread = thread;
            $scope.listMessages();
        }

        $rootScope.$on('message.thread.create', function (event, eventMessage) {
            event.stopPropagation();
            if (!$scope.models.activeThread) {
                $scope.listThreads();
            }
        });

        (function init() {
            $scope.models = {};
            $scope.models.offset = 0;
            $scope.models.limit = 15;
            $scope.models.activeThread = null;
            $scope.models.threads = {};
            $scope.models.messages = {};
            $scope.listThreads();
        }());
    }]);
