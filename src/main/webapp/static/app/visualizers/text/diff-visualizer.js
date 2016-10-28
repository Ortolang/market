'use strict';

/**
 * @ngdoc controller
 * @name ortolangVisualizers.controller:DiffVisualizerCtrl
 * @description
 * # DiffVisualizerCtrl
 */
angular.module('ortolangVisualizers')
    .controller('DiffVisualizerCtrl', ['$scope', '$window', 'Content', function ($scope, $window, Content) {

        $scope.leftObjName = $scope.$ctrl.data.elements[0].name;
        $scope.rightObjName = $scope.$ctrl.data.elements[1].name;
        $scope.$ctrl.header.html = $scope.leftObjName + '&nbsp;&nbsp;<span class="octicon octicon-mirror"></span>&nbsp;&nbsp;' + $scope.rightObjName;
        $scope.$ctrl.header.actions = [
            {name: 'default', text: 'default'},
            {name: 'processing-diff', text: 'processing-diff'},
            {name: 'semantic-diff', text: 'semantic-diff'},
            {name: 'line-diff', text: 'line-diff'}
        ];

        $scope.doAction = function (name) {
            $scope.diff = name;
        };

        Content.downloadWithKey($scope.$ctrl.data.elements[0].key).promise.then(function (response) {
            $scope.leftObj = response.data;
        });
        Content.downloadWithKey($scope.$ctrl.data.elements[1].key).promise.then(function (response) {
            $scope.rightObj = response.data;
        });

        $scope.switchDiff = function () {
            var tmp = $scope.leftObj,
                tmpBis = $scope.leftObjName;
            $scope.leftObj = $scope.rightObj;
            $scope.leftObjName = $scope.rightObjName;
            $scope.rightObj = tmp;
            $scope.rightObjName = tmpBis;
        };
    }])
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'diff',
            templateUrl: 'visualizers/text/diff-visualizer.html',
            data: ['elements'],
            name: {
                fr: 'Visualiseur de différence',
                en: 'Diff Visualizer'
            },
            compatibleTypes: [
                {
                    'text/plain': true
                },
                {
                    'text/plain': true
                }
            ],
            acceptMultiple: true
        });
    }]);

