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
        // $rootScope.$broadcast('metadata-list-push');
        $scope.resizeAsideBody();
    };

    $scope.hideEditor = function() {
        $scope.editorVisibility = false;
        // $rootScope.$broadcast('metadata-list-unpush');
        resetMetadataFormat();
    };

    $scope.toggleEditor = function() {
        if($scope.editorVisibility === true) {
            $scope.hideEditor();
        } else {
            $scope.showEditor();
        }
    };

    $scope.isEditorShow = function() {
        return $scope.editorVisibility === true;
    };

    // ******** //
    // Metadata //
    // ******** //

    $scope.selectedMetadata = undefined;
    $scope.selectedMetadataContent = undefined;

    function loadMetadataContent(view, metadata) {
        $scope.selectedMetadata = metadata;
        //TODO get content from workspace resource
        $http.get(Url.urlBase() + '/rest/objects/' + metadata.key + '/download').success(function (data) {
            $scope.selectedMetadataContent = data;

            $scope.metadataForm = view;

            // $rootScope.$broadcast('metadata-form', $scope.selectedMetadataContent);
            $scope.showEditor();
        }).error(function () {
            resetMetadata();
            //TODO send error message
        });
    }

    function resetMetadata() {
        $scope.selectedMetadata = undefined;
        $scope.selectedMetadataContent = undefined;
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

		var uploadUrl = Url.urlBase() + '/rest/workspaces/'+$scope.selectedElements[0].workspace+'/elements/';
		var fd = new FormData();

        var currentPath = $scope.selectedElements[0].path;

		fd.append('path', currentPath);
		fd.append('type', 'metadata');
		
        fd.append('format', $scope.userMetadataFormat.id);
        fd.append('name', $scope.userMetadataFormat.name);

		var blob = new Blob([content], { type: contentType});

		fd.append('stream', blob);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){

	    	$scope.hideEditor();
	    	resetMetadataFormat();
            $scope.refreshSelectedElement();
        })
        .error(function(error){
        	console.error('creation of metadata failed !',error);
        	//TODO show a message !!
	    	$scope.hideEditor();
	    	resetMetadataFormat();
        });
	}

    // ********* //
    // Listeners //
    // ********* //

    $scope.$on('metadata-editor-show', function (event, metadataFormat) {
        resetMetadata();
        $scope.userMetadataFormat = metadataFormat;
        $scope.metadataForm = metadataFormat.view;
        $scope.showEditor();
    });

    $scope.$on('metadata-editor-edit', function (event, metadataFormat, metadata) {

        $scope.userMetadataFormat = metadataFormat;

        loadMetadataContent(metadataFormat.view, metadata);
    });

    $scope.$on('metadata-editor-create', function (event, content, contentType) {
        sendForm(content, contentType);
    });


        // *********************** //
        //          Resize         //
        // *********************** //

        $scope.resizeAsideBody = function() {
            var topOffset = $('#main-navbar').innerHeight(),
                height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                // browserToolbarHeight = $('#browser-toolbar').innerHeight();

            height = height - topOffset;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                if ($rootScope.uploadQueueStatus === 'active') {
                    height -= $('#upload-queue').innerHeight();
                }
                // $('#browser-sidebar').css('min-height', (height - browserToolbarHeight) + 'px');
                // $('#browser-wrapper').find('.table-wrapper.workspace-elements-wrapper').css('height', (height - browserToolbarHeight) + 'px');
                //$('#browser-sidebar').css('min-height', height + 'px');
                $('#metadataEditorBody').css('height', height + 'px');
            }
        };

  }]);
