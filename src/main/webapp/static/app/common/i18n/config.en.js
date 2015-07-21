'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18n.en
 * @description
 * # i18n.en
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18n.en', ['COMMON_EN', 'NAV_EN', 'BROWSER_EN', 'WORKSPACE_EN', 'MARKET_EN', 'PRODUCER_EN', 'PROCESSES_EN', 'TASKS_EN', 'TOOLS_EN', 'SIMPLE_TEXT_VISUALISER_EN', 'STATICSITE_EN', 'PROFILE_EN', 'FORMS_EN',
        function (COMMON_EN, NAV_EN, BROWSER_EN, WORKSPACE_EN, MARKET_EN, PRODUCER_EN, PROCESSES_EN, TASKS_EN, TOOLS_EN, SIMPLE_TEXT_VISUALISER_EN, STATICSITE_EN, PROFILE_EN, FORMS_EN) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_EN);
                angular.extend(translations, NAV_EN);
                angular.extend(translations, BROWSER_EN);
                angular.extend(translations, WORKSPACE_EN);
                angular.extend(translations, MARKET_EN);
                angular.extend(translations, PRODUCER_EN);
                angular.extend(translations, PROCESSES_EN);
                angular.extend(translations, TASKS_EN);
                angular.extend(translations, TOOLS_EN);
                angular.extend(translations, STATICSITE_EN);
                angular.extend(translations, SIMPLE_TEXT_VISUALISER_EN);
                angular.extend(translations, PROFILE_EN);
                angular.extend(translations, FORMS_EN);
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
    .config(['$translateProvider', 'i18n.enProvider', function ($translateProvider, i18nEN) {
        $translateProvider
            .translations('en', i18nEN.getTranslations());
    }]);
