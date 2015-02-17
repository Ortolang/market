'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter',
        function ($scope, $routeParams, ProfileResource, $filter) {

            /*
             * Route
             */

            $scope.section = $routeParams.section;

            /*
             * FORMS
             */

            //$scope.isLocked = {
            //    firstName: true,
            //    lastName: false,
            //    username: false,
            //    organisation: true,
            //    email: true,
            //    status: true,
            //    desc: false
            //};
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

            $scope.avatars = [
                {value: 0, text: 'Default'},
                {value: 1, text: 'Facebook'},
                {value: 2, text: 'Twitter'},
                {value: 3, text: 'GitHub'},
                {value: 4, text: 'Gravatar'}
            ];

            $scope.civilities = [
                {value: 'none', text: 'Choisissez...'},
                {value: 'M', text: 'Monsieur'},
                {value: 'Mme', text: 'Madame'},
                {value: 'other', text: 'Autre'}
            ];

            $scope.domaines = ['Linguistique', 'Informatique', 'Traitement automatique de la langue'];

            $scope.urlPros = [];

            $scope.user = {civility : 'none', urlPros : [], preferredAvatar : 0 };

            if ($scope.$parent.authenticated) {

                ProfileResource.connected().$promise.then(function (profile) {
                    $scope.user = profile;
                    $scope.user.userId = $scope.$parent.currentUser.userId;
                    $scope.user.name = $scope.$parent.currentUser.name;
                    if($scope.user.civility === undefined) {
                        $scope.user.civility = 'none';
                    }
                    if($scope.user.urlPros === undefined) {
                        $scope.user.urlPros = [];
                        $scope.urlPros=[];
                    }
                    else {
                        angular.forEach($scope.user.urlPros, function (index, url) {
                            $scope.urlPros.push({index:index, url:url});
                        });
                    }
                    if($scope.user.preferredAvatar === undefined) {
                        $scope.user.preferredAvatar = 0;
                    }
                    //$scope.user.urlPros = [{index:0, url:'http://bli.com'},{index:1, url:'http://bli2.com'}];

                    console.debug('user:', $scope.user);
                });
            }

            $scope.addNewUrlPro = function() {
                var lastItem, newItemNo = 0;
                if($scope.urlPros.length>0) {
                    lastItem = $scope.urlPros[$scope.urlPros.length - 1];
                    newItemNo = lastItem.index + 1;
                }
                $scope.urlPros.push({index:newItemNo, url:''});
                console.debug($scope.urlPros);
            };

            $scope.removeUrlPro = function(item) {
                var index = $scope.urlPros.indexOf(item);
                var index2 = $scope.user.urlPros.indexOf(item);
                if (index !== -1) {
                    $scope.urlPros.splice(index, 1);
                    $scope.user.urlPros.splice(index2, 1);
                }
            };

            $scope.showPreferredAvatar = function() {
                var selected = $filter('filter')($scope.avatars, {value: $scope.user.preferredAvatar});
                return ($scope.user.preferredAvatar && selected.length) ? selected[0].text : 'Default avatar';
            };

            $scope.showCivility = function() {
                var selected = $filter('filter')($scope.civilities, {value: $scope.user.civility});
                return ($scope.user.civility && selected.length) ? selected[0].text : 'empty';
            };

            $scope.updateUser = function(data) {
                $scope.user.urlPros.push(data);
            };

        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
