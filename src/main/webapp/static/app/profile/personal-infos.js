'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PersonalInfosCtrl
 * @description
 * # PersonalInfosCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PersonalInfosCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter', 'User',
        function ($scope, $routeParams, ProfileResource, $filter, User) {

            /**
             * INIT
             */
            $scope.infos = [
                {name: 'civilite', value: 'none', type: 'ENUM', source: 'civilities', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'titre', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: true},
                {name: 'prenom', value: $scope.user.firstname, type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'nom', value: $scope.user.lastname, type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'organisme', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false}, // à changer en ENUM avec un référentiel
                {name: 'metier', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'domaine_recherche', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'adresse', value: '', type: 'TEXT', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'ville', value: '', type: 'STRING', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'cp', value: '', type: 'NUMBER', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'site_perso', value: '', type: 'URL', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'pays_id', value: '', type: 'ENUM', source: 'countries', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'etat_id', value: '', type: 'ENUM', source: 'states', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'mail_pro', value: $scope.user.email, type: 'EMAIL', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'mail', value: '', type: 'EMAIL', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'tel_pro', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'tel', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0], helper: false},
                {name: 'fax', value: '', type: 'TEL', source: '', visibility: $scope.visibilityOptions[0], helper: false}
            ];

            ProfileResource.getInfos({userId: $scope.user.id}).$promise.then(function (infos) {
                $scope.user.infos = [];
                var result = [];
                infos = infos.entries;
                angular.forEach(infos, function(info) {
                    var visibilitySelected = $filter('filter')($scope.visibilityOptions, {value: info.visibility}, true);
                    var itemInfo = $filter('filter')($scope.infos, {name: info.name}, true);
                    if (itemInfo.length > 0) {
                        var item = {
                            name: info.name,
                            value: info.value,
                            type: info.type,
                            source: info.source,
                            visibility: visibilitySelected[0],
                            helper: itemInfo[0].helper
                        };
                        result.push(item);
                    }
                });

                if (result.length <= 0) {
                    $scope.user.infos = $scope.infos;
                } else {
                    angular.forEach($scope.infos, function(info) {
                        var fieldName = info.name;
                        var filledField = $filter('filter')(result, {name: fieldName}, true);
                        if (filledField.length <= 0) {
                            $scope.user.infos.push(info);
                        } else {
                            $scope.user.infos.push(filledField[0]);
                        }
                    });
                }

            });

            /**
             * METHODS
             */

            $scope.showValue = function (value, source) {
                var item = $filter('filter')($scope[source], {value: value}, true);
                if (item.length <= 0 || item === undefined) {
                    return 'empty';
                } else {
                    return item[0].text;
                }
            };


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

                ProfileResource.update({userId: $scope.user.id}, formData);
            };
        }
    ]);
