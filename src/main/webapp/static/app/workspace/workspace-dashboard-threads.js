'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardThreadsCtrl
 * @description
 * # WorkspaceDashboardThreadsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardThreadsCtrl', ['$rootScope', '$scope', '$location', '$modal', '$q', '$filter', '$timeout', '$anchorScroll', 'Workspace', 'MessageResource', 'ortolangType', 'Helper', function ($rootScope, $scope, $location, $modal, $q, $filter, $timeout, $anchorScroll, Workspace, MessageResource, ortolangType, Helper) {

        var listDeferred;

        $scope.listThreads = function () {
            listDeferred = $q.defer();

            MessageResource.listThreads({wskey: Workspace.active.workspace.key}, function (result) {
                $scope.models.activeThread = null;
                $scope.models.threads = result;
                angular.forEach($scope.models.threads, function (thread) {
                    Helper.getCard(thread.author);
                });
                listDeferred.resolve();
            }, function () {
                Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
                listDeferred.reject();
            });
            return listDeferred.promise;
        };

        $scope.listMessages = function () {
            MessageResource.listMessages({tkey: $scope.models.activeThread.key}, function (result) {
                $scope.models.messages = result;
                $scope.models.messagesAuthors = {};
                angular.forEach($scope.models.messages, function (message) {
                    Helper.getCard(message.author);
                    $scope.models.messagesAuthors[message.key] = message.author;
                });
            }, function () {
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
                            $scope.listThreads();
                            createThreadModal.hide();
                        }, function () {
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
            $scope.cancelReply();
            $scope.models.replyTo = message;
        };

        $scope.scrollToReply = function () {
            angular.element('.workspace-dashboard-threads').find('[autofocus]:first').focus();
            $anchorScroll('thread-message-reply-wrapper');
        };

        $scope.cancelReply = function () {
            $scope.models.replyTo = undefined;
            $scope.models.pendingSubmit = false;
            $scope.models.replyBody = undefined;
        };

        $scope.replySubmit = function (form) {
            if (!$scope.models.pendingSubmit) {
                $scope.models.pendingSubmit = true;
                if (form.$valid) {
                    MessageResource.postMessage({tkey: $scope.models.activeThread.key, parent: $scope.models.replyTo.key, body: $scope.models.replyBody}, function () {
                        $scope.listMessages();
                        $scope.models.activeThread.lastActivity = Date.now();
                        $scope.cancelReply();
                    }, function () {
                        Helper.showUnexpectedErrorAlert(undefined, 'top');
                        $scope.models.pendingSubmit = false;
                    });
                } else {
                    $scope.models.pendingSubmit = false;
                }
            }
        };

        $scope.openThread = function (thread) {
            $location.search('t', thread.key);
        };

        $scope.backToList = function () {
            $location.search('t', undefined);
            $scope.listThreads();
        };

        $rootScope.$on('message.thread.create', function (event, eventMessage) {
            event.stopPropagation();
            if (!$scope.models.activeThread) {
                listDeferred.promise.then(function () {
                    if ($filter('filter')($scope.models.threads, {key: eventMessage.arguments.key}, true).length === 0) {
                        $scope.listThreads();
                    }
                });
            }
        });

        function setActiveThread(key) {
            listDeferred.promise.then(function () {
                $scope.models.activeThread = $filter('filter')($scope.models.threads, {key: key}, true)[0];
                $scope.listMessages();
            });
        }

        $scope.$on('$routeUpdate', function () {
            if ($location.search().t) {
                setActiveThread($location.search().t);
            } else {
                $scope.models.activeThread = undefined;
                $scope.models.messages = undefined;
                $scope.models.messagesAuthors = undefined;
            }
        });

        $scope.highlightMessage = function (key) {
            $scope.models.highligtedMessage = key;
            $timeout(function () {
                $scope.models.highligtedMessage = undefined;
            }, 3000);
        };

        (function init() {
            $scope.models = {};
            $scope.models.activeThread = null;
            $scope.listThreads().then(function () {
                if ($location.search().t) {
                    setActiveThread($location.search().t);
                }
            });
            $scope.Workspace = Workspace;
        }());
    }]);
