'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataListCtrl
 * @description
 * # MetadataListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
  .controller('MetadataListCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.metadataFormats = [
        {
            id:'rdf',
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
        'click': 'showMetadataEditor("rdf")'
    },
    {
        'text': 'OAI Dublin Core',
        'click': 'showMetadataEditor("oai_dc")'
    }
    ];

    $scope.showMetadataEditor = function(format) {
        var metadataFormat = undefined;
        angular.forEach($scope.metadataFormats, function(md) {
            if(md.id === format) {
                metadataFormat = md;
            }
        });
        $rootScope.$broadcast('metadata-editor-show', metadataFormat);
    }

    $scope.metadatas = [];

    function loadMetadatas(metadatas) {
        $scope.metadatas = metadatas;
    }

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
    }

    $scope.hideMetadataList = function() {
        $scope.metadataListVisibility = false;
    }

    $scope.toggleMetadataList = function() {
        $scope.metadataListVisibility = !$scope.metadataListVisibility;
    }

    $scope.isMetadataListShow = function() {
        return $scope.metadataListVisibility === true;
    }


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
    });



  }]);
