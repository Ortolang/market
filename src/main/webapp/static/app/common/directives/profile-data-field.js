'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:profileDataField
 * @description
 * # profileDataField
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('profileDataField', ['$translate', 'Profile', 'icons', function ($translate, Profile, icons) {
        return {
            restrict: 'A',
            scope: {
                profileData: '=',
                source: '=',
                inputClass: '=',
                labelClass: '=',
                helpClass: '='
            },
            templateUrl: 'common/directives/profile-data-field-template.html',

            link: {
                pre: function (scope) {
                    scope.showValue = function (value, source) {
                        var i;
                        for (i = 0; i < source.length; i++) {
                            if (source[i].value === value) {
                                return source[i].text;
                            }
                        }
                        return undefined;
                    };
                    scope.emptyText = $translate.instant('PROFILE.EMPTY');
                    scope.Profile = Profile;
                    scope.icons = icons;
                }
            }
        };
    }]);
