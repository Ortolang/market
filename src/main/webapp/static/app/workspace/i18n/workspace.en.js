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
            UPLOAD_ALL: 'Upload all',
            CLEAR_ALL: 'Clear all',
            CANCEL_ALL: 'Cancel all',
            ADD_METADATA: 'Add a metadata',
            SNAPSHOT: 'Save workspace state',
            PUBLISH: 'Publish workspace',
            NO_WORKSPACES: 'You do not have created a workspace yet',
            HISTORY: 'Recent activity',
            MEMBERS_NUMBER: '<strong>{{number}} member{{number > 1 ? "s" : ""}}</strong> in the project',
            PUBLISHED_VERSIONS: '<strong>{{number}} published version{{number > 1 ? "s" : ""}}</strong>',
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
            EDIT_DESCRIPTION_MODAL: {
                TITLE: 'Edit description of {{name}}'
            },
            ADD_MEMBER_MODAL: {
                TITLE: 'Add a member to {{wsName}}',
                SUBMIT: 'Add'
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
            }
        }
    });
