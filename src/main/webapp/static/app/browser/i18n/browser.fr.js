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
            AUTHOR: 'Auteur',
            CREATION: 'Création',
            MODIFICATION: 'Modification',
            LAST_MODIFICATION: 'Dernière modification',
            TARGET: 'Cible',
            CLOCK: 'Horloge',
            KEY: 'Clé',
            ELEMENT: '{{value}} élement{{value > 1 ? "s" : ""}}',
            ELEMENT_WITH_SIZE: '{{value}} élement{{value > 1 ? "s" : ""}}<br/>({{size | bytes}})',
            FULL_SIZE: '{{size.elementNumber}} élement{{elementNumber > 1 ? "s" : ""}}<br/>({{size.collectionNumber > 0 ? "au moins " : ""}}{{size.value | bytes}})',
            CALCULATE_SIZE: '(calculer)',
            VIEW_MODE_TILE: 'Mode grille',
            VIEW_MODE_LINE: 'Mode liste',
            SORT_BY: 'Trier par',
            TILE_COLLECTION: 'Dossiers',
            TILE_OBJECT: 'Fichiers',
            FILTER: {
                FILTER: 'Filtrer',
                MIME_TYPE: 'Type Mime'
            },
            SORT: {
                MIME_TYPE: 'Type Mime',
                DATE: 'Date de modification'
            },
            INFO: '{{hideInfo === "true" ? "Afficher" : "Masquer"}} les détails',
            BACK_TO_DASHBOARD: 'Retourner au tableau de bord',
            WORKSPACE_LIST: '{{hideWorkspaceList === "true" ? "Afficher" : "Masquer"}} la liste des espaces de travail',
            SETTINGS: 'Paramètres',
            OTHERS: 'Autres actions',
            PREVIEW: 'Visualiser',
            DELETE: 'Supprimer',
            MOVE: 'Déplacer vers...',
            ADD_TO_CART: 'Ajouter à ma sélection',
            UPLOAD: 'Importer',
            UPLOAD_FILES: 'Importer des fichiers',
            UPLOAD_ZIP: 'Importer un zip',
            UPLOAD_FOLDER: 'Importer un dossier',
            NEW_COLLECTION: 'Nouveau dossier',
            NEW_LINK: 'Nouveau lien',
            PREVIEW_WORKSPACE: 'Aperçu avant publication',
            VERSION: 'Version {{tag.replace("v", "")}}',
            SNAPSHOT: 'Instantané {{name}}',
            TAG: '{{tag.replace("v", "Version ")}}',
            VERSIONS: 'Versions de l\'espace de travail',
            HEAD: 'Version actuelle',
            PREVIOUS_VERSIONS: 'Versions précédentes',
            BACK: 'Revenir',
            FORWARD: 'Avancer',
            TOGGLE_DROPDOWN: 'Menu déroulant',
            NO_PREVIOUS_VERSIONS: 'Pas de version encore crée',
            TOOLS: 'Outils',
            DRAFT: 'Non publié',
            PUBLISHED: 'Publié',
            CREATED: '{{author}} a créé',
            VISIBILITY: 'Visibilité',
            LIST_CONTENT: 'Lister le contenu',
            LIST_CONTENT_MODAL: {
                TITLE: 'Contenu de l\'espace de travail /',
                COPY: 'Copier la liste'
            },
            SHORTCUTS: {
                SHORTCUTS: 'Raccourcis clavier',
                SHOW_SHORTCUTS: 'Afficher la liste des raccourcis clavier',
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
            NO_PREVIEW: 'Aucun aperçu n\'est disponible pour ce type de fichier',
            WORKSPACE_KEY: 'Copier la clé du workspace',
            BEARER_TOKEN: 'Copier le token',
            SEE_ALL: 'Voir tous les fichiers',
            NO_CHILDREN: 'Ce dossier est vide<br/><small>Faites glisser et déposez des fichiers dans cette fenêtre ou cliquez sur le bouton <span class="glyphicon glyphicon-plus"></span></small>',
            NO_CHILDREN_MOBILE: 'Ce dossier est vide',
            NO_CHILDREN_MOBILE_BUTTON: '<span class="glyphicon glyphicon-plus"></span> Ajouter des fichiers',
            NO_CHILDREN_NOT_HEAD: 'Ce dossier est vide',
            NO_FILTERED_CHILDREN: 'Pas d\'éléments correspondants',
            MORE_MD: 'Voir toutes les métadonnées',
            SEE_MD: 'Voir les métadonnées',
            PIDS: {
                PIDS: 'Identifiants pérennes',
                STATIC: 'Identifiant pérenne statique',
                STATIC_HELP: 'L\'identifiant pérenne statique pointera vers cette version du {{::type === "object" ? "fichier" : "dossier"}} <strong>{{::name}}</strong>.',
                STATIC_ITEM_HELP: 'Identifiant pérenne statique (pointera vers cette version de la ressource)',
                DYNAMIC: 'Identifiant pérenne dynamique',
                DYNAMIC_HELP: 'L\'identifiant pérenne dynamique pointera toujours vers la dernière version du {{::type === "object" ? "fichier" : "dossier"}} <strong>{{::name}}</strong> si une nouvelle version de la ressource est publiée.',
                DYNAMIC_ITEM_HELP: 'Identifiant pérenne dynamique (pointera toujours vers la dernière version publiée de la ressource)',
                COPY: 'Copier le lien',
                OTHERS: 'Autres identifiants pérenne'
            },
            CART: {
                REMOVED_ELEMENT_ALERT: '<strong>Un élément</strong> de votre sélection a été remplacé par le dossier <strong>{{collection}}</strong> qui inclus cet élément',
                REMOVED_ELEMENTS_ALERT: '<strong>{{delta}} éléments</strong> de votre sélection ont été remplacés par le dossier <strong>{{collection}}</strong> qui inclus ces éléments',
                ALREADY_SELECTED_ALERT: 'Le {{type === "collection" ? "dossier" : "fichier"}} <strong>{{name}}</strong> fait déjà parti de votre sélection',
                ALREADY_INCLUDED_ALERT: 'Le {{type === "collection" ? "dossier" : "fichier"}} <strong>{{name}}</strong> fait déjà parti de votre sélection car il est inclus dans le dossier <strong>{{collection}}</strong>'
            },
            METADATA_MODAL: {
                TITLE: 'Métadonnées'
            },
            AUDIO: {
                SAMPLE_RATE: 'Échantillonnage',
                DURATION: 'Durée'
            },
            IMAGE: {
                SIZE: 'Taille'
            },
            VIDEO: {
                SIZE: 'Résolution',
                DURATION: 'Durée'
            },
            XML: {
                FORMAT: 'Format',
                SPEAKER_NUMBER: 'Locuteurs',
                SPEECH_TIME: 'Temps de parole'
            },
            PDF: {
                VERSION: 'Version PDF',
                PAGES: 'Page(s)'
            },
            COMMON: {
                ENCODING: 'Encodage',
                TITLE: 'Titre',
                WORDS: 'Mots'
            },
            METADATA_EDITOR: {
                TITLE: 'Editer les métadonnées de <strong>{{elementName}}</strong>',
                CONVERT_XML_JSON: 'Charger à partir d\'un fichier XML',
                ADD_DC_ELEMENT: 'Ajouter un élément Dublin Core',
                ADD_OLAC_ELEMENT: 'Ajouter un élément OLAC'
            }
        }
    });
