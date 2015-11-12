'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$rootScope', '$scope', '$location', '$filter', '$modal', 'ortolangType', 'ObjectResource', 'Workspace', 'WorkspaceElementResource', 'Content',
        function ($rootScope, $scope, $location, $filter, $modal, ortolangType, ObjectResource, Workspace, WorkspaceElementResource, Content) {

            $scope.submitForm = function () {
                console.log('submit form');

                if ($scope.ortolangItemJsonform.$invalid) {
                    console.log('not ready');
                    return;
                }

                delete $scope.metadata.imageUrl;

                $scope.metadata.publicationDate = $filter('date')(new Date(), 'yyyy-MM-dd');

                var content = angular.toJson($scope.metadata),
                    contentType = 'text/json';

                sendForm(content, contentType);
            };


            function sendForm(content, contentType) {

                var fd = new FormData(),
                    currentPath = '/';

                fd.append('path', currentPath);
                fd.append('type', ortolangType.metadata);

                // fd.append('format', $scope.userMetadataFormat.key);
                fd.append('name', 'ortolang-item-json');

                var blob = new Blob([content], { type: contentType});

                fd.append('stream', blob);

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function () {
                	Workspace.refreshActiveWorkspaceMetadata().then(function() {
                        Workspace.getActiveWorkspaceMetadata().then(function() {
                            $location.search('section', 'preview');    
                        });
                    });
                });
            }

            var deregisterFileImageSelectModal = $rootScope.$on('browserSelectedElements-fileImageSelectModal', function ($event, elements) {
                console.log('metadata-form-market-ortolang caught event "browserSelectedElements-fileImageSelectModal" (selected elements: %o)', elements);

                $scope.metadata.image = elements[0].path;
                $scope.image = Content.getContentUrlWithKey(elements[0].key);
                $scope.fileImageSelectModal.hide();
            });

            $scope.$on('$destroy', function () {
                deregisterFileImageSelectModal();
            });

            function init() {
                $scope.activeTab = 0;
                if(Workspace.active.metadata!==null) {
                    $scope.metadata = angular.copy(Workspace.active.metadata);
                } else {
                    $scope.metadata = {schema: 'http://www.ortolang.fr/schema/013#'};
                }

                // Sets datasize
                ObjectResource.size({key: Workspace.active.workspace.head}, function (data) {
                    $scope.metadata.datasize = data.size.toString();
                });

                // File selector for the image
                var fileImageSelectModalScope = $rootScope.$new();
                fileImageSelectModalScope.acceptMultiple = false;
                fileImageSelectModalScope.forceMimeTypes = ['ortolang/collection', 'image'];
                fileImageSelectModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileImageSelectModalScope.forceHead = true;
                fileImageSelectModalScope.fileSelectId = 'fileImageSelectModal';
                $scope.fileImageSelectModal = $modal({
                    scope: fileImageSelectModalScope, 
                    title: 'File select', 
                    template: 'common/directives/file-select-modal-template.html', 
                    show: false
                });

                // Sets image
                if ($scope.metadata.image) {
                    ObjectResource.element({key: Workspace.active.workspace.head, path: $scope.metadata.image}).$promise.then(function (oobject) {
                        $scope.image = Content.getContentUrlWithKey(oobject.key);
                    });
                } else {
                    $scope.imgtitle = 'Cliquez pour ajouter votre logo';
                    $scope.imgtheme = 'ortolang';
                }

            }
            init();
        }]);
