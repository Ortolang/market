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
            MEMBERS: 'Membres',
            UPLOAD: 'Importer',
            UPLOAD_QUEUE: 'Importation',
            EXTRACTION_QUEUE: 'Extraction',
            PROGRESS: 'Avancement',
            PATH: 'Chemin',
            STATUS: 'Status',
            CLEAR: 'Supprimer',
            CLEAR_ALL: 'Fermer',
            HIDE_QUEUE: 'Masquer',
            CANCEL_ALL: 'Annuler',
            PREVIEW_METADATA: 'Voir les métadonnées',
            ADD_METADATA: 'Ajouter une métadonnée',
            SNAPSHOT: 'Sauvegarder l\'état de l\'espace',
            PUBLISH: 'Soumettre à publication',
            NO_WORKSPACES: 'Vous n\'avez pas encore créé d\'espace de travail',
            HISTORY: 'Activité récente',
            MEMBERS_NUMBER: '<strong>{{number}} membre{{number > 1 ? "s" : ""}}</strong> dans le projet',
            PUBLISHED_VERSIONS: '<strong>{{number}} version{{number > 1 ? "s" : ""}} publiée{{number > 1 ? "s" : ""}}</strong>',
            TAGS: 'Versions',
            NO_TAGS: 'Pas de version publiée',
            CREATION_DATE: 'Créé le {{creationDate | date}} par {{author}}',
            LAST_MODIFICATION_DATE: 'Dernière modification',
            EXTERNAL_LINKS: 'Liens externes',
            MARKET_LINKS: 'Lien vers la dernière version publiée',
            CONTENT_LINKS: 'Liens vers le contenu',
            STATISTICS: 'Statistiques',
            ADVANCED_INFORMATION: 'Informations avancées',
            CREATE_PRESENTATION_METADATA_FIRST: 'Vous devez d\'abord créer les métadonées de présentation',
            CREATE_PRESENTATION_METADATA: 'Créer la fiche de métadonnées de présentation',
            EDIT_PRESENTATION_METADATA: 'Éditer la fiche de métadonnées de présentation',
            ADD_MEMBER: 'Ajouter un membre',
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
            DELETE_WORKSPACE_MODAL: {
                TITLE: 'Suppression d\'un espace de travail',
                BODY: '<strong class="text-danger">La suppression d\'un espace de travail est définitive</strong>. Êtes-vous sûr de vouloir supprimer l\'espace de travail <strong>"{{wsName}}"</strong> ?'
            },
            SNAPSHOT_MODAL: {
                TITLE: 'Sauvegarde de l\'état de l\'espace de travail',
                SUBMIT: 'Sauvegarder'
            },
            SNAPSHOT_ALERT: {
                TITLE: 'Sauvegarde',
                CONTENT: 'pas de changements effectués<br/>sur l\'espace de travail depuis la dernière sauvegarde'
            },
            ADD_COLLECTION_MODAL: {
                TITLE: 'Ajouter un nouveau dossier',
                SUBMIT: 'Ajouter'
            },
            RENAME_CHILD_MODAL: {
                TITLE: 'Renommer'
            },
            MOVE_CHILD_MODAL: {
                TITLE: 'Déplacer <strong>{{name}}</strong> vers...'
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Ajouter un membre à {{wsName}}',
                SEARCH: 'Rechercher un membre',
                SEARCH_RESULT: 'Résultats',
                NO_RESULT: 'Aucun membre trouvé',
                MY_FRIENDS: 'Mes collaborateurs',
                NO_FRIENDS: 'Pas de collaborateurs enregistrés',
                ADD: 'Ajouter',
                ADDED: 'Ajouté'
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
                BODY_PATH: 'Mauvais chemin \'{{path}}\'. Vous avez été redirigé vers le dossier racine de l\'espace de travail.',
                BODY_ROOT: 'Il n\'existe pas de version avec le nom \'{{root}}\'. Vous avez été redirigé vers la version actuelle de l\'espace de travail.',
                BODY_ALIAS: 'Il n\'existe pas d\'espace de travail avec l\'identifiant \'{{alias}}\' ou vous n\'êtes pas autorisé à acceder à ce workspace.'
            },
            QUEUE_LIMIT_MODAL: {
                TITLE: 'Limite d\'importation',
                BODY: 'Il n\'est pas possible d\'importer plus de <strong>50 fichiers à la fois</strong> par cette méthode : <ul><li>pour importer simultanément plus de 50 fichiers vous avez la possibilité <strong>d\'importer un zip</strong></li><li>pour importer de grande quantité de données vous avez également la faculté de vous connecter à votre workspace <strong>par FTP</strong></li></ul>'
            },
            DELETE_NON_EMPTY_FOLDER_ALERT: {
                TITLE: 'Erreur',
                CONTENT: 'Impossible de supprimer un dossier non vide'
            },
            METADATA_EDITOR: {
                MESSAGES: {
                    NOT_SET: 'Veuillez renseigner ce champs.',
                    NEED_ONE_VALUE: 'Veuillez spécifier au moins une valeur pour ce champs.'
                },
                BACK_TO_PREVIEW: 'Retourner à l\'aperçu',
                APPLY: 'Appliquer',
                BASIC_INFO: 'Informations générales',
                WHOS_INVOLVED: 'Personnes impliquées',
                DESCRIBE: 'Descriptif',
                LICENCE: 'Licence',
                SPECIFIC_FIELD: 'Champs spécifiques',
                NEXT_STEP: 'Continuer',
                LIST_OF_CONTRIBUTORS: 'Liste des contributeurs',
                LIST_OF_PRODUCERS: 'Liste des producteurs',
                ADD_CONTRIBUTOR: 'Ajouter ...',
                NEW_CONTRIBUTOR: 'Nouveau',
                EDIT_CONTRIBUTOR: 'Modifier',
                DELETE_CONTRIBUTOR: 'Supprimer',
                RESOURCE_TYPE: 'Catégorie de la ressource',
                RESOURCE_TITLE: 'Titre de la ressource',
                RESOURCE_DESCRIPTION: 'Description',
                RESOURCE_IMAGE: 'Illustration',
                WORD_COUNT: 'Nombre de mots',
                CREATION_LOCATIONS: 'Lieux de création de la ressource',
                NAVIGATION_LANGUAGES: 'Langues de navigation',
                PROGRAMMING_LANGUAGES: 'Language de programmation',
                OPERATING_SYSTEMS: 'Systèmes d\'exploitation',
                TOOL_SUPPORT: 'Type de support',
                LEXICON_INPUT_COUNT: 'Nombre d\'entrée dans le lexique',
                ADD_CONTRIBUTOR_MODAL: {
                    TITLE: '{{editing ? "Modifier" : "Ajouter"}} une personne contributrice',
                    SUBMIT: '{{editing ? "Modifier" : "Ajouter"}}',
                    SEARCH: 'Rechercher une personne ?',
                    SEARCH_LABEL: 'Rechercher',
                    FIRSTNAME: 'Prénom',
                    MIDNAME: 'Midname',
                    LASTNAME: 'Nom',
                    ORGANIZATION: 'Organisme',
                    ROLE: 'Role',
                    MESSAGES: {
                        EXISTS: 'Cette personne est déjà dans la liste.',
                        ROLE: 'Veuillez spécifier le role de cette peronne.'
                    }
                },
                ADD_ORGANIZATION_MODAL: {
                    TITLE: '{{editing ? "Modifier" : "Ajouter"}} un laboratoire contributeur',
                    SUBMIT: '{{editing ? "Modifier" : "Ajouter"}}',
                    SEARCH: 'Rechercher un organisme ?',
                    SEARCH_LABEL: 'Rechercher',
                    NAME: 'Nom',
                    CITY: 'Ville',
                    COUNTRY: 'Pays',
                    ACRONYM: 'Sigle',
                    HOMEPAGE: 'Site',
                    IMG: 'Logo',
                    MESSAGES: {
                        EXISTS: 'Cette organisme est déjà dans la liste.'
                    }
                },
                SELECT_TYPE: 'Sélectionnez le type de ressource ...',
                SELECT_CORPORA_TYPE: 'Sélectionnez le type de corpus ...',
                SELECT_CORPORA_STYLES: 'Sélectionnez un ou plusieurs genres ...',
                SELECT_CORPORA_LANGUAGE_TYPE: 'Sélectionnez le type de langue ...',
                SELECT_ANNOTATION_LEVELS: 'Sélectionnez un ou plusieurs niveaux d\'annotation ...',
                SELECT_CORPORA_FORMATS: 'Sélectionnez un ou plusieurs formats ...',
                SELECT_CORPORA_FILE_ENCODINGS: 'Sélectionnez un ou plusieurs encodages de caractères ...',
                SELECT_CORPORA_DATATYPES: 'Sélectionnez un ou plusieurs types de source ...',
                SELECT_LEXICON_INPUT_TYPE: 'Sélectionnez le type d\'entrée du lexique ...',
                SELECT_LEXICON_DESCRIPTION_TYPES: 'Sélectionnez un ou plusieurs type de description du lexique ...',
                SELECT_LEXICON_LANGUAGE_TYPE: 'Sélectionnez le type de langue ...',
                SELECT_LEXICON_FORMATS: 'Sélectionnez un ou plusieurs formats ...',
                SELECT_PROGRAMMING_LANGUAGES: 'Sélectionnez un ou plusieurs languages de programmation ...',
                SELECT_OPERATING_SYSTEMS: 'Sélectionnez un ou plusieurs systèmes d\'exploitation ...',
                SELECT_TOOL_SUPPORT: 'Sélectionnez un type de support ...',
                SELECT_TOOL_FUNCTIONALITIES: 'Sélectionnez une ou plusieurs fonctionnalités ...',
                SELECT_TOOL_INPUTDATA: 'Sélectionnez un ou plusieurs types d\'entrée ...',
                SELECT_TOOL_OUTPUTDATA: 'Sélectionnez un ou plusieurs types de sorties ...',
                SELECT_TOOL_FILE_ENCODINGS: 'Sélectionnez un ou plusieurs encodage de caractères ...'
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Remplir la fiche des métadonnées'
            }
        }
    });
