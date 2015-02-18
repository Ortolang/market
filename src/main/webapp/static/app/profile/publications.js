'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PublicationsCtrl
 * @description
 * # PublicationsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PublicationsCtrl', ['$scope',
        function ($scope) {

            var firstName = 'Claire', lastName = 'Gardent',
            url = 'https://api.archives-ouvertes.fr/search/?q=authFullName_t:' + firstName.toLowerCase() + '+' + lastName.toLowerCase() + '&wt=json&sort=producedDate_tdate desc';

            function createCORSRequest(method, url){
                var xhr = new XMLHttpRequest();
                if ('withCredentials' in xhr){
                    xhr.open(method, url, true);
                } else if (typeof XDomainRequest !== 'undefined'){
                    xhr = new XDomainRequest();
                    xhr.open(method, url);
                } else {
                    xhr = null;
                }
                return xhr;
            }

            $scope.publications = [];

            var request = createCORSRequest('get', url);
            if (request){
                request.onload = function(){
                    $scope.publications = angular.fromJson(request.responseText);
                    console.log('publi : ',$scope.publications.response);
                };
                request.send();
            }
        }
]);
