'use strict';

/**
 * @description
 * # TEMPLATES
 * Templates in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').run([ '$templateCache', function ($templateCache) {
    $templateCache.put('cookies-consent.html', '<div class="alert alert-info"> <p> <strong translate="COOKIE_CONSENT.TITLE"></strong> <span translate="COOKIE_CONSENT.BODY"></span> </p><button class="btn btn-primary btn-sm btn-cookies-consent" ng-click="$root.cookieConsent()" translate="COOKIE_CONSENT.ACCEPT"></button> <a class="btn btn-default btn-sm btn-cookies-consent" ng-click="$root.cookieConsent()" href="/legal-notices" translate="COOKIE_CONSENT.MORE"></a> </div>');
}]);
