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
            ADD_COLLECTION_MODAL: {
                TITLE: 'Add a new folder',
                SUBMIT: 'Add'
            },
            EDIT_DESCRIPTION_MODAL: {
                TITLE: 'Edit description of {{name}}',
                SUBMIT: 'Edit'
            },
            WORKSPACE_MEMBERS_MODAL: {
                TITLE: 'Members of {{name}}'
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
                BODY_PATH: '',
                BODY_ALIAS: 'No workspace with ID \'{{alias}}\' found or you are not authorized to access this workspace.'
            }
        }
    });
