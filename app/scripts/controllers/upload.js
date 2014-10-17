'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$routeParams', '$rootScope', '$http', '$timeout', 'FileUploader', 'Url',
        function ($scope, $routeParams, $rootScope, $http, $timeout, FileUploader, Url) {

            var uploader;

            if ($rootScope.uploader) {
                uploader = $rootScope.uploader;
            } else {
                uploader = $rootScope.uploader = new FileUploader({
                    alias: 'stream',
                    autoUpload: true,
                    removeAfterUpload: false,
                    headers: {
                        'Authorization': $http.defaults.headers.common.Authorization
                    },
                    routeParams: $routeParams,
                    queueLimit: 100,
                    filters: [{
                        name: 'noFolder',
                        fn: function (item) {
                            return item.type.length !== 0;
                        }
                    }]
                });
            }

            $rootScope.toggleUploadQueueStatus = function () {
                $rootScope.uploadQueueStatus ? $rootScope.deactivateUploadQueue() : $rootScope.activateUploadQueue();
            };

            $rootScope.activateUploadQueue = function () {
                $rootScope.uploadQueueStatus = 'active';
                var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                $('#upload-queue').find('.upload-elements-wrapper').css('max-height', height / 3);
            };

            $rootScope.deactivateUploadQueue = function () {
                $rootScope.uploadQueueStatus = undefined;
            };

            $scope.clearUploaderQueue = function () {
                $rootScope.uploader.clearQueue();
                $rootScope.deactivateUploadQueue();
            };

            $scope.clearItem = function (item) {
                item.remove();
                $scope.resizeBrowser();
            };

            uploader.onAfterAddingFile = function (fileItem) {
                fileItem.wsName = $routeParams.wsName;
                fileItem.url = Url.urlBase() + '/rest/workspaces/' + fileItem.wsName + '/elements';
                fileItem.formData = [{type: fileItem.type}];
                if (fileItem.type === 'object') {
                    fileItem.file.path = this.routeParams.path;
                    fileItem.formData.push({path: fileItem.file.path + '/' + fileItem.file.name});
                } else if (fileItem.type === 'metadata') {
                    fileItem.file.path = this.routeParams.path + ($scope.selectedChild ? '/' + $scope.selectedChild.name : '');
                    fileItem.formData.push({path: fileItem.file.path});
                    fileItem.formData.push({name: fileItem.file.name});
                } else {
                    console.error('No file type provided');
                    uploader.removeFromQueue(fileItem);
                    return;
                }
                console.info(fileItem.file.name + ' added to the queue', fileItem, fileItem.formData[0], fileItem.formData[1]);
            };

            uploader.onAfterAddingAll = function () {
                $rootScope.activateUploadQueue();
            };

            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info(fileItem.file.name + ' successfully uploaded', fileItem, response, status, headers);
                if (fileItem.type === 'object') {
                    console.info('Emit: uploaderCompleteItemUpload event');
                    $rootScope.$emit('uploaderCompleteItemUpload');
                    $timeout(function () {
                        fileItem.remove();
                        if (uploader.queue.length === 0) {
                            $rootScope.deactivateUploadQueue();
                        }
                    }, 800);
                } else if (fileItem.type === 'metadata') {
                    console.info('Emit: completeMetadataUpload event');
                    $rootScope.$emit('completeMetadataUpload');
                }
            };
        }]);
