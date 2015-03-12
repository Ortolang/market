'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PROFILE_FR
 * @description
 * # PROFILE_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PROFILE_FR', {
        PROFILE: {
            NAV: {
                PERSONAL_INFOS: 'Informations personnelles',
                SETTINGS: 'Préférences',
                ABOUT_ME: 'A propos de moi',
                EVENTS: 'Acivité récente',
                PUBLICATIONS: 'Publications',
                CONTRIBUTIONS: 'Contributions',
                FRIENDS: 'Collaborateurs'
            },
            PATH: {
                PERSONAL_INFOS: 'profile/personal-infos.html',
                SETTINGS: 'profile/fr/settings.html',
                ABOUT_ME: 'profile/fr/about-me.html',
                EVENTS: 'profile/fr/events.html',
                PUBLICATIONS: 'profile/fr/publications.html',
                CONTRIBUTIONS: 'profile/fr/contributions.html',
                FRIENDS: 'profile/fr/friends.html'
            },
            VISIBILITY: {
                LABEL : 'Visibilité de l\'information :',
                EVERYBODY: 'Public',
                FRIENDS: 'Amis uniquement',
                NOBODY: 'Moi uniquement'
            },
            CIVILITY: {
                MISTER : 'Monsieur',
                MISSUS : 'Madame'
            },
            INFOS: {
                CIVILITE : 'Civilité',
                TITRE : 'Titre professionnel',
                PRENOM : 'Prénom',
                NOM : 'Nom',
                ORGANISME : 'Organisme',
                METIER : 'Métier ou occupation',
                DOMAINE_RECHERCHE : 'Domaine de recherche',
                ADRESSE : 'Adresse postale',
                VILLE : 'Ville',
                CP : 'Code postal',
                SITE_PERSO : 'Adresse de site web',
                PAYS_ID : 'Pays',
                ETAT_ID : 'Etat (seulement aux USA)',
                MAIL_PRO : 'Adresse email professionnelle',
                MAIL : 'Adresse email de secours',
                TEL_PRO : 'Téléphone professionnel',
                TEL : 'Téléphone personnel',
                FAX : 'Fax'
            },
            SETTINGS: {
                ORCID : 'Identifiant ORCID',
                VIAF : 'Identifiant VIAF',
                MYIDREF : 'IdRef',
                LINKEDIN : 'Page Linkedin',
                VIDAEO : 'Identifiant Viadeo',
                LANGUE_MESSAGES : 'Langue d\'interface préférée'
            }
        }
    });
