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
                SETTINGS: 'profile/settings.html',
                ABOUT_ME: 'profile/about-me.html',
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
                FAX : 'Fax',
                HELPER: {
                    TITRE: 'Professional title: Dr., Prof., etc. '
                }
            },
            ABOUT_ME : {
                PRESENTATION: 'Describe yourself in a few words'
            },
            SETTINGS: {
                AVATAR : 'Avatar',
                ORCID : 'Identifiant ORCID',
                VIAF : 'Identifiant VIAF',
                MYIDREF : 'IdRef',
                LINKEDIN : 'Page Linkedin',
                VIDAEO : 'Identifiant Viadeo',
                LANGUE_MESSAGES : 'Preferred interface language',
                FACEBOOK : 'Identifiant Facebook',
                GITHUB : 'Identifiant Github',
                GRAVATAR : 'Identifiant Gravatar',
                HELPER : {
                    ORCID : 'Persistent digital identifiers: <a href="http://orcid.org/" target="_blank">http://orcid.org/</a>.',
                    VIAF : 'Persistent digital identifiers:  <a href="http://viaf.org/viaf/" target="_blank">http://viaf.org/viaf/</a>.',
                    MYIDREF : 'Persistent digital identifiers:  <a href="http://www.idref.fr/" target="_blank">http://www.idref.fr/</a>.',
                    LINKEDIN : 'Persistent digital identifiers:  <a href="http://www.linkedin.com/" target="_blank">http://www.linkedin.com/</a>.',
                    VIADEO : 'Persistent digital identifiers:  <a href="http://www.viadeo.com/profile/" target="_blank">http://www.viadeo.com/profile/</a>.',
                    FACEBOOK : 'More informations about how to get you facebook user id : <a href="http://findmyfacebookid.com/" target="_blank">http://findmyfacebookid.com/</a>.',
                    GRAVATAR : 'Please enter your email address mapped with gravatar : <a href="https://fr.gravatar.com/" target="_blank">https://fr.gravatar.com/</a>.'
                }
            }
        }
    });
/**
 * Created by cmoro on 27/01/15.
 */
