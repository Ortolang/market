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
            PROCESSES_TODAY: 'Processus executés aujourd\'hui',
            NO_ACTIVE_PROCCESS: 'Pas de processus actifs',
            COMPLETED_PROCESSES: 'Processus complétés',
            ABORTED_PROCESSES: 'Processus avortés',
            LAST_COMPLETED_PROCESSES: 'Derniers processus complétés',
            LAST_ABORTED_PROCESSES: 'Derniers processus avortés',
            NO_COMPLETED_PROCESS: 'Pas de processus complétés',
            NO_HISTORY_PROCESS: 'Aucun processus trouvé',
            PROCESSES_FOUND: 'processus trouvé(s)',
            STATE: 'État',
            ABORTED: 'Echoué',
            COMPLETED: 'Completé',
            SUSPENDED: 'Suspendu',
            PENDING: 'En attente',
            RUNNING: 'En cours',
            SUBMITTED: 'Démarré',
            ACTIVITY: 'Activité',
            VIEW_LOG: 'Voir le log',
            VIEW_RESULT: 'Voir le résultat',
            START_PROCESS: 'Démarrer le processus',
            SHOW_ALL: 'Tout afficher',
            SHOW_MORE: 'Voir plus de processus',
            JUST_COMPLETED: '{{name}} vient de se terminer',
            PROCESSES_HISTORY: 'Historique des processus',
            SEARCH: 'Rechercher un processus',
            STOPPED_DATE: 'Date de fin',
            FACET_DATE: {
                PAST_HOUR: 'Moins d\'1 heure',
                PAST_DAY: 'Moins de 24 heures',
                PAST_WEEK: 'Moins d\'une semaine',
                PAST_MONTH: 'Moins d\'un mois',
                PAST_YEAR: 'Moins d\'un an'
            }
        }
    });
