'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', '$window', 'User', '$rootScope', '$translate',
        function ($scope, $routeParams, ProfileResource, $filter, $window, User, $rootScope, $translate) {


            /*
             * Route
             */
            $scope.section = $routeParams.section;

            /*
             * INIT
             */

            function init() {

                $scope.visibilityOptions = [];

                $translate([
                    'PROFILE.VISIBILITY.EVERYBODY',
                    'PROFILE.VISIBILITY.FRIENDS',
                    'PROFILE.VISIBILITY.NOBODY',
                    'NAV.LANGUAGE.FRENCH',
                    'NAV.LANGUAGE.ENGLISH',
                    'PROFILE.CIVILITY.MISSUS',
                    'PROFILE.CIVILITY.MISTER'
                ]).then(function (translations) {
                    $scope.visibilityOptions = [
                        {value: 'EVERYBODY', label: translations['PROFILE.VISIBILITY.EVERYBODY'], icon: 'fa fa-unlock'},
                        {value: 'FRIENDS', label: translations['PROFILE.VISIBILITY.FRIENDS'], icon: 'fa fa-users'},
                        {value: 'NOBODY', label: translations['PROFILE.VISIBILITY.NOBODY'], icon: 'fa fa-lock'}
                    ];
                    $scope.selectedVisibility = $scope.visibilityOptions[0];

                    $scope.lang = [
                        {value: 'fr', text: translations['NAV.LANGUAGE.FRENCH']},
                        {value: 'en', text: translations['NAV.LANGUAGE.ENGLISH']}
                    ];

                    $scope.civilities = [
                        {value: 'Mme', text: translations['PROFILE.CIVILITY.MISSUS']},
                        {value: 'M', text: translations['PROFILE.CIVILITY.MISTER']}
                    ];

                });

                $scope.avatars = [
                    {value: 1, text: 'Facebook'},
                    //{value: 2, text: 'Twitter'},
                    {value: 3, text: 'GitHub'},
                    {value: 4, text: 'Gravatar'}
                ];


                $scope.user = undefined;

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

                $scope.user = $scope.$parent.currentUser;

                ProfileResource.getFriends({userId: $scope.user.id}).$promise.then(function (friends) {
                    $scope.friends = friends;
                });
            }

            $scope.updateCurrentUser = function (name, value, type, source, visibility) {
                $scope.user.name = $scope.user.firstname + ' ' + $scope.user.lastname;
                $scope.$parent.currentUser = User.load($scope.user);

                var formData = {
                    name: name,
                    value: value,
                    type: type,
                    source: source,
                    visibility: visibility
                };
                console.debug(formData);

                ProfileResource.update({userId: $scope.user.id}, formData);
            };

            init();


            /**
             * RESIZE CONTAINER
             */

            $scope.resize = function () {
                //console.debug('Resizing');
                var profileContainerHeight = angular.element('#profile-container').outerHeight();
                //console.debug('new height : ', profileContainerHeight);
                angular.element('#main-wrapper').css({'height': profileContainerHeight + 'px'});
            };

            $scope.$watch(
                function() {
                    return angular.element('#profile-content').outerHeight();
                },
                function(newValue, oldValue) {
                    if(newValue !== oldValue) {
                        $scope.resize();
                    }
                }
            );

            angular.element($window).bind('resize', function () {
                $scope.resize();
            });
        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
