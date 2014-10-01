'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BagUploaderCtrl
 * @description
 * # BagUploaderCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('BagUploaderCtrl',['$scope', '$routeParams', '$rootScope', '$http', 'FileUploader', 'Url', 
  	function ($scope, $routeParams, $rootScope, $http, FileUploader, Url) {

    var url = Url.urlBase() + '/rest/processes/';

    var bagUploader = $scope.bagUploader = new FileUploader({
        url: url,
        alias: 'bag-hash',
        autoUpload: false,
        removeAfterUpload: false,
        headers: {
            'Authorization': $http.defaults.headers.common.Authorization
        },
        routeParams: $routeParams
    });

    bagUploader.onAfterAddingFile = function (fileItem) {
    	var key = $scope.importWorkspaceName;
        fileItem.formData = [
        		 {type: 'import-workspace'},
        		 {name: 'Workspace import for bag '+$scope.importWorkspaceName},
        		 {'workspace-key': key},
        		 {'workspace-name': $scope.importWorkspaceName},
        		 {'workspace-type': $scope.importWorkspaceType}
        		 ];
        console.info('onAfterAddingFile', fileItem);
        // console.info('formData', fileItem.formData[0], fileItem.formData[1]);
    };

    bagUploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        $rootScope.$emit('completeItemUpload');
    };
  }]);
