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
            ALIAS: 'ID',
            CONTENT: 'Content',
            METADATA: 'Metadata',
            PERMISSIONS: 'Permissions',
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
            HISTORY: 'Recent activity',
            MEMBERS_NUMBER: '<strong>{{number}} member{{number > 1 ? "s" : ""}}</strong> in the project',
            MEMBERS_LIST: 'Workspace members',
            OWNER: 'Workspace owner',
            PUBLISHED_VERSIONS: '<strong>{{number}} published version{{number > 1 ? "s" : ""}}</strong>',
            TAGS: 'Versions',
            NO_TAGS: 'No published version',
            CREATED: 'Created on {{creationDate | date}}',
            CREATION_DATE: 'Created on {{creationDate | date}} by {{author}}',
            LAST_MODIFICATION_DATE: 'Last modification',
            ACCESS_LINKS: 'Access links',
            ACTIONS: 'Actions',
            DELETE_WORKSPACE: 'Delete the workspace',
            MARKET_LINKS: 'Link to the last published version',
            CONTENT_LINKS: 'Content links',
            STATISTICS: 'Statistics',
            ADVANCED_INFORMATION: 'Advanced information',
            CREATE_PRESENTATION_METADATA_FIRST: 'You must create presentation metadata first',
            CREATE_PRESENTATION_METADATA: 'Create metadata',
            EDIT_PRESENTATION_METADATA: 'Edit metadata',
            ADD_MEMBER: 'Add member',
            CREATE_WORKSPACE: 'Create a new workspace',
            CREATE_WORKSPACE_MODAL: {
                TITLE: 'Create Workspace',
                AUTO_GENERATED: 'Auto-generated ID',
                MESSAGES: {
                    AVAILABILITY: 'ID already used',
                    MIN_LENGTH: 'Minimum length of 3 characters'
                },
                HELP: {
                    ALIAS: 'The ID is unique and it cannot be modified afterwards'
                },
                SUBMIT: 'Create'
            },
            PUBLISH_MODAL: {
                TITLE: 'Workspace Publication',
                BODY: 'Are you sure you want to publish "{{wsName}}"?',
                SUBMIT: 'Publish'
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
                SUBMIT: 'Add'
            },
            RENAME_CHILD_MODAL: {
                TITLE: 'Rename'
            },
            MOVE_CHILD_MODAL: {
                TITLE: 'Move \'{{name}}\' into...'
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Add a member to {{wsName}}',
                SEARCH: 'Search a member',
                SEARCH_RESULT: 'Search results',
                NO_RESULT: 'No member found',
                MY_FRIENDS: 'My co-worker',
                NO_FRIENDS: 'No co-worker registered',
                ADD: 'Add',
                ADDED: 'Added'
            },
            UPLOAD_ZIP_MODAL: {
                TITLE: 'Upload a zip into "{{name === "root" ? "/" : "name" }}"',
                SUBMIT: 'Upload',
                ZIP_FILE: 'Zip file',
                ROOT: 'Folder',
                ROOT_HELP: 'Name of the folder to decompress into.<br/>Leave empty to extract into the current folder : "{{wsName}}{{path === "/" ? "" : path}}/"',
                ROOT_HELP_FILLED: 'The zip will be extract into "{{wsName}}{{path === "/" ? "" : path}}/{{root}}"',
                OVERWRITE: 'Overwrite existing files'
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
            SEARCH_ERROR_MODAL: {
                TITLE: 'Error',
                BODY_PATH: 'Wrong path \'{{path}}\'. You have been redirected to the root directory.',
                BODY_ROOT: 'No snapshot with name \'{{root}}\' found. You have been redirected to the current version of the workspace.',
                BODY_ALIAS: 'No workspace with ID \'{{alias}}\' found or you are not authorized to access this workspace.'
            },
            QUEUE_LIMIT_MODAL: {
                TITLE: 'Import limit',
                BODY: 'You cannot import more than <strong>50 files</strong> at the same time using this method:<ul><li>to import more thant 50 files simultaneously you can <strong>import a zip</strong></li><li>for larger amount of data you are also able to <strong>access your workspace by FTP</strong></li></ul>'
            },
            DELETE_NON_EMPTY_FOLDER_ALERT: {
                TITLE: 'Error',
                CONTENT: 'Cannot delete a non-empty folder'
            },
            METADATA_EDITOR: {
                MESSAGES: {
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
                LEXICON_INPUT_COUNT: 'The count of input in the lexicon',
                ADD_CONTRIBUTOR_MODAL: {
                    TITLE: '{{editing ? "Editing" : "Adding"}} new contributor',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    SEARCH: 'Looking for someone ?',
                    SEARCH_LABEL: 'Search',
                    FIRSTNAME: 'Firstname',
                    MIDNAME: 'Midname',
                    LASTNAME: 'Lastname',
                    ORGANIZATION: 'Organization',
                    ROLE: 'Role',
                    MESSAGES: {
                        EXISTS: 'This person is already in the list.',
                        ROLE: 'You need to specify the role of this person.'
                    }
                },
                ADD_ORGANIZATION_MODAL: {
                    TITLE: '{{editing ? "Editing" : "Adding"}} new organization which contributes',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    SEARCH: 'Looking for an organization ?',
                    SEARCH_LABEL: 'Search',
                    NAME: 'Name',
                    CITY: 'City',
                    COUNTRY: 'Country',
                    ACRONYM: 'Acronym',
                    HOMEPAGE: 'Homepage',
                    IMG: 'Image',
                    MESSAGES: {
                        EXISTS: 'This organization is already in the list.',
                        UNDEFINED: 'The name must be specify.'
                    }
                },
                ADD_LICENCE_MODAL: {
                    TITLE: 'Add a licence',
                    LABEL: 'Gets a name for this licnse'
                },
                SELECT_TITLE: 'Specify a title for the resource',
                SELECT_DESCRIPTION: 'Describe the resource here',
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
                SELECT_TOOL_FILE_ENCODINGS: 'Choose one or more file encodings'
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Create metadata item'
            }
        }
    });
