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

            var url = Url.urlBase() + '/rest/workspaces/' + $routeParams.wsName + '/elements',
                uploader;

            if ($rootScope.uploader) {
                uploader = $rootScope.uploader;
            } else {
                uploader = $rootScope.uploader = new FileUploader({
                    url: url,
                    alias: 'stream',
                    autoUpload: true,
                    removeAfterUpload: false,
                    headers: {
                        'Authorization': $http.defaults.headers.common.Authorization
                    },
                    routeParams: $routeParams
                });
            }

            uploader.onAfterAddingFile = function (fileItem) {
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
                $rootScope.$emit('uploaderAfterAddingAll');
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
