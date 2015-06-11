'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.TOOLS_FR
 * @description
 * # TOOLS_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('TOOLS_FR', {
        TOOLS: {
            AVAILABLE_TOOLS: 'Liste des outils disponibles - ancienne version',
            AVAILABLE_TOOLS_SERVER: 'Liste des outils externes disponibles',
            CHOOSE: 'Choisir',
            DOCUMENTATION: 'Documentation',
            TOOL_LIST: 'Liste des outils',
            BACK_TO_TOOL_LIST: 'Retour à la liste des outils',
            CONFIGURATION: 'Configuration',
            DELAY: 'Date de suppression',
            TOOL: 'Outil',
            TOOLS: 'Outils',
            NO_ACTIVE_TOOL_PROCCESS: 'Pas d\'exécution d\'outil active',
            COMPLETED_TOOL_PROCESSES: 'Outils complétés',
            ABORTED_TOOL_PROCESSES: 'Outils interrompus par des erreurs',
            NO_COMPLETED_TOOL_PROCESS: 'Pas d\'outil complété',
            PREVIEW_TITLE: 'Affichage du résultat',
            LOG_TITLE: 'Journal d\'execution',
            LINK_LIST_TITLE: 'Fichier(s) généré(s)',
            RUN_TOOL: 'Executer',
            FAIL: 'a échoué',
            WAS_SUCCESS: 'est en cours d\'execution',
            VIEW_PARAM: 'Voir les paramètres',
            PARAMETERS: 'Paramètres',
            ABORT: 'Annuler',
            ABORTED: 'est annulé',
            TREATED_CONTENT: {
                WRITTEN: 'Traitement de l\'écrit',
                ORAL: 'Traitement de l\'oral',
                VIDEO: 'Traitement vidéo'
            },
            FOUND_TOOLS: 'outil(s) trouvé(s)',
            DESCRIPTION: {
                TEXT_PREVIEW: 'Affichage d\'un extrait du résultat de l\'exécution de l\'outil',
                LINK_LIST: 'Liste des fichiers générés à la suite de l\'exécution de l\'outil. Ils peuvent être sauvegardés dans un espace de travail.',
                LOG: 'Affichage du journal d\'exécution',
                PARAMETERS: 'Paramètres d\'execution de l\'outil'
            },
            DATAOBJECT_KEY: 'Clé du fichier',
            FILES_SAVED_OK: '<p><strong>Les fichiers ont été sauvegardés avec succès dans le dossier <i>{{path}}</i>.</strong></p><p><a class="btn btn-sm btn-default" href="{{url}}"> Voir les fichiers sauvegardés </a></p>',
            FILES_SAVED_FAIL: '<p><strong>La sauvegarde des fichiers a échoué.</strong></p><p><i>{{error}}</i></p>'
        }
    });
