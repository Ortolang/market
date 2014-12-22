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
            }
        }
    });
