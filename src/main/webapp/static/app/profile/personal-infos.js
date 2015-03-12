'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PersonalInfosCtrl
 * @description
 * # PersonalInfosCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PersonalInfosCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter',
        function ($scope, $routeParams, ProfileResource, $filter) {

            /**
             * INIT
             */
            $scope.infos = [
                {name: 'civilite', value: 'none', type: 'ENUM', source: 'civilities', visibility: $scope.visibilityOptions[0]},
                {name: 'titre', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'prenom', value: $scope.user.firstname, type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'nom', value: $scope.user.lastname, type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'organisme', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]}, // à changer en ENUM avec un référentiel
                {name: 'metier', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'domaine_recherche', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'adresse', value: '', type: 'TEXT', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'ville', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'cp', value: '', type: 'NUMBER', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'site_perso', value: '', type: 'URL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'pays_id', value: '', type: 'ENUM', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'etat_id', value: '', type: 'ENUM', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'mail_pro', value: $scope.user.email, type: 'EMAIL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'mail', value: '', type: 'EMAIL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'tel_pro', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'tel', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0]},
                {name: 'fax', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0]}
            ];

            ProfileResource.getInfos({userId: $scope.user.id}).$promise.then(function (infos) {
                $scope.user.infos = [];
                angular.forEach(infos, function(info) {
                    var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: info.visibility});
                    var item = {name:info.name, value:info.value, type: info.type, source: info.source, visibility: visibilitySelected[0]};
                    $scope.user.infos.push(item);
                });

                if ($scope.user.infos.length <= 0) {
                    $scope.user.infos = $scope.infos;
                } else {
                    angular.forEach($scope.infos, function(info) {
                        var fieldName = info.name;
                        var filledField = $filter('filter')($scope.user.infos, {name: fieldName});
                        if (filledField.length <= 0) {
                            $scope.user.infos.push(info);
                        }
                    });
                }

                console.debug('INFOS:', $scope.user.infos);
            });

        }
    ]);
