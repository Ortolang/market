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
        	}
        }
    }
);