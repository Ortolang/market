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

            $scope.section = $routeParams.section;
            $scope.isLocked = {
                firstName: true,
                lastName: true,
                username: true,
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
                desc: 'En se réveillant un matin après des rêves agités, Gregor Samsa se retrouva, dans son lit, métamorphosé en un monstrueux insecte. Il était sur le dos, un dos aussi dur qu’une ' +
                'carapace, et, en relevant un peu la tête, il vit, bombé, brun, cloisonné par des arceaux plus rigides, son abdomen sur le haut duquel la couverture, prête à glisser tout à fait, ne tenait ' +
                'plus qu’à peine.\n' +
                'Ses nombreuses pattes, lamentablement grêles par comparaison avec la corpulence qu’il avait par ailleurs, grouillaient désespérément sous ses yeux. « Qu’est-ce qui m’est arrivé ? »' +
                ' pensa-t-il. Ce n’était pas un rêve.\n' +
                'Sa chambre, une vraie chambre humaine, juste un peu trop petite, était là tranquille entre les quatre murs qu’il connaissait bien. Au-dessus de la table où était déballée une collection' +
                ' d’échantillons de tissus - Samsa était représentant de commerce - on voyait accrochée l’image qu’il avait récemment découpée dans un magazine et mise dans un joli cadre doré. Elle ' +
                'représentait une dame munie d’une toque et d’un boa tous les deux en fourrure et qui, assise bien droite, tendait vers le spectateur un lourd manchon de fourrure où tout son avant-bras ' +
                'avait disparu. Le regard de Gregor se tourna ensuite vers'
            };

            $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];
        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
