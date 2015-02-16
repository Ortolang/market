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
                NEWSLETTER: 'Lettre d\'information',
                CONVENTION: 'Charte d\'Ortolang'
            },
            PATH: {
                PRESENTATION: 'information/fr/presentation.html',
                PARTNERS: 'information/partners.html',
                ROADMAP: 'information/fr/roadmap.html',
                NEWSLETTER: 'information/newsletter.html',
                LEGAL_NOTICES: 'information/fr/legal-notices.html',
                NEWS: 'information/fr/news.html',
                CONVENTION: 'information/fr/convention.html'
            },
            NEWSLETTER: {
                FIRST_NEWSLETTER: 'Première lettre d\'information d\'ORTOLANG',
                DOWNLOAD_NEWSLETTER: 'Télécharger la lettre d\'information',
                FOLLOW_NEWSLETTER: 'Vous pouvez suivre l\'actualité d\'Ortolang en lisant sa lettre d\'information.',
                PAST_ISSUES: 'Les numéros déjà parus sont téléchargeables ci-dessous :',
                SUBSCRIPTION: 'Abonnement',
                INFO_SUBSCRIBE: 'Cliquez ici si vous souhaitez vous abonner et recevoir les prochaines lettres d\'information d\'Ortolang sur votre messagerie.',
                SUBSCRIBE: 'S\'abonner'
            },
            NEWS: 'Actualités',
            INNOVATIVE_SHS: 'Retrouvez ORTOLANG à la Seconde édition du salon Innovatives SHS de l\'INSHS, à la Cité des sciences et de l\'industrie de Paris, les 16 et 17 juin 2015.',
            MORE: 'Plus d\'informations',
            INSTITUTIONS: 'Institutions',
            PARTNERS: 'Unités support du projet',
            DOWNLOAD_CONVENTION: 'Télécharger la charte d\'Ortolang au format pdf'
        }
    });
