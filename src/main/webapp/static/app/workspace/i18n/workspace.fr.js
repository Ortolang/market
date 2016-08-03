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
            INFORMATION: 'Informations',
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
            PUBLISHED_VERSIONS: '<strong>{{number}} version{{number > 1 ? "s" : ""}} publiée{{number > 1 ? "s" : ""}}{{number !== snapshots ? " | " + snapshots + " versions mémorisée" + (snapshots > 1 ? "s" : "") : ""}}</strong>',
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
            REMOVE_MEMBER: 'Retirer des membres',
            CHANGE_OWNER: 'Changer le propriétaire',
            CREATE_WORKSPACE: 'Créer un espace de travail',
            NO_METATDATA: 'Les métadonnées ne sont pas encore renseignées.',
            GO_TO_METATDATA: 'Allez à la page des métadonnées.',
            HEAD: 'Version actuelle',
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
                VERSION: 'Version',
                NEXT_TAG: 'Choisir le numéro de la nouvelle version',
                NEXT_TAG_HELP: 'Vous pouvez choisir le numéro de la nouvelle version qui sera publiée. Veuillez noter que si vous choisissez de "remplacer la dernière version publiée" : la dernière version publiée n\'apparaitra plus dans les resources d\'ORTOLANG et sera remplacée par cette nouvelle publication. Les données de la version remplacée seront toutefois conservées.',
                NEXT_TAG_CUSTOM: 'Saisir manuellement le numéro de la nouvelle version',
                CONTENT: 'Je reconnais être responsable des contenus que je publie et posséder toutes les autorisations, consentements et droits qui me permettent de publier ces contenus',
                POLICY: 'Je déclare avoir pris connaissance et accepter sans réserves <a href="/information/policy" target="_blank">la charte ORTOLANG</a>',
                MESSAGES: {
                    CONTENT: 'Vous devez cocher cette case',
                    POLICY: 'Vous devez accepter la charte ORTOLANG',
                    PATTERN: 'Vous devez entrer un numéro de version valide (ex : 3 ou 3.2)'
                },
                LABEL: {
                    NEXT_MAJOR_VERSION: 'Version {{version}}',
                    NEXT_MINOR_VERSION: 'Version {{version}} (modifications mineures)',
                    SAME_VERSION: 'Version {{version}} (remplacer la dernière version publiée)'
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
                SUBMIT: 'Ajouter',
                MESSAGES: {
                    CONFLICT: 'Un fichier ou un dossier du même nom existe déjà'
                }
            },
            RENAME_CHILD_MODAL: {
                TITLE: 'Renommer'
            },
            MOVE_CHILD_MODAL: {
                TITLE: 'Déplacer <strong>{{name}}</strong> vers...'
            },
            DELETE_MULTIPLE_ELEMENTS_MODAL: {
                COLLECTION: {
                    TITLE: 'Suppression d\'un dossier',
                    BODY: 'Vous êtes sur le point de supprimer un dossier. <strong class="text-danger">Êtes-vous sûr de vouloir supprimer ce dossier ainsi que son contenu ?</strong>'
                },
                COLLECTIONS: {
                    TITLE: 'Suppression de dossiers multiples',
                    BODY: 'Vous êtes sur le point de supprimer {{collectionNumber}} dossiers à la fois. <strong class="text-danger">Êtes-vous sûr de vouloir supprimer ces dossiers ainsi que leur contenu ?</strong>'
                },
                FILES: {
                    TITLE: 'Suppression de fichiers multiples',
                    BODY: '<strong class="text-danger">Vous êtes sur le point de supprimer {{objectNumber}} fichiers à la fois.</strong> Êtes-vous sûr de vouloir les supprimer ?'
                },
                FILES_COLLECTIONS: {
                    TITLE: 'Suppression de fichier{{objectNumber > 1 ? "s" : ""}} et dossier{{collectionNumber > 1 ? "s" : ""}}',
                    BODY: '<strong class="text-danger">Vous êtes sur le point de supprimer {{objectNumber}} fichier{{objectNumber > 1 ? "s" : ""}} et {{collectionNumber}} dossier{{collectionNumber > 1 ? "s" : ""}}.</strong> Êtes-vous sûr de vouloir supprimer {{objectNumber > 1 ? "ces fichiers" : "ce fichier"}} et {{collectionNumber > 1 ? "ces dossiers ainsi que leur contenu" : "ce dossier ainsi que son contenu"}} ?'
                }
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Ajouter un membre à {{wsName}}',
                SEARCH: 'Rechercher un membre',
                SEARCH_RESULT: 'Résultats',
                NO_RESULT: 'Aucun membre trouvé',
                MORE_RESULTS: 'Votre recherche a retourné de nombreux résultats qui ne sont pas tous affichés. Veuillez affiner votre recherche.',
                QUERY_LENGTH: 'Veuillez entrer au minimum 3 caractères',
                MY_FRIENDS: 'Mes collaborateurs',
                NO_FRIENDS: 'Pas de collaborateurs enregistrés',
                ADD: 'Ajouter',
                ADDED: 'Ajouté'
            },
            CHANGE_OWNER_MODAL: {
                TITLE: 'Changer le propriétaire de {{wsName}}',
                NO_OTHER_MEMBERS: 'Il n\'y a pas d\'autres membres de l\'espace de travail. Veuillez d\'abord ajouter le nouveau propriétaire en tant que membre.'
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
            READ_ONLY_MODE: '<strong>Espace de travail en lecture seule:</strong> certaines propriétés tels que le contenu, les métadonnées et les permissions ne sont pas éditables.',
            EDIT_LOGO: 'Cliquez pour modifier votre logo',
            HOLDER_EDITOR_MODAL: {
                TITLE: 'Création de logo',
                TEXT: 'Texte',
                SIZE: 'Taille du texte',
                FOREGROUND: 'Couleur du texte',
                BACKGROUND: 'Couleur de fond',
                BOLD: 'Texte gras',
                SUBMIT: 'Créer'
            },
            MOVE_CONFLICT_ALERT: {
                TITLE: 'Erreur',
                CONTENT: 'Un fichier ou dossier du même nom existe déjà à cet emplacement: {{path}}'
            },
            EDIT_LOGO_MODAL: {
                TITLE: 'Édition du logo',
                HOLDER_EDITOR: 'Création d\'un logo',
                FILE_INPUT: 'Utiliser une image',
                FILE_INPUT_HELP: 'Pour éviter tout problème d\'affichage éventuel veuillez sélectionner une image carrée et de type : JPG, PNG, GIF ou SVG',
                LOGO_EDITOR: 'Utiliser le créateur de logo',
                LOGO_EDITOR_BUTTON: 'Créer un logo',
                LOGO_EDITOR_HELP: 'Créer facilement un logo à l\'aide du créateur de logo ORTOLANG'
            },
            DIFF: 'Comparer les versions',
            DIFF_MODAL: {
                TITLE: 'Liste des modifications',
                HELP: 'Choisissez deux snapshots à comparer',
                COMPARE_LAST: '<em>(comparer la version actuelle à la dernière publiée)</em>',
                NEW: 'Nouvel élément',
                REMOVED: 'Element supprimé',
                RENAMED: 'Element déplacé',
                METADATAS: 'Métadonnées modifiées'
            },
            SAVE_METADATA_MODAL: {
                TITLE: 'Enregistrer les métadonnées',
                BODY: 'Souhaitez-vous enregistrer les changements ?'
            },
            METADATA_EDITOR: {
                MESSAGES: {
                    TITLE_NOT_SET: 'Veuillez renseigner le titre.',
                    TYPE_NOT_SET: 'Veuillez renseigner la catéorie.',
                    DESCRIPTION_NOT_SET: 'Veuillez renseigner la description.',
                    METADATA_FORMAT_INVALID: 'Format des métadonnées non valide. Veuillez contacter un administrateurs.',
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
                NO_PERSON_FOUND: 'Vous ne trouvez pas la personne ?',
                ADD_NEW_PERSON: 'Ajouter une personne',
                ADD_CONTRIBUTOR_MODAL: {
                    TITLE: 'Personne contributrice',
                    SUBMIT: '{{editing ? "Modifier" : "Ajouter"}}',
                    CREATE_ENTITY: 'Créer cette entité',
                    SEARCH: 'Rechercher une personne dans le référentiel ORTOLANG',
                    SEARCH_LABEL: 'Rechercher',
                    ID: 'Identifiant',
                    FIRSTNAME: 'Prénom',
                    MIDNAME: 'Deuxième prénom',
                    LASTNAME: 'Nom',
                    ORGANIZATION: 'Organisme',
                    ROLE: 'Role',
                    MESSAGES: {
                        EXISTS: 'Cette personne est déjà dans la liste.',
                        ROLE: 'Veuillez spécifier le rôle de cette personne.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Demande en cours</strong> : Ajout de la personne dans le référentiel.'
                },
                NO_PRODUCER_FOUND: 'Vous ne trouvez pas votre laboratoire ?',
                ADD_NEW_PRODCUER: 'Ajouter un laboratoire',
                NO_ORGANIZATION_FOUND: 'Vous ne trouvez pas votre organisme ?',
                ADD_NEW_ORGANIZATION: 'Ajouter un nouveau organisme',
                ADD_ORGANIZATION_MODAL: {
                    TITLE: 'Organisme',
                    SUBMIT: '{{editing ? "Modifier" : "Ajouter"}}',
                    SEARCH: 'Rechercher un organisme ?',
                    SEARCH_LABEL: 'Rechercher',
                    IDENTIFIER: 'Identifiant',
                    NAME: 'Nom',
                    CITY: 'Ville',
                    COUNTRY: 'Pays',
                    ACRONYM: 'Sigle',
                    HOMEPAGE: 'Site',
                    IMG: 'Logo',
                    MESSAGES: {
                        EXISTS: 'Ce laboratoire est déjà dans la liste.',
                        UNDEFINED: 'Le nom du laboratoire n\'est pas spécifié.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Demande en cours</strong> : Ajout de l\'organisation dans le référentiel.'
                },
                NO_LANGUAGE_FOUND: 'Vous ne trouvez pas une languge ?',
                ADD_NEW_LANGUAGE: 'Ajouter une langue',
                ADD_LANGUAGE_MODAL: {
                    TITLE: 'Langue',
                    SUBMIT: '{{editing ? "Modifier" : "Ajouter"}}',
                    IDENTIFIER: 'Identifiant',
                    LABEL: {
                        LABEL: 'Label',
                        PLACEHOLDER: 'Label de la langue'
                    },
                    MESSAGES: {
                        EXISTS: 'Cette langue est déjà dans la liste.',
                        UNDEFINED: 'Le label de la langue n\'est pas spécifié.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Demande en cours</strong> : Ajout de la langue dans le référentiel.'
                },
                NO_LICENCE_FOUND: 'Vous ne trouvez pas votre licence ?',
                ADD_NEW_LICENCE: 'Ajouter une licence particulière',
                ADD_LICENCE_MODAL: {
                    TITLE: 'Licence',
                    IDENTIFIER: 'Identifiant',
                    LABEL: 'Donnez un nom à cette licence',
                    LABEL_FIELD: {
                        LABEL: 'Nom'
                    },
                    DESCRIPTION_FIELD: {
                        LABEL: 'Description',
                        PLACEHOLDER: 'Résumez les particularités de la licence'
                    },
                    WEBSITE_FIELD: {
                        LABEL: 'Page web',
                        PLACEHOLDER: 'Adresse HTTP du site web contenant des informations sur la licence.'
                    },
                    MESSAGES: {
                        EXISTS: 'Cette licence est déjà dans la liste.',
                        UNDEFINED: 'Le nom de la licence n\'est pas spécifié.'
                    },
                },
                CHOOSE_LICENCE_MODAL: {
                    TITLE: 'Choisir une licence'
                },
                NEW_LICENCE: 'Licence non enregistrée.',
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
                BODY: '<p>Vous allez appliquer une visibilité <strong>"{{::"WORKSPACE.ACL." + template.toUpperCase() | translate}}" au dossier "{{::name}}"</strong>.</p><p>Souhaitez vous également appliquer cette option de visibilité aux éléments de ce dossier ? Dans le cas contraire, les options de visibilité déjà réglées sur les éléments de ce dossier seront conservées.</p>',
                RECURSIVE: 'Appliquer aux enfants <strong>(recommandé)</strong>',
                HELP: 'Cette opération peut prendre une trentaine de secondes.'
            },
            ACL: {
                FORALL: 'Pour tous',
                AUTHENTIFIED: 'Utilisateurs connectés',
                ESR: 'Membres de l\'ESR',
                RESTRICTED: 'Membres de l\'espace de travail',
                HELP: 'Certains éléments contenu dans cette resource peuvent avoir un accès restreint aux :'
            },
            EVENTS: {
                CORE: {
                    WORKSPACE: {
                        TAG: 'a publié une nouvelle version :<span class="description">{{::arguments["tag-name"]}}</span>',
                        SNAPSHOT: 'a pris un nouvel instanané',
                        CREATE: 'a créé cet espace de travail',
                        'CHANGE-OWNER': 'a changé le propriétaire de l\'espace',
                        LOCK: 'a verrouillé l\'espace de travail (lecture seule)',
                        UNLOCK: 'a déverrouillé l\'espace de travail'
                    },
                    METADATA: {
                        CREATE: 'a créé des métadonnées :<span class="description">{{::arguments.name | translate}} de {{::arguments.path}}</span>',
                        DELETE: 'a supprimé les métadonnées :<span class="description">{{::arguments.name | translate}} de {{::arguments.path}}</span>',
                        UPDATE: 'a mis à jour les métadonnées :<span class="description">{{::arguments.name | translate}} de {{::arguments.path}}</span>',
                        CREATE_ITEM: 'a créé la fiche de métadonnées de présentation',
                        UPDATE_ITEM: 'a mis à jour la fiche de métadonnées de présentation',
                        CREATE_THUMB: 'a ajouté un logo',
                        UPDATE_THUMB: 'a modifié le logo',
                        CREATE_ACL: 'a modifié les permissions d\'accès de :<span class="description">{{::arguments.path}}</span>',
                        DELETE_ACL: 'a supprimé les permissions d\'accès de :<span class="description">{{::arguments.path}}</span>',
                        UPDATE_ACL: 'a modifié les permissions d\'accès de :<span class="description">{{::arguments.path}}</span>'
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
                        'ADD-MEMBER': 'a ajouté un membre à l\'espace de travail',
                        'REMOVE-MEMBER': 'a retiré un membre à l\'espace de travail'
                    }
                },
                PROCESSES: {
                    PUBLISH_WORKSPACE: {
                        PUBLISH_WORKSPACE: 'a fait une demande de publication',
                        SUBMITTED: 'En attente de modération',
                        RUNNING: 'En attente de modération',
                        COMPLETED: 'Publication effectuée',
                        ABORTED: 'Publication annulée',
                        ACCEPTED: 'Publication effectuée',
                        REJECTED: 'Publication rejetée',
                        REVIEW: 'En attente de modération',
                        MODERATION: {
                            WAITING: 'En attente de vérification'
                        }
                    }
                },
                MESSAGE: {
                    THREAD: {
                        CREATE: 'a créé une nouvelle discussion <span class="description">{{::arguments.name}}</span>',
                        POST: 'a posté un message dans la discussion <span class="description">{{::arguments.threadname}}</span>'
                    }
                }
            },
            THREADS: {
                TAB_TITLE: 'Discussion',
                EMPTY: '<strong>Cet espace de travail ne contient aucune discussion.</strong><br/> Les discussions vous permettent de poser des questions ou d\'échanger des informations entre membres du projet ou avec les modérateurs ORTOLANG.',
                START: 'Démarrer une nouvelle discussion',
                BACK: 'Revenir à la liste des discussions',
                POST: 'Poster un nouveau message',
                CREATE_THREAD_MODAL: {
                    TITLE: 'Création d\'une nouvelle discussion',
                    SUBMIT: 'Créer',
                    VISIBILITY: 'Impliquer les modérateurs dans la discussion'
                },
                CREATED_BY: 'créé par'
            }
        },
        ERROR_MODAL_QUEUE_LIMIT: {
            TITLE: 'Limite d\'importation',
            BODY: 'Il n\'est pas possible d\'importer plus de <strong>50 fichiers à la fois</strong> par cette méthode : <ul><li>pour importer simultanément plus de 50 fichiers vous avez la possibilité <strong>d\'importer un zip</strong></li><li>pour importer de grandes quantités de données vous pouvez également <strong>vous connecter à votre workspace par FTP</strong>. L\'adresse FTP de votre workspace se trouve dans l\'onglet Informations.</li></ul>'
        },
        ERROR_MODAL_UPLOAD_SIZE_LIMIT: {
            TITLE: 'Fichier trop volumineux',
            BODY: '<p>Il n\'est pas possible d\'importer des fichiers dont la taille dépasse <strong>1 Go</strong> par cette méthode.</p><p>Pour importer de grandes quantités de données vous pouvez <strong>vous connecter à votre workspace par FTP</strong>. L\'adresse FTP de votre workspace se trouve dans l\'onglet Informations.</p>'
        },
        'ortolang-item-json': 'Fiche de présentation',
        'ortolang-thumb-json': 'Logo',
        'ortolang-acl-json': 'Permissions',
        'ortolang-pid-json': 'Identifiant pérenne'
    });
