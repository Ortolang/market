'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardThreadsCtrl
 * @description
 * # WorkspaceDashboardThreadsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardThreadsCtrl', ['$rootScope', '$scope', '$location', '$modal', '$q', '$filter', '$timeout', '$anchorScroll', 'Workspace', 'MessageResource', 'ortolangType', 'Helper', 'VisualizerService', 'Content', function ($rootScope, $scope, $location, $modal, $q, $filter, $timeout, $anchorScroll, Workspace, MessageResource, ortolangType, Helper, VisualizerService, Content) {

        var listDeferred, messagesDeferred;

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
            messagesDeferred = $q.defer();

            MessageResource.listMessages({tkey: $scope.models.activeThread.key}, function (result) {
                $scope.models.messages = result;
                $scope.models.messagesAuthors = {};
                angular.forEach($scope.models.messages, function (message) {
                    Helper.getCard(message.author);
                    $scope.models.messagesAuthors[message.key] = message.author;
                });
                messagesDeferred.resolve();
            }, function () {
                Helper.showUnexpectedErrorAlert('#create-thread-modal', 'top');
                messagesDeferred.reject();
            });

            return messagesDeferred.promise;
        };

        $scope.createThread = function () {
            var createThreadModal,
                modalScope = Helper.createModalScope(true, true);

            modalScope.submit = function (createThreadForm) {
                if (!modalScope.models.pendingSubmit) {
                    modalScope.models.pendingSubmit = true;
                    if (createThreadForm.$valid) {
                        var formData = new FormData();
                        formData.append('wskey', Workspace.active.workspace.key);
                        formData.append('title', modalScope.models.title);
                        formData.append('body', modalScope.models.body);
                        angular.forEach(modalScope.models.attachments, function (attachment, key) {
                            formData.append('attachment-' + key, attachment);
                        });
                        MessageResource.createThread(formData, function () {
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
            createThreadModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/create-thread-modal.html',
                show: true
            });
        };

        function setLastActivity() {
            $scope.models.activeThread.lastActivity = Date.now();
        }

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
            $scope.models.attachments = undefined;
        };

        $scope.replySubmit = function (form) {
            if (!$scope.models.pendingSubmit) {
                $scope.models.pendingSubmit = true;
                if (form.$valid) {
                    var formData = new FormData();
                    formData.append('parent', $scope.models.replyTo.key);
                    formData.append('body', $scope.models.replyBody);
                    angular.forEach($scope.models.attachments, function (attachment, key) {
                        formData.append('attachment-' + key, attachment);
                    });
                    MessageResource.postMessage({tkey: $scope.models.activeThread.key}, formData, function () {
                        $scope.listMessages();
                        setLastActivity();
                        $scope.cancelReply();
                    }, function () {
                        Helper.showUnexpectedErrorAlert();
                        $scope.models.pendingSubmit = false;
                    });
                } else {
                    $scope.models.pendingSubmit = false;
                }
            }
        };

        $scope.deleteMessage = function (message) {
            var deleteMessageModal,
                modalScope = Helper.createModalScope(true);

            modalScope.delete = function () {
                MessageResource.deleteMessage({tkey: $scope.models.activeThread.key, mkey: message.key}, function () {
                    $scope.listMessages();
                    deleteMessageModal.hide();
                }, function () {
                    Helper.showUnexpectedErrorAlert('#delete-message-modal', 'top');
                });
            };

            deleteMessageModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/delete-message-modal.html',
                show: true
            });
        };

        $scope.cancelEdit = function () {
            $scope.models.editedMessage = undefined;
            $scope.models.editBody = undefined;
            $scope.models.removedAttachments = undefined;
            $scope.models.pendingSubmit = undefined;
            $scope.models.attachments = undefined;
        };

        $scope.editMessage = function (message) {
            $scope.models.editedMessage = message;
            $scope.models.editBody = message.body;
            $scope.models.removedAttachments = {};
            if (message.key === $scope.models.activeThread.question) {
                $scope.models.editTitle = $scope.models.activeThread.title;
            }
        };

        $scope.removeAttachment = function (attachment) {
            $scope.models.removedAttachments[attachment.hash] = attachment;
        };

        function isMessageEdited() {
            return $scope.models.editedMessage.body !== $scope.models.editBody ||
                ($scope.models.removedAttachments && Object.keys($scope.models.removedAttachments).length > 0) ||
                ($scope.models.attachments && Object.keys($scope.models.attachments).length > 0);
        }

        function isThreadTitleEdited() {
            return $scope.models.editedMessage.key === $scope.models.activeThread.question && $scope.models.editTitle && $scope.models.editTitle !== $scope.models.activeThread.title;
        }

        $scope.editSubmit = function (form) {
            if (!$scope.models.pendingSubmit) {
                if (!isMessageEdited() && !isThreadTitleEdited()) {
                    $scope.cancelEdit();
                    return;
                }
                $scope.models.pendingSubmit = true;
                if (form.$valid) {
                    var deferred = $q.defer();
                    if (isMessageEdited()) {
                        var removedAttachments = '';
                        angular.forEach($scope.models.removedAttachments, function (attachment) {
                            removedAttachments += attachment.name + ',';
                        });
                        var formData = new FormData();
                        if ($scope.models.editedMessage.body !== $scope.models.editBody) {
                            formData.append('body', $scope.models.editBody);
                        }
                        if (removedAttachments.length > 0) {
                            formData.append('removed-attachments', removedAttachments.slice(0, -1));
                        }
                        angular.forEach($scope.models.attachments, function (attachment, key) {
                            formData.append('attachment-' + key, attachment);
                        });
                        deferred = MessageResource.updateMessage({tkey: $scope.models.activeThread.key, mkey: $scope.models.editedMessage.key}, formData, function () {
                            $scope.listMessages();
                            $scope.cancelEdit();
                        }, function () {
                            Helper.showUnexpectedErrorAlert();
                            $scope.models.pendingSubmit = false;
                        });
                    } else {
                        deferred.resolve();
                    }
                    if (isThreadTitleEdited()) {
                        var promise = deferred.promise || deferred.$promise;
                        promise.then(function () {
                            var tmp = angular.copy($scope.models.activeThread.title);
                            $scope.models.activeThread.title = $scope.models.editTitle;
                            MessageResource.updateThread({tkey: $scope.models.activeThread.key}, $scope.models.activeThread, function () {
                                $scope.cancelEdit();
                                $scope.models.editTitle = undefined;
                            }, function () {
                                $scope.models.activeThread.title = tmp;
                                Helper.showUnexpectedErrorAlert();
                                $scope.models.pendingSubmit = false;
                            });
                        });
                    }
                } else {
                    $scope.models.pendingSubmit = false;
                }
            }
        };

        $scope.validateAnswer = function (message) {
            $scope.models.activeThread.answer = message.key;
            MessageResource.updateThread({tkey: $scope.models.activeThread.key}, $scope.models.activeThread, function (data) {
                $scope.models.activeThread = data;
            });
        };

        $scope.deleteThread = function () {
            var deleteThreadModal,
                modalScope = Helper.createModalScope(true);

            modalScope.delete = function () {
                MessageResource.deleteThread({tkey: $scope.models.activeThread.key}, function () {
                    deleteThreadModal.hide();
                    $scope.backToList();
                }, function () {
                    Helper.showUnexpectedErrorAlert('#delete-message-modal', 'top');
                });
            };

            modalScope.thread = true;

            deleteThreadModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/delete-message-modal.html',
                show: true
            });
        };

        $scope.openThread = function (thread) {
            $location.search('t', thread.key);
        };

        $scope.backToList = function () {
            $location.search('t', undefined);
            $scope.listThreads();
        };

        $scope.showAttachment = function (message, attachment, fn, forceDownload) {
            if (forceDownload) {
                Content.downloadAttachmentInWindow(message.key, attachment.hash);
                return;
            }
            var tmp = angular.copy(attachment);
            tmp.mimeType = tmp.type;
            tmp.attachment = true;
            if (fn(tmp, Content.getAttachmentUrl(message.key, attachment.hash)) === 0) {
                Content.downloadAttachmentInWindow(message.key, attachment.hash);
            }
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

        $rootScope.$on('message.thread.post', function (event, eventMessage) {
            event.stopPropagation();
            if (eventMessage.fromObject === $scope.models.activeThread.key) {
                messagesDeferred.promise.then(function () {
                    if ($filter('filter')($scope.models.messages, {key: eventMessage.arguments.key}, true).length === 0) {
                        $scope.listMessages();
                        setLastActivity();
                    }
                });
            }
        });

        $rootScope.$on('message.thread.answered', function (event, eventMessage) {
            event.stopPropagation();
            if (eventMessage.fromObject === $scope.models.activeThread.key) {
                $timeout(function () {
                    if (!$scope.models.activeThread.answer) {
                        var key = $scope.models.activeThread.key;
                        $scope.listThreads();
                        setActiveThread(key);
                    }
                }, 500);
            }
        });

        function setActiveThread(key) {
            listDeferred.promise.then(function () {
                $scope.models.activeThread = $filter('filter')($scope.models.threads, {key: key}, true)[0];
                $scope.listMessages();
            });
        }

        $scope.showObjectPreview = function (object, url) {
            VisualizerService.showObjectPreview(object, url);
        };

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
