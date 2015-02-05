'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.INFORMATION_FR
 * @description
 * # INFORMATION_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('INFORMATION_FR', {
        INFORMATION: {
            NAV: {
                PRESENTATION: 'Présentation',
                PARTNERS: 'Partenaires',
                ROADMAP: 'Planning de réalisation',
                NEWSLETTER: 'Lettre d\'information'
            },
            PATH: {
                PRESENTATION: 'information/fr/presentation.html',
                PARTNERS: 'information/partners.html',
                ROADMAP: 'information/roadmap.html',
                NEWSLETTER: 'information/newsletter.html',
                LEGAL_NOTICES: 'information/fr/legal-notices.html'
            },
            NEWSLETTER: {
                FIRST_NEWSLETTER: 'Première lettre d\'information d\'ORTOLANG'
            },
            INNOVATIVE_SHS: 'Retrouver ORTOLANG à la Seconde édition du salon Innovatives SHS de l\'INSHS',
            LINK_DOCUMENTATION: '<p>Une <a href="/#/documentation" title="Documentation Utilisateur">documentation utilisateur</a> est disponible pour vous aider ' +
            'à effectuer des recherches.</p>',
            LINK_COMMUNITY: '<p>Vous pouvez également accèder au <a href="http://dev.ortolang.fr/" target="_blank" >site communautaire</a> de l\'équipe de développement du projet ORTOLANG.</p>',
            LINK_PARTNERS: 'ORTOLANG réunit des compétences variées grâce à un ensemble de <a href="/#/partners" title="Partenaires">partenaires</a>.',
            LINK_ROADMAP: 'Le planning de réalisation globale des versions majeures d\'ORTOLANG est visible dans la <a href="/#/roadmap" title="roadmap">roadmap générale</a>.',
            INSTITUTIONS: 'Institutions',
            PARTNERS: 'Unités support du projet'
        }
    });
