'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:multilingualEditor
 * @text
 * # multilingualEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('multilingualEditor', ['Helper', '$translate', function (Helper, $translate) {
        return {
            restrict: 'A',
            scope: {
                model: '=',
                type: '=',
                disabled: '='
            },
            templateUrl: 'common/directives/multilingual-editor-template.html',
            link: function (scope) {
                
                scope.changeLanguage = function () {
                    var text = Helper.findObjectOfArray(scope.model, 'lang', scope.models.selectedLanguage);
                    if (text !== null) {
                        scope.models.text = text;
                    } else {
                        text = {lang: scope.models.selectedLanguage, value: ''};
                        scope.models.text = text;
                    }
                };

                scope.update = function () {
                    if (scope.models.text.value !== '') {
                        var text = Helper.findObjectOfArray(scope.model, 'lang', scope.models.selectedLanguage);
                        if (text === null) {
                            // text = {lang: scope.models.selectedLanguage, value: scope.models.text.value};
                            // angular.copy(scope.models.text, text);
                            text = scope.models.text;
                            scope.model.push(text);
                        } else {
                            text.value = scope.models.text.value;
                        }
                    }
                };

                function init () {
                    if (angular.isUndefined(scope.model)) {
                        console.log('multilingualEditor : model is undefined. Needs to be initialized by a array.');
                        return;
                    }
                    if (!angular.isArray(scope.model)) {
                        console.log('multilingualEditor : model is not a array. Needs to be initialized by a array.');
                        return;
                    }
                    scope.languages = [
                        {key: 'fr', value: $translate.instant('LANGUAGES.FR')},
                        {key: 'en', value: $translate.instant('LANGUAGES.EN')},
                        {key: 'es', value: $translate.instant('LANGUAGES.ES')},
                        {key: 'zh', value: $translate.instant('LANGUAGES.ZH')}
                    ];
                    scope.models = {
                        text: {value: '', lang: 'fr'},
                        selectedLanguage: 'fr'
                    };
                    if (angular.isArray(scope.model) && scope.model.length>0) {
                        scope.changeLanguage(scope.selectedLanguage);
                    }
                }
                init();
            }
        };
    }]);
