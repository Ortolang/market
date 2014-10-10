'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataTabCtrl
 * @description
 * # MetadataTabCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataTabCtrl', ['$scope', function ($scope) {
    console.debug('MetadataTabCtrl ');

    $scope.aside = {
      "title": "Create metadata",
      "contentTemplate": "views/metadata-creator-market-ortolang.html",
    };

    console.debug($scope.element);

    $scope.metadataFormats = [{id:'rdf-market-ortolang', name:'Présentation'}];
    $scope.mdName = ""; //TODO aller cherhcer le nom de l'element selectionné

}]);
