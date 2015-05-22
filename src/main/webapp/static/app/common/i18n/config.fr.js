'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18n.fr
 * @description
 * # i18n.fr
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18n.fr', ['COMMON_FR', 'NAV_FR', 'BROWSER_FR', 'WORKSPACE_FR', 'MARKET_FR', 'PROCESSES_FR', 'TASKS_FR', 'TOOLS_FR', 'SIMPLE_TEXT_VISUALISER_FR', 'INFORMATION_FR', 'PROFILE_FR', 'FORMS_FR',
        function (COMMON_FR, NAV_FR, BROWSER_FR, WORKSPACE_FR, MARKET_FR, PROCESSES_FR, TASKS_FR, TOOLS_FR, SIMPLE_TEXT_VISUALISER_FR, PRES_FR, PROFILE_FR, FORMS_FR) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_FR);
                angular.extend(translations, NAV_FR);
                angular.extend(translations, BROWSER_FR);
                angular.extend(translations, WORKSPACE_FR);
                angular.extend(translations, MARKET_FR);
                angular.extend(translations, PROCESSES_FR);
                angular.extend(translations, TASKS_FR);
                angular.extend(translations, TOOLS_FR);
                angular.extend(translations, PRES_FR);
                angular.extend(translations, SIMPLE_TEXT_VISUALISER_FR);
                angular.extend(translations, PROFILE_FR);
                angular.extend(translations, FORMS_FR);
            }

            init();

            this.getTranslations = function () {
                return translations;
            };

            this.$get = function () {
                return {
                    getTranslations: this.getTranslations
                };
            };
        }])
    .config(['$translateProvider', 'i18n.frProvider', function ($translateProvider, i18nFR) {
        $translateProvider
            .translations('fr', i18nFR.getTranslations())
            .registerAvailableLanguageKeys(['fr', 'en'], {
                'fr_FR': 'fr',
                'fr_CH': 'fr',
                'fr_BE': 'fr',
                'fr_CA': 'fr',
                'fr_LU': 'fr',
                'en_US': 'en',
                'en_UK': 'en'
            })
            .preferredLanguage('fr')
            .fallbackLanguage('fr')
            .useSanitizeValueStrategy('escaped');
    }]);
