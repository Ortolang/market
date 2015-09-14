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
            PROGRESS: 'Avancement',
            PATH: 'Chemin',
            STATUS: 'Status',
            CLEAR: 'Supprimer',
            CLEAR_ALL: 'Fermer',
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
                BASIC_INFO: 'Informations générales',
                WHOS_INVOLVED: 'Personnes impliquées',
                DESCRIBE: 'Descriptif',
                LICENCE: 'Licence',
                NEXT_STEP: 'Continuer',
                LIST_OF_CONTRIBUTORS: 'Liste des contributeurs',
                LIST_OF_PRODUCERS: 'Liste des producteurs',
                ADD_CONTRIBUTOR: 'Ajouter ...',
                NEW_CONTRIBUTOR: 'Nouveau',
                EDIT_CONTRIBUTOR: 'Modifier',
                DELETE_CONTRIBUTOR: 'Supprimer',
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
                }
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Remplir la fiche des métadonnées'
            }
        }
    });
