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
            ALIAS: 'Alias',
            CONTENT: 'Contenu',
            METADATA: 'Métadonnées',
            PERMISSIONS: 'Visibilité',
            PREVIEW: 'Prévisualisation',
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
            MEMBERS_NUMBER: '<strong>{{number}} membre{{number > 1 ? "s" : ""}}</strong> dans ce projet',
            MEMBERS_LIST: 'Membres de l\'espace de travail',
            OWNER: 'Propriétaire de l\'espace de travail',
            PUBLISHED_VERSIONS: '<strong>{{number}} version{{number > 1 ? "s" : ""}} publiée{{number > 1 ? "s" : ""}}</strong>',
            TAGS: 'Versions',
            NO_TAGS: 'Pas de version publiée',
            CREATED: 'Créé le {{creationDate | date}}',
            CREATION_DATE: 'Créé le {{creationDate | date}} par {{author}}',
            LAST_MODIFICATION_DATE: 'Dernière modification',
            ACCESS_LINKS: 'Accès',
            WORKFLOW: 'Demandes de publication',
            NO_WORKFLOW: 'Il n\'y a pas de demande de publication en cours concernant cet espace de travail',
            ACTIONS: 'Actions',
            DELETE_WORKSPACE: 'Supprimer l\'espace de travail',
            MARKET_LINKS: 'Lien vers la dernière version publiée',
            CONTENT_LINKS: 'Liens vers le contenu',
            STATISTICS: 'Statistiques',
            ADVANCED_INFORMATION: 'Informations avancées',
            CREATE_PRESENTATION_METADATA_FIRST: 'Vous devez d\'abord créer les métadonées de présentation',
            CREATE_PRESENTATION_METADATA: 'Créer les métadonnées',
            EDIT_PRESENTATION_METADATA: 'Éditer les métadonnées',
            ADD_MEMBER: 'Ajouter un membre',
            CREATE_WORKSPACE: 'Créer un espace de travail',
            NO_METATDATA: 'Les métadonnées ne sont pas encore renseignées.',
            GO_TO_METATDATA: 'Allez à la page des métadonnées.',
            CREATE_WORKSPACE_MODAL: {
                TITLE: 'Création d\'un espace de travail',
                AUTO_GENERATED: 'Générer automatiquement l\'alias',
                POLICY: 'Je déclare avoir pris connaissance et accepter sans réserves <a href="/information/policy" target="_blank">la charte ORTOLANG</a>',
                MESSAGES: {
                    AVAILABILITY: 'Alias déjà utilisé',
                    MIN_LENGTH: 'L\'alias doit contenir au minimum 3 caractères',
                    CONSENT: 'Vous devez accepter la charte ORTOLANG'
                },
                HELP: {
                    ALIAS: 'L\'alias est unique et apparaîtra dans les URLs menant à votre espace de travail. Il ne pourra plus être modifié par la suite.',
                    POLICY: 'La création d\'un espace de travail doit avoir pour objectif la publication des ressources qui y seront déposées. Tout espace qui n\'aura pas publié tout ou partie de son contenu à l\'issue d\'une période de 6 mois (sauf motivation particulière) pourra être fermé par les administrateurs de la plate-forme.'
                },
                SUBMIT: 'Créer'
            },
            PUBLISH_MODAL: {
                TITLE: 'Demande de publication',
                BODY: 'Vous allez soumettre l\'espace de travail "{{wsName}}" à publication :',
                CONTENT: 'Je reconnais être responsable des contenus que je publie et posséder toutes les autorisations, consentements et droits qui me permettent de publier ces contenus',
                POLICY: 'Je déclare avoir pris connaissance et accepter sans réserves <a href="/information/policy" target="_blank">la charte ORTOLANG</a>',
                MESSAGES: {
                    CONTENT: 'Vous devez cocher cette case',
                    POLICY: 'Vous devez accepter la charte ORTOLANG'
                }
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
                BODY_ALIAS: 'Il n\'existe pas d\'espace de travail avec l\'alias \'{{alias}}\' ou vous n\'êtes pas autorisé à acceder à ce workspace.'
            },
            QUEUE_LIMIT_MODAL: {
                TITLE: 'Limite d\'importation',
                BODY: 'Il n\'est pas possible d\'importer plus de <strong>50 fichiers à la fois</strong> par cette méthode : <ul><li>pour importer simultanément plus de 50 fichiers vous avez la possibilité <strong>d\'importer un zip</strong></li><li>pour importer de grande quantité de données vous avez également la faculté de vous connecter à votre workspace <strong>par FTP</strong></li></ul>'
            },
            READ_ONLY_MODE: '<strong>Espace de travail en lecture seule:</strong> certaines propriétés tels que le contenu, les métadonnées et les permissions ne sont pas éditables.',
            HOLDER_EDITOR_MODAL: {
                TITLE: 'Création de logo',
                TEXT: 'Texte',
                SIZE: 'Taille du texte',
                FOREGROUND: 'Couleur du texte',
                BACKGROUND: 'Couleur de fond',
                BOLD: 'Texte gras',
                SUBMIT: 'Créer'
            },
            DELETE_NON_EMPTY_FOLDER_ALERT: {
                TITLE: 'Erreur',
                CONTENT: 'Impossible de supprimer un dossier non vide'
            },
            METADATA_EDITOR: {
                MESSAGES: {
                    TITLE_NOT_SET: 'Veuillez renseigner le titre.',
                    TYPE_NOT_SET: 'Veuillez renseigner la catéorie.',
                    DESCRIPTION_NOT_SET: 'Veuillez renseigner la description.',
                    NOT_SET: 'Veuillez renseigner ce champs.',
                    NEED_ONE_VALUE: 'Veuillez spécifier au moins une valeur pour ce champs.'
                },
                BACK_TO_PREVIEW: 'Retourner à l\'aperçu',
                APPLY: 'Appliquer',
                BASIC_INFO: 'Informations générales',
                WHOS_INVOLVED: 'Personnes impliquées',
                DESCRIBE: 'Descriptif',
                LICENCE: 'Licence',
                LICENCE_WEBSITE: 'Page web de la Licence',
                SPECIFIC_FIELD: 'Champs spécifiques',
                ADDITIONAL_INFO: 'Informations complémentaires',
                MANDATORY_FIELD: 'Champ obligatoire',
                NEXT_STEP: 'Continuer',
                LIST_OF_CONTRIBUTORS: 'Liste des contributeurs',
                LIST_OF_PRODUCERS: 'Liste des producteurs',
                ADD_PERSON: 'Ajouter une personne',
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
                PROGRAMMING_LANGUAGES: 'Langage de programmation',
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
                        ROLE: 'Veuillez spécifier le rôle de cette personne.'
                    }
                },
                ADD_ORGANIZATION_MODAL: {
                    TITLE: '{{editing ? "Modifier" : "Ajouter"}} un laboratoire producteur',
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
                        EXISTS: 'Ce laboratoire est déjà dans la liste.',
                        UNDEFINED: 'Le nom du laboratoire n\'est pas spécifié.'
                    }
                },
                ADD_LICENCE_MODAL: {
                    TITLE: 'Ajouter une licence particulière',
                    LABEL: 'Donnez un nom à cette licence'
                },
                ERROR_MESSAGES_MODAL: {
                    TITLE: 'Erreur dans les métadonnées'
                },
                SELECT_TITLE: 'Spécifiez un titre pour la ressource',
                SELECT_DESCRIPTION: 'Décrivez ici la ressource...\n\nIndiquez dans quel contexte la ressource a été créée...',
                SELECT_LOGO: 'Sélectionnez une image',
                SELECT_TYPE: 'Sélectionnez le type de ressource ...',
                SELECT_ROLE: 'Sélectionnez son role ...',
                SELECT_KEYWORD: 'Ajouter un mot-clé.',
                SELECT_CONDITIONS_OF_USE: 'Conditions d\'utilisation spécifiques',
                SELECT_CORPORA_TYPE: 'Sélectionnez le type de corpus',
                SELECT_CORPORA_LANGUAGE: 'Indiquer les langues du corpus',
                SELECT_CORPORA_STYLES: 'Sélectionnez un ou plusieurs genres',
                SELECT_CORPORA_LANGUAGE_TYPE: 'Sélectionnez le type de langue',
                SELECT_ANNOTATION_LEVELS: 'Sélectionnez les niveaux d\'annotation ',
                SELECT_CORPORA_FORMATS: 'Sélectionnez un ou plusieurs formats',
                SELECT_CORPORA_FILE_ENCODINGS: 'Sélectionnez les encodages de caractères',
                SELECT_CORPORA_DATATYPES: 'Sélectionnez un ou plusieurs types de source',
                SELECT_LEXICON_INPUT_TYPE: 'Sélectionnez un type',
                SELECT_LEXICON_DESCRIPTION_TYPES: 'Sélectionnez un type',
                SELECT_LEXICON_LANGUAGE_TYPE: 'Sélectionnez le type de langue',
                SELECT_LEXICON_FORMATS: 'Sélectionnez un ou plusieurs formats',
                SELECT_PROGRAMMING_LANGUAGES: 'Sélectionnez les languages',
                SELECT_OPERATING_SYSTEMS: 'Sélectionnez un système d\'exploitation',
                SELECT_TOOL_SUPPORT: 'Sélectionnez un type de support',
                SELECT_TOOL_FUNCTIONALITIES: 'Sélectionnez les fonctionnalités',
                SELECT_TOOL_INPUTDATA: 'Sélectionnez les types d\'entrée',
                SELECT_TOOL_OUTPUTDATA: 'Sélectionnez les types de sorties',
                SELECT_TOOL_FILE_ENCODINGS: 'Sélectionnez les encodage de caractères'
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Remplir la fiche des métadonnées'
            },
            PERMISSIONS_EDITOR: {
                TITLE: 'Visibilité du contenu de l\'espace de travail',
                SHOW_FILES: 'Afficher les fichiers',
                ADVANCED_MODE: 'Édition avancée'
            },
            PERMISSIONS_MODAL: {
                TITLE: 'Visibilité de {{::path}}',
                BODY: '<p>Vous allez appliquer une visibilité "{{::"WORKSPACE.ACL." + template.toUpperCase() | translate}}" au dossier "{{::name}}".</p><p>Souhaitez vous également appliquer cette option de visibilité aux éléments de ce dossier ? Dans le cas contraire, les options de visibilité déjà réglées sur les éléments de ce dossier seront conservées.</p>',
                RECURSIVE: 'Appliquer aux enfants <strong>(recommandé)</strong>'
            },
            ACL: {
                FORALL: 'Pour tous',
                AUTHENTIFIED: 'Utilisateur connecté',
                ESR: 'Membres de l\'ESR',
                RESTRICTED: 'Membres de l\'espace de travail'
            },
            EVENTS: {
                CORE: {
                    WORKSPACE: {
                        TAG: 'a publié une nouvelle version :<span class="description">{{::arguments["tag-name"]}}</span>',
                        SNAPSHOT: 'a pris un nouvel instanané',
                        CREATE: 'a créé cet espace de travail'
                    },
                    METADATA: {
                        CREATE: 'a créé des métadonnées :<span class="description">{{::arguments.name | translate}} de {{::arguments.path}}</span>',
                        UPDATE: 'a mis à jour des métadonnées :<span class="description">{{::arguments.name | translate}} de {{::arguments.path}}</span>'
                    },
                    OBJECT: {
                        CREATE: 'a ajouté un élément :<span class="description">{{::arguments.path}}</span>',
                        UPDATE: 'a mis à jour un élément :<span class="description">{{::arguments.path}}</span>',
                        MOVE: 'a déplacé une élément :<span class="description">{{::arguments["src-path"]}} vers {{::arguments["dest-path"]}}</span>',
                        DELETE: 'a supprimé un élément :<span class="description">{{::arguments.path}}</span>'
                    },
                    COLLECTION: {
                        CREATE: 'a créé une collection :<span class="description">{{::arguments.path}}</span>',
                        UPDATE: 'a mis à jour une collection :<span class="description">{{::arguments.path}}</span>',
                        MOVE: 'a déplacé une collection :<span class="description">{{::arguments["src-path"]}} vers {{::arguments["dest-path"]}}</span>',
                        DELETE: 'a supprimé une collection:<span class="description">{{::arguments.path}}</span>'
                    }
                },
                MEMBERSHIP: {
                    GROUP: {
                        'ADD-MEMBER': 'a ajouté un membre à l\'espace de travail'
                    }
                },
                PROCESSES: {
                    PUBLISH_WORKSPACE: {
                        PUBLISH_WORKSPACE: 'a fait une demande de publication'
                    }
                }
            }
        },
        'ortolang-item-json': 'Fiche de présentation',
        'ortolang-thumb-json': 'Logo',
        'ortolang-acl-json': 'Permissions',
        'ortolang-pid-json': 'Identifiant pérenne'
    });
