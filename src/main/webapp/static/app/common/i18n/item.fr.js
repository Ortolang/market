'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ITEM_FR
 * @description
 * # ITEM_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('ITEM_FR', {
        ITEM: {
        	TYPE: {
        		LABEL: 'Catégorie',
        		VALUES: {
        			CORPORA: 'Corpus',
		            LEXICON: 'Lexique',
		            TOOL: 'Outil'
        		}
        	},
        	TITLE: {
        		LABEL: 'Titre'
        	},
        	DESCRIPTION: {
        		LABEL: 'Description'
        	}
        }
    }
);