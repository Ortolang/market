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

            function createCORSRequest(method, url) {
                var xhr = new XMLHttpRequest();
                if ('withCredentials' in xhr) {
                    xhr.open(method, url, true);
                } else if (XDomainRequest !== undefined) {
                    xhr = new XDomainRequest();
                    xhr.open(method, url);
                } else {
                    xhr = null;
                }
                return xhr;
            }

            function csvToArray(strData, strDelimiter) {
                strDelimiter = (strDelimiter || ',');
                var objPattern = new RegExp(
                    ('(\\' + strDelimiter + '|\\r?\\n|\\r|^)' + // Delimiters
                    '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' + // Quoted fields.
                    '([^\"\\' + strDelimiter + '\\r\\n]*))'), // Standard fields.
                    'gi'
                );
                var arrData = [[]],
                    arrMatches = null;
                arrMatches = objPattern.exec(strData);
                while (arrMatches) {
                    var strMatchedDelimiter = arrMatches[1];
                    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                        arrData.push([]);
                    }
                    var strMatchedValue;
                    if (arrMatches[2]) {
                        strMatchedValue = arrMatches[ 2 ].replace(new RegExp( '\"\"', 'g' ),'\"');
                    } else {
                        strMatchedValue = arrMatches[ 3 ];
                    }
                    arrData[ arrData.length - 1 ].push( strMatchedValue );
                    arrMatches = objPattern.exec( strData );
                }
                return (arrData);
            }

            $scope.publications = undefined;
            $scope.doctype = {
                'ART': {'value': 'Article dans des revues', 'color': 'danger'},
                'COMM': {'value': 'Communication dans un congrès', 'color': 'danger'},
                'POSTER': {'value': 'Poster', 'color': 'danger'},
                'PRESCONF': {'value': 'Document associé à des manifestations scientifiques', 'color': 'danger'},
                'OUV': {'value': 'Ouvrage (y compris édition critique et traduction)', 'color': 'danger'},
                'COUV': {'value': 'Chapitre d\'ouvrage', 'color': 'danger'},
                'DOUV': {'value': 'Direction d\'ouvrage, Proceedings', 'color': 'danger'},
                'PATENT': {'value': 'Brevet', 'color': 'danger'},
                'OTHER': {'value': 'Autre publication', 'color': 'warning'},
                'UNDEFINED': {'value': 'Pré-publication, Document de travail', 'color': 'warning'},
                'REPORT': {'value': 'Rapport', 'color': 'warning'},
                'THESE': {'value': 'Thèse', 'color': 'info'},
                'HDR': {'value': 'HDR', 'color': 'info'},
                'MEM': {'value': 'Mémoire d\'étudiant', 'color': 'info'},
                'LECTURE': {'value': 'Cours', 'color': 'info'},
                'IMG': {'value': 'Image', 'color': 'success'},
                'VIDEO': {'value': 'Vidéo', 'color': 'success'},
                'SON': {'value': 'Son', 'color': 'success'},
                'MAP': {'value': 'Carte', 'color': 'success'},
                'MINUTES': {'value': 'Compte rendu de table ronde', 'color': 'warning'},
                'NOTE': {'value': 'Note de lecture', 'color': 'warning'},
                'OTHERREPORT': {'value': 'Autre rapport, séminaire, workshop', 'color': 'warning'}
            };

            $scope.getPublications = function () {
                // otherwise use names
                //var name = 'Falk+Ingrid',
                var name = $scope.$parent.currentUser.firstname + '+' + $scope.$parent.currentUser.lastname,
                    url = 'https://api.archives-ouvertes.fr/search/?q=authFullName_t:' + name.toLowerCase() + '&wt=csv&sort=producedDate_tdate desc&indent=true',
                    request = createCORSRequest('get', url);
                $scope.publications = [];
                if (request) {
                    request.onload = function () {
                        $scope.publications = csvToArray(request.responseText, ',');
                        $scope.publications.shift();
                    };
                    request.send();
                }
            };


        }
]);
