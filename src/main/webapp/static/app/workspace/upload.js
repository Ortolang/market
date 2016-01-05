'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$rootScope', '$window', '$timeout', '$modal', '$filter', 'FileUploader', 'url', 'ortolangType', 'AuthService', 'Runtime', 'AtmosphereService',
        function ($scope, $rootScope, $window, $timeout, $modal, $filter, FileUploader, url, ortolangType, AuthService, Runtime, AtmosphereService) {

            var uploader, queueLimitReached, queueLimitModal;

            if ($rootScope.uploader) {
                uploader = $rootScope.uploader;
            } else {
                uploader = $rootScope.uploader = new FileUploader({
                    alias: 'stream',
                    autoUpload: true,
                    removeAfterUpload: false,
                    queueLimit: 50,
                    filters: [
                        {
                            name: 'noFolder',
                            fn: function (item) {
                                return !(!item.type && ((!this.isMacOs && item.size % 4096 === 0) ||
                                (this.isMacOs && (item.name.indexOf('.') === -1 || item.name.lastIndexOf('.') + 5 < item.name.length - 1))));
                            }
                        }
                    ]
                });
                uploader.uploadQueueStatus = undefined;
                uploader.isMacOs = $window.navigator.appVersion.indexOf('Mac') !== -1;
                uploader.tokenJustRefreshed = false;
                uploader.zipExtractionQueue = [];

                // EVENTS
                $rootScope.$on('runtime.process.change-state', function ($event, message) {
                    var queueItem = $filter('filter')(uploader.zipExtractionQueue, {key: message.fromObject}, true);
                    if (queueItem.length > 0) {
                        queueItem[0].state = message.arguments.state;
                    }
                });
                $rootScope.$on('runtime.process.update-activity', function ($event, message) {
                    var queueItem = $filter('filter')(uploader.zipExtractionQueue, {key: message.fromObject}, true);
                    if (queueItem.length > 0) {
                        queueItem[0].progress = message.arguments.progress;
                    }
                });
            }

            function deactivateUploadQueue() {
                uploader.uploadQueueStatus = undefined;
            }

            function clearItem(fileItem) {
                $timeout(function () {
                    fileItem.remove();
                    if (uploader.queue.length === 0 && uploader.zipExtractionQueue.length === 0) {
                        deactivateUploadQueue();
                    }
                }, 1500);
            }

            function activateUploadQueue() {
                uploader.uploadQueueStatus = 'active';
                var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                angular.element('.upload-queue').css('max-height', 2 * height / 5);
            }

            $scope.toggleUploadQueueStatus = function () {
                if (uploader.uploadQueueStatus) {
                    deactivateUploadQueue();
                } else {
                    activateUploadQueue();
                }
            };

            $scope.clearUploaderQueue = function () {
                uploader.clearQueue();
                uploader.zipExtractionQueue = [];
                deactivateUploadQueue();
            };

            $scope.clearItem = function (item) {
                item.remove();
                $scope.resizeBrowser();
            };

            $scope.isZipExtractionQueueEmpty = function () {
                var empty = true;
                angular.forEach(uploader.zipExtractionQueue, function (extractionQueueItem) {
                    if (extractionQueueItem.state !== Runtime.getStates().completed && extractionQueueItem.state !== Runtime.getStates().aborted) {
                        empty = false;
                    }
                });
                return empty;
            };

            uploader.onAfterAddingFile = function (fileItem) {
                fileItem.wsName = angular.copy($scope.browserService.workspace.name);
                fileItem.headers = {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                };
                fileItem.wskey = fileItem.wskey || angular.copy($scope.browserService.workspace.key);
                fileItem.url = url.api + '/workspaces/' + fileItem.wskey + '/elements';
                fileItem.formData = [{type: fileItem.ortolangType}];
                switch (fileItem.ortolangType) {
                    case ortolangType.object:
                        fileItem.file.path = angular.copy($scope.parent.path) + '/';
                        fileItem.formData.push({path: fileItem.file.path + fileItem.file.name});
                        break;

                    case ortolangType.metadata:
                        fileItem.file.path = angular.copy($scope.parent.path) + ($scope.selectedChild ? '/' + $scope.selectedChild.name : '');
                        fileItem.formData.push({path: fileItem.file.path});
                        fileItem.formData.push({name: fileItem.file.name});
                        break;

                    case 'zip':
                        fileItem.url = url.api + '/runtime/processes/';
                        fileItem.file.path = fileItem.ziproot;
                        fileItem.alias = 'zippath';
                        fileItem.formData = [];
                        fileItem.formData.push({'process-type': 'import-zip'});
                        fileItem.formData.push({'process-name': fileItem['process-name']});
                        fileItem.formData.push({'wskey': fileItem.wskey});
                        fileItem.formData.push({'ziproot': fileItem.ziproot});
                        fileItem.formData.push({'zipoverwrites': fileItem.zipoverwrites});
                        break;

                    default:
                        console.error('No ortolang type provided');
                        uploader.removeFromQueue(fileItem);
                        break;
                }
            };

            uploader.onAfterAddingAll = function (addedItems) {
                if (queueLimitReached) {
                    angular.forEach(addedItems, function (addedItem) {
                        uploader.removeFromQueue(addedItem);
                    });
                    queueLimitReached = false;
                } else {
                    activateUploadQueue();
                }
            };

            uploader.onWhenAddingFileFailed = function (item, filter, options) {
                if (filter.name === 'queueLimit') {
                    queueLimitReached = true;
                    if (!queueLimitModal) {
                        queueLimitModal = $modal({
                            templateUrl: 'workspace/templates/queue-limit-modal.html',
                            show: true
                        });
                        queueLimitModal.$promise.then(function () {
                            queueLimitModal.$scope.$on('modal.hide', function () {
                                queueLimitModal = undefined;
                            });
                        });
                    }
                }
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                switch (fileItem.ortolangType) {
                    case ortolangType.object:
                        if (!AtmosphereService.isConnected()) {
                            $rootScope.$emit('uploaderObjectUploadCompleted');
                        }
                        break;
                    case 'zip':
                        var zipExtractionQueueItem = {};
                        zipExtractionQueueItem.key = response.key;
                        zipExtractionQueueItem.fileName = fileItem.file.name;
                        zipExtractionQueueItem.wsName = fileItem.wsName;
                        zipExtractionQueueItem.ziproot = fileItem.ziproot;
                        zipExtractionQueueItem.state = Runtime.getStates().pending;
                        uploader.zipExtractionQueue.push(zipExtractionQueueItem);
                        break;
                    case ortolangType.metadata:
                        $rootScope.$emit('metadataUploadCompleted');
                        break;
                }
                clearItem(fileItem);
            };

            uploader.onCompleteAll = function () {
                uploader.tokenJustRefreshed = false;
            };

            uploader.onErrorItem = function (fileItem, response, status, headers) {
                if (uploader.tokenJustRefreshed || AuthService.getKeycloak().isTokenExpired()) {
                    uploader.tokenJustRefreshed = true;
                    AuthService.getKeycloak().updateToken(5).success(function () {
                        fileItem.headers.Authorization = 'Bearer ' + AuthService.getToken();
                        fileItem.upload();
                    }).error(function () {
                        console.error('Failed to refresh token');
                        AuthService.forceReload();
                    });
                }
            };
        }]);
