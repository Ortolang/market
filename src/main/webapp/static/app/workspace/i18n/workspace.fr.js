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
            }
        }
    });
