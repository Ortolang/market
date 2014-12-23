'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18n.fr
 * @description
 * # i18n.fr
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18n.fr', ['COMMON_FR', 'NAV_FR', 'BROWSER_FR', 'WORKSPACE_FR', 'MARKET_FR', 'PROCESSES_FR', 'TOOLS_FR',
        function (COMMON_FR, NAV_FR, BROWSER_FR, WORKSPACE_FR, MARKET_FR, PROCESSES_FR, TOOLS_FR) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_FR);
                angular.extend(translations, NAV_FR);
                angular.extend(translations, BROWSER_FR);
                angular.extend(translations, WORKSPACE_FR);
                angular.extend(translations, MARKET_FR);
                angular.extend(translations, PROCESSES_FR);
                angular.extend(translations, TOOLS_FR);
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
            .preferredLanguage('fr');
    }]);
