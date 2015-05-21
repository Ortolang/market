'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolResultsCtrl', ['$scope', '$rootScope', '$modal', 'ObjectResource', 'ToolManager', '$window',
        function ($scope, $rootScope, $modal, ObjectResource, ToolManager, $window) {

            /*************
             * Listeners
             *************/
            var deregisterFolderSelectModal = $rootScope.$on('browserSelectedElements-folderSelectModal', function ($event, elements) {
                if (!$scope.data) {
                    $scope.data = {};
                }
                $scope.data.path = elements[0].path;
                $scope.data.wskey = elements[0].workspace;
                $scope.folder = elements[0];
                ObjectResource.get({oKey: elements[0].workspace}, function (data) {
                    $scope.folder.ws = data.object.alias;
                });
                $scope.folderSelectModal.hide();
            });

            $scope.submit = function(){
                console.debug($scope.data);
                ToolManager.getTool($scope.toolKey).saveResult($scope.jobId, $scope.data).$promise.then(
                    function(success){
                        $window.location.href = 'http://www.google.com';
                    },
                    function(error) {
                        console.debug(error);
                    }
                );
            };


            /**************
             * Methods
             **************/

            $scope.init = function(filename, index){
                $scope.data['file-' + index] = filename;
            };

            $scope.changeStatus = function(filename, index){
                if(! $scope.data.hasOwnProperty('file-' + index)) {
                    $scope.data['file-' + index] = filename;
                } else {
                    delete $scope.data['file-' + index];
                }
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

            }

            init();
        }
    ]);

