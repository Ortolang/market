'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ITEM_EN
 * @description
 * # ITEM_EN
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('ITEM_EN', {
        ITEM: {
        	TYPE: {
        		LABEL: 'Category',
        		VALUES: {
		            CORPORA: 'Corpora',
		            LEXICON: 'Lexicon',
		            TOOL: 'Tool',
                    TERMINO: 'Terminology'
        		}
        	},
        	TITLE: {
        		LABEL: 'Title'
        	},
        	DESCRIPTION: {
        		LABEL: 'Description'
        	},
            SPONSORS: {
                LABEL: 'Sponsors',
                PLACEHOLDER: 'Looks for organization registered in ORTOLANG repository'
            },
            CREATIONLOCATIONS: {
                LABEL: 'Creation locations',
                PLACEHOLDER: 'Creation locations',
                DCMIPOINT: {
                    PLACEHOLDER: 'DCMIPoint Code'
                },
                DCMIBOX: {
                    PLACEHOLDER: 'DCMIBox Code'
                },
                ISO3166: {
                    PLACEHOLDER: 'ISO3166 Code'
                },
                TGN: {
                    PLACEHOLDER: 'TGN Code'
                }
            },
            ORIGIN_DATE: {
                LABEL: 'Origin date',
                PLACEHOLDER: 'Origin date'
            },
            LINGUISTIC_DATA_TYPE: {
                LABEL: 'Linguistic data type',
                PLACEHOLDER: 'Linguistic data type'
            },
            DISCOURSE_TYPE: {
                LABEL: 'Discourse type',
                PLACEHOLDER: 'Discourse type'
            },
            LINGUISTIC_SUBJECT: {
                LABEL: 'LINGUISTIC subject',
                PLACEHOLDER: 'LINGUISTIC subject'
            },
            TERMINO_TYPE: {
                LABEL: 'Terminlogy type',
                RESETLABEL: 'All terminology type',
                PLACEHOLDER: 'Terminlogy type'
            },
            TERMINO_STRUCTURE_TYPE: {
                LABEL: 'Structure type',
                PLACEHOLDER: 'Structure type'
            },
            TERMINO_DESCRIPTION_FIELD: {
                LABEL: 'Description fields',
                PLACEHOLDER: 'Description fields'
            },
            TERMINO_INPUT_LANGUAGE: {
                LABEL: 'Input languages',
                PLACEHOLDER: 'Languages of units'
            },
            TERMINO_LANGUAGE_TYPE: {
                LABEL: 'Type of linguistic coverage',
                PLACEHOLDER: 'Type of linguistic coverage.'
            },
            TERMINO_DOMAIN: {
                LABEL: 'Domains',
                PLACEHOLDER: 'Domains.'
            },
            TERMINO_FORMAT: {
                LABEL: 'Formats and models',
                PLACEHOLDER: 'Format or models used for modelized the resource.'
            },
            TERMINO_USAGE: {
                LABEL: 'Usage',
                PLACEHOLDER: 'Usage.'
            },
            TERMINO_ORIGIN: {
                LABEL: 'Origin',
                PLACEHOLDER: 'Origin.'
            },
            TERMINO_INPUT_COUNT: {
                LABEL: 'Input count',
                PLACEHOLDER: 'Input count.'
            },
            TERMINO_VERSION: {
                LABEL: 'Version',
                PLACEHOLDER: 'Version number.'
            },
            TERMINO_QUALITY: {
                LABEL: 'Quality',
                PLACEHOLDER: 'Quality.'
            },
            TERMINO_CONTROLED: {
                LABEL: 'Controled',
                PLACEHOLDER: 'Controled.'
            },
            TERMINO_VALIDATED: {
                LABEL: 'Validated',
                PLACEHOLDER: 'Validated.'
            },
            TERMINO_APPROVED: {
                LABEL: 'Approved',
                PLACEHOLDER: 'Approved.'
            },
            TERMINO_CHECKED: {
                LABEL: 'Checked',
                PLACEHOLDER: 'Checked.'
            },
            TERMINO_NATURE_CATEGORY: {
                TITLE: 'Terminology resource nature'
            },
            TERMINO_LINGUISTIC_COVERAGE_CATEGORY: {
                TITLE: 'Linguistic coverage'
            },
            TERMINO_FORMATS_MODELS_CATEGORY: {
                TITLE: 'Formats and Models'
            },
            TERMINO_OTHERS_CATEGORY: {
                TITLE: 'Others categories'
            },
            TERMINO_DOMAIN_CATEGORY: {
                TITLE: 'Domain'
            },
            PARTS: { 
                TITLE: 'Subparts'
            },
        }
    }
);