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
            NEWS: 'News',
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
                HYPERLINKS_CONTENT: 'The establishment of hyperlinks by others to pages or documents available on the website of ORTOLANG Community, are permitted provided that the links are not contrary to the interests of partners ORTOLANG project, and they guarantee the possibility for the user to identify the origin and author.'
            }
        }
    }
);
