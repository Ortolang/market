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

    var url = Url.urlBase() + '/rest/runtime/instances';

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
        		 {definition: 'import-bag'},
        		 {'wskey': key},
        		 {'wsname': $scope.importWorkspaceName},
        		 {'wstype': $scope.importWorkspaceType}
        		 ];
        console.info('onAfterAddingFile', fileItem);
        // console.info('formData', fileItem.formData[0], fileItem.formData[1]);
    };

    bagUploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteBag', fileItem, response, status, headers);
        $rootScope.$emit('completeBagUpload');
    };
  }]);
