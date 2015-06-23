'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$rootScope', '$window', '$timeout', 'FileUploader', 'url', 'AuthService',
        function ($scope, $rootScope, $window, $timeout, FileUploader, url, AuthService) {

            var uploader;

            function clearItem(fileItem) {
                $timeout(function () {
                    fileItem.remove();
                    if (uploader.queue.length === 0) {
                        deactivateUploadQueue();
                    }
                }, 1500);
            }

            function activateUploadQueue() {
                uploader.uploadQueueStatus = 'active';
                var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                $('.upload-queue').find('.upload-elements-wrapper').css('max-height', height / 3);
            }

            function deactivateUploadQueue() {
                uploader.uploadQueueStatus = undefined;
            }

            if ($rootScope.uploader) {
                uploader = $rootScope.uploader;
            } else {
                uploader = $rootScope.uploader = new FileUploader({
                    alias: 'stream',
                    autoUpload: true,
                    removeAfterUpload: false,
                    queueLimit: 100,
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
                deactivateUploadQueue();
            };

            $scope.clearItem = function (item) {
                item.remove();
                $scope.resizeBrowser();
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
                    case 'object':
                        fileItem.file.path = angular.copy($scope.parent.path) + '/';
                        if (fileItem._file.webkitRelativePath) {
                            fileItem.formData.push({path: fileItem.file.path + fileItem._file.webkitRelativePath});
                            fileItem.file.path += fileItem._file.webkitRelativePath.replace(fileItem.file.name, '');
                        } else {
                            fileItem.formData.push({path: fileItem.file.path + fileItem.file.name});
                        }
                        break;

                    case 'metadata':
                        fileItem.file.path = angular.copy($scope.parent.path) + ($scope.selectedChild ? '/' + $scope.selectedChild.name : '');
                        fileItem.formData.push({path: fileItem.file.path});
                        fileItem.formData.push({name: fileItem.file.name});
                        break;

                    case 'zip':
                        fileItem.url = url.api + '/runtime/processes/';
                        fileItem.alias = 'zippath';
                        fileItem.formData = [];
                        fileItem.formData.push({'process-type': 'import-zip'});
                        fileItem.formData.push({'process-name': fileItem['process-name']});
                        fileItem.formData.push({'wskey': fileItem.wskey});
                        fileItem.formData.push({'ziproot': fileItem.ziproot});
                        fileItem.formData.push({'overwrite': fileItem.overwrite});
                        break;

                    default:
                        console.error('No ortolang type provided');
                        uploader.removeFromQueue(fileItem);
                        break;
                }
            };

            uploader.onAfterAddingAll = function () {
                activateUploadQueue();
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                switch (fileItem.ortolangType) {
                    case 'object':
                        $rootScope.$emit('uploaderObjectUploadCompleted');
                        break;
                    case 'zip':
                        $rootScope.$emit('uploaderZipUploadCompleted', fileItem, response);
                        $rootScope.$emit('process-created', response);
                        break;
                    case 'metadata':
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
