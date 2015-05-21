'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolResultsCtrl', ['$scope', '$rootScope', '$modal', 'ObjectResource', 'ToolManager',
        function ($scope, $rootScope, $modal, ObjectResource, ToolManager) {

            /*************
             * Listeners
             *************/
            var deregisterFolderSelectModal = $rootScope.$on('browserSelectedElements-folderSelectModal', function ($event, elements) {
                if (!$scope.data) {
                    $scope.data = {};
                }
                $scope.data.folder = elements[0].path;
                $scope.data.wskey = elements[0].workspace;
                $scope.folder = elements[0];
                ObjectResource.get({oKey: elements[0].workspace}, function (data) {
                    $scope.folder.ws = data.object.alias;
                });
                $scope.folderSelectModal.hide();
            });

            $scope.submit = function(){
                ToolManager.getTool($scope.toolKey).saveResult($scope.jobId, $scope.data);
            };


            /**************
             * Methods
             **************/

            $scope.init = function(filename){
                $scope.data.files[filename] = true;
            };

            $scope.changeStatus = function(filename){
                $scope.data.files[filename] = !$scope.data.files[filename];
            };

            function init() {
                var folderSelectModalScope = $rootScope.$new(true);
                folderSelectModalScope.acceptMultiple = false;
                folderSelectModalScope.forceMimeTypes = 'ortolang/collection';
                folderSelectModalScope.forceHead = true;
                folderSelectModalScope.fileSelectId = 'folderSelectModal';
                $scope.folderSelectModal = $modal({
                    scope: folderSelectModalScope,
                    title: 'Folder select',
                    template: 'common/directives/file-select-modal-template.html',
                    show: false
                });

                $scope.folder = {};
                $scope.data = {};
                $scope.data.files = {};

            }

            init();
        }
    ]);

