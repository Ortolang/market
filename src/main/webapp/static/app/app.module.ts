import * as angular from "angular";
import IRouteProvider = angular.route.IRouteProvider;
import ILocationProvider = angular.ILocationProvider;
import ISCEDelegateProvider = angular.ISCEDelegateProvider;
import ICompileProvider = angular.ICompileProvider;
import IRootScopeService = angular.IRootScopeService;
import IDirective = angular.IDirective;
import ITooltipProvider = mgcrea.ngStrap.tooltip.ITooltipProvider;
import IAlertProvider = mgcrea.ngStrap.alert.IAlertProvider;
import IAnalyticsServiceProvider = angulartics.IAnalyticsServiceProvider;
import IEditableOptions = angular.xeditable.IEditableOptions;
import IServiceProviderFactory = angular.IServiceProviderFactory;
import IModule = angular.IModule;


//@require "./**/*.html"

/**
 * @ngdoc overview
 * @name ortolangMarketApp
 * @description
 * # ortolangMarketApp
 *
 * Main module of the application.
 */
angular
    .module('ortolangMarketApp', [
        'ngRoute',
        'ngResource',
        'ngMessages',
        'ngSanitize',
        'ngTouch',
        'ngCookies',
        'ngAnimate',
        'ortolangVisualizers',
        'angularFileUpload',
        'mgcrea.ngStrap.tab',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.aside',
        'mgcrea.ngStrap.helpers.dimensions',
        'mgcrea.ngStrap.tooltip',
        'mgcrea.ngStrap.dropdown',
        'mgcrea.ngStrap.typeahead',
        'mgcrea.ngStrap.alert',
        'mgcrea.ngStrap.button',
        'mgcrea.ngStrap.select',
        'mgcrea.ngStrap.scrollspy',
        'mgcrea.ngStrap.affix',
        'mgcrea.ngStrap.popover',
        'toggle-switch',
        'hljs',
        'cfp.hotkeys',
        'formly',
        'formlyBootstrap',
        'pascalprecht.translate',
        'ngclipboard',
        'xeditable',
        'ngTagsInput',
        'angularMoment',
        'angulartics',
        'angulartics.piwik',
        'ng-showdown',
        'zInfiniteScroll',
        'angular-duration-format',
        'dndLists',
        'ngWig',
        'xml',
        'chart.js'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider: OrtolangRouteProvider, $locationProvider: ILocationProvider) {
        $routeProvider
            .when('/market/home', {
                redirectTo: '/'
            })
            .when('/', {
                templateUrl: 'market/home.html',
                controller: 'HomeCtrl',
                description: 'default'
            })
            .when('/news', {
                templateUrl: 'market/news.html',
                controller: 'NewsCtrl',
                title: 'NEWS',
                description: 'default'
            })
            .when('/market/:section/cluster/:cluster', {
                templateUrl: 'market/cluster.html',
                controller: 'ClusterCtrl',
                title: 'CORPORA',
                description: 'NAV.DESCRIPTION.CORPORA',
                reloadOnSearch: false
            })
            .when('/market/corpora', {
                templateUrl: 'market/corpora.html',
                controller: 'CorporaCtrl',
                title: 'CORPORA',
                description: 'NAV.DESCRIPTION.CORPORA',
                reloadOnSearch: false
            })
            .when('/market/tools', {
                templateUrl: 'market/tools.html',
                controller: 'ToolsCtrl',
                title: 'TOOLS',
                reloadOnSearch: false
            })
            .when('/market/lexicons', {
                templateUrl: 'market/lexicons.html',
                controller: 'LexiconsCtrl',
                title: 'LEXICONS',
                reloadOnSearch: false
            })
            .when('/market/terminologies', {
                templateUrl: 'market/terminologies.html',
                controller: 'TerminologiesCtrl',
                title: 'TERMINOLOGIES',
                reloadOnSearch: false
            })
            .when('/market/applications', {
                templateUrl: 'market/applications.html',
                controller: 'ApplicationsCtrl',
                title: 'INTEGRATED_PROJECTS'
            })
            .when('/market/:section/:alias/:version?', {
                templateUrl: 'market/item.html',
                controller: 'ItemCtrl',
                reloadOnSearch: false
            })
            .when('/market/search', {
                templateUrl: 'market/search.html',
                controller: 'SearchCtrl',
                title: 'SEARCH',
                reloadOnSearch: false
            })
            .when('/producers', {
                templateUrl: 'producer/producers.html',
                title: 'PRODUCERS'
            })
            .when('/producers/:producerId', {
                templateUrl: 'producer/producer.html'
            })
            .when('/contributors/:contributorId', {
                templateUrl: 'contributor/contributor.html'
            })
            .when('/workspaces', {
                templateUrl: 'workspace/workspaces.html',
                requiresAuthentication: true,
                reloadOnSearch: false,
                controller: 'WorkspacesCtrl',
                title: 'NAV.WORKSPACES'
            })
            .when('/workspaces/:alias', {
                templateUrl: 'workspace/workspace-dashboard.html',
                requiresAuthentication: true,
                reloadOnSearch: false,
                controller: 'WorkspaceDashboardCtrl',
                title: 'NAV.WORKSPACES'
            })
            .when('/information/:section?', {
                templateUrl: 'common/static-website/information.html',
                controller: 'InformationCtrl',
                reloadOnSearch: false,
                title: 'NAV.INFORMATION'
            })
            .when('/legal-notices', {
                templateUrl: 'common/static-website/legal-notices.html',
                title: 'NAV.LEGAL_NOTICES'
            })
            .when('/profiles/me/edition', {
                templateUrl: 'profile/profile.html',
                controller: 'ProfileCtrl',
                requiresAuthentication: true,
                resolve: {
                    func: ['AuthService', function (AuthService: any) {
                        return AuthService.sessionInitialized;
                    }]
                },
                title: 'NAV.PROFILE'
            })
            .when('/profiles/me/tasks', {
                templateUrl: 'profile/tasks.html',
                controller: 'TasksCtrl',
                requiresAuthentication: true,
                title: 'NAV.TASKS'
            })
            .when('/404', {
                templateUrl: 'common/templates/404.html',
                title: 'NAV.404',
                resolve: {
                    func: [function () {
                        var meta = angular.element('<meta name="prerender-status-code" content="404">');
                        angular.element('head').append(meta);
                        return true;
                    }]
                }
            })
            .otherwise({
                redirectTo: '/404'
            });
        if (OrtolangConfig.tests) {
            $locationProvider.html5Mode({enabled: true, requireBase: false, rewriteLinks: true});
        } else {
            $locationProvider.html5Mode(true);
        }
        $locationProvider.hashPrefix('!');
    }])
    .config(['$sceDelegateProvider', function ($sceDelegateProvider: ISCEDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            OrtolangConfig.apiServerUrlDefault + '**',
            OrtolangConfig.apiServerUrlNoSSL + '**',
            'http://' + OrtolangConfig.piwikHost + '**',
            'https://' + OrtolangConfig.piwikHost + '**'
        ]);
    }])
    .config(['$tooltipProvider', '$alertProvider', function ($tooltipProvider: ITooltipProvider, $alertProvider: IAlertProvider) {
        angular.extend($tooltipProvider.defaults, {
            container: 'body',
            trigger: 'hover'
        });
        angular.extend($alertProvider.defaults, {
            container: '.alerts-wrapper',
            placement: 'top-right'
        });
    }])
    .config(['hotkeysProvider', function (hotkeysProvider: any) {
        hotkeysProvider.templateHeader = '<span></span>';
    }])
    .config(['$analyticsProvider', function ($analyticsProvider: IAnalyticsServiceProvider) {
        if (!(OrtolangConfig.piwikHost && OrtolangConfig.piwikHost !== '' && OrtolangConfig.piwikSiteId)) {
            $analyticsProvider.developerMode(true);
            $analyticsProvider.virtualPageviews(false);
            $analyticsProvider.firstPageview(false);
        }
    }])
    .config(['$compileProvider', function ($compileProvider: ICompileProvider) {
        $compileProvider.debugInfoEnabled(!!OrtolangConfig.debug);
    }])
    .config(function () {
        var microDataElement = angular.element('<script type="application/ld+json">'),
            microData = {
                '@context': 'http://schema.org',
                '@type': 'website',
                'name': 'ORTOLANG',
                'alternateName': 'Outils et Ressources pour un Traitement Optimisé de la LANGue',
                'url': location.origin
            };
        microDataElement.text(angular.toJson(microData));
        angular.element('head').append(microDataElement);
    })
    .config(['ChartJsProvider', function (ChartJsProvider: any) {
        ChartJsProvider.setOptions('global', {
            tooltips: {
                titleFontFamily: '"Open Sans","Helvetica Neue", Helvetica, Arial, sans-serif',
                bodyFontFamily: '"Open Sans","Helvetica Neue", Helvetica, Arial, sans-serif'
            }
        });
    }])
    .run(['$rootScope', function ($rootScope: OrtolangRootScopeService) {
        if (OrtolangConfig.piwikHost && OrtolangConfig.piwikHost !== '' && OrtolangConfig.piwikSiteId) {
            var optOutUrl = '//' + OrtolangConfig.piwikHost + 'index.php?module=CoreAdminHome&action=optOut&language=';
            $rootScope.$on('languageInitialized', function (event, language) {
                $rootScope.piwikIframeSrc =  optOutUrl + language;
            });
            $rootScope.$on('$translateChangeSuccess', function (event, data) {
                $rootScope.piwikIframeSrc = optOutUrl + data.language;
            });
        }
    }])
    .run(['editableOptions', 'editableThemes', function (editableOptions: IEditableOptions, editableThemes: any) {
        var copy = editableThemes.bs3;
        copy.formTpl = '<form class="" role="form"></form>';
        copy.controlsTpl = '<div class="editable-controls input-group" ng-class="{\'has-error\': $error, \'input-group-lg\': largeInput}"></div>';
        copy.buttonsTpl = '<span class="input-group-btn"></span>';
        copy.inputClass = 'editable-custom-inputs';
        copy.errorTpl = '<div class="editable-error editable-custom-error help-block" ng-show="$error" translate="{{$error}}"></div>';
        editableThemes.bs3 = copy;
        editableOptions.theme = 'bs3';
    }])
    .run(['$rootScope', 'icons', function ($rootScope: OrtolangRootScopeService, icons: IModule) {
        $rootScope.icons = icons;
    }]);


/**
 * @ngdoc overview
 * @name ortolangVisualizers
 * @description
 * # ortolangVisualizers
 *
 * Ortolang Visualizers Module
 */
angular.module('ortolangVisualizers', [
    'ortolangMarketApp',
    'pascalprecht.translate'
]);

