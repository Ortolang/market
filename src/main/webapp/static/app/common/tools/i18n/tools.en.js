'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.TOOLS_EN
 * @description
 * # TOOLS_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('TOOLS_EN', {
        TOOLS: {
            AVAILABLE_TOOLS: 'Available tools - old version',
            AVAILABLE_TOOLS_SERVER: 'Available tool servers',
            CHOOSE: 'Choose',
            DOCUMENTATION: 'Documentation',
            TOOL_LIST: 'Tool list',
            BACK_TO_TOOL_LIST: 'Back to tool list',
            CONFIGURATION: 'Configuration',
            DELAY: 'Delete deadline',
            TOOL: 'Tool',
            TOOLS: 'Tools',
            NO_ACTIVE_TOOL_PROCCESS: 'No active tool process',
            COMPLETED_TOOL_PROCESSES: 'Completed tool processes',
            ABORTED_TOOL_PROCESSES: 'Interrupted tool processes with errors',
            NO_COMPLETED_TOOL_PROCESS: 'No completed tool process',
            PREVIEW_TITLE: 'Preview of the result',
            LOG_TITLE: 'Execution log',
            LINK_LIST_TITLE: 'Generated file(s)',
            RUN_TOOL: 'Run',
            FAIL: 'fails',
            WAS_SUCCESS: 'is now running',
            VIEW_PARAM: 'View parameters',
            BACKGROUND: 'Put in background',
            PARAMETERS: 'Parameters',
            ABORT: 'Abort',
            SAVE: 'Save',
            SAVE_IN_WS: 'Do you want to save your files in a workspace ?',
            FILENAME: 'File name',
            ABORTED: 'is aborted',
            TREATED_CONTENT: {
                WRITTEN: 'Processing of written content',
                ORAL: 'Processing of oral content',
                VIDEO: 'Processing of video content'
            },
            FOUND_TOOLS: 'tool(s) found',
            DESCRIPTION: {
                TEXT_PREVIEW: 'Preview of the result from tool\'s execution.',
                LINK_LIST: 'List of generated files from tool\'s execution. You can save them in a workspace or download them directly.',
                LOG: 'Display of the execution log',
                PARAMETERS: 'Tool\'s execution parameters'
            },
            DATAOBJECT_KEY: 'File\'s key',
            FILES_SAVED_OK: '<p><strong>The files were successfully saved in the folder <i>{{path}}</i>.</strong></p>',
            FILES_SAVED_LINK: 'See saved files',
            FILES_SAVED_FAIL: '<p><strong>File save has failed</strong></p> <p> <i>{{error}}</i></p>',
            EXECUTION: 'Execution',
            EXECUTION_DESC: 'You can leave this page without interrupting the tool\'s execution by clicking on the button [Put in background]. ' +
            'To see the progress of the tool\'s execution, click on the button [Processes] in the navbar.',
            EXECUTION_CONSOLE: 'Console log',
            SELECT_FOLDER: 'Select a folder'
        }
    });
