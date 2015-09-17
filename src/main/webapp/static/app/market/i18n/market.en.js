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
            NEW_RESOURCES: 'Recent publications',
            WEBSITES: 'Websites',
            WEBSITE: 'Website',
            SEARCH_PAGE: 'Search in data',
            REDACTOR_CHOICES: 'Redactor choices',
            CONDITIONS_OF_USE: 'Conditions of use',
            BROWSE: 'Browse',
            GO_BACK_INFO: 'Go back',
            ADD_TO_FAVOURITES: 'Add to my favourites',
            USE_IN_MY_PROJECT: 'Use in my project',
            ADDITIONAL_INFORMATION: 'Additional information',
            KEYWORDS: 'Keywords',
            EXTENT: 'Extent',
            PUBLICATIONS: 'Publications',
            PRIMARY_PUBLICATIONS: 'Reference publications',
            SECONDARY_PUBLICATIONS: 'Publications based on this item',
            ALL_VERSIONS: 'All versions',
            PRIMARY_LANGUAGE: 'Primary language',
            DISCOURSE_TYPE: 'Discourse type',
            LINGUISTIC_SUBJECT: 'Linguistic subjects',
            PROGRAMMING_LANGUAGE: 'Programming languages',
            OPERATING_SYSTEM: 'Operating systems supported',
            SUPPORT_TOOL: 'Support tool',
            LANGUAGE: 'Languages',
            PRODUCER: 'Made by',
            RESEARCHER: 'Researcher{{value > 1 ? "s" : ""}}',
            MANAGER: 'Manager{{value > 1 ? "s" : ""}}',
            DESIGNER: 'Designer{{value > 1 ? "s" : ""}}',
            DEVELOPER: 'Developer{{value > 1 ? "s" : ""}}',
            AUTHOR: 'Author{{value > 1 ? "s" : ""}}',
            COMPILER: 'Compiler{{value > 1 ? "s" : ""}}',
            TRANSCRIBER: 'Transcriber{{value > 1 ? "s" : ""}}',
            SPONSOR: 'Sponsor{{value > 1 ? "s" : ""}}',
            SPACIAL: 'Spacial',
            TEMPORAL: 'Temporal',
            PREVIEW: 'Preview',
            LOCATION: 'Location',
            CONTRIBUTOR: 'Contributor',
            DOWNLOAD: 'Download',
            DOWNLOAD_ALL: 'You will download a complete archive of this resource {{value && value !=="" ? "("+value+")" : ""}}',
            DOWNLOAD_AGREEMENT: 'Download implies the acceptance of the licence',
            LICENCE_DETAIL: 'License information',
            DEROGATION: 'Code du patrimoine',
            BIBLIOGRAPHIC_CITATION: 'Bibliographic reference',
            RESULTS_LABEL: '{{value}} result{{value > 1 ? "s" : ""}}',
            SITE: 'Go to website',
            LINK: 'Link',
            THUMBNAIL: 'Thumbnail',
            ALL_RESOURCE: 'All type of resources',
            RESOURCE_TYPE: 'Type of resource',
            FACET: {
                CORPORA_TYPE: 'Type of corpora',
                ALL_CORPORA: 'All corpus',
                ANNOTATION_LEVEL: 'Annotation levels',
                ALL_ANNOTATION_LEVEL: 'All annotation levels',
                TEXT_FORMAT: 'Formats',
                ALL_TEXT_FORMAT: 'All formats',
                TEXT_ENCODING: 'Text encodings',
                ALL_TEXT_ENCODING: 'All text encodings',
                STATUS_OF_USE: 'Conditions of use',
                ALL_STATUS_OF_USE: 'All conditions of use',
                CORPORA_LANG: 'Corpora languages',
                ALL_LANG: 'All languages',
                CORPORA_DATATYPES: 'Data type',
                ALL_CORPORA_DATATYPES: 'All data type',
                CORPORA_FILE_ENCODINGS: 'Corpora file encodings',
                CORPORA_LANGUAGE_TYPE: 'Languages',
                ALL_CORPORA_LANGUAGE_TYPE: 'All languages',
                CORPORA_STYLES: 'Corpora nature',
                TOOL_LANGUAGE: 'Tool language',
                TOOL_FUNCTIONALITY: 'Functionalities',
                ALL_TOOL_FUNCTIONALITY: 'All functionalities',
                TOOL_INPUTDATA: 'Input data',
                ALL_TOOL_INPUTDATA: 'All input data',
                TOOL_OUTPUTDATA: 'Output data type',
                ALL_TOOL_OUTPUTDATA: 'All output data type',
                TOOL_FILE_ENCODINGS: 'File encoding',
                ALL_TOOL_FILE_ENCODINGS: 'All file encodings',
                LEXICON_INPUT_TYPE: 'Input type',
                ALL_LEXICON_INPUT_TYPE: 'All input types',
                LEXICON_DESCRIPTION_TYPE: 'Description type',
                ALL_LEXICON_DESCRIPTION_TYPE: 'All description types',
                LEXICON_INPUT_LANGUAGE: 'Lexicon input languages',
                LEXICON_DESCRIPTION_LANGUAGE: 'Description languages',
                LEXICON_FORMAT: 'Format',
                ALL_LEXICON_FORMAT: 'All format',
                LEXICON_LANGUAGE_TYPE: 'Language type',
                ALL_LEXICON_LANGUAGE_TYPE: 'All language types',
                PRODUCERS: 'Producter',
                ALL_PRODUCERS: 'All producers'
            },
            SORT: {
                TITLE: 'Title',
                PUBLICATION_DATE: 'Publication date'
            },
            SEARCH: {
                CORPORA: 'Search for corpora',
                TOOLS: 'Search for tools',
                LEXICONS: 'Search for lexicons',
                PRODUCERS: 'Search for a producer',
                ALL: 'Search in ORTOLANG'
            },
            SHOW_IN: 'Show by',
            VIEW_MODE: {
                LINE: 'List',
                GRID: 'Icons'
            },
            FACETS: 'Advanced filters',
            MORE_FACETS: 'More filter',
            LESS_FACETS: 'Hide filters',
            ACTIVATED_FILTERS: 'Activated filters',
            RESET_FILTERS: 'Clear filters',
            NO_ITEM: 'No resource available',
            NO_PRODUCER: 'No producer available',
            PUBLISHED_ON: 'Published on',
            ITEM_TYPE: {
                CORPORA: 'Corpora',
                LEXICON: 'Lexicon',
                TOOL: 'Tool',
                INTEGRATED_PROJECT: 'Integrated Project',
            }
        }
    });
