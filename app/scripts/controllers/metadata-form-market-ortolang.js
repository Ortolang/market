'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataFormMarketOrtolangCtrl', [ '$scope', '$rootScope', '$q', 'N3Serializer', function ($scope, $rootScope, $q, N3Serializer) {

	$scope.categories = [{id:'Corpora', label:'Corpus'}, {id:'Lexicon', label:'Lexique'}];
	$scope.useConditions = [{id:'free', label:'Libre'}, {id:'free-nc', label:'Libre sans usage commercial'}, {id:'restricted', label:'Négociation nécessaire'}];
	
	$scope.submit = function(form, md) {
		$scope.$broadcast('show-errors-check-validity');

		if (form.$invalid) {
			console.debug('not ready');
		    return;
		}

		var content = N3Serializer.toN3(md);
		var contentType = 'text/n3';

		$rootScope.$broadcast('metadata-editor-create', content, contentType);
	};


	if($scope.selectedMetadataContent !== undefined) {
		var mdFromN3 = N3Serializer.fromN3($scope.selectedMetadataContent);
		mdFromN3.then(function(data) {
			$scope.md = angular.copy(data);
		});
	}


  }]);
