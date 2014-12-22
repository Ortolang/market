'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PROCESSES_FR
 * @description
 * # PROCESSES_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PROCESSES_FR', {
        PROCESSES: {
            PROCESS: 'Processus',
            PROCESSES: 'Processus',
            NO_ACTIVE_PROCCESS: 'Pas de processus actifs',
            COMPLETED_PROCESSES: 'Processus complétés',
            ABORTED_PROCESSES: 'Processus avortés',
            NO_COMPLETED_PROCESS: 'Pas de processus complétés',
            TASKS: 'Tâches',
            NO_TASK: 'Pas de tâches',
            STATE: 'État',
            ACTIVITY: 'Activité',
            VIEW_LOG: 'Voir le log',
            ASSIGNEE: 'Assignée à',
            CLAIM: 'Se l\'assigner',
            START_PROCESS: 'Démarrer le processus',
            COMPLETE_TASK: 'Compléter la tâche',
            SHOW_ALL: 'Tout afficher',
            JUST_COMPLETED: '{{name}} vient de se terminer'
        }
    });
