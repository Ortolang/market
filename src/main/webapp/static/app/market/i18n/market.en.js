'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MARKET_EN
 * @description
 * # MARKET_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('MARKET_EN', {
        MARKET: {
            ALL_TYPE: 'All',
            NEW_RESOURCES: 'New resources',
            WEBSITES: 'Websites',
            WEBSITE: 'Website',
            SEARCH_PAGE: 'Search in data',
            REDACTOR_CHOICES: 'Redactor choices',
            CONDITIONS_OF_USE: 'Conditions of use',
            BROWSE: 'Browse',
            GOBACKINFO: 'Go back',
            ADD_TO_FAVOURITES: 'Add to my favourites',
            USE_IN_MY_PROJECT: 'Use in my project',
            ADDITIONAL_INFORMATION: 'Additional information',
            KEYWORDS: 'Keywords',
            EXTENT: 'Extent',
            PRIMARY_LANGUAGE: 'Primary language',
            DISCOURSE_TYPE: 'Discourse type',
            LINGUISTIC_SUBJECT: 'Linguistic subjects',
            PROGRAMMING_LANGUAGE: 'Programming languages',
            OPERATING_SYSTEM: 'Operating systems supported',
            SUPPORT_TOOL: 'Support tool',
            LANGUAGE: 'Languages',
            PRODUCER: 'Made by',
            RESEARCHER: 'Researchers',
            MANAGER: 'Managers',
            DEVELOPER: 'Developers',
            AUTHOR: 'Authors',
            COMPILER: 'Compilers',
            SPACIAL: 'Spacial',
            TEMPORAL: 'Temporal',
            PREVIEW: 'Preview',
            LOCATION: 'Location',
            CONTRIBUTOR: 'Contributor',
            DOWNLOAD: 'Download',
            DOWNLOAD_ALL: 'You will download a complete archive of this resource {{value && value !=="" ? "("+value+")" : ""}}',
            DOWNLOAD_AGREEMENT: 'Download implies the accpetance of the licence',
            LICENCE_DETAIL: 'License information',
            DEROGATION: 'Code du patrimoine',
            RESULTS_LABEL: '{{value}} result{{value > 1 ? "s" : ""}}',
            SITE: 'Website',
            THUMBNAIL: 'Thumbnail',
            ALL_RESOURCE: 'All type of resources',
            RESOURCE_TYPE: 'Type of resource',
            CORPORA: {
                  CORPORA_TYPE: 'Type of corpora',
                  ALL_CORPORA: 'All corpus',
                  ANNOTATION_LEVEL: 'Annotation levels',
                  ALL_ANNOTATION_LEVEL: 'All annotation levels',
                  TEXT_FORMAT: 'Formats',
                  ALL_TEXT_FORMAT: 'All formats',
                  TEXT_ENCODING: 'Text encodings',
                  ALL_TEXT_ENCODING: 'All text encodings',
                  STATUSOFUSE: 'Conditions of use',
                  ALL_STATUSOFUSE: 'All conditions of use',
                  CORPORA_LANG: 'Corpora languages',
                  ALL_LANG: 'All languages',
                  CORPORA_DATATYPES: 'Data type',
                  ALL_CORPORA_DATATYPES: 'All data type',
                  CORPORA_LANGUAGE_TYPE: 'Languages',
                  ALL_CORPORA_LANGUAGE_TYPE: 'All languages',
                  ALL_TOOL_FUNCTIONALITY: 'All functionalities',
                  ALL_TOOL_INPUTDATA: 'All input data'
            },
            SORT: {
                  TITLE: 'Title',
                  PUBLICATION_DATE: 'Publication date'    
            },
            SHOW_IN: 'Show by',
            VIEW_MODE: {
                  LINE: 'List',
                  GRID: 'Icons'
            },
            FACETS: 'Advanced filters',
            MORE_FACETS: 'More filter',
            LESS_FACETS: 'Hide filters',
            NO_ITEM: 'No resource availabled',
            PUBLISHED_ON: 'Published on the'
        }
    });
