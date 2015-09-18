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
        SELECT: 'Selectionner',
        CANCEL: 'Annuler',
        CREATE: 'Créer',
        SUBMIT: 'Valider',
        ADD: 'Ajouter',
        NAME: 'Nom',
        RENAME: 'Renommer',
        DESCRIPTION: 'Description',
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
        TOOLS: 'Outils',
        INTEGRATED_PROJECTS: 'Projets Intégrés',
        PRODUCERS: 'Institutions productrices',
        SELECT_WORKSPACE_ELEMENT: 'Selectionner un élément',
        PENDING_DATA: 'Chargement...',
        CART: 'Sélection',
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
        UNEXPECTED_ERROR_ALERT: {
            TITLE: 'Erreur',
            CONTENT: 'Une erreur inattendue s\'est produite'
        },
        ROLES: {
            DEVELOPER: 'Responsable technique',
            MANAGER: 'Responsable informatique',
            DESIGNER: 'Concepteur',
            RESEARCHER: 'Responsable scientifique',
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
        }

    });
