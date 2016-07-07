'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Settings
 * @description
 * # Settings
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Helper', ['$rootScope', '$translate', '$alert', '$modal', '$aside', '$window', 'Settings', function ($rootScope, $translate, $alert, $modal, $aside, $window, Settings) {

        var modalScope, modal, asideMobileNav;

        this.getMultilingualValue = function (multilingualProperty, language) {
            if (multilingualProperty) {
                var i;
                language = language || Settings.language;
                for (i = 0; i < multilingualProperty.length; i++) {
                    if (multilingualProperty[i].lang === language) {
                        return multilingualProperty[i].value;
                    }
                }
                return multilingualProperty.length > 0 ? multilingualProperty[0].value : undefined;
            }
        };

        this.findObjectOfArray = function (arr, propertyName, propertyValue, defaultValue) {
            if (arr) {
                var iObject;
                for (iObject = 0; iObject < arr.length; iObject++) {
                    if (arr[iObject][propertyName] === propertyValue) {
                        return arr[iObject];
                    }
                }
            }
            if (defaultValue) {
                return defaultValue;
            }
            return null;
        };

        this.extractKeyFromReferentialId = function (key) {
            // Pattern : ${key}
            return key.substring(2, key.length - 1);
        };

        this.createKeyFromReferentialId = function (id) {
            // Pattern : ${key}
            return '${' + id + '}';
        };

        this.createKeyFromReferentialName = function (name) {
            // Pattern : ${key}
            return '${referential:' + name + '}';
        };

        this.extractNameFromReferentialId = function (id) {
            // Pattern : ${referential:name}
            var key = this.extractKeyFromReferentialId(id);
            return key.split(':').pop();
        };

        this.startsWith = function (actual, expected) {
            var lowerStr = (actual + '').toLowerCase();
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        };

        this.endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        this.normalizePath = function (path) {
            return path.indexOf('//') === 0 ? path.substring(1) : path;
        };

        this.pack = function (list) {
            var register = {};
            var results = [];
            for (var i = list.length - 1; i >= 0; i--) {

                if (list[i].wskey) {
                    var wskey = list[i].wskey;
                    if (angular.isUndefined(register[wskey])) {
                        register[wskey] = list[i];
                        results.push(list[i]);
                    } else {
                        if (register[wskey].lastModificationDate < list[i].lastModificationDate) {
                            var index = results.indexOf(register[wskey]);
                            results.splice(index, 1, list[i]);
                            register[wskey] = list[i];
                        }
                    }
                }
            }
            return results;
        };

        $rootScope.$on('modal.show', function (event, _modal_) {
            modal = _modal_;
        });

        this.createModalScope = function (isolate) {
            modalScope = $rootScope.$new(isolate);
            modalScope.$on('modal.hide', function () {
                modalScope.$destroy();
            });
            modalScope.models = {};
            return modalScope;
        };

        this.hideModal = function () {
            if (modal && modal.hide) {
                modal.hide();
                modal = undefined;
            }
        };

        this.showUnexpectedErrorAlert = function (container, placement, type) {
            var config = {
                placement: placement || 'top-right',
                title: $translate.instant('UNEXPECTED_ERROR_ALERT.TITLE'),
                content: $translate.instant('UNEXPECTED_ERROR_ALERT.CONTENT'),
                type: type || 'danger'
            };
            if (container) {
                config.container = container;
            }
            $alert(config);
        };

        this.showErrorModal = function (error, container, placement) {
            if (angular.element('.modal.error-modal').length === 0) {
                var scope = this.createModalScope(true);
                scope.error = error;
                var config = {
                    title: 'ERROR_MODAL_' + error.code + '.TITLE',
                    content: 'ERROR_MODAL_' + error.code + '.BODY',
                    show: true,
                    templateUrl: 'common/templates/error-modal.html',
                    scope: scope
                };
                if (container) {
                    config.container = container;
                }
                if (placement) {
                    config.placement = placement;
                }
                $modal(config);
                return scope;
            }
        };

        this.hideAsideMobileNav = function () {
            if (asideMobileNav) {
                asideMobileNav.hide();
            }
        };

        this.showAsideMobileNav = function () {
            if (asideMobileNav) {
                asideMobileNav.show();
            } else {
                asideMobileNav = $aside({
                    templateUrl: 'common/nav/mobile-nav.html',
                    placement: 'left',
                    animation: 'am-slide-left',
                    container: 'body'
                });
            }
        };

        this.isMobile = function () {
            return $window.navigator.userAgent.indexOf('Mobi') !== -1;
        };

        this.isMac = function () {
            return $window.navigator.appVersion.indexOf('Mac') !== -1;
        };

        return this;
    }]);
