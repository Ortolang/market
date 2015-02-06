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
            CORPORA: 'Corpus',
            LEXICONS: 'Lexiques',
            TOOLS: 'Outils',
            WEBSITES: 'Sites web',
            PUNCH_LINE: 'Cherchez dans Ortolang',
            REDACTOR_CHOICES: 'Choix de l\'équipe',
            CONDITIONS_OF_USE: 'Conditions d\'utilisation',
            BROWSE: 'Voir le contenu',
            ADD_TO_FAVOURITES: 'Ajouter à mes favoris',
            USE_IN_MY_PROJECT: 'Utiliser dans mon projet',
            ADDITIONAL_INFORMATION: 'Informations complémentaires',
            LOCATION: 'Localisation',
            CONTRIBUTOR: 'Contribution',
            DOWNLOAD: 'Téléchargement',
            DOWNLOAD_ALL: 'Vous allez télécharger la totalité des données de cette ressource {{value && value !=="" ? "("+value+")" : ""}}',
            DOWNLOAD_AGREEMENT: 'Le téléchargement de cette ressource vaut acceptation de la licence d\'utilisation.',
            LICENCE_DETAIL: 'Détails sur la license',
            DEROGATION: 'Code du patrimoine',
            RESULTS_LABEL: 'Environ {{value}} résultat{{value > 1 ? "s" : ""}}',
            SITE: 'Accéder à l\'application web'
        }
    });
