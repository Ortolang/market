'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('UploadCtrl', ['$scope', '$routeParams', '$rootScope', 'FileUploader', 'Url',
        function ($scope, $routeParams, $rootScope, FileUploader, Url) {

            var url = Url.urlBase() + '/rest/workspaces/' + $routeParams.wsName + '/elements';

            var uploader = $scope.uploader = new FileUploader({
                url: url,
                alias: 'stream',
                autoUpload: false,
                removeAfterUpload: false,
                headers: {
                    'Authorization': 'Basic cm9vdDp0YWdhZGE1NA=='
                },
                routeParams: $routeParams
            });

            uploader.onAfterAddingFile = function (fileItem) {
                fileItem.formData = [{ path: this.routeParams.elementPath + '/' + fileItem.file.name}, {type: 'object'}];
                console.info('onAfterAddingFile', fileItem);
                console.info('formData', fileItem.formData[0], fileItem.formData[1]);
            };

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                $rootScope.$emit('completeItemUpload');
            };
        }]);
