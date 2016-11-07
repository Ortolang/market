'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserUploaderCtrl
 * @description
 * # BrowserUploaderCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserUploaderCtrl', ['$rootScope', '$timeout', '$filter', 'FileUploader', 'url', 'ortolangType', 'AuthService', 'processStates', 'Helper',
        function ($rootScope, $timeout, $filter, FileUploader, url, ortolangType, AuthService, processStates, Helper) {

            var ctrl = this;

            var uploader, queueLimitReached, sizeLimitReached;

            if ($rootScope.uploader) {
                ctrl.uploader = $rootScope.uploader;
            } else {
                ctrl.uploader = $rootScope.uploader = new FileUploader({
                    alias: 'stream',
                    autoUpload: true,
                    removeAfterUpload: false,
                    queueLimit: 50,
                    filters: [
                        {
                            name: 'noFolder',
                            fn: function (item) {
                                return !(!item.type && ((!Helper.isMac() && item.size % 4096 === 0) ||
                                (Helper.isMac() && (item.name.indexOf('.') === -1 || item.name.lastIndexOf('.') + 8 < item.name.length - 1))));
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
                ctrl.uploader.tokenJustRefreshed = false;
                ctrl.uploader.zipExtractionQueue = [];

                // EVENTS
                $rootScope.$on('runtime.process.change-state', function ($event, message) {
                    var queueItem = $filter('filter')(ctrl.uploader.zipExtractionQueue, {key: message.fromObject}, true);
                    if (queueItem.length > 0) {
                        queueItem[0].state = message.arguments.state;
                    }
                });
                $rootScope.$on('runtime.process.update-activity', function ($event, message) {
                    var queueItem = $filter('filter')(ctrl.uploader.zipExtractionQueue, {key: message.fromObject}, true);
                    if (queueItem.length > 0) {
                        queueItem[0].progress = message.arguments.progress;
                    }
                });
            }

            function isQueueEmpty() {
                return ctrl.uploader.queue.length === 0 && ctrl.uploader.zipExtractionQueue.length === 0;
            }

            ctrl.active = function () {
                return !isQueueEmpty();
            };

            function clearItem(fileItem) {
                $timeout(function () {
                    fileItem.remove();
                }, 1500);
            }

            ctrl.clearUploaderQueue = function () {
                ctrl.uploader.clearQueue();
                ctrl.uploader.zipExtractionQueue = [];
            };

            ctrl.isZipExtractionQueueEmpty = function () {
                var empty = true;
                angular.forEach(ctrl.uploader.zipExtractionQueue, function (extractionQueueItem) {
                    if (extractionQueueItem.state !== processStates.completed && extractionQueueItem.state !== processStates.aborted) {
                        empty = false;
                    }
                });
                return empty;
            };

            ctrl.uploader.onAfterAddingFile = function (fileItem) {
                fileItem.wsName = fileItem.wsName || angular.copy(ctrl.workspace.name);
                fileItem.headers = {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                };
                if (ctrl.workspace) {
                    fileItem.wskey = angular.copy(ctrl.workspace.key);
                }
                fileItem.url = url.api + '/workspaces/' + fileItem.wskey + '/elements';
                fileItem.formData = [{type: fileItem.ortolangType}];
                switch (fileItem.ortolangType) {
                    case ortolangType.object:
                        fileItem.file.path = Helper.normalizePath(angular.copy(ctrl.parent.path) + '/');
                        fileItem.formData.push({path: fileItem.file.path + fileItem.file.name});
                        break;

                    case ortolangType.metadata:
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
                        ctrl.uploader.removeFromQueue(fileItem);
                        break;
                }
            };

            ctrl.uploader.onAfterAddingAll = function (addedItems) {
                if (queueLimitReached) {
                    angular.forEach(addedItems, function (addedItem) {
                        ctrl.uploader.removeFromQueue(addedItem);
                    });
                    queueLimitReached = false;
                }
            };

            //noinspection JSUnusedLocalSymbols
            ctrl.uploader.onWhenAddingFileFailed = function (item, filter, options) { // jshint ignore:line
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

            //noinspection JSUnusedLocalSymbols
            ctrl.uploader.onSuccessItem = function (fileItem, response, status, headers) { // jshint ignore:line
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
                        ctrl.uploader.zipExtractionQueue.push(zipExtractionQueueItem);
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

            ctrl.uploader.onCompleteAll = function () {
                ctrl.uploader.tokenJustRefreshed = false;
            };

            //noinspection JSUnusedLocalSymbols
            ctrl.uploader.onErrorItem = function (fileItem, response, status, headers) { // jshint ignore:line
                if (ctrl.uploader.tokenJustRefreshed || AuthService.getKeycloak().isTokenExpired()) {
                    ctrl.uploader.tokenJustRefreshed = true;
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
