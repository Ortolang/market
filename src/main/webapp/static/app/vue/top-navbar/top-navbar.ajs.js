import TopNavbarComponent from './top-navbar.component'
import i18n from '../i18n';
/**
 * @ngdoc function
 * @name vue.components.controller:TopNavbarCtrl
 * @description The navbar is on the top of the website. 
 * It allows users to navigate and get some features when they are connected.
 * 
 * Controller in the vue.components module
 */
var app = angular.module('vue.components.top-navbar', ['ngVue', 'ngVue.plugins', 'ortolangMarketApp'])
    .config(['$ngVueProvider', function ($ngVueProvider) {
        $ngVueProvider.setRootVueInstanceProps({
            i18n: i18n
        })
    }])
    .controller('TopNavbarCtrl',['$rootScope', '$scope', '$translate', 'icons', 'Settings', 'AuthService', 'User', 'Runtime', 
    function ($rootScope, $scope, $translate, icons, Settings, AuthService, User, Runtime) {
        var ctrl = this;
        this.authenticated = AuthService.isAuthenticated();
        this.icons = icons;
        this.Settings = Settings;
        this.AuthService = AuthService;
        this.User = User;
        this.Runtime = Runtime;

        // *********************** //
        //        Language         //
        // *********************** //

        /**
         * Handles the modification of the language by the user from the top-navbar (from Vue component to the AngularJS app).
         * @param {String} lang - Key language ('fr' or 'en')
         */
        this.handleAskLanguageChange = function(lang) {
            // Broadcast the information to all AngularJS listener that the language has been changed
            $rootScope.$broadcast('askLanguageChange', lang);
        };

        /**
         * Listens when the language has been changed for setting the Vue translation language (i18n).
         */
        $scope.$on('askLanguageChange', function (_event, langKey) {
            setVueTranslationLanguage(langKey);
        });
        
        $rootScope.$on('languageInitialized', function (_event, language) {
            setVueTranslationLanguage(language);
        });

        /**
         * Sets the Vue translation language (i18n).
         * @param {string} langKey - Key language ('fr' or 'en')
         */
        function setVueTranslationLanguage(langKey) {
            i18n.locale = langKey || 'fr';
        }

        $rootScope.$on('$routeChangeSuccess', function (_event, current, previous) {
            if (current.$$route) {
                if (current.$$route.title) {
                    $rootScope.ortolangPageTitle = $translate.instant(current.$$route.title) + ' | ';
                } else if (previous || current.$$route.originalPath === '/') {
                    $rootScope.ortolangPageTitle = '';
                } else {
                    $rootScope.ortolangPageTitle = undefined;
                }
                if (angular.isUndefined(current.$$route.description)) {
                    $rootScope.ortolangPageDescription = '';
                } else if (current.$$route.description === 'default') {
                    $rootScope.ortolangPageDescription = 'Outils et Ressources pour un Traitement Optimisé de la LANGue';
                } else {
                    $rootScope.ortolangPageDescription = $translate.instant(current.$$route.description);
                }
            }
        });
}]);

app.value('TopNavbarComponent', TopNavbarComponent);