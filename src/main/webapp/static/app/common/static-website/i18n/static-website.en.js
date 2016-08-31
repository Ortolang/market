'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.STATIC_WEBSITE_EN
 * @description
 * # STATIC_WEBSITE_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('STATIC_WEBSITE_EN', {
        STATIC_WEBSITE: {
            PATH: {
                LEGAL_NOTICES: 'common/static-website/en/legal-notices.html'
            },
            ALL_THE_NEWS: 'All the news...',
            USERS: '{{::stat}} users',
            WORKSPACES: '{{::stat}} resources',
            DATA: '{{::stat | bytes}} of data',
            LEGAL_NOTICES: {
                TITLE: 'Legal notices',
                INFO_PUBLICATION: 'Publication Information',
                PUBLICATION_DIRECTOR: 'Publication Director',
                IT_MANAGER: 'IT Manager',
                IT_DEVELOPMENT: 'IT Development',
                TERMS_OF_USE: 'Terms of use',
                LIABILITY_DISCLAIMER: 'Disclaimer of Liability',
                LIABILITY_DISCLAIMER_CONTENT: 'The responsibility of the CNRS and ORTOLANG partners can in no way be liable for the content of the information on this site or the consequences that may result from their use or interpretation.',
                INTELLECTUAL_PROPERTY: 'Intellectual Property',
                INTELLECTUAL_PROPERTY_CONTENT: 'The ORTOLANG Community site is a work of creation, exclusive property of the CNRS, protected by French and international legislation on the right to intellectual property. No reproduction or representation can not be done in contravention of the rights of the CNRS from the above legislation.',
                HYPERLINKS: 'hyperlinks',
                HYPERLINKS_CONTENT: 'The establishment of hyperlinks by others to pages or documents available on the website of ORTOLANG Community, are permitted provided that the links are not contrary to the interests of partners ORTOLANG project, and they guarantee the possibility for the user to identify the origin and author.',
                CONFIDENTIALITY: 'Confidentiality policy',
                COOKIES_USE: 'Cookies usage',
                COOKIES_USE_CONTENT: 'The ORTOLANG website uses cookies to anonymously measure your use of this website for intern analysis. These measures are collected by an open-source web analytics platform: <a href="https://piwik.org/" target="_blank">Piwik</a> host on our own servers.',
                DO_NOT_TRACK: 'Do not track my visits',
                DO_NOT_TRACK_CONTENT: '<ul><li>If the "Do No Track" functionality of your browser is turned on, our analytics tool will not record your activity on this website.</li><li>You may also choose not to be tracked on this website:</li></ul>',
                DO_NOT_TRACK_ACTUAL_CONFIG: 'Current configuration:'
            }
        }
    });
