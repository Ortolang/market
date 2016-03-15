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
		            TOOL: 'Tool'
        		}
        	},
        	TITLE: {
        		LABEL: 'Title'
        	},
        	DESCRIPTION: {
        		LABEL: 'Description'
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
            }
        }
    }
);