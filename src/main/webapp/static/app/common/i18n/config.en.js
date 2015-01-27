'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18n.en
 * @description
 * # i18n.en
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18n.en', ['COMMON_EN', 'NAV_EN', 'BROWSER_EN', 'WORKSPACE_EN', 'MARKET_EN', 'PROCESSES_EN', 'TASKS_EN', 'TOOLS_EN', 'PRES_EN',
        function (COMMON_EN, NAV_EN, BROWSER_EN, WORKSPACE_EN, MARKET_EN, PROCESSES_EN, TASKS_EN, TOOLS_EN, PRES_EN) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_EN);
                angular.extend(translations, NAV_EN);
                angular.extend(translations, BROWSER_EN);
                angular.extend(translations, WORKSPACE_EN);
                angular.extend(translations, MARKET_EN);
                angular.extend(translations, PROCESSES_EN);
                angular.extend(translations, TASKS_EN);
                angular.extend(translations, TOOLS_EN);
                angular.extend(translations, PRES_EN);
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
