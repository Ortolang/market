'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataTabCtrl
 * @description
 * # MetadataTabCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataTabCtrl', function ($scope) {
    console.debug('MetadataTabCtrl ');

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var metadataCreator = false;

    $scope.isMetadataCreatorShow = function () {
    	return metadataCreator;
    };

    $scope.showMetadataCreator = function () {
    	metadataCreator = true;
    };

	$scope.hideMetadataCreator = function () {
		metadataCreator = false;
    };  

	$scope.metadataFormats = [{id:'rdf-market-ortolang', name:'Présentation'}];

});
