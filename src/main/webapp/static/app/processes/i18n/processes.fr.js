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
            PROCESS_FOUND: 'Processus trouvé(s)',
            NO_ACTIVE_PROCCESS: 'Pas de processus actifs',
            COMPLETED_PROCESSES: 'Processus complétés',
            ABORTED_PROCESSES: 'Processus avortés',
            LAST_COMPLETED_PROCESSES: 'Derniers processus complétés',
            LAST_ABORTED_PROCESSES: 'Derniers processus avortés',
            NO_COMPLETED_PROCESS: 'Pas de processus complétés',
            STATE: 'État',
            ABORTED: 'Echoué',
            COMPLETED: 'Completé',
            SUSPENDED: 'Suspendu',
            PENDING: 'En attente',
            RUNNING: 'En cours d\'execution',
            ACTIVITY: 'Activité',
            VIEW_LOG: 'Voir le log',
            VIEW_RESULT: 'Voir le résultat',
            START_PROCESS: 'Démarrer le processus',
            SHOW_ALL: 'Tout afficher',
            JUST_COMPLETED: '{{name}} vient de se terminer',
            PROCESSES_HISTORY: 'Historique des processus'
        }
    });
