'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams', 'ProfileResource',
        function ($scope, $routeParams, ProfileResource) {

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
            //$scope.user = {
            //    id: 1,
            //    firstName: 'Kurt',
            //    lastName: 'Cobain',
            //    username: 'KC',
            //    organisation: 'Nirvana',
            //    email: 'kurt.cobain@nirvana.org',
            //    status: 4,
            //    desc: '<p><img style="float: right;" src="http://graph.facebook.com/678872827/picture?width=200&amp;height=200" height="213" width="213"></p>' +
            //    '<p>En se réveillant un matin après des rêves agités, Gregor Samsa se retrouva, dans son lit, métamorphosé en un monstrueux insecte. Il était sur le dos, ' +
            //    'un dos aussi dur qu’une carapace, et, en relevant un peu la tête, il vit, bombé, brun, cloisonné par des arceaux plus rigides, son abdomen sur le haut duquel la couverture, prête à ' +
            //    'glisser tout à fait, ne tenait plus qu’à peine. Ses nombreuses pattes, lamentablement grêles par comparaison avec la corpulence qu’il avait par ailleurs, <b>grouillaient désespérément ' +
            //    'sous ses yeux</b>. <br></p><blockquote><p>« Qu’est-ce qui m’est arrivé ? » pensa-t-il.&nbsp;</p></blockquote><p> Ce n’était pas un rêve.<br>Sa chambre, une vraie chambre humaine, ' +
            //    'juste un peu trop petite, était là tranquille entre les quatre murs qu’il connaissait bien. Au-dessus de la table où était déballée une collection d’échantillons de tissus - Samsa était ' +
            //    'représentant de commerce - on voyait accrochée l’image qu’il avait récemment découpée dans un magazine et mise dans un joli cadre doré. Elle représentait une dame munie d’une toque et ' +
            //    'd’un boa tous les deux en fourrure et qui, assise bien droite, tendait vers le spectateur un lourd manchon de fourrure où tout son avant-bras avait disparu. <br></p><p></p>'
            //};

            $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];

            $scope.user = undefined;

            if ($scope.$parent.authenticated) {

                ProfileResource.connected().$promise.then(function (profile) {
                    console.debug('profil:', profile);
                    $scope.user = profile;
                    $scope.user.userId = $scope.$parent.currentUser.userId;
                    $scope.user.name = $scope.$parent.currentUser.name;

                });
            }
        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
