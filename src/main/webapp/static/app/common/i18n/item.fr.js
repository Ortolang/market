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
		            TOOL: 'Outil',
                    TERMINO: 'Terminologie'
        		}
        	},
        	TITLE: {
        		LABEL: 'Titre'
        	},
        	DESCRIPTION: {
        		LABEL: 'Description'
        	},
            SPONSORS: {
                LABEL: 'Soutien(s) institutionnel(s)',
                PLACEHOLDER: 'Rechercher dans le référentiel des organismes répertoriés sur ORTOLANG'
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
            },
            TERMINO_TYPE: {
                LABEL: 'Type de la ressource terminologique',
                RESETLABEL: 'Toutes les terminologies',
                PLACEHOLDER: 'Type de ressource terminologique au regard de la nature des données qu\'il contient et de son organisation'
            },
            TERMINO_STRUCTURE_TYPE: {
                LABEL: 'Type de structure',
                PLACEHOLDER: 'Organisation structurant les concepts entre eux'
            },
            TERMINO_DESCRIPTION_FIELD: {
                LABEL: 'Champs de description terminologique',
                PLACEHOLDER: 'Ensemble des champs d\'informations utilisés pour décrire les concepts et/ou les termes qu\'ils désignent.'
            },
            TERMINO_INPUT_LANGUAGE: {
                LABEL: 'Langues des entrées',
                PLACEHOLDER: 'Langue des unités terminologiques décrites.'
            },
            TERMINO_LANGUAGE_TYPE: {
                LABEL: 'Type de couverture linguistique',
                PLACEHOLDER: 'Pluralité des langues des entrées terminologiques.'
            },
            TERMINO_DOMAIN: {
                LABEL: 'Domaines',
                PLACEHOLDER: 'Champ notionnel dans lequel s’inscrit la ressource.'
            },
            TERMINO_FORMAT: {
                LABEL: 'Formats et modèles',
                PLACEHOLDER: 'Format ou modèle utilisé pour modéliser la ressource.'
            },
            TERMINO_USAGE: {
                LABEL: 'Usage',
                PLACEHOLDER: 'Contexte d\'application/ usages de la ressource tels que indexation documentaire, rédaction scientifique, traduction, etc.'
            },
            TERMINO_ORIGIN: {
                LABEL: 'Origine ressource',
                PLACEHOLDER: 'Une source principale dont la ressource décrite est dérivée. La ressource décrite peut en être dérivée, en totalité ou en partie. Typiquement, le nom d\'une base terminologique d\'appartenance.'
            },
            TERMINO_INPUT_COUNT: {
                LABEL: 'Nombre d\'entrées',
                PLACEHOLDER: 'Nombre approximatif d\'entrées contenues dans la ressource terminologique.'
            },
            TERMINO_VERSION: {
                LABEL: 'Version',
                PLACEHOLDER: 'Identification de la version de la ressource si système de version.'
            },
            TERMINO_QUALITY: {
                LABEL: 'Qualité',
                PLACEHOLDER: 'Indicateur permettant d\'évaluer la fiabilité théorique de l\'information terminologique.'
            },
            TERMINO_CONTROLED: {
                LABEL: 'Contrôlé',
                PLACEHOLDER: 'Vérification du maintien de l\'intégrité de la ressource.'
            },
            TERMINO_VALIDATED: {
                LABEL: 'Validé',
                PLACEHOLDER: 'Vérification de la fiabilité de la ressource.'
            },
            TERMINO_APPROVED: {
                LABEL: 'Homologué',
                PLACEHOLDER: 'Règle d\'application exclusive, prioritaire ou obligatoire de la ressource.'
            },
            TERMINO_CHECKED: {
                LABEL: 'Vérifié',
                PLACEHOLDER: 'Exactitude.'
            },
            TERMINO_NATURE_CATEGORY: {
                TITLE: 'Nature de la ressource terminologique'
            },
            TERMINO_LINGUISTIC_COVERAGE_CATEGORY: {
                TITLE: 'Couverture linguistique'
            },
            TERMINO_FORMATS_MODELS_CATEGORY: {
                TITLE: 'Formats et Modèles'
            },
            TERMINO_OTHERS_CATEGORY: {
                TITLE: 'Autres catégories'
            },
            TERMINO_DOMAIN_CATEGORY: {
                TITLE: 'Domaine'
            },
            PARTS: { 
                TITLE: 'Sous-parties',
            },
        }
    }
);