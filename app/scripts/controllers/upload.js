'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$routeParams', '$rootScope', '$http', 'FileUploader', 'Url',
        function ($scope, $routeParams, $rootScope, $http, FileUploader, Url) {

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

            uploader.onAfterAddingFile = function (fileItem) {
                fileItem.wsName = $routeParams.wsName;
                fileItem.url = Url.urlBase() + '/rest/workspaces/' + fileItem.wsName + '/elements';
                fileItem.formData = [{type: fileItem.type}];
                if (fileItem.type === 'object') {
                    fileItem.file.path = this.routeParams.elementPath;
                    fileItem.formData.push({path: fileItem.file.path + '/' + fileItem.file.name});
                } else if (fileItem.type === 'metadata') {
                    fileItem.file.path = this.routeParams.elementPath + ($rootScope.getSelectedChild() ? '/' + $rootScope.getSelectedChild().name : '');
                    fileItem.formData.push({path: fileItem.file.path});
                    fileItem.formData.push({name: fileItem.file.name});
                } else {
                    console.error('No file type provided');
                    uploader.removeFromQueue(fileItem);
                    return;
                }
                console.info('onAfterAddingFile', fileItem);
                console.info('formData', fileItem.formData[0], fileItem.formData[1]);
            };

            uploader.onAfterAddingAll = function () {
                $rootScope.activateUploadQueue();
            };

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                if (fileItem.type === 'object') {
                    console.debug('Emit: uploaderCompleteItemUpload event');
                    $rootScope.$emit('uploaderCompleteItemUpload');
                } else if (fileItem.type === 'metadata') {
                    console.debug('Emit: completeMetadataUpload event');
                    $rootScope.$emit('completeMetadataUpload');
                }
            };
        }]);
