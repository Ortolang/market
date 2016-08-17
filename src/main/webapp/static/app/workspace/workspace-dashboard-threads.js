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
            MessageResource.listThreads({wskey: Workspace.active.workspace.key}, function (result) {
                $scope.models.activeThread = null;
                $scope.models.threads = result;
                angular.forEach($scope.models.threads, function (thread) {
                    Helper.getCard(thread.author);
                });
            }, function (error) {
                Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
            });
        };

        $scope.listMessages = function () {
            MessageResource.listMessages({tkey: $scope.models.activeThread.key}, function (result) {
                $scope.models.messages = result;
                angular.forEach($scope.models.messages, function (message) {
                    Helper.getCard(message.author);
                });
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
                        MessageResource.createThread({wskey: Workspace.active.workspace.key, title: modalScope.models.title, body: modalScope.models.body}, function (newThread) {
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

        $scope.reply = function (message) {
            var replyMessageModal,
                modalScope = Helper.createModalScope(true);

            modalScope.submit = function (form) {
                if (!modalScope.models.pendingSubmit) {
                    modalScope.models.pendingSubmit = true;
                    if (form.$valid) {
                        MessageResource.postMessage({tkey: $scope.models.activeThread.key, parent: message.key, body: modalScope.models.body}, function (result) {
                            replyMessageModal.hide();
                        }, function (error) {
                            Helper.showUnexpectedErrorAlert('#reply-message-modal', 'top');
                            modalScope.models.pendingSubmit = false;
                        });
                    } else {
                        modalScope.models.pendingSubmit = false;
                    }
                }
            };
            modalScope.$on('modal.show', function () {
                angular.element('#reply-message-modal').find('[autofocus]:first').focus();
            });
            replyMessageModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/reply-message-modal.html',
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
            $scope.models.activeThread = null;
            $scope.listThreads();
            $scope.Workspace = Workspace;
        }());
    }]);
