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
            NO_DESCRIPTION_PROVIDED: 'Ajouter une description',
            AUTHOR: 'Auteur',
            CREATION: 'Création',
            MODIFICATION: 'Modification',
            LAST_MODIFICATION: 'Dernière modification',
            CLOCK: 'Horloge',
            KEY: 'Clé',
            ELEMENT: '{{value}} élement{{value > 1 ? "s" : ""}}',
            ELEMENT_WITH_SIZE: '{{value}} élement{{value > 1 ? "s" : ""}}<br/>({{size | bytes}})',
            FULL_SIZE: '{{size.elementNumber}} élement{{elementNumber > 1 ? "s" : ""}}<br/>({{size.collectionNumber > 0 ? "au moins " : ""}}{{size.value | bytes}})',
            CALCULATE_SIZE: '(calculer)',
            VIEW_MODE_TILE: 'Mode grille',
            VIEW_MODE_LINE: 'Mode liste',
            SORT_BY: 'Trier par',
            FILTER: {
                FILTER: 'Filtrer',
                MIME_TYPE: 'Type Mime'
            },
            SORT: {
                TYPE_NAME: 'Type ORTOLANG',
                MIME_TYPE: 'Type Mime',
                DATE: 'Date'
            },
            INFO: '{{hideInfo ? "Afficher" : "Masquer"}} les détails',
            WORKSPACE_LIST: '{{hideWorkspaceList ? "Afficher" : "Masquer"}} la liste des espaces de travail',
            SETTINGS: 'Paramètres',
            PREVIEW: 'Visualiser',
            DELETE: 'Supprimer',
            UPLOAD: 'Importer',
            UPLOAD_FILES: 'Importer des fichiers',
            UPLOAD_ZIP: 'Importer un zip',
            UPLOAD_FOLDER: 'Importer un dossier',
            NEW_COLLECTION: 'Nouveau dossier',
            PREVIEW_WORKSPACE: 'Aperçu avant publication',
            VERSION: 'Versions de l\'espace de travail',
            HEAD: 'Version actuelle',
            PREVIOUS_VERSIONS: 'Versions précédentes',
            BACK: 'Revenir',
            FORWARD: 'Avancer',
            TOGGLE_DROPDOWN: 'Menu déroulant',
            COPY_TO_CLIPBOARD: 'Copier',
            HISTORY: 'Historique',
            NO_PREVIOUS_VERSIONS: 'Pas de version encore crée',
            TOOLS: 'Outils',
            CREATE_PRESENTATION_METADATA_FIRST: 'Vous devez d\'abord créer les métadonées de présentation',
            CREATE_PRESENTATION_METADATA: 'Créer les métadonées de présentation',
            EDIT_PRESENTATION_METADATA: 'Éditer les métadonées de présentation',
            DRAFT: 'Non publié',
            PUBLISHED: 'Publié',
            CREATED: '{{author}} a créé',
            SHORTCUTS: {
                SHORTCUTS: 'Raccourcis clavier',
                FILTER: 'Filtrer les éléments',
                UP: 'Naviguer vers le haut',
                DOWN: 'Naviguer vers le bas',
                BACKSPACE: 'Revenir en arrière',
                VIEW_MODE: 'Changer de mode de vue (liste/grille)',
                SELECT_ALL: 'Tout selectionner',
                ENTER: 'Visualiser / Ouvrir le dossier',
                NEW_COLLECTION: 'Nouveau dossier',
                DELETE: 'Supprimer les éléments sélectionnés',
                INFO: 'Afficher / Masquer les détails',
                WORKSPACE_LIST: 'Afficher / Masquer la liste des espaces de travail'
            },
            WORKSPACE_KEY: 'Copier la clé du workspace',
            BEARER_TOKEN: 'Copier le token'
        }
    });
