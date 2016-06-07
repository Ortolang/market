'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:publicationsHal
 * @publicationsHal
 * # publicationsHal
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('publicationsHal', ['$http', function ($http) {
        return {
            restrict: 'A',
            scope: {
                idHal: '=',
                profileEdition: '@?'
            },
            templateUrl: 'common/directives/publications-hal-template.html',
            link: {
                post: function (scope, element, attrs) {

                    function getPublications() {
                        var url = 'https://api.archives-ouvertes.fr/search/?q=' + scope.idType + ':' + scope.idHal + '&wt=json&fl=docType_s,citationFull_s,halId_s,producedDate_tdate&sort=producedDate_tdate desc';
                        $http.get(url).then(function (response) {
                            if (response.data && response.data.response) {
                                scope.publicationNumber = response.data.response.numFound;
                                scope.publications = response.data.response.docs;
                            }
                        });
                    }

                    scope.$watch('idHal', function (newValue) {
                        if (newValue) {
                            if (isNaN(parseInt(scope.idHal, 10))) {
                                scope.idType = 'authIdHal_s';
                            } else {
                                scope.idType = 'authIdHal_i';
                            }
                            scope.morePublicationsUrl = 'https://hal.archives-ouvertes.fr/search/index/q/*/' + scope.idType + '/' + scope.idHal;
                            getPublications();
                        } else if (newValue === '') {
                            scope.publicationNumber = 0;
                            scope.publications = [];
                        }
                    });

                    scope.doctype = {
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

                }
            }
        };
    }]);
