'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.INFORMATION_EN
 * @description
 * # INFORMATION_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('INFORMATION_EN', {
        INFORMATION: {
            NAV: {
                PRESENTATION: 'Presentation',
                PARTNERS: 'Partners',
                ROADMAP: 'Roadmap',
                NEWSLETTER: 'Newsletter'
            },
            PATH: {
                PRESENTATION: 'information/en/presentation.html',
                PARTNERS: 'information/partners.html',
                ROADMAP: 'information/roadmap.html',
                NEWSLETTER: 'information/newsletter.html',
                LEGAL_NOTICES: 'information/fr/legal-notices.html'
            },
            NEWSLETTER: {
                FIRST_NEWSLETTER: 'ORTOLANG first newsletter'
            },
            INNOVATIVE_SHS: 'Meet ORTOLANG at the 2nd conference  of the exposition "Innovatives SHS de l\'INSHS"',
            LINK_DOCUMENTATION: '<p>A <a href="/#/documentation" title="user\'s documentation">user\'s documentation</a> is available for facilitating ' +
            'your queries.</p>',
            LINK_COMMUNITY: '<p>You may also access the <a href="http://dev.ortolang.fr/" target="_blank" >community development site</a> of ORTOLANG project.</p>',
            LINK_PARTNERS: 'ORTOLANG brings together diverse fields of expertise from its <a href="/#/partners" title="partners">partners</a>.',
            LINK_ROADMAP: 'A planning of major ORTOLANG version building stages is displayed in the <a href="/#/roadmap" title="roadmap">general roadmap</a>.',
            INSTITUTIONS: 'Institutions',
            PARTNERS: 'Partners'
        }
    });
