'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PROFILE_EN
 * @description
 * # PROFILE_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PROFILE_EN', {
        PROFILE: {
            NAV: {
                PERSONAL_INFOS: 'Personal informations',
                SETTINGS: 'Settings',
                ABOUT_ME: 'About me',
                EVENTS: 'Recent activity',
                PUBLICATIONS: 'Publications',
                CONTRIBUTIONS: 'Contributions',
                FRIENDS: 'Co-workers'
            },
            PATH: {
                PERSONAL_INFOS: 'profile/personal-infos.html',
                SETTINGS: 'profile/en/settings.html',
                ABOUT_ME: 'profile/en/about-me.html',
                EVENTS: 'profile/en/events.html',
                PUBLICATIONS: 'profile/en/publications.html',
                CONTRIBUTIONS: 'profile/en/contributions.html',
                FRIENDS: 'profile/en/friends.html'
            },
            VISIBILITY: {
                LABEL : 'Field visibility: ',
                EVERYBODY: 'Public',
                FRIENDS: 'Friends only',
                NOBODY: 'Me only'
            },
            CIVILITY: {
                MISTER : 'M.',
                MISSUS : 'Mrs.'
            },
            INFOS: {
                CIVILITE : 'Gender',
                TITRE : 'Professional title',
                PRENOM : 'First name',
                NOM : 'Family name',
                ORGANISME : 'Institution',
                METIER : 'Profession or occupation',
                DOMAINE_RECHERCHE : 'Field of research',
                ADRESSE : 'Postal mail',
                VILLE : 'City',
                CP : 'Postal code',
                SITE_PERSO : 'Personal website',
                PAYS_ID : 'Country',
                ETAT_ID : 'State (only USA)',
                MAIL_PRO : 'Professional email',
                MAIL : 'Alternate email',
                TEL_PRO : 'Professional phone',
                TEL : 'Personal phone',
                FAX : 'Fax'
            },
            SETTINGS: {
                ORCID : 'Identifiant ORCID',
                VIAF : 'Identifiant VIAF',
                MYIDREF : 'IdRef',
                LINKEDIN : 'Page Linkedin',
                VIDAEO : 'Identifiant Viadeo',
                LANGUE_MESSAGES : 'Preferred interface language'
            }
        }
    });
/**
 * Created by cmoro on 27/01/15.
 */
