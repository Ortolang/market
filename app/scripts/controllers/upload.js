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
                fileItem.formData = [{ path: this.routeParams.elementPath + '/' + fileItem.file.name}, {type: 'object'}];
                console.info('onAfterAddingFile', fileItem);
                console.info('formData', fileItem.formData[0], fileItem.formData[1]);
            };

            uploader.onAfterAddingAll = function () {
                $rootScope.$emit('uploaderAfterAddingAll');
            };

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                $rootScope.$emit('uploaderCompleteItemUpload');
            };
        }]);
