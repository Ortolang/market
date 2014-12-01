'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.BROWSER_FR
 * @description
 * # BROWSER_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('BROWSER_FR', {
        BROWSER: {
            MY_WORKSPACES: 'Mes espaces',
            NEW: 'Nouveau',
            WORKSPACE: 'Espace de travail',
            COLLECTION: 'Dossier',
            INFORMATION: 'Informations',
            METADATA: 'Métadonnées',
            DESCRIPTION: 'Description',
            AUTHOR: 'Auteur',
            CREATION: 'Création',
            MODIFICATION: 'Modification',
            LAST_MODIFICATION: 'Dernière modification',
            CLOCK: 'Horloge',
            KEY: 'Clé',
            ELEMENT: '{{value}} élement{{value > 1 ? "s" : ""}}',
            VIEW_MODE_TILE: 'Mode grille',
            VIEW_MODE_LINE: 'Mode liste',
            SORT_BY: 'Trier par',
            FILTER: {
                FILTER: 'Filtrer',
                MIME_TYPE: 'Type Mime'
            },
            SORT: {
                TYPE_NAME: 'Type Ortolang',
                MIME_TYPE: 'Type Mime',
                DATE: 'Date'
            },
            PREVIEW: 'Visualiser',
            DELETE: 'Supprimer',
            UPLOAD: 'Importer',
            UPLOAD_FILES: 'Importer des fichiers',
            UPLOAD_FOLDER: 'Importer un dossier',
            NEW_COLLECTION: 'Nouveau dossier',
            CREATE_WORKSPACE: 'Créer un espace de travail',
            PUBLISH: 'Publier l\'espace de travail',
            PUBLISH_MODAL: {
                TITLE: 'Publication d\'un espace de travail',
                BODY: 'Êtes-vous sûr de vouloir publier l\'espace de travail "{{wsName}}" ?',
                SUBMIT: 'Publier'
            },
            VERSION: 'Versions de l\'espace de travail',
            BACK: 'Revenir',
            FORWARD: 'Avancer',
            TOGGLE_DROPDOWN: 'Menu déroulant',
            COPY_TO_CLIPBOARD: 'Copier'
        }
    });
