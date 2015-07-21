'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.INFORMATION_FR
 * @description
 * # INFORMATION_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('STATICSITE_FR', {
        STATICSITE: {
            PATH: {
                LEGAL_NOTICES: 'common/staticSite/fr/legal-notices.html'
            },
            NO_NEWS: 'Aucune actualité',
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
                HYPERLINKS_CONTENT: 'La mise en place de liens hypertextes par des tiers vers des pages ou des documents diffusés sur le site de ORTOLANG Community, est autorisée sous réserve que les liens ne contreviennent pas aux intérêts des partenaires du projet ORTOLANG, et, qu’ils garantissent la possibilité pour l’utilisateur d’identifier l’origine et l’auteur du document.'
            }
        }
    }
);
