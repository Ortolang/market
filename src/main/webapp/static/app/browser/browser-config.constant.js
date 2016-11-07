'use strict';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.browserConfig
 * @description
 * # browserConfig
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('browserConfig', {
        workspace: {
            id: 'workspace',
            canEdit: true,
            canDownload: true,
            canPreview: true,
            canChangeRoot: true,
            defaultViewMode: 'line',
            canSwitchViewMode: true,
            canExecuteTool: true,
            displayAsideInfo: true
        },
        market: {
            id: 'market',
            canEdit: false,
            canDownload: true,
            canPreview: true,
            canChangeRoot: false,
            defaultViewMode: 'line',
            canSwitchViewMode: true,
            canExecuteTool: false,
            displayAsideInfo: false
        },
        fileSelect: {
            id: 'fileSelect',
            canEdit: false,
            canDownload: false,
            canPreview: false,
            canChangeRoot: true,
            defaultViewMode: 'line',
            canSwitchViewMode: false,
            canExecuteTool: false,
            displayAsideInfo: false
        }

    });
