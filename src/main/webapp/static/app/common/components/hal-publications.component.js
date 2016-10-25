'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:halPublications
 * @halPublications
 * # halPublications
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('halPublications', {
        bindings: {
            idHal: '<'
        },
        templateUrl: 'common/components/hal-publications.component.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            var ctrl = this;

            function getPublications() {
                var url = 'https://api.archives-ouvertes.fr/search/?q=' + ctrl.idType + ':' + ctrl.idHal + '&wt=json&fl=docType_s,citationFull_s,halId_s,producedDate_tdate&sort=producedDate_tdate desc';
                $http.get(url).then(function (response) {
                    if (response.data && response.data.response) {
                        ctrl.publicationNumber = response.data.response.numFound;
                        ctrl.publications = response.data.response.docs;
                    }
                });
            }

            $scope.$watch('$ctrl.idHal', function (newValue) {
                if (newValue) {
                    if (angular.isNumber(ctrl.idHal)) {
                        ctrl.idType = 'authIdHal_i';
                    } else {
                        ctrl.idType = 'authIdHal_s';
                    }
                    ctrl.morePublicationsUrl = 'https://hal.archives-ouvertes.fr/search/index/q/*/' + ctrl.idType + '/' + ctrl.idHal;
                    getPublications();
                } else {
                    ctrl.publicationNumber = 0;
                    ctrl.publications = [];
                }
            });

            ctrl.doctype = {
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

        }]
    });
