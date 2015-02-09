'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams',
        function ($scope, $routeParams) {
            //console.debug($scope.$parent.authenticated);
            //if($scope.$parent.authenticated) {
            //    var user = $scope.$parent.currentUser;
            //    console.debug($scope.$parent);
            //
            //    console.debug(user.name);
            //}

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
             * Route
             */

            $scope.section = $routeParams.section;

            /*
             * FORMS
             */

            $scope.isLocked = {
                firstName: true,
                lastName: false,
                username: false,
                organisation: true,
                email: true,
                status: true,
                desc: false
            };
            $scope.user = {
                id: 1,
                firstName: 'Kurt',
                lastName: 'Cobain',
                username: 'KC',
                organisation: 'Nirvana',
                email: 'kurt.cobain@nirvana.org',
                status: 4,
                desc: '<p><img style="float: right;" src="http://graph.facebook.com/678872827/picture?width=200&amp;height=200" height="213" width="213"></p>' +
                '<p>En se réveillant un matin après des rêves agités, Gregor Samsa se retrouva, dans son lit, métamorphosé en un monstrueux insecte. Il était sur le dos, ' +
                'un dos aussi dur qu’une carapace, et, en relevant un peu la tête, il vit, bombé, brun, cloisonné par des arceaux plus rigides, son abdomen sur le haut duquel la couverture, prête à ' +
                'glisser tout à fait, ne tenait plus qu’à peine. Ses nombreuses pattes, lamentablement grêles par comparaison avec la corpulence qu’il avait par ailleurs, <b>grouillaient désespérément ' +
                'sous ses yeux</b>. <br></p><blockquote><p>« Qu’est-ce qui m’est arrivé ? » pensa-t-il.&nbsp;</p></blockquote><p> Ce n’était pas un rêve.<br>Sa chambre, une vraie chambre humaine, ' +
                'juste un peu trop petite, était là tranquille entre les quatre murs qu’il connaissait bien. Au-dessus de la table où était déballée une collection d’échantillons de tissus - Samsa était ' +
                'représentant de commerce - on voyait accrochée l’image qu’il avait récemment découpée dans un magazine et mise dans un joli cadre doré. Elle représentait une dame munie d’une toque et ' +
                'd’un boa tous les deux en fourrure et qui, assise bien droite, tendait vers le spectateur un lourd manchon de fourrure où tout son avant-bras avait disparu. <br></p><p></p>'
            };

            $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

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

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
