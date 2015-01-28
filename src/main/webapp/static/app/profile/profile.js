'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope',
        function ($scope) {
            console.debug($scope.$parent.authenticated);
            if($scope.$parent.authenticated) {
                var user = $scope.$parent.currentUser;
                console.debug($scope.$parent);

                console.debug(user);
            }

            $scope.text = '<h1> Les modes d\'overdrives</h1>La particularité de ce dixième épisode est la possibilité de choisir la manière de remplir votre jauge d\'overdrive. ' +
            'C\'est à vous de choisir le mode d\'overdrive qui convient au style de combat de chacun de vos personnages. Au total, vous aurez 17 possibilités. Voici les différents modes ' +
            'd\'overdrives et la manière de les obtenir. Une fois acquise, vous pourrez monter votre jauge de la même manière que cette dernière fut apprise.';
        }
]);
