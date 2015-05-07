'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WORKSPACE_FR
 * @description
 * # WORKSPACE_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('WORKSPACE_FR', {
        WORKSPACE: {
            WORKSPACE: 'Workspace',
            ALIAS: 'Identifiant',
            UPLOAD: 'Importer',
            UPLOAD_QUEUE: 'Importation',
            PROGRESS: 'Avancement',
            PATH: 'Chemin',
            STATUS: 'Status',
            CLEAR: 'Supprimer',
            UPLOAD_ALL: 'Tout importer',
            CLEAR_ALL: 'Tout supprimer',
            CANCEL_ALL: 'Tout annuler',
            ADD_METADATA: 'Ajouter une métadonnée',
            CREATE_WORKSPACE_MODAL: {
                TITLE: 'Créer un espace de travail',
                AUTO_GENERATED: 'Générer automatiquement l\'identifiant',
                MESSAGES: {
                    AVAILABILITY: 'Identifiant déjà utilisé',
                    MIN_LENGTH: 'L\'identifiant doit contenir au minimum 3 caractères'
                },
                HELP: {
                    ALIAS: 'L\'identifiant est unique et ne pourra plus être modifié par la suite'
                },
                SUBMIT: 'Créer'
            },
            PUBLISH_MODAL: {
                TITLE: 'Publication d\'un espace de travail',
                BODY: 'Êtes-vous sûr de vouloir publier l\'espace de travail "{{wsName}}" ?',
                SUBMIT: 'Publier'
            },
            SNAPSHOT_MODAL: {
                TITLE: 'Sauvegarde de l\'état de l\'espace de travail',
                SUBMIT: 'Sauvegarder'
            },
            ADD_COLLECTION_MODAL: {
                TITLE: 'Ajouter un nouveau dossier',
                SUBMIT: 'Ajouter'
            },
            EDIT_DESCRIPTION_MODAL: {
                TITLE: 'Éditer la description de {{name}}',
                SUBMIT: 'Éditer'
            },
            WORKSPACE_MEMBERS_MODAL: {
                TITLE: 'Membres de {{name}}'
            },
            UPLOAD_ZIP_MODAL: {
                TITLE: 'Importer un zip',
                SUBMIT: 'Importer',
                ZIP_FILE: 'Fichier zip',
                ROOT: 'Dossier',
                ROOT_HELP: 'Nom du dossier dans lequel décompresser l\'archive zip.<br/>Laisser vide pour décompresser dans le dossier actuel : "{{wsName}}{{path === "/" ? "" : path}}/"',
                ROOT_HELP_FILLED: 'Le zip sera décompressé dans "{{wsName}}{{path === "/" ? "" : path}}/{{root}}"',
                OVERWRITE: 'Remplacer en cas de fichiers existants'
            },
            UPLOAD_ZIP_COMPLETED_MODAL: {
                TITLE: 'Importation du contenu du Zip en cours',
                BODY: 'Le contenu de l\'archive "{{archiveName}}" est en train d\'être importé dans l\'espace de travail "{{wsName}}".',
                SHOW_LOG: 'Voir la progression',
                BACKGROUND_PROCESSING: 'Mettre en arrière plan'
            },
            PROCESS_NAMES: {
                IMPORT_ZIP: 'Importation de "{{zipName}}" dans l\'espace de travail "{{wsName}}"'
            },
            SEARCH_ERROR_MODAL: {
                TITLE: 'Erreur',
                BODY_PATH: '',
                BODY_ALIAS: 'Il n\'existe pas d\'espace de travail avec l\'identifiant \'{{alias}}\' ou vous n\'êtes pas autorisé à acceder à ce workspace.'
            }
        }
    });
