'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsListCtrl
 * @description
 * # ToolsListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsListCtrl', ['$scope', function ($scope) {

        // ***************** //
        // Editor visibility //
        // ***************** //

        $scope.visibility = false;

        $scope.show = function () {
            $scope.visibility = true;
            // $scope.resizeAsideBody();
        };

        $scope.hide = function () {
            $scope.visibility = false;
            // resetMetadataFormat();
        };

        $scope.toggle = function () {
            if ($scope.visibility === true) {
                $scope.hide();
            } else {
                $scope.show();
            }
        };

        $scope.isShow = function () {
            return $scope.visibility === true;
        };

        // Tools list //

        $scope.selectTool = function(tool) {
            $scope.selectedTool = tool;
        };

        $scope.resetSelectedTool = function() {
            $scope.selectedTool = undefined;
        };

        $scope.hasToolSelected = function() {
            return $scope.selectedTool !== undefined;
        };


        // ********* //
        // Listeners //
        // ********* //

        $scope.$on('tools-list-show', function () {
            // resetMetadata();
            // $scope.userMetadataFormat = metadataFormat;
            // $scope.metadataForm = metadataFormat.view;
            $scope.show();
        });

        $scope.$on('tools-list-create', function () {
            // sendForm(content, contentType);
        });


        function init() {
            $scope.tools = [
                {id: 'tika', name: 'Tika', description: 'Detects and extracts metadata and text content.'},
                {id: 'sample-tool', name: 'Sample tool', description: 'Dumb tool for demonstration purpose.'}
            ];
            $scope.selectedTool = undefined;

        }

        init();
    }]);