'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.COMMON_EN
 * @description
 * # COMMON_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('COMMON_EN', {
        CLOSE: 'Close',
        SELECT: 'Select',
        CANCEL: 'Cancel',
        CREATE: 'Create',
        SUBMIT: 'Submit',
        ADD: 'Add',
        NAME: 'Name',
        DESCRIPTION: 'Description',
        TYPE: 'Type',
        ACTIONS: 'Actions',
        RESULT: 'Result',
        SIZE: 'Size',
        SEARCH: 'Search',
        LOG_IN: 'Login',
        NO_IMAGE_PROVIDED: 'No image provided',
        DOWNLOAD: 'Download',
        START: 'Start',
        STOP: 'Stop',
        ORTOLANG: 'Open Resources and TOols for LANGuage',
        CORPORA: 'Corpora',
        LEXICONS: 'Lexicons',
        TOOLS: 'Tools',
        INTEGRATED_PROJECTS: 'Integrated Projects',
        PRODUCERS: 'Producers',
        SELECT_WORKSPACE_ELEMENT: 'Select workspace element',
        404: {
            TITLE: 'Page not found',
            BODY: 'Sorry, but we can\'t find the page you are looking for. Maybe you should try heading home.',
            BUTTON: 'Home'
        },
        SERVER_DOWN_MODAL: {
            TITLE: 'The server seems to be currently unavailable',
            BODY: '<p>It seems that the server is currently unavailable; thus you won\'t be able to access ORTOLANG\'s resources.</p><p>You should try to refresh the page. If the problem persists, please contact us at <a href="mailto:contact@ortolang.fr">contact@ortolang.fr</a> .</p>',
            BUTTON: 'Refresh the page'
        }
    });
