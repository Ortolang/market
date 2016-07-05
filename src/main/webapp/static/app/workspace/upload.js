'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$rootScope', '$window', '$timeout', '$modal', '$filter', 'FileUploader', 'url', 'ortolangType', 'AuthService', 'processStates', 'AtmosphereService', 'Helper',
        function ($scope, $rootScope, $window, $timeout, $modal, $filter, FileUploader, url, ortolangType, AuthService, processStates, AtmosphereService, Helper) {

            var uploader, queueLimitReached, sizeLimitReached;

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
                                (this.isMacOs && (item.name.indexOf('.') === -1 || item.name.lastIndexOf('.') + 8 < item.name.length - 1))));
                            }
                        },
                        {
                            name: 'sizeLimit',
                            fn: function (item) {
                                return item.size < 1000000000; // 1 GB
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
            };

            $scope.isZipExtractionQueueEmpty = function () {
                var empty = true;
                angular.forEach(uploader.zipExtractionQueue, function (extractionQueueItem) {
                    if (extractionQueueItem.state !== processStates.completed && extractionQueueItem.state !== processStates.aborted) {
                        empty = false;
                    }
                });
                return empty;
            };

            uploader.onAfterAddingFile = function (fileItem) {
                fileItem.wsName = fileItem.wsName || angular.copy($scope.browserService.workspace.name);
                fileItem.headers = {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                };
                if ($scope.browserService) {
                    fileItem.wskey = angular.copy($scope.browserService.workspace.key);
                }
                fileItem.url = url.api + '/workspaces/' + fileItem.wskey + '/elements';
                fileItem.formData = [{type: fileItem.ortolangType}];
                switch (fileItem.ortolangType) {
                    case ortolangType.object:
                        fileItem.file.path = Helper.normalizePath(angular.copy($scope.parent.path) + '/');
                        fileItem.formData.push({path: fileItem.file.path + fileItem.file.name});
                        break;

                    case ortolangType.metadata:
                        // fileItem.file.path = Helper.normalizePath(angular.copy($scope.parent.path) + ($scope.selectedChild ? '/' + $scope.selectedChild.name : ''));
                        fileItem.formData.push({path: fileItem.path});
                        fileItem.formData.push({name: fileItem.name});
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
                if (filter.name === 'queueLimit' && !queueLimitReached) {
                    queueLimitReached = true;
                    Helper.showErrorModal({code: 'QUEUE_LIMIT'});
                } else if (filter.name === 'sizeLimit' && !sizeLimitReached) {
                    sizeLimitReached = true;
                    var modalScope = Helper.showErrorModal({code: 'UPLOAD_SIZE_LIMIT'});
                    if (modalScope) {
                        modalScope.$on('modal.hide', function () {
                            sizeLimitReached = undefined;
                        });
                    }
                }
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                switch (fileItem.ortolangType) {
                    case ortolangType.object:
                        if (status === 200) {
                            $rootScope.$emit('uploader.object.update', response);
                        } else if (status === 201) {
                            $rootScope.$emit('uploader.object.create', response);
                        }
                        break;
                    case 'zip':
                        var zipExtractionQueueItem = {};
                        zipExtractionQueueItem.key = response.key;
                        zipExtractionQueueItem.fileName = fileItem.file.name;
                        zipExtractionQueueItem.wsName = fileItem.wsName;
                        zipExtractionQueueItem.ziproot = fileItem.ziproot;
                        zipExtractionQueueItem.state = processStates.pending;
                        uploader.zipExtractionQueue.push(zipExtractionQueueItem);
                        break;
                    case ortolangType.metadata:
                        if (status === 200) {
                            $rootScope.$emit('uploader.metadata.update', response);
                        } else if (status === 201) {
                            $rootScope.$emit('uploader.metadata.create', response);
                        }
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
                } else {
                    switch (fileItem.ortolangType) {
                    case ortolangType.metadata:
                        if (status === 400) {
                            $rootScope.$emit('uploader.metadata.failed', response);
                        }
                        break;
                    }
                }
            };
        }]);
