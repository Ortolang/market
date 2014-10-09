'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataCreatorCtrl
 * @description
 * # MetadataCreatorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataCreatorMarketOrtolangCtrl', function ($scope) {
    console.debug('MetadataCreatorMarketOrtolangCtrl')
    
	$scope.categories = [{id:'corpora', label:'Corpus'}, {id:'lexicon', label:'Lexique'}];
	$scope.use_conditions = [{id:'free', label:'Libre'}, {id:'free-nc', label:'Libre sans usage commercial'}, {id:'restricted', label:'Restreint'}];

	$scope.submit = function(form) {
		console.debug("submit form : ");
		console.debug(form);

		if (form.$invalid) {
			console.debug('not ready');
		    return;
		  }
	}
  });
