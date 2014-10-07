'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormatSelectCtrl
 * @description
 * # MetadataFormatSelectCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataFormatSelectCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
	$scope.metadataFormats = [{id:'rdf-market-ortolang', name:'Présentation'}];

    console.debug('MetadataFormatSelectCtrl ');
  });
