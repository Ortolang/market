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
            MEMBERS: 'Members',
            UPLOAD: 'Upload',
            UPLOAD_QUEUE: 'Upload Queue',
            PROGRESS: 'Progress',
            PATH: 'Path',
            STATUS: 'Status',
            CLEAR: 'Clear',
            CLEAR_ALL: 'Close',
            CANCEL_ALL: 'Cancel',
            PREVIEW_METADATA: 'Show metadata',
            ADD_METADATA: 'Add a metadata',
            SNAPSHOT: 'Save workspace state',
            PUBLISH: 'Submit for publication',
            NO_WORKSPACES: 'You do not have created a workspace yet',
            HISTORY: 'Recent activity',
            MEMBERS_NUMBER: '<strong>{{number}} member{{number > 1 ? "s" : ""}}</strong> in the project',
            PUBLISHED_VERSIONS: '<strong>{{number}} published version{{number > 1 ? "s" : ""}}</strong>',
            TAGS: 'Versions',
            NO_TAGS: 'No published version',
            CREATION_DATE: 'Created on {{creationDate | date}} by {{author}}',
            LAST_MODIFICATION_DATE: 'Last modification',
            EXTERNAL_LINKS: 'External links',
            MARKET_LINKS: 'Link to the last published version',
            CONTENT_LINKS: 'Content links',
            STATISTICS: 'Statistics',
            ADVANCED_INFORMATION: 'Advanced information',
            CREATE_PRESENTATION_METADATA_FIRST: 'You must create presentation metadata first',
            CREATE_PRESENTATION_METADATA: 'Create presentation metadata',
            EDIT_PRESENTATION_METADATA: 'Edit presentation metadata',
            ADD_MEMBER: 'Add member',
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
                BODY: 'Are you sure you want to publish "{{wsName}}" ?',
                SUBMIT: 'Publish'
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
                BASIC_INFO: 'Basic info'
            }
        }
    });
