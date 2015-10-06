'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolResultsCtrl
 * @description
 * # ToolResultsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolResultsCtrl', ['$scope', '$rootScope', '$modal', 'ObjectResource', 'ToolManager', '$filter', '$translate', 'FileSelectBrowserService', 'Settings',  'WorkspaceResource',
        function ($scope, $rootScope, $modal, ObjectResource, ToolManager, $filter, $translate, FileSelectBrowserService, Settings, WorkspaceResource) {

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

            function showAlert(alertType, message) {
                $scope.mainAlert.message = message;
                $scope.mainAlert.isShown = true;
                $scope.mainAlert.alertType = alertType;
            }

            $scope.closeAlert = function() {
                $scope.mainAlert.isShown = false;
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
                ToolManager.checkGrant($scope.tool.key).then(function () {
                    saveResult();
                });
            };

            function saveResult() {
                ToolManager.getTool($scope.tool.key).saveResult($scope.job.id, $scope.data).$promise.then(
                    function(status){
                        var url = '#/workspaces?alias='+ $scope.folder.ws + '&root=head&path=' + status.path + '&browse';
                        var path = $scope.folder.ws + '/' + status.path.replace(/^\/*|\/*$/, '');
                        console.debug(status.path.replace(/^\/*|\/*$/, ''));
                        var message = $translate.instant('TOOLS.FILES_SAVED_OK', {path: path}) +
                            '<p><a class="btn btn-sm btn-default" href="' + url + '" target="_blank"> ' +
                            $translate.instant('TOOLS.FILES_SAVED_LINK') +
                            '</a></p>';
                        showAlert('alert-success', message);
                    },
                    function(error) {
                        console.debug(error);
                        var message = $translate.instant('TOOLS.FILES_SAVED_FAIL', {error: error});
                        showAlert('alert-danger', message);
                    }
                );
            }

            $scope.loadConfig = function (tool) {
                tool.getForm().then(
                    function (result) {
                        $scope.config = result[1];
                    },
                    function (msg) {
                        console.error('The tool server for "%s" is not responding.', tool.getName(), msg);
                    }
                );
            };

            $scope.getField = function(param) {
                $scope.config[param] = ($filter('filter')($scope.config, {key: param}, true))[0];
                return $scope.config[param];
            };


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
                ObjectResource.get({key: elements[0].workspace}, function (data) {
                    $scope.folder.ws = data.object.alias;
                });
                $scope.folderSelectModal.hide();
            });

            $scope.$on('tool-results-show', function () {
                init();
                $scope.results = $scope.$parent.results;
                angular.forEach(angular.element.find('div#toolResults div.tab-content div.active'), function(tab) {
                    angular.element(tab).removeClass('active');
                });
                angular.forEach(angular.element.find('div#toolResults ul.nav-pills li.active'), function(pane) {
                    angular.element(pane).removeClass('active');
                });
                angular.element(document.querySelector('#logTab')).addClass('active');
                angular.element(document.querySelector('#logPane')).addClass('in active');
                $scope.show();
            });

            function init() {
                var folderSelectModalScope = $rootScope.$new();
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
                WorkspaceResource.get().$promise.then(function (data) {
                    if (Settings[FileSelectBrowserService.id].wskey) {
                        var key = Settings[FileSelectBrowserService.id].wskey,
                            filteredWorkspace = $filter('filter')(data.entries, {key: key}, true);
                        if (filteredWorkspace.length === 1) {
                            $scope.folder = filteredWorkspace[0];
                            $scope.folder.ws = filteredWorkspace[0].alias;
                            $scope.data.path = '/';
                            $scope.data.wskey = filteredWorkspace[0].key;
                        }
                    } else {
                        $scope.folder =  data.entries[0];
                        $scope.folder.ws  = data.entries[0].alias;
                        $scope.data.path =  '/';
                        $scope.data.wskey =  data.entries[0].key;
                    }
                });

                $scope.config = [];
                $scope.results = [];

                $scope.mainAlert = {
                    isShown: false
                };
            }

            init();

        }
    ]);

