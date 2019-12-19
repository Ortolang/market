'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WORKSPACE_EN
 * @description
 * # WORKSPACE_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('WORKSPACE_EN', {
        WORKSPACE: {
            WORKSPACE: 'Workspace',
            ALIAS: 'Alias',
            INFORMATION: 'Information',
            CONTENT: 'Content',
            METADATA: 'Metadata',
            PERMISSIONS: 'Visibility',
            PREVIEW: 'Preview',
            MEMBERS: 'Members',
            UPLOAD: 'Upload',
            UPLOAD_QUEUE: 'Upload Queue',
            EXTRACTION_QUEUE: 'Extraction',
            PROGRESS: 'Progress',
            PATH: 'Path',
            STATUS: 'Status',
            CLEAR: 'Clear',
            CLEAR_ALL: 'Close',
            HIDE_QUEUE: 'Hide',
            CANCEL_ALL: 'Cancel',
            PREVIEW_METADATA: 'Show metadata',
            ADD_METADATA: 'Add a metadata',
            SNAPSHOT: 'Save workspace state',
            PUBLISH: 'Submit for publication',
            NO_WORKSPACES: 'You do not have created a workspace yet',
            HISTORY: 'Activity',
            MEMBERS_NUMBER: '<strong>{{number}} member{{number > 1 ? "s" : ""}}</strong> in the project',
            MEMBERS_LIST: 'Workspace members',
            PRIVILEGED_MEMBERS_LIST: 'Privileged members',
            OWNER: 'Workspace owner',
            PUBLISHED_VERSIONS: '<strong>{{number}} published version{{number > 1 ? "s" : ""}}{{number !== snapshots ? " | " + snapshots + " saved version" + (snapshots > 1 ? "s" : "") : ""}}</strong>',
            TAGS: 'Versions',
            NO_TAGS: 'No published version',
            CREATED: 'Created on {{creationDate | date}}',
            CREATION_DATE: 'Created on {{creationDate | date}} by {{author}}',
            LAST_MODIFICATION_DATE: 'Last modification',
            ACCESS_LINKS: 'Access links',
            WORKFLOW: 'Publication requests',
            NO_WORKFLOW: 'There are no publication requests for this workspace',
            ACTIONS: 'Actions',
            DELETE_WORKSPACE: 'Delete the workspace',
            MARKET_LINKS: 'Link to the last published version',
            CONTENT_LINKS: 'Content links',
            FTP_LINKS: 'Use the FTP protocol for importing big files (up to 1 Gb)',
            STATISTICS: 'Statistics',
            STATISTICS_HITS: 'Views statistics',
            STATISTICS_TOTAL_HITS: '({{hits}} total views)',
            STATISTICS_DOWNLOADS: 'Downloads statistics',
            STATISTICS_WHOLE_DOWNLOADS: '{{downloads}} whole downloads',
            STATISTICS_SINGLE_DOWNLOADS: '{{downloads}} files or folders downloaded',
            STATISTICS_DOWNLOADS_HELP: 'since November 2016',
            STATISTICS_DOWNLOADS_INFO: 'This functionality has been added in November 2016, therefore it does not include previous downloads.',
            ADVANCED_INFORMATION: 'Advanced information',
            CREATE_PRESENTATION_METADATA_FIRST: 'You must create presentation metadata first',
            CREATE_PRESENTATION_METADATA: 'Create metadata',
            EDIT_PRESENTATION_METADATA: 'Edit metadata',
            ADD_MEMBER: 'Add member',
            REMOVE_MEMBER: 'Remove from members',
            CHANGE_OWNER: 'Change owner',
            CREATE_WORKSPACE: 'Create a new workspace',
            NO_METATDATA: 'Metadata is not filled.',
            GO_TO_METATDATA: 'Go to metadata page.',
            NO_METADATA_TYPE: 'The resource type is not specified.',
            GO_BASIC_INFO: 'Pick it one.',
            HEAD: 'Current version',
            CREATE_WORKSPACE_MODAL: {
                TITLE: 'Create Workspace',
                AUTO_GENERATED: 'Auto-generated alias',
                POLICY: 'I have read and agree to <a href="/information/policy" target="_blank">the ORTOLANG policy</a>',
                MESSAGES: {
                    AVAILABILITY: 'Alias already used',
                    MIN_LENGTH: 'Minimum length of 3 characters',
                    MAX_LENGTH: 'Maximum length of 25 characters, please choose it manually.',
                    CONSENT: 'You must accept the ORTOLANG policy'
                },
                HELP: {
                    ALIAS: 'The alias is unique and will appear in the URLs relative to your workspace. It cannot be modified afterwards',
                    POLICY: 'The ultimate goal of a workspace creation is to published the resources that will be transferred on it. Please note that any workspace that has not published all or part of its content after a period of 6 months may be closed by the platform administrators.'
                },
                SUBMIT: 'Create'
            },
            PUBLISH_MODAL: {
                TITLE: 'Workspace Publication',
                BODY: 'You are about to submit the workspace "{{wsName}}" for publication:',
                VERSION: 'Version',
                NEXT_TAG: 'Choose the new version number',
                NEXT_TAG_HELP: 'You can choose the number of the new version that will be published. Please note that if you decide to "replace the last published version": the last published version will not appear in ORTOLANG\'s resources anymore and will be replaced by this new publication. Nevertheless, the data of the replaced version will remain stored.',
                NEXT_TAG_CUSTOM: 'Manually enter the new version number',
                CONTENT: 'I acknowledge being responsible for the content that I publish and I have all the authorizations, consents and rights that allow me to publish these contents',
                POLICY: 'I have read and agree to <a href="/information/policy" target="_blank">the ORTOLANG policy</a>',
                MESSAGES: {
                    CONTENT: 'You must check this box',
                    POLICY: 'You must accept the ORTOLANG policy',
                    PATTERN: 'You mus enter a valid version number (ex: 3, 3.2 or 3.2.1)'
                },
                LABEL: {
                    NEXT_MAJOR_VERSION: 'Version {{version}}',
                    NEXT_MINOR_VERSION: 'Version {{version}} (minor changes)',
                    SAME_VERSION: 'Version {{version}} (replace the last published version)'
                }
            },
            DELETE_WORKSPACE_MODAL: {
                TITLE: 'Workspace deletion',
                BODY: '<strong class="text-danger">The deletion of a workspace cannot be undone</strong>. Are you sure you want to delete the workspace <strong>"{{wsName}}"</strong>?'
            },
            SNAPSHOT_MODAL: {
                TITLE: 'Save workspace state',
                SUBMIT: 'Save'
            },
            SNAPSHOT_ALERT: {
                TITLE: 'Save',
                CONTENT: 'no changes on the workspace since last save'
            },
            ADD_COLLECTION_MODAL: {
                TITLE: 'Add a new folder',
                SUBMIT: 'Add',
                MESSAGES: {
                    CONFLICT: 'A file or a folder of the same name already exists'
                }
            },
            RENAME_CHILD_MODAL: {
                TITLE: 'Rename'
            },
            MOVE_CHILD_MODAL: {
                TITLE: 'Move <strong>{{name}}</strong> into...'
            },
            DELETE_ELEMENTS_MODAL: {
                COLLECTION: {
                    TITLE: 'Deletion of a folder',
                    BODY: 'You are about to delete a folder. <strong class="text-danger">Are you sure you want to delete this folder and its content?</strong>'
                },
                COLLECTIONS: {
                    TITLE: 'Deletion of multiple folders',
                    BODY: 'You are about to delete {{collectionNumber}} folders. <strong class="text-danger">Are you sure you want to delete these folders and their content?</strong>'
                },
                FILE: {
                    TITLE: 'Deletion of a file',
                    BODY: 'You are about to delete the file {{ elementName }}. <strong class="text-danger">Are you sure you want to delete this file?</strong>'
                },
                FILES: {
                    TITLE: 'Deletion of multiple files',
                    BODY: 'You are about to delete {{objectNumber}} files. <strong class="text-danger">Are you sure you want to delete these files?</strong>'
                },
                FILES_COLLECTIONS: {
                    TITLE: 'Deletion of multiple files and folders',
                    BODY: '<strong class="text-danger">You are about to delete {{objectNumber}} file{{objectNumber > 1 ? "s" : ""}} and {{collectionNumber}} folder{{collectionNumber > 1 ? "s" : ""}}.</strong> Are you sure you want to delete {{objectNumber > 1 ? "these files" : "this file"}} and {{collectionNumber > 1 ? "these folders along with their content" : "this folder along with its content"}} ?'
                }
            },
            DELETE_NON_EMPTY_COLLECTION_MODAL: {
                TITLE: 'Delete non-empty folder',
                BODY: '<strong class="text-danger">One or several folders that you want to delete are non-empty</strong>. Are you sure you want to delete these folders and their content?'
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Add a member to {{wsName}}',
                SEARCH: 'Search a member',
                SEARCH_RESULT: 'Search results',
                NO_RESULT: 'No member found',
                MORE_RESULTS: 'Due to the number of results some of them are hidden. Please refine your search.',
                QUERY_LENGTH: 'Minimum length of 3 characters',
                MY_FRIENDS: 'My co-worker',
                NO_FRIENDS: 'No co-worker registered',
                ADD: 'Add',
                ADDED: 'Added'
            },
            CHANGE_OWNER_MODAL: {
                TITLE: 'Change the owner of {{wsName}}',
                NO_OTHER_MEMBERS: 'There are no other workspace members. Please add the new owner as member before.'
            },
            UPLOAD_ZIP_MODAL: {
                TITLE: 'Upload a zip into "{{name === "root" ? "/" : "name" }}"',
                SUBMIT: 'Upload',
                ZIP_FILE: 'Zip file',
                ROOT: 'Folder',
                ROOT_HELP: 'Name of the folder to decompress into.<br/>Leave empty to extract into the current folder : "{{wsName}}{{path === "/" ? "" : path}}/"',
                ROOT_HELP_FILLED: 'The zip will be extract into "{{wsName}}{{path === "/" ? "" : path}}/{{root}}"',
                OVERWRITE: 'Overwrite existing files',
                MODE: 'Uploads metadata files'
            },
            UPLOAD_ZIP_COMPLETED_MODAL: {
                TITLE: 'Importation of Zip content in progress',
                BODY: 'The content of the archive "{{archiveName}}" is being imported into workspace "{{wsName}}".',
                SHOW_LOG: 'Follow the progress',
                BACKGROUND_PROCESSING: 'Send to background'
            },
            PROCESS_NAMES: {
                IMPORT_ZIP: 'Import of archive "{{zipName}}" into workspace "{{wsName}}"'
            },
            READ_ONLY_MODE: '<strong>Workspace on read only :</strong> some properties such as the content, the metadata and the permissions are no longer editables.',
            ARCHIVE_MODE: '<strong>Archived workspace :</strong> All the published version are no longer availables.',
            EDIT_LOGO: 'Click to edit logo',
            HOLDER_EDITOR_MODAL: {
                TITLE: 'Logo creator',
                TEXT: 'Text',
                SIZE: 'Text size',
                FOREGROUND: 'Text colour',
                BACKGROUND: 'Background colour',
                BOLD: 'Bold',
                SUBMIT: 'Create'
            },
            DIFF: 'Compare',
            DIFF_MODAL: {
                TITLE: 'Changes',
                HELP: 'Choose two snapshots to compare',
                COMPARE_LAST: '<em>(compare current to last publish version)</em>',
                NEW: 'New element',
                REMOVED: 'Removed element',
                RENAMED: 'Moved element',
                METADATAS: 'Updated metadata'
            },
            SAVE_METADATA_MODAL: {
                TITLE: 'Save metadata',
                BODY: 'Would you save the modifications ?'
            },
            METADATA_EDITOR: {
                MESSAGES: {
                    TITLE_NOT_SET: 'Please fills the title field.',
                    TYPE_NOT_SET: 'Please fills the type field.',
                    DESCRIPTION_NOT_SET: 'Please fills the description field.',
                    METADATA_FORMAT_INVALID: 'Metadata format invalid. Please contact an administrator.',
                    NOT_SET: 'Please fills this field.',
                    NEED_ONE_VALUE: 'Please specify at least one value for this field.'
                },
                BACK_TO_PREVIEW: 'Back to the preview',
                APPLY: 'Apply',
                BASIC_INFO: 'Basic info',
                WHOS_INVOLVED: 'Who\'s involved',
                DESCRIBE: 'Describe',
                LICENCE: 'Licence',
                LICENCE_WEBSITE: 'Web page of the licence',
                SPECIFIC_FIELD: 'Specific fields',
                ADDITIONAL_INFO: 'Additionals informations',
                MANDATORY_FIELD: 'Mandatory field',
                NEXT_STEP: 'Next step',
                LIST_OF_CONTRIBUTORS: 'List of contributors',
                LIST_OF_PRODUCERS: 'List of producers',
                ADD_PERSON: 'Add a person',
                NEW_CONTRIBUTOR: 'New',
                EDIT_CONTRIBUTOR: 'Edit',
                DELETE_CONTRIBUTOR: 'Delete',
                RESOURCE_TYPE: 'Resource type',
                RESOURCE_TITLE: 'Resource title',
                RESOURCE_DESCRIPTION: 'Description',
                RESOURCE_IMAGE: 'Image',
                WORD_COUNT: 'Word count',
                CREATION_LOCATIONS: 'Lieux de création de la ressource',
                NAVIGATION_LANGUAGES: 'Navigation languages',
                PROGRAMMING_LANGUAGES: 'Programming language',
                OPERATING_SYSTEMS: 'Operating systems',
                TOOL_SUPPORT: 'Tool support',
                LEXICON_INPUT_COUNT: 'Number of lexicon entities described',
                NO_PERSON_FOUND: 'You do not find a person ?',
                ADD_NEW_PERSON: 'Ask for adding a new person',
                ORDER_CONTRIBUTORS: 'Order by last name',
                PARTS: {
                    ADD: 'Add a subpart'
                },
                CREATE_PART_MODAL: {
                    TITLE: 'Create a subpart',
                    FIELDS: {
                        TITLE: {
                            LABEL: 'Title',
                            PLACEHOLDER: 'Name of the subpart'
                        },
                        DESCRIPTION: {
                            LABEL: 'Description',
                            PLACEHOLDER: 'A short description of the subpart'
                        },
                        PATH: {
                            LABEL: 'Path',
                            PLACEHOLDER: 'Path to the directory of the subpart'
                        },
                        IMAGE: {
                            LABEL: 'Image',
                            PLACEHOLDER: 'Path to the image file'
                        }
                    }
                },
                ADD_CONTRIBUTOR_MODAL: {
                    TITLE: 'Contributor',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    CREATE_ENTITY: 'Create this entity',
                    SEARCH: 'Looking for someone ?',
                    SEARCH_LABEL: 'Search',
                    ID: 'Identifier',
                    FIRSTNAME: 'First name',
                    MIDNAME: 'Middle name',
                    LASTNAME: 'Last name',
                    ORGANIZATION: 'Organization',
                    ROLE: 'Role',
                    MESSAGES: {
                        EXISTS: 'This person is already in the list.',
                        ROLE: 'You need to specify the role of this person.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Request pending</strong> : Add the new person in the referential.'
                },
                NO_PRODUCER_FOUND: 'You do not find your laboratory ?',
                ADD_NEW_PRODCUER: 'Add a new laboratory',
                NO_ORGANIZATION_FOUND: 'You do not find your organization ?',
                ADD_NEW_ORGANIZATION: 'Add a new organization',
                ADD_ORGANIZATION_MODAL: {
                    TITLE: 'Organization',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    SEARCH: 'Looking for an organization ?',
                    SEARCH_LABEL: 'Search',
                    IDENTIFIER: 'Identifier',
                    NAME: 'Name',
                    CITY: 'City',
                    COUNTRY: 'Country',
                    ACRONYM: 'Acronym',
                    HOMEPAGE: 'Homepage',
                    IMG: 'Image',
                    MESSAGES: {
                        EXISTS: 'This organization is already in the list.',
                        UNDEFINED: 'The name must be specify.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Request pending</strong> : Add the new organization in the referential.'
                },
                NO_LANGUAGE_FOUND: 'You do not find a language ?',
                ADD_NEW_LANGUAGE: 'Add a new language',
                ADD_LANGUAGE_MODAL: {
                    TITLE: 'Language',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    IDENTIFIER: 'Identifier',
                    LABEL: {
                        LABEL: 'Label',
                        PLACEHOLDER: 'Label of the language'
                    },
                    MESSAGES: {
                        EXISTS: 'This language is already in the list.',
                        UNDEFINED: 'The label is not defined.'
                    },
                    CREATE_ENTITY_PENDING: '<strong>Request pending</strong> : Add the new language in the referential.'
                },
                NO_LICENCE_FOUND: 'You do not find your license ?',
                ADD_NEW_LICENCE: 'Add your license',
                ADD_LICENCE_MODAL: {
                    TITLE: 'License',
                    IDENTIFIER: 'Identifier',
                    LABEL: 'Give a name for this license',
                    LABEL_FIELD: {
                        LABEL: 'Name'
                    },
                    DESCRIPTION_FIELD: {
                        LABEL: 'Description',
                        PLACEHOLDER: 'Summary of the particularity'
                    },
                    WEBSITE_FIELD: {
                        LABEL: 'Web page',
                        PLACEHOLDER: 'HTTP address of the web site which contains informations about the license.'
                    },
                    MESSAGES: {
                        EXISTS: 'This license is already in the list.',
                        UNDEFINED: 'The label is not defined.'
                    }
                },
                CHOOSE_LICENCE_MODAL: {
                    TITLE: 'Choose a licence'
                },
                NEW_LICENCE: 'Unregistered license.',
                ERROR_MESSAGES_MODAL: {
                    TITLE: 'Error in metadata'
                },
                SELECT_TITLE: 'Specify a title for the resource',
                SELECT_DESCRIPTION: 'Describe the resource here',
                SELECT_LOGO: 'Select an image',
                SELECT_TYPE: 'Choose the type of resource',
                SELECT_ROLE: 'Choose the role',
                SELECT_KEYWORD: 'Adds a keyword.',
                SELECT_CONDITIONS_OF_USE: 'Abstract of the conditions if necessary',
                SELECT_CORPORA_TYPE: 'Choose the type of corpora',
                SELECT_CORPORA_LANGUAGE: 'Specify the corpora language',
                SELECT_CORPORA_STYLES: 'Choose one or more styles',
                SELECT_CORPORA_LANGUAGE_TYPE: 'Choose the kind of language',
                SELECT_ANNOTATION_LEVELS: 'Choose one or more annotation levels',
                SELECT_CORPORA_FORMATS: 'Choose one or more formats',
                SELECT_CORPORA_FILE_ENCODINGS: 'Choose one or more file encodings',
                SELECT_CORPORA_DATATYPES: 'Choose one or more data types',
                SELECT_LEXICON_INPUT_TYPE: 'Choose a type',
                SELECT_LEXICON_DESCRIPTION_TYPE: 'Choose a description',
                SELECT_LEXICON_LANGUAGE_TYPE: 'Choose the kind of language',
                SELECT_LEXICON_FORMATS: 'Choose one or more formats',
                SELECT_PROGRAMMING_LANGUAGES: 'Choose one or more programming languages',
                SELECT_OPERATING_SYSTEMS: 'Choose an operating systems',
                SELECT_TOOL_SUPPORT: 'Choose one tool support',
                SELECT_TOOL_FUNCTIONALITIES: 'Choose one or more functionalities',
                SELECT_TOOL_INPUTDATA: 'Choose one or more input data',
                SELECT_TOOL_OUTPUTDATA: 'Choose one or more input data',
                SELECT_TOOL_FILE_ENCODINGS: 'Choose one or more file encodings',
                EXTERNAL_WEBSITE: 'External link',
                INTERNAL_WEBSITE: 'Internal link'
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Create metadata item'
            },
            PERMISSIONS_EDITOR: {
                TITLE: 'Visibility of the workspace content after publication',
                HELP: '<p>Here you can set the visibility options of the workspace content: <ul><li>for example you can choose to limit the access to given files or folders to ESR members only ("Enseignement supérieur et de la Recherche").</li><li><strong>these settings only apply on published content</strong>: files uploaded initially and between two publications are only visible to the membres of the workspace until a (new) publication request has been made.</li></ul></p>',
                LEGEND: 'Legend:',
                SHOW_FILES: 'Show files'
            },
            PERMISSIONS_MODAL: {
                TITLE: 'Visibility of {{::path}}',
                BODY: '<p>You are about to set a visibility <strong>"{{::"WORKSPACE.ACL." + template.toUpperCase() | translate}}" to the folder "{{::name}}"</strong>.</p><p>Do you want to apply this visibility option to all the folder elements as well? Otherwise, the visibility options already set on the elements of this folder will remain unchanged.</p>',
                RECURSIVE: 'Apply to children <strong>(recommended)</strong>',
                HELP: 'This operation can take 30 seconds.'
            },
            ACL: {
                FORALL: 'For all',
                AUTHENTIFIED: 'Connected users',
                ESR: 'ESR members',
                PRIVILEGED: 'Privileged members',
                RESTRICTED: 'Workspace members',
                HELP: 'Some of the content of this resource may have a restricted access to:'
            },
            THREADS: {
                TAB_TITLE: 'Discussions',
                DESCRIPTION: 'Discussions allows to exchange informations between workspace members but also with ORTOLANG\'s moderators.',
                EMPTY: '<strong>This workspace does not hold any discussions.</strong>',
                START: 'Start a new discussion',
                BACK: 'Go back to discussion\'s list',
                POST: 'Post a new message',
                REPLY: 'Reply',
                PUBLISH: 'Publish',
                RESPONSES: 'Responses:',
                NO_RESPONSES_YET: 'This question has not been answered yet',
                LAST_ACTIVITY: 'Last response',
                EDITED: 'Edited on ',
                VALIDATE_ANSWER: 'Validate as answer',
                CREATE_THREAD_MODAL: {
                    TITLE: 'Create a new discussion',
                    SUBMIT: 'Create',
                    VISIBILITY: 'Imply moderators into the discussion',
                    QUESTION: 'Title / Question',
                    MESSAGE: 'Message'
                },
                REPLY_MESSAGE_MODAL: {
                    TITLE: 'Reply to Message',
                    SUBMIT: 'Reply',
                    MESSAGE: 'Message'
                },
                CREATED_BY: 'created by',
                REPLY_TO: 'in response to',
                ATTACHMENT: 'Attachement',
                ATTACHMENTS: 'Attachement{{number > 1 ? "s" : ""}}:',
                ADD_ATTACHMENTS: 'Add an attachement',
                ANSWERED: {
                    PART1: 'This question has been',
                    PART: 'answered'
                },
                NOTANSWERED: {
                    PART1: 'This question has',
                    PART2: 'not been answered yet'
                },
                DELETE_MESSAGE_MODAL: {
                    TITLE: 'Message deletion',
                    BODY: '<strong class="text-danger">The deletion of a message cannot be undone</strong>. Are you sure you want to delete this message?'
                },
                DELETE_DISCUSSION_MODAL: {
                    TITLE: 'Discussion deletion',
                    BODY: '<strong class="text-danger">The deletion of a discussion cannot be undone</strong>. Are you sure you want to delete this discussion?'
                }
            }
        },
        ERROR_MODAL_QUEUE_LIMIT: {
            TITLE: 'Import limit',
            BODY: 'You cannot import more than <strong>50 files</strong> at the same time using this method:<ul><li>to import more thant 50 files simultaneously you can <strong>import a zip</strong></li><li>for larger amount of data you are also able to <strong>access your workspace by FTP</strong>. The FTP address of your workspace can be found in the Information tab.</li></ul>'
        },
        ERROR_MODAL_UPLOAD_SIZE_LIMIT: {
            TITLE: 'File size limit',
            BODY: '<p>You cannot import files whose size exceeds <strong>1 GB</strong> using this method.</p><p>To import larger amount of data, you can <strong>access your workspace by FTP</strong>. The FTP address of your workspace can be found in the Information tab.</p>'
        },
        'ortolang-item-json': 'Item informations',
        'ortolang-thumb-json': 'Logo',
        'ortolang-acl-json': 'Permissions',
        'ortolang-pid-json': 'Long-term identifier',
        'oai_dc': 'Dublin Core',
        'olac': 'OLAC'
    });
