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
        	},
            CREATION_LOCATIONS: {
                LABEL: 'Lieux de création',
                PLACEHOLDER: 'Lieux de création',
                DCMIPOINT: {
                    PLACEHOLDER: 'Code DCMIPoint'
                },
                DCMIBOX: {
                    PLACEHOLDER: 'Code DCMIBox'
                },
                ISO3166: {
                    PLACEHOLDER: 'Code ISO3166'
                },
                TGN: {
                    PLACEHOLDER: 'Code TGN'
                }
            },
            ORIGIN_DATE: {
                LABEL: 'Date d\'origine',
                PLACEHOLDER: 'Date d\'origine'
            },
            LINGUISTIC_DATA_TYPE: {
                LABEL: 'Type de données linguistiques',
                PLACEHOLDER: 'Type de données linguistiques'
            },
            DISCOURSE_TYPE: {
                LABEL: 'Type de discours',
                PLACEHOLDER: 'Type de discours'
            },
            LINGUISTIC_SUBJECT: {
                LABEL: 'Thème linguistique',
                PLACEHOLDER: 'Thème linguistique'
            }
        }
    }
);