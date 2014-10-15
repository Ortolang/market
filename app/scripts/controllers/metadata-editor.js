'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataEditorCtrl
 * @description
 * # MetadataEditorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataEditorCtrl', ['$scope', '$rootScope', '$http', 'Url', function ($scope, $rootScope, $http, Url) {

	// ***************** //
	// Editor visibility //
	// ***************** //

    $scope.editorVisibility = false;

    $scope.showEditor = function() {
        $scope.editorVisibility = true;
        $rootScope.$broadcast('metadata-list-push');
    }

    $scope.hideEditor = function() {
        $scope.editorVisibility = false;
        $rootScope.$broadcast('metadata-list-unpush');
    }

    $scope.toggleEditor = function() {
        if($scope.editorVisibility == true) {
            $scope.hideEditor();
        } else {
            $scope.showEditor();
        }
    }

    $scope.isEditorShow = function() {
        return $scope.editorVisibility === true;
    }


	// **** //
	// Form //
	// **** //

	$scope.userMetadataFormat = undefined;
	$scope.metadataForm = undefined;

	function resetMetadataFormat() {
		$scope.userMetadataFormat = undefined;
		$scope.metadataForm = undefined;
	}

	function sendForm(content, contentType) {

		var uploadUrl = Url.urlBase() + '/rest/workspaces/'+$scope.wsName+'/elements/';
		var fd = new FormData();

		var currentPath = $scope.element.path;
		if($scope.selectedChild) {
			currentPath += '/' + $scope.selectedChildData.object.name
		}
		fd.append('path', currentPath);
		fd.append('type', 'metadata');
		
        fd.append('format', $scope.userMetadataFormat.id);
        fd.append('name', $scope.userMetadataFormat.name);

		var blob = new Blob([content], { type: contentType});

		fd.append("stream", blob);

		console.info('create metadata with param : (path:"'+currentPath+'",format:"'+$scope.userMetadataFormat.id+'",name:"'+$scope.userMetadataFormat.name+'")');

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        	console.debug("metadata created !");

	    	$scope.hideEditor();
	    	//TODO refresh metadata list
	    	resetMetadataFormat();
        })
        .error(function(){
        	console.error("creation of metadata failed !");
        	//TODO show a message !!
	    	$scope.hideEditor();
	    	resetMetadataFormat();
        });
	};

    // ********* //
    // Listeners //
    // ********* //

    $scope.$on('metadata-editor-show', function (event, metadataFormat) {
        $scope.userMetadataFormat = metadataFormat;
        $scope.metadataForm = metadataFormat.view;
        $scope.showEditor();
    });

    $scope.$on('metadata-editor-create', function (event, content, contentType) {
        sendForm(content, contentType);
    });



  }]);
