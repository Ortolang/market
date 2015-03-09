'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MARKET_FR
 * @description
 * # MARKET_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('MARKET_FR', {
        MARKET: {
            ALL_TYPE: 'Tous',
            NEW_RESOURCES: 'Nouveautés',
            WEBSITES: 'Sites web',
            SEARCH_PAGE: 'Rechercher dans le contenu',
            PUNCH_LINE: 'Cherchez dans Ortolang',
            REDACTOR_CHOICES: 'Choix de l\'équipe',
            CONDITIONS_OF_USE: 'Conditions d\'utilisation',
            BROWSE: 'Voir le contenu',
            ADD_TO_FAVOURITES: 'Ajouter à mes favoris',
            USE_IN_MY_PROJECT: 'Utiliser dans mon projet',
            ADDITIONAL_INFORMATION: 'Informations complémentaires',
            KEYWORDS: 'Mots clés',
            EXTENT: 'Contenu',
            PRIMARY_LANGUAGE: 'Langue principale',
            DISCOURSE_TYPE: 'Genre du discours',
            LINGUISTIC_SUBJECT: 'Domaines linguistiques',
            SPACIAL: 'Lieux',
            TEMPORAL: 'Date de création',
            PREVIEW: 'Aperçu',
            LOCATION: 'Localisation',
            CONTRIBUTOR: 'Contribution',
            DOWNLOAD: 'Téléchargement',
            DOWNLOAD_ALL: 'Vous allez télécharger la totalité des données de cette ressource {{value && value !=="" ? "("+value+")" : ""}}',
            DOWNLOAD_AGREEMENT: 'Le téléchargement de cette ressource vaut acceptation de la licence d\'utilisation.',
            LICENCE_DETAIL: 'Détails sur la licence',
            DEROGATION: 'Code du patrimoine',
            RESULTS_LABEL: 'Environ {{value}} résultat{{value > 1 ? "s" : ""}}',
            SITE: 'Accéder à l\'application web'
        }
    });
