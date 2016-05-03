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
        EXIT_WITHOUT_SAVE: 'Exit without save',
        SELECT: 'Select',
        CANCEL: 'Cancel',
        CREATE: 'Create',
        SUBMIT: 'OK',
        ADD: 'Add',
        SAVE: 'Save',
        DELETE: 'Delete',
        CLEAR: 'Clear',
        NAME: 'Name',
        RENAME: 'Rename',
        DESCRIPTION: 'Description',
        INFORMATION: 'Information',
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
        PENDING: 'In progress',
        PENDING_DATA: 'Loading...',
        CART: 'Selection',
        SEE_MORE: 'See more',
        SHARE: 'Share',
        404: {
            TITLE: 'Page not found',
            BODY: 'Sorry, but we can\'t find the page you are looking for. Maybe you should try heading home.',
            BUTTON: 'Home'
        },
        SERVER_DOWN_MODAL: {
            TITLE: 'The server seems to be currently unavailable',
            BODY: '<p>It seems that the server is currently unavailable; thus you won\'t be able to access ORTOLANG\'s resources.</p><p>You should try to refresh the page. If the problem persists, please contact us at <a href="mailto:contact@ortolang.fr">contact@ortolang.fr</a> .</p>',
            BUTTON: 'Refresh the page'
        },
        NOT_LOGGED_IN_MODAL: {
            TITLE: 'Unauthorized',
            BODY: 'You do not have the access rights to see the content of this file/folder or this page: please login.'
        },
        UNAUTHORIZED_MODAL: {
            TITLE: 'Unauthorized',
            BODY: 'You do not have the access rights to see the content of this file/folder or this page.'
        },
        UNEXPECTED_ERROR_ALERT: {
            TITLE: 'Error',
            CONTENT: 'An unexpected error has occurred'
        },
        ROLES: {
            DEVELOPER: 'Developer',
            CHIEF_DEVELOPER: 'Chief developer',
            MANAGER: 'Manager',
            IT_MANAGER: 'IT manager',
            DESIGNER: 'Designer',
            RESEARCHER: 'Researcher',
            SCIENTIFIC_DIRECTOR: 'Scientific director',
            AUTHOR: 'Author',
            ANNOTATOR: 'Annotator',
            COMPILER: 'Compiler',
            CONSULTANT: 'Consultant',
            DATA_INPUTTER: 'Data inputter',
            DEPOSITOR: 'Depositor',
            EDITOR: 'Editor',
            ILLUSTRATOR: 'Illustrator',
            INTERPRETER: 'interpreter',
            INTERVIEWER: 'Interviewer',
            PARTICIPANT: 'Participant',
            PERFORMER: 'Performer',
            PHOTOGRAPHER: 'Photographer',
            RECORDER: 'Recorder',
            RESEARCH_PARTICIPANT: 'Research participant',
            RESPONDER: 'Responder',
            SIGNER: 'Signer',
            SINGER: 'Singer',
            SPEAKER: 'Speaker',
            SPONSOR: 'Sponsor',
            TRANSCRIBER: 'Transcriber',
            TRANSLATOR: 'Translator'
        },
        LANGUAGES: {
            FR: 'Français',
            EN: 'Anglais',
            ES: 'Spanish',
            ZH: 'Chinese'
        },
        MULTILINGUAL_TEXTFIELD: {
            LANGUAGE: 'Language',
            SELECT_LANGUAGE: 'Choose a language ...'
        },
        COOKIE_CONSENT: {
            TITLE: 'This website uses cookies:',
            BODY: 'we are using statistics cookies to understand how visitors interact with the website by collecting and reporting information anonymously. You can find out more or switch them off if you prefer. However, by continuing to use the site without changing settings, you are agreeing to our use of cookies.',
            ACCEPT: 'I agree',
            MORE: 'More information'
        },
        ERROR_MODAL_: {
            TITLE: 'Error',
            BODY: 'An unexpected error has occurred'
        },
        ERROR_MODAL_1: {
            TITLE: 'The specified path does not exist',
            BODY: 'The path <strong>{{path}}</strong> does not exist. You have been redirected to the root directory.'
        },
        ERROR_MODAL_5: {
            TITLE: 'The specified path does not exist',
            BODY: 'No snapshot with name <strong>{{root}}</strong> found. You have been redirected to the current version of the workspace.'
        },
        ERROR_MODAL_6: {
            TITLE: 'Erreur',
            BODY: 'No workspace with alias <strong>{{alias}}</strong> found or you are not authorized to access this workspace.'
        },
        ERROR_MODAL_9: {
            TITLE: 'Invalid metadata',
            BODY: 'The metadata send to .'
        }
    });
