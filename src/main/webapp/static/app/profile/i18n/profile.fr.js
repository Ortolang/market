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
            EMPTY: 'non renseigné',
            NAV: {
                PERSONAL_INFOS: 'Informations personnelles',
                SETTINGS: 'Préférences',
                ABOUT_ME: 'A propos de moi',
                IDENTIFIERS: 'Identifiants externes',
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
                LABEL: 'Visibilité de l\'information :',
                EVERYBODY: 'Public',
                FRIENDS: 'Amis uniquement',
                NOBODY: 'Moi uniquement'
            },
            CIVILITY: {
                MISTER: 'Monsieur',
                MISSUS: 'Madame'
            },
            FIELDS: {
                CIVILITY: 'Civilité',
                TITLE: 'Titre professionnel',
                GIVEN_NAME: 'Prénom',
                FAMILY_NAME: 'Nom',
                ORGANISATION: 'Organisme',
                JOB: 'Métier ou occupation',
                FIELD_OF_RESEARCH: 'Domaine de recherche',
                ADDRESS: 'Adresse',
                ADDRESS_ERROR: 'Veuillez selectionner une adresse parmi les propositions',
                WEBSITE: 'Site web',
                EMAIL: 'E-mail professionnel',
                RESCUE_EMAIL: 'E-mail de secours',
                PROFESSIONAL_TEL: 'Téléphone professionnel',
                TEL: 'Téléphone personnel',
                FAX: 'Fax',
                PRESENTATION: 'Décrivez-vous en quelques mots',
                ORCID: 'Identifiant ORCID',
                VIAF: 'Identifiant VIAF',
                MYIDREF: 'IdRef',
                LINKEDIN: 'Page Linkedin',
                VIADEO: 'Identifiant Viadeo',
                LANGUAGE: 'Langue d\'interface préférée'
            },
            HELPER: {
                TITLE: 'Titre professionnel : Dr., Prof. etc.',
                ORCID: 'Identifiant personnel pérenne : <a href="http://orcid.org/" target="_blank">http://orcid.org/</a>',
                VIAF: 'Identifiant personnel pérenne : <a href="http://viaf.org/viaf/" target="_blank">http://viaf.org/viaf/</a>',
                MYIDREF: 'Identifiant personnel pérenne : <a href="http://www.idref.fr/" target="_blank">http://www.idref.fr/</a>',
                LINKEDIN: 'Identifiant personnel pérenne : <a href="http://www.linkedin.com/" target="_blank">http://www.linkedin.com/</a>',
                VIADEO: 'Identifiant personnel pérenne : <a href="http://www.viadeo.com/profile/" target="_blank">http://www.viadeo.com/profile/</a>'
            },
            EDIT_AVATAR_MODAL: {
                TITLE: 'Comment changer son avatar ?',
                BODY_START: 'ORTOLANG utilise votre Gravatar comme image de profil :',
                BODY_END: '<i>Votre adresse email sur ORTOLANG est <code>{{email}}</code></i>',
                NO_GRAVATAR: '<b>Vous n\'avez pas de Gravatar :</b> une image aléatoire unique est utilisée. Pour utiliser votre propre avatar ou photo, vous devez simplement <a href="https://fr.gravatar.com/" target="_blank">créer un compte Gravatar</a>. Retrouvez plus d\'explications dans cet <a href="http://www.calliframe.com/comment-creer-gravatar/" target="_blank">article.</a>',
                GRAVATAR: '<b>Vous avez déjà un compte Gravatar :</b> il vous suffit de <a href="https://fr.gravatar.com/emails" target="_blank">modifier l\'avatar lié à votre adresse email</a>'
            }
        }
    });
