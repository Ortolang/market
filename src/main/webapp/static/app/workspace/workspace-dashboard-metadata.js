'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$scope',
        function ($scope) {

        	function init() {
        		$scope.activeTab = 0; 

        		$scope.allCorporaStyles = [{id:'Scientifique', label:'Scientifique'}, {id:'Littéraire', label:'Littéraire'}];
        	}
        	init();
}]);