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
            NO_DESCRIPTION_PROVIDED: 'Add a description',
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
                MIME_TYPE: 'Mime Type',
                DATE: 'Modification date'
            },
            INFO: '{{hideInfo === "true" ? "Display" : "Hide"}} details',
            DASHBOARD: 'Go back to dashboard',
            WORKSPACE_LIST: '{{hideWorkspaceList === "true" ? "Display" : "Hide"}} workspace list',
            SETTINGS: 'Settings',
            PREVIEW: 'Preview',
            DELETE: 'Delete',
            UPLOAD: 'Upload',
            UPLOAD_FILES: 'Import files',
            UPLOAD_ZIP: 'Import zip',
            UPLOAD_FOLDER: 'Import folder',
            NEW_COLLECTION: 'New Folder',
            PREVIEW_WORKSPACE: 'Preview before publication',
            VERSION: 'Workspace versions',
            HEAD: 'Current version',
            PREVIOUS_VERSIONS: 'Previous versions',
            BACK: 'Back',
            FORWARD: 'Forward',
            TOGGLE_DROPDOWN: 'Toggle dropdown',
            COPY_TO_CLIPBOARD: 'Copy to clipboard',
            NO_PREVIOUS_VERSIONS: 'No previous versions',
            TOOLS: 'Tools',
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
            },
            NO_PREVIEW: 'No preview available for this type of file',
            WORKSPACE_KEY: 'Copy workspace key',
            BEARER_TOKEN: 'Copy token'
        }
    });
