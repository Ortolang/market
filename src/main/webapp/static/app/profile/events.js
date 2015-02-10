'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('EventCtrl', ['$scope',
        function ($scope) {

            /*
             * CONSTANTS
             */

            $scope.badge = {
                default: {
                    icon : 'fa fa-check-square-o',
                    color : 'info'
                },
                tool: {
                    icon : 'fa fa-cubes',
                    color : 'tool'
                },
                workspace: {
                    icon : 'fa fa-cloud',
                    color : 'workspace'
                },
                process: {
                    icon : 'fa fa-tasks',
                    color : 'processes'
                },
                task: {
                    icon : 'fa fa-bell',
                    color : 'tasks'
                },
                profile: {
                    icon : 'fa fa-user',
                    color : 'profile'
                },
                corpus: {
                    icon : 'fa fa-book',
                    color : 'corpus'
                }
            };

            $scope.limitDisplay = 10;

            /*
             * EVENTS
             */

            $scope.events = [
                {type: 'workspace', title: 'Create Workspace : test', date: '1417317900000'},
                {type: 'tool', title: 'Execute Tool : tika', date: '1418252400000'},
                {type: 'process', title: 'Processus completed : test', date: '1419651600000'},
                {type: 'task', title: 'Task completed : test', date: '1439258700000'},
                {type: 'corpus', title: 'Consult corpus 14', date: '1420058400000'},
                {type: 'workspace', title: 'Add file to workspace test', date: '1457787900000'},
                {type: 'tool', title: 'Execute Tool : marsatag', date: '1432152400000'},
                {type: 'process', title: 'Processus completed : test2', date: '1418657400000'},
                {type: 'task', title: 'Task completed : test2', date: '1419252400000'},
                {type: 'publish', title: 'Publish Corpus : test v2', date: '1472763600000'},
                {type: 'profile', title: 'Read Profile : root', date: '1420238220000'},
                {type: 'workspace', title: 'Add file to workspace test', date: '1425238340000'},
                {type: 'process', title: 'Processus completed : test3', date: '1438516560000'},
                {type: 'task', title: 'Task completed : test3', date: '1438516920000'},
                {type: 'corpus', title: 'Consult Corpus : test', date: '1441204440000'}
            ];

            $scope.raiseLimit = function() {
                $scope.limitDisplay = $scope.limitDisplay + 10;
                $scope.$apply();
            };

        }
    ]);
