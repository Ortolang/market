'use strict';

/**
 * @ngdoc constant
 * @name ortolangMarketApp.SearchPanelConfig
 * @description
 * # SearchPanelConfig
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('SearchPanelConfig', {
        SEARCH_TYPES: {
            MATCH: '=',
            MATCH_PHRASE_PREFIX: '*',
            REGEX: '{}'
        },
        FIELDS: {
            INCLUDES: 'includes',
            HIGHLIGHT_NUMOFFRAGMENTS: 'highlightNumOfFragments',
            HIGHLIGHT_FIELDS: 'highlightFields',
            WORKSPACE_KEY: 'workspace.key.keyword'
        },
        HIGHLIGHT_FIELDS: {
            CONTENT: 'content',
            NAME: 'name',
            PID: 'pid',
            KEY: 'key'
        },
        NUM_OF_FRAGMENTS: '25',
    });
