'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18nFR
 * @description
 * # i18nFR
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18nFR', ['COMMON_FR', 'ITEM_FR', 'NAV_FR', 'BROWSER_FR', 'WORKSPACE_FR', 'MARKET_FR', 'PRODUCER_FR', 'CONTRIBUTOR_FR', 'PROCESSES_FR', 'VISUALIZERS_FR', 'STATIC_WEBSITE_FR', 'PROFILE_FR', 'FORMS_FR',
        function (COMMON_FR, ITEM_FR, NAV_FR, BROWSER_FR, WORKSPACE_FR, MARKET_FR, PRODUCER_FR, CONTRIBUTOR_FR, PROCESSES_FR, VISUALIZERS_FR, STATIC_WEBSITE_FR, PROFILE_FR, FORMS_FR) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_FR);
                angular.extend(translations, ITEM_FR);
                angular.extend(translations, NAV_FR);
                angular.extend(translations, BROWSER_FR);
                angular.extend(translations, WORKSPACE_FR);
                angular.extend(translations, MARKET_FR);
                angular.extend(translations, PRODUCER_FR);
                angular.extend(translations, CONTRIBUTOR_FR);
                angular.extend(translations, PROCESSES_FR);
                angular.extend(translations, STATIC_WEBSITE_FR);
                angular.extend(translations, VISUALIZERS_FR);
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
    .config(['$translateProvider', 'i18nFRProvider', function ($translateProvider, i18nFR) {
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
