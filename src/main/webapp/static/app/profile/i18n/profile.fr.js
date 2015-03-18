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
                EVENTS: 'Activité récente',
                PUBLICATIONS: 'Publications',
                CONTRIBUTIONS: 'Contributions',
                FRIENDS: 'Collaborateurs'
            },
            PATH: {
                PERSONAL_INFOS: 'profile/personal-infos.html',
                SETTINGS: 'profile/settings.html',
                ABOUT_ME: 'profile/about-me.html',
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
                FAX : 'Fax',
                HELPER : {
                    TITRE : 'Titre professionnel : Dr., Prof. etc.'
                }
            },
            ABOUT_ME : {
                PRESENTATION: 'Décrivez-vous en quelques mots'
            },
            SETTINGS: {
                AVATAR : 'Avatar',
                ORCID : 'Identifiant ORCID',
                VIAF : 'Identifiant VIAF',
                MYIDREF : 'IdRef',
                LINKEDIN : 'Page Linkedin',
                VIADEO : 'Identifiant Viadeo',
                LANGUE_MESSAGES : 'Langue d\'interface préférée',
                FACEBOOK : 'Identifiant Facebook',
                GITHUB : 'Identifiant Github',
                GRAVATAR : 'Identifiant Gravatar',
                HELPER : {
                    ORCID : 'Identifiant personnel pérenne : <a href="http://orcid.org/" target="_blank">http://orcid.org/</a>',
                    VIAF : 'Identifiant personnel pérenne : <a href="http://viaf.org/viaf/" target="_blank">http://viaf.org/viaf/</a>',
                    MYIDREF : 'Identifiant personnel pérenne : <a href="http://www.idref.fr/" target="_blank">http://www.idref.fr/</a>',
                    LINKEDIN : 'Identifiant personnel pérenne : <a href="http://www.linkedin.com/" target="_blank">http://www.linkedin.com/</a>',
                    VIADEO : 'Identifiant personnel pérenne : <a href="http://www.viadeo.com/profile/" target="_blank">http://www.viadeo.com/profile/</a>',
                    FACEBOOK : 'Pour obtenir votre identifiant facebook, visitez ce lien : <a href="http://findmyfacebookid.com/" target="_blank">http://findmyfacebookid.com/</a>.',
                    GRAVATAR : 'Adresse email liée à votre compte gravatar : <a href="https://fr.gravatar.com/" target="_blank">https://fr.gravatar.com/</a>.'
                }
            }
        }
    });
