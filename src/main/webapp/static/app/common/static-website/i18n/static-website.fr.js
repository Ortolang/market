'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.STATIC_WEBSITE_FR
 * @description
 * # STATIC_WEBSITE_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('STATIC_WEBSITE_FR', {
        STATIC_WEBSITE: {
            PATH: {
                LEGAL_NOTICES: 'common/static-website/fr/legal-notices.html'
            },
            NEWS: 'Actualités',
            LEGAL_NOTICES: {
                TITLE: 'Mentions Légales',
                INFO_PUBLICATION: 'Informations de publication',
                PUBLICATION_DIRECTOR: 'Directeur de la publication',
                IT_MANAGER: 'Responsable informatique',
                IT_DEVELOPMENT: 'Développement informatique',
                TERMS_OF_USE: 'Conditions d’utilisation',
                LIABILITY_DISCLAIMER: 'Clause de non-responsabilité',
                LIABILITY_DISCLAIMER_CONTENT: 'La responsabilité du CNRS et des partenaires ORTOLANG ne peut, en aucune manière, être engagée quant au contenu des informations figurant sur ce site ou aux conséquences pouvant résulter de leur utilisation ou interprétation.',
                INTELLECTUAL_PROPERTY: 'Propriété intellectuelle',
                INTELLECTUAL_PROPERTY_CONTENT: 'Le site de ORTOLANG Community est une oeuvre de création, propriété exclusive du CNRS, protégé par la législation française et internationale sur le droit de la propriété intellectuelle. Aucune reproduction ou représentation ne peut être réalisée en contravention avec les droits du CNRS issus de la législation susvisée.',
                HYPERLINKS: 'Liens hypertextes',
                HYPERLINKS_CONTENT: 'La mise en place de liens hypertextes par des tiers vers des pages ou des documents diffusés sur le site de ORTOLANG Community, est autorisée sous réserve que les liens ne contreviennent pas aux intérêts des partenaires du projet ORTOLANG, et, qu’ils garantissent la possibilité pour l’utilisateur d’identifier l’origine et l’auteur du document.',
                CONFIDENTIALITY: 'Politique de confidentialité',
                COOKIES_USE: 'Utilisation des cookies',
                COOKIES_USE_CONTENT: 'Le site de ORTOLANG utilise des cookies afin de réaliser des statistiques d\'audiences anonymes uniquement destinées à un usage interne. Ces statistiques sont réalisées grâce au logiciel libre et open source de mesure de statistiques web <a href="https://fr.piwik.org/" target="_blank">Piwik</a> hébergé sur nos propres serveur.',
                DO_NOT_TRACK: 'Ne pas autoriser à suivre mes visites',
                DO_NOT_TRACK_CONTENT: '<ul><li>Si la fonction "Ne pas me pister" ("Do No Track" en anglais) de votre navigateur est activée, notre outil d\'analyse web n\'enregistrera pas votre activité sur notre site.</li><li>Vous avez également la possibilité de demander à ne pas être suivi ci-dessous :</li></ul>',
                DO_NOT_TRACK_ACTUAL_CONFIG: 'Configuration actuelle :'
            }
        }
    });
