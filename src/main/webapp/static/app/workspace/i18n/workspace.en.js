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
            WORKFLOW: 'Publication requests',
            NO_WORKFLOW: 'There are no publication requests for this workspace',
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
            REMOVE_MEMBER: 'Remove from members',
            CHANGE_OWNER: 'Change owner',
            CREATE_WORKSPACE: 'Create a new workspace',
            NO_METATDATA: 'Metadata is not filled.',
            GO_TO_METATDATA: 'Go to metadata page.',
            HEAD: 'Current version',
            CREATE_WORKSPACE_MODAL: {
                TITLE: 'Create Workspace',
                AUTO_GENERATED: 'Auto-generated alias',
                POLICY: 'I have read and agree to <a href="/information/policy" target="_blank">the ORTOLANG policy</a>',
                MESSAGES: {
                    AVAILABILITY: 'Alias already used',
                    MIN_LENGTH: 'Minimum length of 3 characters',
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
                    PATTERN: 'You mus enter a valid version number (ex: 3 or 3.2)'
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
            DELETE_MULTIPLE_ELEMENTS_MODAL: {
                COLLECTION: {
                    TITLE: 'Deletion of a folder',
                    BODY: 'You are about to delete a folder. <strong class="text-danger">Are you sure you want to delete this folder and its content?</strong>'
                },
                COLLECTIONS: {
                    TITLE: 'Deletion of multiple folders',
                    BODY: 'You are about to delete {{collectionNumber}} folders. <strong class="text-danger">Are you sure you want to delete these folders and their content?</strong>'
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
            DIFF: 'Changes',
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
                LEXICON_INPUT_COUNT: 'The count of input in the lexicon',
                NO_ORGANIZATION_FOUND: 'You do not find your organization ?',
                ADD_NEW_ORGANIZATION: 'Add a new organization',
                ADD_CONTRIBUTOR_MODAL: {
                    TITLE: '{{editing ? "Editing" : "Adding"}} new contributor',
                    SUBMIT: '{{editing ? "Edit" : "Add"}}',
                    SEARCH: 'Looking for someone ?',
                    SEARCH_LABEL: 'Search',
                    FIRSTNAME: 'First name',
                    MIDNAME: 'Middle name',
                    LASTNAME: 'Last name',
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
                    TITLE: 'Add a new license',
                    LABEL: 'Give a name for this licnse',
                    LABEL_FIELD: {
                        LABEL: 'Name'
                    },
                    DESCRIPTION_FIELD: {
                        LABEL: 'Description',
                        PLACEHOLDER: 'Sumary of the particularity'
                    },
                    WEBSITE_FIELD: {
                        LABEL: 'Web page',
                        PLACEHOLDER: 'HTTP address of the web site which contains informations about the license.'
                    }
                },
                CHOOSE_LICENCE_MODAL: {
                    TITLE: 'Choose a licence'
                },
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
                SELECT_TOOL_FILE_ENCODINGS: 'Choose one or more file encodings'
            },
            CREATE_METADATA_ITEM_MODAL: {
                TITLE: 'Create metadata item'
            },
            PERMISSIONS_EDITOR: {
                TITLE: 'Visibility of the workspace content',
                SHOW_FILES: 'Show files',
                ADVANCED_MODE: 'Advanced edition'
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
                RESTRICTED: 'Workspace members',
                HELP: 'Some of the content of this resource may have a restricted access to:'
            }
        },
        ERROR_MODAL_QUEUE_LIMIT: {
            TITLE: 'Import limit',
            BODY: 'You cannot import more than <strong>50 files</strong> at the same time using this method:<ul><li>to import more thant 50 files simultaneously you can <strong>import a zip</strong></li><li>for larger amount of data you are also able to <strong>access your workspace by FTP</strong>. The FTP address of your workspace can be found in the Information tab.</li></ul>'
        },
        ERROR_MODAL_UPLOAD_SIZE_LIMIT: {
            TITLE: 'File size limit',
            BODY: '<p>You cannot import files whose size exceeds <strong>1 GB</strong> using this method.</p><p>To import larger amount of data, you can <strong>access your workspace by FTP</strong>. The FTP address of your workspace can be found in the Information tab.</p>'
        }
    });
