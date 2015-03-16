'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.BROWSER_EN
 * @description
 * # BROWSER_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('BROWSER_EN', {
        BROWSER: {
            MY_WORKSPACES: 'My Workspaces',
            NEW: 'New',
            WORKSPACE: 'Workspace',
            COLLECTION: 'Folder',
            INFORMATION: 'Information',
            METADATA: 'Metadata',
            DESCRIPTION: 'Description',
            AUTHOR: 'Author',
            CREATION: 'Creation',
            MODIFICATION: 'Modification',
            LAST_MODIFICATION: 'Last modification',
            CLOCK: 'Clock',
            KEY: 'Key',
            ELEMENT: '{{value}} element{{value > 1 ? "s" : ""}}',
            ELEMENT_WITH_SIZE: '{{value}} element{{value > 1 ? "s" : ""}}<br/>({{size | bytes}})',
            FULL_SIZE: '{{size.elementNumber}} element{{elementNumber > 1 ? "s" : ""}}<br/>({{size.collectionNumber > 0 ? "more thant " : ""}}{{size.value | bytes}})',
            CALCULATE_SIZE: '(calculate)',
            VIEW_MODE_TILE: 'Tile Mode',
            VIEW_MODE_LINE: 'List Mode',
            SORT_BY: 'Sort by',
            FILTER: {
                FILTER: 'Filter',
                MIME_TYPE: 'Mime Type'
            },
            SORT: {
                TYPE_NAME: 'ORTOLANG Type',
                MIME_TYPE: 'Mime Type',
                DATE: 'Date'
            },
            INFO: '{{hideInfo ? "Display" : "Hide"}} details',
            WORKSPACE_LIST: '{{hideWorkspaceList ? "Display" : "Hide"}} workspace list',
            SETTINGS: 'Settings',
            PREVIEW: 'Preview',
            DELETE: 'Delete',
            UPLOAD: 'Upload',
            UPLOAD_FILES: 'Import files',
            UPLOAD_FOLDER: 'Import folder',
            NEW_COLLECTION: 'New Folder',
            PUBLISH: 'Publish workspace',
            PREVIEW_WORKSPACE: 'Preview before publication',
            VERSION: 'Workspace versions',
            HEAD: 'Current version',
            PREVIOUS_VERSIONS: 'Previous versions',
            BACK: 'Back',
            FORWARD: 'Forward',
            TOGGLE_DROPDOWN: 'Toggle dropdown',
            COPY_TO_CLIPBOARD: 'Copy to clipboard',
            MEMBERS: 'Members',
            HISTORY: 'History',
            TOOLS: 'Tools',
            SNAPSHOT: 'Save workspace state',
            CREATE_PRESENTATION_METADATA_FIRST: 'You must create presentation metadata first',
            CREATE_PRESENTATION_METADATA: 'Create presentation metadata',
            EDIT_PRESENTATION_METADATA: 'Edit presentation metadata',
            DRAFT: 'Not published',
            PUBLISHED: 'Published',
            CREATED: '{{author}} created',
            SHORTCUTS: {
                SHORTCUTS: 'Shortcuts',
                FILTER: 'Filter elements',
                UP: 'Navigate up',
                DOWN: 'Navigate down',
                BACKSPACE: 'Go back',
                VIEW_MODE: 'Change view mode (line/tile)',
                SELECT_ALL: 'Select all',
                ENTER: 'Preview / Open folder',
                NEW_COLLECTION: 'New Folder',
                DELETE: 'Remove selected items',
                INFO: 'Display / Hide details',
                WORKSPACE_LIST: 'Display / Hide workspace list'
            }
        }
    });
