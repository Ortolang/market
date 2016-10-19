'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.i18nEN
 * @description
 * # i18nEN
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('i18nEN', ['COMMON_EN', 'ITEM_EN', 'NAV_EN', 'BROWSER_EN', 'WORKSPACE_EN', 'MARKET_EN', 'PRODUCER_EN', 'CONTRIBUTOR_EN', 'PROCESSES_EN', 'VISUALIZERS_EN', 'STATIC_WEBSITE_EN', 'PROFILE_EN', 'FORMS_EN',
        function (COMMON_EN, ITEM_EN, NAV_EN, BROWSER_EN, WORKSPACE_EN, MARKET_EN, PRODUCER_EN, CONTRIBUTOR_EN, PROCESSES_EN, VISUALIZERS_EN, STATIC_WEBSITE_EN, PROFILE_EN, FORMS_EN) {

            var translations;

            function init() {
                translations = {};
                angular.extend(translations, COMMON_EN);
                angular.extend(translations, ITEM_EN);
                angular.extend(translations, NAV_EN);
                angular.extend(translations, BROWSER_EN);
                angular.extend(translations, WORKSPACE_EN);
                angular.extend(translations, MARKET_EN);
                angular.extend(translations, PRODUCER_EN);
                angular.extend(translations, CONTRIBUTOR_EN);
                angular.extend(translations, PROCESSES_EN);
                angular.extend(translations, STATIC_WEBSITE_EN);
                angular.extend(translations, VISUALIZERS_EN);
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
    .config(['$translateProvider', 'i18nENProvider', function ($translateProvider, i18nEN) {
        $translateProvider
            .translations('en', i18nEN.getTranslations());
    }]);
