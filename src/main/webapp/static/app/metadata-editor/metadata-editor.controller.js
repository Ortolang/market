'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:MetadataEditorCtrl
 * @description
 * # MetadataEditorCtrl
 * Controller of the ortolangMarketApp
 *
 * @property {Array}   metadatas              - List of metadatas
 * @property {String}   metadataName              - The selected metadata name
 * @property {String}   elementName              - The selected element name
 */
angular.module('ortolangMarketApp').controller('MetadataEditorCtrl', 
	['$scope', '$filter', '$timeout', 'Content', 'ortolangType', 'Workspace', 
		function($scope, $filter, $timeout, Content, ortolangType, Workspace) {

			function findMetadata(name) {
				var metadataFound = $filter('filter')($scope.metadatas, {name: name});
				if (metadataFound.length>0) {
					return metadataFound[0];
				} else {
					return null;
				}
			}

			function loadMetadata(md) {
				Content.downloadWithKey(md.key).promise.then(function (data) {
		            md.metadata = angular.fromJson(data.data);
		            md.content = angular.toJson(md.metadata, true);
		        }, function (reason) {
					//TODO show message to user
		        	console.log(reason);
		        });
			}

			$scope.selectMetadataByName = function (name) {
				var refMetadata = findMetadata(name);
				if (refMetadata !== null) {
					if (angular.isUndefined(refMetadata.metadata)) {
						loadMetadata(refMetadata);
					}
					$scope.selectedMetadata = refMetadata;
				} else {
					//TODO show message to user 
					console.log('enable to download metadata name : {name}');
				}
			};

			$scope.upload = function () {
				// Using $timeout to prevent '$apply already in progress' error
		        $timeout(function () {
		            angular.element('#metadata-editor-upload-file-select').click();
		        });
			};

			(function init() {
		        if ($scope.metadataName) {
		        	$scope.selectMetadataByName($scope.metadataName);
		        }
		        $scope.Workspace = Workspace;
		        $scope.ortolangType = ortolangType;
		    }());
		}
	]
);