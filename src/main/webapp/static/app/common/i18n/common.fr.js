'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.COMMON_FR
 * @description
 * # COMMON_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('COMMON_FR', {
        CLOSE: 'Fermer',
        EXIT_WITHOUT_SAVE: 'Quitter sans sauvegarder',
        SELECT: 'Sélectionner',
        CANCEL: 'Annuler',
        CREATE: 'Créer',
        SUBMIT: 'Valider',
        EDIT: 'Éditer',
        ADD: 'Ajouter',
        COPY: 'Copier',
        COPY_TO_CLIPBOARD: 'Copier',
        SAVE: 'Enregistrer',
        DELETE: 'Supprimer',
        CLEAR: 'Réinitialiser',
        NAME: 'Nom',
        RENAME: 'Renommer',
        DESCRIPTION: 'Description',
        INFORMATION: 'Informations',
        TYPE: 'Type',
        ACTIONS: 'Actions',
        RESULT: 'Résultat',
        SIZE: 'Taille',
        SEARCH: 'Rechercher',
        LOG_IN: 'Connexion',
        NO_IMAGE_PROVIDED: 'Pas d\'image disponible',
        DOWNLOAD: 'Télécharger',
        START: 'Début',
        STOP: 'Fin',
        ORTOLANG: 'Outils et Ressources pour un Traitement Optimisé de la LANGue',
        CORPORA: 'Corpus',
        LEXICONS: 'Lexiques',
        TERMINOLOGIES: 'Terminologies',
        TOOLS: 'Outils',
        INTEGRATED_PROJECTS: 'Projets Intégrés',
        PRODUCERS: 'Institutions productrices',
        SELECT_WORKSPACE_ELEMENT: 'Sélectionner un élément',
        PENDING: 'En cours',
        PENDING_DATA: 'Chargement...',
        CART: 'Sélection',
        SEE_MORE: 'Voir plus',
        SHARE: 'Partager',
        CONTACT: 'Contacter',
        YES: 'Oui',
        NO: 'Non',
        TEXT: 'Texte',
        LEGEND: 'Légende',
        NEWS: 'Actualités',
        STATISTICS: 'Statistiques',
        404: {
            TITLE: 'Page non trouvée',
            BODY: 'Désolé, mais la page que vous recherchez est introuvable. Vous devriez peut être essayé de retourner sur la page d\'accueuil.',
            BUTTON: 'Page d\'accueil'
        },
        SERVER_DOWN_MODAL: {
            TITLE: 'Le serveur semble momentanément indisponible',
            BODY: '<p>Il semblerait que le serveur soit momentanément indisponible et vous ne pourrez donc pas accéder aux ressources.</p><p>Vous devriez tenter de rafraichir la page et si jamais l\'erreur persiste veuillez nous contacter <a href="mailto:contact@ortolang.fr">contact@ortolang.fr</a>.</p>',
            BUTTON: 'Rafraichir la page'
        },
        UNAUTHENTICATED_MODAL: {
            TITLE: 'Accès refusé',
            BODY: 'Vous ne disposez pas des permissions nécessaires pour voir le contenu de ce fichier/dossier ou de cette page : veuillez vous authentifier.'
        },
        UNAUTHORIZED_MODAL: {
            TITLE: 'Accès refusé',
            BODY: 'Vous ne disposez pas des permissions nécessaires pour voir le contenu de ce fichier/dossier ou de cette page.'
        },
        UNEXPECTED_ERROR_ALERT: {
            TITLE: 'Erreur',
            CONTENT: 'Une erreur inattendue s\'est produite'
        },
        ROLES: {
            DEVELOPER: 'Développeur',
            CHIEF_DEVELOPER: 'Responsable technique',
            MANAGER: 'Responsable informatique',
            IT_MANAGER: 'Responsable informatique',
            DESIGNER: 'Concepteur',
            RESEARCHER: 'Responsable scientifique',
            SCIENTIFIC_DIRECTOR: 'Responsable scientifique',
            AUTHOR: 'Auteur',
            ANNOTATOR: 'Annotateur',
            COMPILER: 'Compilateur',
            CONSULTANT: 'Consultant',
            DATA_INPUTTER: 'Gestionnaire de données',
            DEPOSITOR: 'Déposant',
            EDITOR: 'Relecteur',
            ILLUSTRATOR: 'Illustrateur',
            INTERPRETER: 'Interprète',
            INTERVIEWER: 'Interviewer',
            PARTICIPANT: 'Participant',
            PERFORMER: 'Intervenant',
            PHOTOGRAPHER: 'Preneur de vues',
            RECORDER: 'Opérateur',
            RESEARCH_PARTICIPANT: 'Sujet',
            RESPONDER: 'Répondant',
            SIGNER: 'Signeur',
            SINGER: 'Chanteur',
            SPEAKER: 'Locuteur',
            SPONSOR: 'Soutien financier',
            TRANSCRIBER: 'Transcripteur',
            TRANSLATOR: 'Traducteur'
        },
        LANGUAGES: {
            FR: 'Français',
            EN: 'Anglais',
            ES: 'Espagnol',
            ZH: 'Chinois'
        },
        MULTILINGUAL_TEXTFIELD: {
            LANGUAGE: 'Langue',
            SELECT_LANGUAGE: 'Selectionner une langue ...'
        },
        COOKIE_CONSENT: {
            TITLE: 'Ce site internet utilise des cookies :',
            BODY: 'en poursuivant votre navigation sur ce site, vous acceptez l\'utilisation de cookies afin de réaliser des statistiques d\'audiences anonymes. Vous avez la possibilité de vous y opposer en cliquant sur "{{"COOKIE_CONSENT.MORE" | translate}}".',
            ACCEPT: 'J\'accepte',
            MORE: 'En savoir plus'
        },
        ERROR_MODAL_: {
            TITLE: 'Erreur',
            BODY: 'Une erreur inattendue s\'est produite'
        },
        ERROR_MODAL_1: {
            TITLE: 'Le chemin d\'accès spécifié n\'existe pas',
            BODY: 'Le chemin <strong>{{::path}}</strong> n\'existe pas. Vous avez été redirigé vers le dossier racine de l\'espace de travail.'
        },
        ERROR_MODAL_5: {
            TITLE: 'Le chemin d\'accès spécifié n\'existe pas',
            BODY: 'Il n\'existe pas de version avec le nom <strong>{{root}}</strong>. Vous avez été redirigé vers la version actuelle de l\'espace de travail.'
        },
        ERROR_MODAL_6: {
            TITLE: 'Erreur',
            BODY: 'Il n\'existe pas d\'espace de travail avec l\'alias <strong>{{alias}}</strong> ou vous n\'êtes pas autorisé à accéder à ce workspace.'
        },
        ERROR_MODAL_9: {
            TITLE: 'Métadonnées invalide',
            BODY: 'Les métadonnées envoyées au serveur ne sont pas valide.'
        }
    });
