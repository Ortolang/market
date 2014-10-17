'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataListCtrl
 * @description
 * # MetadataListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataListCtrl', ['$scope', '$rootScope', '$http', '$routeParams', 'Url', 'WorkspaceElementResource', function ($scope, $rootScope, $http, $routeParams, Url, WorkspaceElementResource) {

    $scope.metadataFormats = [
        {
            id:'market-ortolang-n3',
            name:'Présentation',
            view: 'views/metadata-form-market-ortolang.html'
        },
        {
            id:'oai_dc',
            name: 'OAI Dublin Core',
            view: 'views/metadata-form-oai_dc.html'
        }
    ];

    $scope.userMetadataFormat = null;
    $scope.dropdownMetadataFormats = [{
        'text': 'Présentation',
        'click': 'showMetadataEditor("market-ortolang-n3")'
    },
    {
        'text': 'OAI Dublin Core',
        'click': 'showMetadataEditor("oai_dc")'
    }
    ];

    $scope.showMetadataEditor = function(format) {
        var metadataFormat;
        angular.forEach($scope.metadataFormats, function(md) {
            if(md.id === format) {
                metadataFormat = md;
            }
        });
        $rootScope.$broadcast('metadata-editor-show', metadataFormat);
    };

    $scope.metadatas = [];

    function loadMetadatas(metadatas) {
        $scope.metadatas = metadatas;
    }

    function refreshMetadatas() {
        WorkspaceElementResource.get({wsName: $scope.selectedElements[0].workspace, path: $scope.selectedElements[0].path, root: $routeParams.root},
            function (workspaceElement) {
                loadMetadatas(workspaceElement.metadatas);
            });
    }

    $scope.editMetadata = function (clickEvent, metadata) {
        console.debug('editMetadata with metadata : ');
        console.debug(metadata);
        //TODO load metadata from WorkspaceElementResource factory
        $http.get(Url.urlBase() + '/rest/workspaces/'+$scope.selectedElements[0].workspace+'/elements?path='+$scope.selectedElements[0].path+'&metadata='+metadata.name)
        .success(function (data) {
            var metadataFormat;
            angular.forEach($scope.metadataFormats, function(md) {
                if(md.id === data.format) {
                    metadataFormat = md;
                }
            });
            $rootScope.$broadcast('metadata-editor-edit', metadataFormat, data);
        })
        .error(function () {
            //TODO send error message
            console.error('get workspace element failed !');
        });

        
    };

    $scope.previewMetadata = function (clickEvent, metadata) {
        $rootScope.$broadcast('metadata-preview', clickEvent, metadata);
    };

    $scope.deleteMetadata = function (metadata) {
        $rootScope.$broadcast('metadata-delete', metadata);
    };


    $scope.middle = '';

    $scope.metadataListVisibility = false;

    $scope.showMetadataList = function() {
        $scope.metadataListVisibility = true;
    };

    $scope.hideMetadataList = function() {
        $scope.metadataListVisibility = false;
    };

    $scope.toggleMetadataList = function() {
        $scope.metadataListVisibility = !$scope.metadataListVisibility;
    };

    $scope.isMetadataListShow = function() {
        return $scope.metadataListVisibility === true;
    };


    // ********* //
    // Listeners //
    // ********* //

    $scope.$on('metadata-list-show', function (event, metadata) {
        loadMetadatas(metadata);
        $scope.toggleMetadataList();
    });

    $scope.$on('metadata-list-push', function (event, metadata) {
        $scope.middle = 'middle';
    });

    $scope.$on('metadata-list-unpush', function (event, metadata) {
        $scope.middle = '';
        // Refresh list of metadata
        refreshMetadatas();
    });



  }]);
