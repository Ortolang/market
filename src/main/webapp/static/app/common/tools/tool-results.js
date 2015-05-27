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

            // ***************** //
            // Editor visibility //
            // ***************** //

            $scope.visibility = false;

            $scope.show = function () {
                $scope.visibility = true;
            };

            $scope.hide = function () {
                $scope.visibility = false;
            };

            $scope.toggle = function () {
                if ($scope.visibility) {
                    $scope.hide();
                } else {
                    $scope.show();
                }
            };

            $scope.isVisible = function () {
                return $scope.visibility;
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

            $scope.submit = function(){
                console.debug($scope.data);
                ToolManager.checkGrant($scope.toolKey).then(function () {
                    saveResult();
                });
            };

            function saveResult() {
                ToolManager.getTool($scope.toolKey).saveResult($scope.jobId, $scope.data).$promise.then(
                    function(){
                        var url = '#/workspaces?alias='+ $scope.folder.ws + '&root=head&path=' + $scope.data.path;
                        //$window.location.href = encodeURI(url);
                        //$scope.$hide();
                    },
                    function(error) {
                        console.debug(error);
                    }
                );
            }


            // ********* //
            // Listeners //
            // ********* //

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

            $scope.$on('tool-results-show', function () {
                $scope.show();
            });

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

