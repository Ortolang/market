'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PROFILE_FR
 * @description
 * # PROFILE_FR
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('PROFILE_FR', {
        PROFILE: {
            NAV: {
                PERSONAL_INFOS: 'Informations personnelles',
                SETTINGS: 'Préférences d\'affichage',
                ABOUT_ME: 'A propos de moi',
                EVENTS: 'Acivité récente',
                CONTRIBUTIONS: 'Contributions',
                FRIENDS: 'Mes amis'
            },
            PATH: {
                PERSONAL_INFOS: 'profile/fr/personal-infos.html',
                SETTINGS: 'profile/fr/settings.html',
                ABOUT_ME: 'profile/fr/about-me.html',
                EVENTS: 'profile/fr/events.html',
                CONTRIBUTIONS: 'profile/fr/contributions.html',
                FRIENDS: 'profile/fr/friends.html'
            },
            VISIBILITY: 'Rendre visible ?'
        }
    });
